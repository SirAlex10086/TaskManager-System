import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import TaskForm from './TaskForm';
import { taskAPI } from '../utils/api';
import { TASK_STATUS, TASK_PRIORITY, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '../utils/constants';

const { Header, Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取任务列表
  const fetchTasks = async (page = 1, pageSize = 10, filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...filterParams,
      };
      
      // 移除空值
      Object.keys(params).forEach(key => {
        if (!params[key]) {
          delete params[key];
        }
      });
      
      const response = await taskAPI.getTasks(params);
      setTasks(response.tasks);
      setPagination({
        current: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error('获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchTasks();
  }, []);

  // 处理筛选
  const handleFilter = () => {
    fetchTasks(1, pagination.pageSize, filters);
  };

  // 重置筛选
  const handleResetFilter = () => {
    setFilters({ status: '', priority: '', assignee: '' });
    fetchTasks(1, pagination.pageSize, {});
  };

  // 处理分页
  const handleTableChange = (paginationInfo) => {
    fetchTasks(paginationInfo.current, paginationInfo.pageSize, filters);
  };

  // 创建任务
  const handleCreateTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  // 编辑任务
  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  // 删除任务
  const handleDeleteTask = async (taskId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个任务吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await taskAPI.deleteTask(taskId);
          message.success('任务删除成功');
          fetchTasks(pagination.current, pagination.pageSize, filters);
        } catch (error) {
          message.error('删除任务失败');
        }
      },
    });
  };

  // 保存任务
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskAPI.updateTask(editingTask.id, taskData);
        message.success('任务更新成功');
      } else {
        await taskAPI.createTask(taskData);
        message.success('任务创建成功');
      }
      setModalVisible(false);
      fetchTasks(pagination.current, pagination.pageSize, filters);
    } catch (error) {
      message.error(editingTask ? '更新任务失败' : '创建任务失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={TASK_STATUS_COLORS[status]} className="status-tag">
          {TASK_STATUS_LABELS[status]}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority) => (
        <Tag color={TASK_PRIORITY_COLORS[priority]} className="priority-tag">
          {TASK_PRIORITY_LABELS[priority]}
        </Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100,
    },
    {
      title: '截止日期',
      dataIndex: 'due_date',
      key: 'due_date',
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '预估工时',
      dataIndex: 'estimated_hours',
      key: 'estimated_hours',
      width: 80,
      render: (hours) => hours ? `${hours}h` : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditTask(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTask(record.id)}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 统计数据
  const getStatistics = () => {
    const stats = {
      total: tasks.length,
      todo: 0,
      in_progress: 0,
      completed: 0,
    };
    
    tasks.forEach(task => {
      if (task.status === 'todo') stats.todo++;
      else if (task.status === 'in_progress') stats.in_progress++;
      else if (task.status === 'approved') stats.completed++;
    });
    
    return stats;
  };

  const stats = getStatistics();

  return (
    <Layout className="dashboard-container">
      <Header className="dashboard-header">
        <h1 style={{ margin: 0, color: '#1890ff' }}>任务管理系统</h1>
      </Header>
      
      <Content className="dashboard-content">
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="总任务数" value={pagination.total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="待办任务" value={stats.todo} valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="进行中" value={stats.in_progress} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="已完成" value={stats.completed} valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
        </Row>

        {/* 筛选区域 */}
        <Card className="filter-section">
          <Row gutter={16} className="filter-row">
            <Col span={4}>
              <div className="filter-item">
                <label>状态</label>
                <Select
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  placeholder="选择状态"
                  allowClear
                >
                  {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={4}>
              <div className="filter-item">
                <label>优先级</label>
                <Select
                  value={filters.priority}
                  onChange={(value) => setFilters({ ...filters, priority: value })}
                  placeholder="选择优先级"
                  allowClear
                >
                  {Object.entries(TASK_PRIORITY_LABELS).map(([key, label]) => (
                    <Option key={key} value={key}>{label}</Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={4}>
              <div className="filter-item">
                <label>负责人</label>
                <Input
                  value={filters.assignee}
                  onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                  placeholder="输入负责人"
                  allowClear
                />
              </div>
            </Col>
            <Col span={8}>
              <div className="filter-item">
                <label>&nbsp;</label>
                <Space>
                  <Button type="primary" onClick={handleFilter}>
                    筛选
                  </Button>
                  <Button onClick={handleResetFilter}>
                    重置
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={() => fetchTasks(pagination.current, pagination.pageSize, filters)}>
                    刷新
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 操作按钮 */}
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateTask}
          >
            新建任务
          </Button>
        </div>

        {/* 任务表格 */}
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          onChange={handleTableChange}
          className="task-table"
        />

        {/* 任务表单模态框 */}
        <Modal
          title={editingTask ? '编辑任务' : '新建任务'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={600}
        >
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default Dashboard;
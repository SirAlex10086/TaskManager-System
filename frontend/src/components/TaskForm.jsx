import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../utils/constants';

const { TextArea } = Input;
const { Option } = Select;

const TaskForm = ({ task, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        ...task,
        due_date: task.due_date ? dayjs(task.due_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [task, form]);

  const handleSubmit = async (values) => {
    const taskData = {
      ...values,
      due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
      tags: values.tags ? JSON.stringify(values.tags.split(',').map(tag => tag.trim())) : '[]',
    };
    
    await onSave(taskData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        priority: 'medium',
        status: 'todo',
        estimated_hours: 0,
        actual_hours: 0,
      }}
    >
      <Form.Item
        name="title"
        label="任务标题"
        rules={[
          { required: true, message: '请输入任务标题' },
          { max: 255, message: '标题长度不能超过255个字符' },
        ]}
      >
        <Input placeholder="请输入任务标题" />
      </Form.Item>

      <Form.Item
        name="description"
        label="任务描述"
        rules={[{ required: true, message: '请输入任务描述' }]}
      >
        <TextArea
          rows={4}
          placeholder="请输入任务描述"
        />
      </Form.Item>

      <Form.Item
        name="priority"
        label="优先级"
        rules={[{ required: true, message: '请选择优先级' }]}
      >
        <Select placeholder="请选择优先级">
          {Object.entries(TASK_PRIORITY_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>{label}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="任务状态"
        rules={[{ required: true, message: '请选择任务状态' }]}
      >
        <Select placeholder="请选择任务状态">
          {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
            <Option key={key} value={key}>{label}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="assignee"
        label="负责人"
      >
        <Input placeholder="请输入负责人" />
      </Form.Item>

      <Form.Item
        name="project_id"
        label="项目ID"
      >
        <Input placeholder="请输入项目ID" />
      </Form.Item>

      <Form.Item
        name="project_name"
        label="项目名称"
      >
        <Input placeholder="请输入项目名称" />
      </Form.Item>

      <Form.Item
        name="due_date"
        label="截止日期"
      >
        <DatePicker
          style={{ width: '100%' }}
          placeholder="请选择截止日期"
        />
      </Form.Item>

      <Form.Item
        name="tags"
        label="标签"
        extra="多个标签请用逗号分隔"
      >
        <Input placeholder="请输入标签，用逗号分隔" />
      </Form.Item>

      <Form.Item
        name="estimated_hours"
        label="预估工时（小时）"
      >
        <InputNumber
          min={0}
          max={999.99}
          step={0.5}
          style={{ width: '100%' }}
          placeholder="请输入预估工时"
        />
      </Form.Item>

      <Form.Item
        name="actual_hours"
        label="实际工时（小时）"
      >
        <InputNumber
          min={0}
          max={999.99}
          step={0.5}
          style={{ width: '100%' }}
          placeholder="请输入实际工时"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {task ? '更新' : '创建'}
          </Button>
          <Button onClick={onCancel}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
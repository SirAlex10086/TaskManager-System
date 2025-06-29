# 任务管理系统 (TaskManager System)

基于 React + Node.js + SQLite 的现代化任务管理平台，支持任务创建、状态跟踪、优先级管理等核心功能。

## 🚀 技术栈

### 前端
- **React 18** - 现代化前端框架
- **Ant Design** - 企业级UI组件库
- **Axios** - HTTP客户端
- **React Router** - 路由管理

### 后端
- **Node.js** - 服务端运行环境
- **Express.js** - Web应用框架
- **Sequelize** - ORM数据库操作
- **SQLite** - 轻量级数据库
- **Swagger** - API文档生成

## 📦 快速启动

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 启动服务
```bash
# 启动后端服务 (端口: 3001)
cd backend
npm start

# 启动前端服务 (端口: 3000)
cd frontend
npm start
```

### 访问应用
- 前端界面: http://localhost:3000
- API文档: http://localhost:3001/api-docs
- 后端API: http://localhost:3001/api

## 📁 项目结构

```
TaskManager/
├── backend/                 # 后端服务
│   ├── models/             # 数据模型
│   ├── routes/             # API路由
│   ├── scripts/            # 数据库脚本
│   └── index.js            # 服务入口
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── utils/          # 工具函数
│   │   └── App.js          # 应用入口
│   └── public/             # 静态资源
├── scripts/                # PowerShell脚本
├── wiki/                   # 技术文档
├── Plan/                   # 开发计划
└── PRD/                    # 产品需求文档
```

## ✨ 功能特性

### 核心功能
- ✅ 任务创建与编辑
- ✅ 任务状态管理
- ✅ 优先级设置
- ✅ 任务分配
- ✅ 截止日期管理
- ✅ 标签系统
- ✅ 工时统计

### 高级功能
- 🔄 任务状态流转
- 📊 数据统计分析
- 🔍 高级搜索过滤
- 📱 响应式设计
- 🌐 RESTful API
- 📖 Swagger API文档

## 📋 任务状态说明

| 状态 | 英文标识 | 中文描述 | 说明 |
|------|----------|----------|------|
| todo | todo | 待办 | 新创建的任务 |
| in_progress | in_progress | 进行中 | 正在执行的任务 |
| pending_review | pending_review | 待审核 | 等待审核的任务 |
| approved | approved | 已通过 | 审核通过的任务 |
| rejected_revision | rejected_revision | 需修改 | 需要修改的任务 |
| cancelled | cancelled | 已取消 | 取消执行的任务 |

## 🔌 API接口

### 任务管理
- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建新任务
- `GET /api/tasks/:id` - 获取任务详情
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 查询参数
- `status` - 按状态筛选
- `priority` - 按优先级筛选
- `assignee` - 按负责人筛选
- `page` - 分页页码
- `limit` - 每页数量

## 🗄️ 数据库模型

### Task 任务表
```javascript
{
  id: INTEGER,              // 主键
  title: STRING,            // 任务标题
  description: TEXT,        // 任务描述
  priority: ENUM,           // 优先级 (low, medium, high, urgent)
  status: ENUM,             // 状态 (见上表)
  assignee: STRING,         // 负责人
  due_date: DATE,           // 截止日期
  tags: STRING,             // 标签 (JSON格式)
  estimated_hours: DECIMAL, // 预估工时
  actual_hours: DECIMAL,    // 实际工时
  created_at: DATE,         // 创建时间
  updated_at: DATE          // 更新时间
}
```

## 📈 开发进度

- [x] 项目初始化
- [x] 后端API开发
- [x] 数据库设计
- [x] 前端界面开发
- [x] API文档生成
- [x] 基础功能测试
- [ ] 高级功能开发
- [ ] 性能优化
- [ ] 部署配置

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 开发团队

- **系统架构师** - 负责技术架构设计和开发标准制定
- **全栈开发工程师** - 负责前后端功能实现
- **产品经理** - 负责需求分析和产品规划

---

📧 如有问题或建议，请提交 Issue 或联系开发团队。
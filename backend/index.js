const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { sequelize } = require('./models/Task');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger 配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskManager API',
      version: '1.0.0',
      description: '任务管理系统 API 文档',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '开发服务器',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            id: {
              type: 'integer',
              description: '任务ID',
            },
            title: {
              type: 'string',
              description: '任务标题',
            },
            description: {
              type: 'string',
              description: '任务描述',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: '优先级',
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'pending_review', 'approved', 'rejected_revision', 'cancelled'],
              description: '任务状态',
            },
            assignee: {
              type: 'string',
              description: '负责人',
            },
            due_date: {
              type: 'string',
              format: 'date',
              description: '截止日期',
            },
            tags: {
              type: 'string',
              description: '标签 (JSON格式)',
            },
            estimated_hours: {
              type: 'number',
              description: '预估工时',
            },
            actual_hours: {
              type: 'number',
              description: '实际工时',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 路由
app.use('/api/tasks', taskRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'TaskManager API Server',
    version: '1.0.0',
    docs: '/api-docs',
    endpoints: {
      tasks: '/api/tasks'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`API文档地址: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('数据库连接失败:', err);
});
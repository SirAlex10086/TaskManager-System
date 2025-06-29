const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// 创建 Sequelize 实例
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // 设置为 true 可以看到 SQL 查询
});

// 定义 Task 模型
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('todo', 'in_progress', 'pending_review', 'approved', 'rejected_revision', 'cancelled'),
    defaultValue: 'todo',
  },
  assignee: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '[]',
  },
  estimated_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
  },
  actual_hours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = { Task, sequelize };
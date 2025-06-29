const express = require('express');
const { Task } = require('../models/Task');
const { Op } = require('sequelize');

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: 获取任务列表
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, pending_review, approved, rejected_revision, cancelled]
 *         description: 按状态筛选
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: 按优先级筛选
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *         description: 按负责人筛选
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功获取任务列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', async (req, res) => {
  try {
    const { status, priority, assignee, page = 1, limit = 10 } = req.query;
    
    // 构建查询条件
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignee) where.assignee = { [Op.like]: `%${assignee}%` };
    
    // 分页参数
    const offset = (page - 1) * limit;
    
    // 查询任务
    const { count, rows } = await Task.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });
    
    res.json({
      tasks: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({ error: '获取任务列表失败' });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: 创建新任务
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: 任务创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: 请求参数错误
 */
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('创建任务失败:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: '请求参数错误', details: error.errors });
    } else {
      res.status(500).json({ error: '创建任务失败' });
    }
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: 获取任务详情
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 任务ID
 *     responses:
 *       200:
 *         description: 成功获取任务详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: 任务不存在
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }
    res.json(task);
  } catch (error) {
    console.error('获取任务详情失败:', error);
    res.status(500).json({ error: '获取任务详情失败' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: 更新任务
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 任务ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: 任务更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: 任务不存在
 *       400:
 *         description: 请求参数错误
 */
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error('更新任务失败:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: '请求参数错误', details: error.errors });
    } else {
      res.status(500).json({ error: '更新任务失败' });
    }
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: 删除任务
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 任务ID
 *     responses:
 *       200:
 *         description: 任务删除成功
 *       404:
 *         description: 任务不存在
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }
    
    await task.destroy();
    res.json({ message: '任务删除成功' });
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({ error: '删除任务失败' });
  }
});

module.exports = router;
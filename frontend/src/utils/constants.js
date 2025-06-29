// 任务状态枚举
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED_REVISION: 'rejected_revision',
  CANCELLED: 'cancelled',
};

// 任务状态标签
export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: '待办',
  [TASK_STATUS.IN_PROGRESS]: '进行中',
  [TASK_STATUS.PENDING_REVIEW]: '待审核',
  [TASK_STATUS.APPROVED]: '已通过',
  [TASK_STATUS.REJECTED_REVISION]: '需修改',
  [TASK_STATUS.CANCELLED]: '已取消',
};

// 任务状态颜色
export const TASK_STATUS_COLORS = {
  [TASK_STATUS.TODO]: 'default',
  [TASK_STATUS.IN_PROGRESS]: 'processing',
  [TASK_STATUS.PENDING_REVIEW]: 'warning',
  [TASK_STATUS.APPROVED]: 'success',
  [TASK_STATUS.REJECTED_REVISION]: 'error',
  [TASK_STATUS.CANCELLED]: 'default',
};

// 任务优先级枚举
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// 任务优先级标签
export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: '低',
  [TASK_PRIORITY.MEDIUM]: '中',
  [TASK_PRIORITY.HIGH]: '高',
  [TASK_PRIORITY.URGENT]: '紧急',
};

// 任务优先级颜色
export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'green',
  [TASK_PRIORITY.MEDIUM]: 'blue',
  [TASK_PRIORITY.HIGH]: 'orange',
  [TASK_PRIORITY.URGENT]: 'red',
};

// API 配置
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
};

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
};

// 表单验证规则
export const VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
  ASSIGNEE_MAX_LENGTH: 100,
  PROJECT_ID_MAX_LENGTH: 50,
  PROJECT_NAME_MAX_LENGTH: 200,
  MAX_HOURS: 999.99,
};

// 日期格式
export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD',
  API: 'YYYY-MM-DD',
  DATETIME_DISPLAY: 'YYYY-MM-DD HH:mm:ss',
};

// 消息提示配置
export const MESSAGE_CONFIG = {
  DURATION: 3, // 秒
  MAX_COUNT: 3,
};
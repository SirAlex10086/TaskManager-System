import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error('请求参数错误:', data.error);
          break;
        case 401:
          console.error('未授权访问');
          // 可以在这里处理登录跳转
          break;
        case 403:
          console.error('禁止访问');
          break;
        case 404:
          console.error('资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error('未知错误:', data.error || '请求失败');
      }
      
      return Promise.reject(new Error(data.error || '请求失败'));
    } else if (error.request) {
      // 网络错误
      console.error('网络错误:', error.message);
      return Promise.reject(new Error('网络连接失败，请检查网络设置'));
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message);
      return Promise.reject(error);
    }
  }
);

// 任务相关 API
export const taskAPI = {
  // 获取任务列表
  getTasks: (params = {}) => {
    return api.get('/tasks', { params });
  },
  
  // 获取任务详情
  getTask: (id) => {
    return api.get(`/tasks/${id}`);
  },
  
  // 创建任务
  createTask: (data) => {
    return api.post('/tasks', data);
  },
  
  // 更新任务
  updateTask: (id, data) => {
    return api.put(`/tasks/${id}`, data);
  },
  
  // 删除任务
  deleteTask: (id) => {
    return api.delete(`/tasks/${id}`);
  },
};

export default api;
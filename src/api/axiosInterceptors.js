import axios from 'axios';
import { message } from 'antd';

// 请求拦截器
axios.interceptors.request.use(config => {
    // 注：不需要手动设置默认请求头，axios会自动添加
    config.headers.Authorization = `${localStorage.getItem('jwt')}`;
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(response => {
    // 如果返回中，code是-999，则说明登录失效，跳转到登录页，并删除本地存储的token
    if (response.data.code === -999) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return null;
    } else if (response.data.code !== 0) {
        // 如果返回中，code不是0，则说明业务失败，弹出错误信息
        message.error(response.data.msg || '请求失败');
        return null;
    } else {
        // 如果返回中，code是0，则说明业务成功，返回数据
        return response.data.data;
    }
}, error => {
    if (error.response && error.response.status === 500) {
        // 处理状态码为 500 的响应
        message.error('服务器错误');
    }
    return Promise.reject(error);
});


import axios from 'axios';
import {Message, Loading} from 'element-ui';
import store from './../store';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://127.0.0.1:8081/',
    timeout: 5000
});

// 定义loading变量
let loading

// 使用Element loading-start 方法
function startLoading() {    
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.6)'
    })
}

// 使用Element loading-close 方法
function endLoading() {    
    loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}

service.interceptors.request.use(
    config => {
        showFullScreenLoading();
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        tryHideFullScreenLoading();
        if (response.status === 200) {
            if(response.data.code === 200){
                return response.data;
            }else{
                Message({
                    'message':response.data.message,
                    'type':'error'
                });
            }
        } else {
            return Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;

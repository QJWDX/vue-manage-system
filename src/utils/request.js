import axios from 'axios';
import {Message} from 'element-ui';
import store from './../store';
import route from './../router';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    timeout: 5000
});
let protocol = window.location.protocol; //协议
   let host = window.location.host; //主机
   let reg = /^localhost+/;
   if(reg.test(host)) {
      // 若\本地项目调试使用
      service.defaults.baseURL = 'http://127.0.0.1';
   } else {
       // 动态请求地址
       service.defaults.baseURL = protocol + "//www.hhdxdx.cn";
   }

// 请求拦截器
service.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + store.getters.token;
        return config;
    },
    error => {
        console.log(error);
        Message({
            'message':error.response.data.message,
            'type':'error',
            'duration' : 2000,
            'showClose' :true
        });
        return Promise.reject();
    }
);


// 响应拦截器
service.interceptors.response.use(
    response => {
        switch(response.status){
            case 200:
                if(response.data.code === 200){
                    return response.data;
                }else{
                    Message({
                        'message':response.data.message,
                        'type':'error'
                    });
                }
                break;
            case 201:
                if(response.data.code === 201){
                    store.dispatch('storeToken', response.data.data.token);
                    return service.request(response.config);
                }
                break;
            default:
                return Promise.reject();
                break;
        }
    },
    error => {
        if (error && error.response && error.response.status) {
            switch (error.response.status) {
                case 500:
                    Message({
                        'message':error.response.data.message,
                        'type':'error',
                        'duration' : 2000,
                        'showClose' :true
                    });
                    break
                case 401:
                    // token黑名单
                    store.dispatch('delUserInfo');
                    route.push('/login');
                    break;
                case 403:
                    route.push('/403');
                    break
                case 404:
                    route.push('/404');
                    break
                case 429:
                    console.log('429');
                    break
                case 201:
                    console.log('201');
                    break;
                default:
                    console.log('default');
                    break
            }
        };
        return Promise.reject();
    }
);

export default service;

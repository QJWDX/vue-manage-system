import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import store from '../store';
import {router} from '../router';
const instance = axios.create({
    timeout: 1000*5
});

// 判断开发环境
console.log(process.env.NODE_ENV);

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
instance.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + store.getters.token;
        return config;
    },
    error => {
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
instance.interceptors.response.use(
    response => {
        switch(response.status){
            case 200:
                switch(response.data.code){
                    case 200:
                        return response.data;
                        break;
                    case 500:
                        Message({
                            'message':response.data.message,
                            'type':'error',
                            'center': true
                        });
                        break;
                    default:
                        Message({
                            'message':'系统错误',
                            'type':'error',
                            'center': true
                        });
                        break;
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
                    switch(error.response.data.code){
                        case 500:
                            Message({
                                'message':error.response.data.message,
                                'type':'error',
                                'duration' : 2000,
                                'showClose' :true,
                                'center': true
                            });
                            break;
                        case 403:
                            router.push('/403');
                            break;
                    }
                    break
                case 401:
                    MessageBox.alert(error.response.data.message, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        // token黑名单
                        store.dispatch('delUserInfo');
                        router.push('/login');
                        return;
                      }).catch(() => {
                        console.log('取消重新登录');
                      });
                    break;
                case 403:
                    router.push('/403');
                    break
                case 404:
                    router.push('/404');
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

export default instance;

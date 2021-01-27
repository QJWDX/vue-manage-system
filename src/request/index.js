import axios from 'axios';
import {Message, MessageBox} from 'element-ui';
import store from '../store';
import {router} from '../router';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    timeout: 5000
});
let production = false;
if(production){
    let protocol = window.location.protocol; //协议
    let host = window.location.host; //主机
    let reg = /^localhost+/;
    service.defaults.baseURL = reg.test(host) ? protocol + '//127.0.0.1' : protocol + '//www.hhdxdx.cn';
}
// 请求拦截器
service.interceptors.request.use(
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
service.interceptors.response.use(
    response => {
        console.log(response);
        switch(response.status){
            case 200:
                if(response.data.code === 200){
                    return response.data;
                }else{
                    return response;
                    Message({
                        'message':response.data.message,
                        'type':'error',
                        'center': true
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
                      }).catch(() => {
                        console.log('取消重新登录');
                      });
                    break;
                case 403:
                    router.push('/403');
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

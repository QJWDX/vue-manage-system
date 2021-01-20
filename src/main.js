import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import store from './store';
import commonFunction from './utils/commonFunction';
import apiList from '@/request/apiList';
Vue.config.productionTip = false;
Vue.prototype.$fun = commonFunction;
Vue.prototype.$apiList = apiList;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
const whiteList = ['/login', '/403', '/404'];


if(sessionStorage.getItem('token')){
    store.dispatch('addRoutes');
}

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = store.getters.systemName;
    if(sessionStorage.getItem('token')){
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }else{
        if (whiteList.indexOf(to.path) !== -1) {
            // ip白名单路由，直接跳转
            next()
        }else{
            next('/login');
        }
    }
});

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
//import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import store from './store';
import {getVueRoute} from './api/login';
import {JSEncrypt} from 'jsencrypt';
import commonFunction from './utils/commonFunction';
import * as apiList from './utils/apiList';
const Base64 = require('js-base64').Base64;
Vue.config.productionTip = false;
Vue.prototype.$jsEncrypt = JSEncrypt;
Vue.prototype.$apiList = apiList;
Vue.prototype.$commonFunction = commonFunction;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
const whiteList = ['/login', '/403', '/404'];
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 后台管理系统`;
    const hasToken = store.getters.token ? true : false;
    const role = store.getters.user.role;
    if(hasToken && role){
        /**
         * 从后台获取vue所需路由和菜单基础数据
         */
        getVueRoute({'role':role}).then(res => {
            store.dispatch('createAsnyRoutes', res.data);
            let dataRouter = store.getters.routes;
            // console.log(dataRouter);
            //动态添加路由信息
            router.addRoutes(dataRouter);
        });
        next();
    }else{
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        }else{
            next('/login');
        }
    }

    // if (!token && to.path !== '/login') {
    //     next('/login');
    // } else {
    //     if(role){
    //         getMenus({'role':role}).then(res => {
    //             store.dispatch('createAsnyRoutes', res.data);
    //             let dataRouter = store.getters.routes;
    //             // console.log(dataRouter);
    //             //动态添加路由信息
    //             router.addRoutes(dataRouter);
    //         });
    //     }
    //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
    //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
    //             confirmButtonText: '确定'
    //         });
    //     } else {
    //         next();
    //     }
    // }
});

new Vue({
    router,
    store,
    i18n,
    Base64,
    render: h => h(App)
}).$mount('#app');

import {router, constantRoutes, lastRoute} from './../../router';
import { login, getVueRoute } from './../../api/login';
const state = {
    token : sessionStorage.getItem('token') || '',
    user : JSON.parse(localStorage.getItem('user')) || {},
    // 后台原始路由数据处理后的路由
    routerData : JSON.parse(localStorage.getItem('routerData')) || [],
    // 后台原始菜单数据处理后的菜单
    menus : JSON.parse(localStorage.getItem('menus')) || [],
    userAvatar : localStorage.getItem('userAvatar') || '',
};

const getters = {
    token:(state) => {
        return state.token;
    },
    user:(state) => {
        return state.user
    },
    routerData:(state) => {
        return state.routerData;
    },
    menus:(state) => {
        return state.menus;
    },
    userAvatar:(state) => {
        return state.userAvatar;
    }
};

const mutations = {
    setToken(state, newToken){
        state.token = newToken;
        sessionStorage.setItem('token', newToken);
    },
    removeToken(state){
        sessionStorage.removeItem('token');
        state.token = '';
    },
    setUserInfo(state, userInfo){
        state.user = userInfo;
        localStorage.setItem('user', JSON.stringify(userInfo));
    },
    setUserAvatar(state, userAvatar){
        state.userAvatar = userAvatar;
        localStorage.setItem('userAvatar', userAvatar);
    },
    removeUserInfo(state){
        localStorage.removeItem('user');
        state.user = {};
    },
    setRoutes(state, routerData){
        // 保存后台获取的路由数据
        localStorage.setItem('routerData', JSON.stringify(routerData));
        state.routerData = routerData;
        addRoutes(routerData);
    },
    setMenus(state, menuData){
        const menus = createAsynMenus(menuData);
        // console.log(menus);
        localStorage.setItem('menus', JSON.stringify(menus));
        state.menus = menus;
    }
};

const actions = {
    userLoginSuccess(context, data){
        context.commit('setUserInfo', data.user);
        context.commit('setToken', data.token);
        context.commit('setUserAvatar', data.user.avatar);
    },
    addMenuData(context, role){
        return new Promise(function(resolve, reject){
            /**
             * 从后台获取vue所需路由和菜单基础数据
             */
            getVueRoute({'role': role}).then(res => {
                context.commit('setRoutes', res.data.routes);
                context.commit('setMenus', res.data.menus);
                resolve(res.message);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    addRoutes(context){
        // 生成vue所需的路由格式数据
        let routerData = JSON.parse(localStorage.getItem('routerData')) || [];
        addRoutes(routerData);
    },
    delUserInfo(context){
        context.commit('removeToken');
        context.commit('removeUserInfo');
    },
    storeToken(context, token){
        context.commit('setToken', token);
    },
    storeUserAvatar(context, avatar){
        context.commit('setUserAvatar', avatar);
    }
};

/**
 * 动态添加路由
 */
function addRoutes(routerData){
    const asyncRoutes = createAsynRoutes(routerData);
    const rootRoutes =  constantRoutes[1].children;
    constantRoutes[1].children.splice(0);
    constantRoutes[1].children = rootRoutes.concat(asyncRoutes);
    const addRoutes = constantRoutes.concat(lastRoute);
    // console.log(routes);
    // 动态路由添加
    router.addRoutes(addRoutes);
}


/**
 * 创建动态路由
 * @param {*} anyncRouter 
 */

function createAsynRoutes(anyncRouter){
    let dataRouter = [];
    //循环遍历动态路由表的每一个路由
    for (let i=0;i<anyncRouter.length;i++){
        let data = {};
        data.path = anyncRouter[i].path;
        // data.name = premissionsMenu[i].index;
        data.component = getViews(anyncRouter[i].component);
        data.meta = {};
        data.meta.title = anyncRouter[i].name
        dataRouter.push(data);
    }
    return dataRouter;
}

/**
 * 创建vue菜单
 * @param {*} anyncMenu 
 */
function createAsynMenus(anyncMenu){
    let dataMenu = [];
    //循环遍历动态路由表的每一个路由
    for (let i=0;i<anyncMenu.length;i++){
        let data = {};
        data.index = anyncMenu[i].index;
        data.icon = anyncMenu[i].icon;
        data.title = anyncMenu[i].name
        if(anyncMenu[i].subs){
            data.subs = createAsynMenus(anyncMenu[i]['subs']);
        }
        dataMenu.push(data);
    }
    return dataMenu;
}

/**
 * 根据组件名称引入vue页面
 * @param {*} componentName 
 */
function getViews(componentName) {
    // return resolve => {
    //   require.ensure([], (require) => {
    //     resolve(require('@/components/page/' + componentName + '.vue'))
    //   })
    // }
    if(componentName){
        return  () => import(/* webpackChunkName: "dashboard" */ '../../components/page/' + componentName + '.vue');
    }
    return '';
}

export default {
    namespace:true,
    state,
    getters,
    mutations,
    actions
}
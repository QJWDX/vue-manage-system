import {constantRoutes, lastRoute} from './../../router';
import {login} from './../../api/index';
const state = {
    token : localStorage.getItem('token') || '',
    user : JSON.parse(localStorage.getItem('user')) || {},
    routes : JSON.parse(localStorage.getItem('routes')) || [],
    menus : JSON.parse(localStorage.getItem('menus')) || []
};

const getters = {
    token:(state) => {
        return state.token;
    },
    user:(state) => {
        return state.user
    },
    routes:(state) => {
        return state.routes;
    },
    menus:(state) => {
        return state.menus;
    }
};

const mutations = {
    setToken(state, newToken){
        state.token = newToken;
        localStorage.setItem('token', newToken);
    },
    removeToken(state){
        localStorage.removeItem('token');
        state.token = '';
    },
    setUserInfo(state, userInfo){
        state.user = userInfo;
        localStorage.setItem('user', JSON.stringify(userInfo));
    },
    removeUserInfo(state){
        localStorage.removeItem('user');
        state.user = {};
    },
    createRoutes(state, anyncRouter){
        const asyncRoutes = createAsynRoutes(anyncRouter);
        const rootRoutes =  constantRoutes[1].children;
        constantRoutes[1].children.splice(0);
        constantRoutes[1].children = rootRoutes.concat(asyncRoutes);
        const routes = constantRoutes.concat(lastRoute);
        // console.log(routes);
        localStorage.setItem('routes', JSON.stringify(routes));
        state.routes = routes;
    },
    createMenus(state, anyncMenu){
        const menus = createAsynMenus(anyncMenu);
        // console.log(menus);
        localStorage.setItem('menus', JSON.stringify(menus));
        state.menus = menus;
    }
};

const actions = {
    userLogin(context, query){
        return new Promise(function(resolve, reject){
            login(query).then(res => {
                console.log(res);
                context.commit('setUserInfo', res.data.user);
                context.commit('setToken', res.data.token);
                resolve(res.message);
            }).catch((err) => {
                reject(err);
            });
        });
    },
    delUserInfo(context){
        context.commit('removeToken');
        context.commit('removeUserInfo');
    },
    createAsnyRoutes(context, data){
        context.commit('createRoutes', data.routes);
        context.commit('createMenus', data.menus);
    }
};

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
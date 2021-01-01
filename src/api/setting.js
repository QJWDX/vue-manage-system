import axios from '../utils/request';

// vue路由
export const getVueRoute = params => {
    return axios({
        url: 'api/setting/getVueRoute',
        method: 'get',
        params: params
    });
};

// 用户列表
export const userList = params => {
    return axios({
        url: 'api/setting/user',
        method: 'get',
        params: params
    });
};

// 用户信息
export const userInfo = id => {
    return axios({
        url: 'api/setting/user/' + id,
        method: 'get',
        params: []
    });
};

// 用户新增
export const userStore = params => {
    return axios.post('api/setting/user', params);
};

// 用户编辑
export const userUpate = (id, params) => {
    return axios({
        url: 'api/setting/user/' + id,
        method: 'put',
        data: params
    });
};

// 用户删除
export const userDelete = id => {
    return axios({
        url: 'api/setting/user/' + id,
        method: 'delete'
    });
};

// 禁用启用冻结用户
export const changeUserStatus = params => {
    return axios({
        url: 'api/setting/changeUserStatus',
        method: 'get',
        params: params
    });
};

export const getUserRole = id => {
    return axios({
        url: 'api/user/getUserRole/' + id,
        method: 'get'
    });
};

export const setUserRole = (id, params) => {
    return axios({
        url: 'api/user/setUserRole/' + id,
        method: 'post',
        data: params
    });
};

export const modPassword = (id, params) => {
    return axios({
        url: 'api/user/modPassword/' + id,
        method: 'post',
        data: params
    });
};

// 角色管理
export const roleList = params => {
    return axios({
        url: 'api/role/list',
        method: 'get',
        params: params
    });
};

export const storeRole = params => {
    return axios({
        url: 'api/role/store',
        method: 'post',
        data: params
    });
};

export const roleInfo = id => {
    return axios({
        url: 'api/role/show/' + id,
        method: 'get'
    });
};

export const saveRole = (id, params) => {
    return axios({
        url: 'api/role/update/' + id,
        method: 'put',
        data: params
    });
};

export const delRole = params => {
    return axios({
        url: 'api/role/delRole',
        method: 'delete',
        params: params
    });
};

export const getRoleTree = () => {
    return axios({
        url: 'api/role/getRoleTree',
        method: 'get'
    });
};

// 菜单管理
export const menuList = params => {
    return axios({
        url: 'api/menus/list',
        method: 'get',
        params: params
    });
};

export const menuStore = params => {
    return axios({
        url: 'api/menus/store',
        method: 'post',
        data: params
    });
};

export const menuInfo = id => {
    return axios({
        url: 'api/menus/show/' + id,
        method: 'get'
    });
};

export const saveMenu = (id, params) => {
    return axios({
        url: 'api/menus/update/' + id,
        method: 'put',
        data: params
    });
};

export const delMenu = id => {
    return axios({
        url: 'api/menus/' + id,
        method: 'delete',
        params: []
    });
};

export const menuSelect = () => {
    return axios({
        url: 'api/menus/menuSelect',
        method: 'get'
    });
};

export const getMenuTree = params => {
    return axios({
        url: 'api/menus/getMenuTree',
        method: 'get',
        params: params
    });
};

export const getRoleMenus = params => {
    return axios({
        url: 'api/menus/getRoleMenus',
        method: 'get',
        params: params
    });
};

export const setRoleMenus = params => {
    return axios({
        url: 'api/menus/setRoleMenus',
        method: 'post',
        data: params
    });
};

// 登陆日志
export const loginLog = params => {
    return axios({
        url: 'api/setting/loginLog',
        method: 'get',
        params: params
    });
};

export const loginLogInfo = id => {
    return axios({
        url: 'api/setting/loginLog/' + id,
        method: 'get'
    });
};

export const delLoginLog = params => {
    return axios({
        url: 'api/setting/delLoginLog',
        method: 'delete',
        params: params
    });
};
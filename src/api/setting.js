import axios from '../utils/request';
import qs from 'qs';

// vue路由
export const getUserVueRoute = () => {
    return axios({
        url: 'api/setting/getUserVueRoute',
        method: 'post'
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

/**
 * 检查用户密码
 * @param {*} params 
 */
export const checkPassword = (params, headers) => {
    return axios.post('api/setting/checkPassword', qs.stringify(params), {headers:headers});
};

// 更新用户密码
export const userPasswordUpdate = (params, headers) => {
    return axios.post('api/setting/userPasswordUpdate', qs.stringify(params), {headers:headers});
};

// 角色管理
export const roleList = params => {
    return axios({
        url: 'api/setting/role',
        method: 'get',
        params: params
    });
};

export const roleStore = params => {
    return axios({
        url: 'api/setting/role',
        method: 'post',
        data: params
    });
};

export const roleInfo = id => {
    return axios({
        url: 'api/setting/role/' + id,
        method: 'get'
    });
};

export const roleUpdate = (id, params) => {
    return axios({
        url: 'api/setting/role/' + id,
        method: 'put',
        data: params
    });
};

export const roleDelete = id => {
    return axios({
        url: 'api/setting/role/' + id,
        method: 'delete'
    });
};

// 禁用启用角色
export const changeRoleStatus = params => {
    return axios({
        url: 'api/setting/changeRoleStatus',
        method: 'get',
        params: params
    });
};

// 角色用户管理
export const roleUserList = (id) => {
    return axios({
        url: 'api/setting/roleUserList/' + id,
        method: 'get'
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
        url: 'api/setting/menus',
        method: 'get',
        params: params
    });
};

export const menuStore = params => {
    return axios({
        url: 'api/setting/menus',
        method: 'post',
        data: params
    });
};

export const menuInfo = id => {
    return axios({
        url: 'api/setting/menus/' + id,
        method: 'get'
    });
};

export const menuUpdate = (id, params) => {
    return axios({
        url: 'api/setting/menus/' + id,
        method: 'put',
        data: params
    });
};

export const menuDelete = id => {
    return axios({
        url: 'api/setting/menus/' + id,
        method: 'delete',
        params: []
    });
};

export const menuSelect = () => {
    return axios({
        url: 'api/setting/menuSelect',
        method: 'get'
    });
};

export const getMenuTree = (id) => {
    return axios({
        url: 'api/setting/getMenuTree/' + id,
        method: 'get'
    });
};

export const setRoleMenus = (id, params) => {
    return axios({
        url: 'api/setting/setRoleMenus/' + id,
        method: 'post',
        data: params
    });
};

export const setRoleUsers = params => {
    return axios({
        url: 'api/setting/setRoleUsers',
        method: 'post',
        data: params
    });
};

export const menuPermissionTransfer = id => {
    return axios({
        url: 'api/setting/menuPermissionTransfer/'+ id,
        method: 'get'
    });
};

export const setMenuPermission = params => {
    return axios({
        url: 'api/setting/setMenuPermission',
        method: 'post',
        data: params
    });
};


// 权限管理
export const permissionList = params => {
    return axios({
        url: 'api/setting/permission',
        method: 'get',
        params: params
    });
};

export const permissionStore = params => {
    return axios({
        url: 'api/setting/permission',
        method: 'post',
        data: params
    });
};

export const permissionInfo = id => {
    return axios({
        url: 'api/setting/permission/' + id,
        method: 'get'
    });
};

export const permissionUpdate = (id, params) => {
    return axios({
        url: 'api/setting/permission/' + id,
        method: 'put',
        data: params
    });
};

export const permissionDelete = id => {
    return axios({
        url: 'api/setting/permission/' + id,
        method: 'delete',
        params: []
    });
};

// 登陆日志
export const loginLogList = params => {
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

export const loginLogDelete = params => {
    return axios({
        url: 'api/setting/delLoginLog',
        method: 'delete',
        params: params
    });
};
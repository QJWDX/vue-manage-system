import request from '../utils/request';

export const login = query => {
    return request({
        url: 'api/auth/login',
        method: 'post',
        params: query
    });
};

export const logout = () => {
    return request({
        url: 'api/auth/logout',
        method: 'get'
    });
};

export const getUserInfo = () => {
    return request({
        url: 'api/auth/user',
        method: 'get'
    });
};

export const getMenusAndRoute = query => {
    return request({
        url: 'api/role/getMenusAndRoute',
        method: 'get',
        params: query
    });
};

export const getTableData = query => {
    return request({
        url: 'api/example/baseTable',
        method: 'get',
        params: query
    });
};

export const getRoleList = query => {
    return request({
        url: 'api/role/getRoleList',
        method: 'get',
        params: query
    });
};

export const addRole = query => {
    return request({
        url: 'api/role/addRole',
        method: 'post',
        params: query
    });
};

export const getRoleInfo = id => {
    return request({
        url: 'api/role/getRoleInfo/' + id,
        method: 'get',
        params: []
    });
};

export const modRole = id => {
    return request({
        url: 'api/role/modRole/' + id,
        method: 'put',
        params: []
    });
};

export const delRole = query => {
    return request({
        url: 'api/role/delRole',
        method: 'delete',
        params: query
    });
};




export const getNotifications = query => {
    return request({
        url: 'api/notifications/getNotifications',
        method: 'get',
        params: query
    });
};

export const delNotifications = query => {
    return request({
        url: 'api/notifications/delNotifications',
        method: 'delete',
        params: query
    });
};

export const makeRead = query => {
    return request({
        url: 'api/notifications/makeRead',
        method: 'get',
        params: query
    });
};

export const getUnreadNumber = query => {
    return request({
        url: 'api/notifications/getUnreadNumber',
        method: 'get',
        params: query
    });
};

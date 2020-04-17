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


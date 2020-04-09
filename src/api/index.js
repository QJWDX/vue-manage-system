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

export const getTableData = query => {
    return request({
        url: 'api/example/baseTable',
        method: 'get',
        params: query
    });
};

export const getRole = query => {
    return request({
        url: 'api/example/getRoleList',
        method: 'get',
        params: query
    });
};


import request from '../utils/request';

export const getMenuTree = query => {
    return request({
        url: 'api/menus/getMenuTree',
        method: 'get',
        params: query
    });
};

export const getRoleMenus = query => {
    return request({
        url: 'api/menus/getRoleMenus',
        method: 'get',
        params: query
    });
};

export const setRoleMenus = query => {
    return request({
        url: 'api/menus/setRoleMenus',
        method: 'post',
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

export const modRole = (id, query) => {
    return request({
        url: 'api/role/modRole/' + id,
        method: 'put',
        params: query
    });
};

export const delRole = query => {
    return request({
        url: 'api/role/delRole',
        method: 'delete',
        params: query
    });
};

export const getRoleTree = () => {
    return request({
        url: 'api/role/getRoleTree',
        method: 'get'
    });
};

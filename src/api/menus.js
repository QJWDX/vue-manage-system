import request from '../utils/request';

export const menuList = query => {
    return request({
        url: 'api/menus',
        method: 'get',
        params: query
    });
};

export const menuStore = query => {
    return request({
        url: 'api/menus',
        method: 'post',
        params: query
    });
};


export const menuInfo = id => {
    return request({
        url: 'api/menus/' + id,
        method: 'get',
        params: []
    });
};




export const saveMenu = (id, query) => {
    return request({
        url: 'api/menus/' + id,
        method: 'put',
        params: query
    });
};

export const delMenu = id => {
    return request({
        url: 'api/menus/' + id,
        method: 'delete',
        params: []
    });
};


export const menuSelect = () => {
    return request({
        url: 'api/menus/menuSelect',
        method: 'get'
    });
};


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

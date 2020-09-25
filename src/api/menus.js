import request from '../utils/request';

export const menuList = query => {
    return request({
        url: 'api/menus/list',
        method: 'get',
        params: query
    });
};

export const menuStore = query => {
    return request({
        url: 'api/menus/store',
        method: 'post',
        data: query
    });
};


export const menuInfo = id => {
    return request({
        url: 'api/menus/show/' + id,
        method: 'get'
    });
};




export const saveMenu = (id, query) => {
    return request({
        url: 'api/menus/update/' + id,
        method: 'put',
        data: query
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
        data: query
    });
};

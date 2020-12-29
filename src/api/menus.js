import axios from '../utils/request';

export const menuList = query => {
    return axios({
        url: 'api/menus/list',
        method: 'get',
        params: query
    });
};

export const menuStore = query => {
    return axios({
        url: 'api/menus/store',
        method: 'post',
        data: query
    });
};


export const menuInfo = id => {
    return axios({
        url: 'api/menus/show/' + id,
        method: 'get'
    });
};




export const saveMenu = (id, query) => {
    return axios({
        url: 'api/menus/update/' + id,
        method: 'put',
        data: query
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


export const getMenuTree = query => {
    return axios({
        url: 'api/menus/getMenuTree',
        method: 'get',
        params: query
    });
};

export const getRoleMenus = query => {
    return axios({
        url: 'api/menus/getRoleMenus',
        method: 'get',
        params: query
    });
};

export const setRoleMenus = query => {
    return axios({
        url: 'api/menus/setRoleMenus',
        method: 'post',
        data: query
    });
};

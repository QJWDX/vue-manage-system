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
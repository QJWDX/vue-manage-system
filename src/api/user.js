import request from '../utils/request';

export const userList = query => {
    return request({
        url: 'api/user',
        method: 'get',
        params: query
    });
};

export const userStore = query => {
    return request({
        url: 'api/user',
        method: 'post',
        params: query
    });
};


export const userInfo = id => {
    return request({
        url: 'api/user/' + id,
        method: 'get',
        params: []
    });
};




export const saveUser = (id, query) => {
    return request({
        url: 'api/user/' + id,
        method: 'put',
        params: query
    });
};

export const delUser = id => {
    return request({
        url: 'api/user/' + id,
        method: 'delete',
        params: []
    });
};

export const getUserRole = id => {
    return request({
        url: 'api/user/getUserRole/' + id,
        method: 'get'
    });
};


export const setUserRole = (id, query) => {
    return request({
        url: 'api/user/setUserRole/' + id,
        method: 'post',
        params: query
    });
};


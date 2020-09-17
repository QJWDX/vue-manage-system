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
        data: query
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
        data: query
    });
};

export const delUser = id => {
    return request({
        url: 'api/user/' + id,
        method: 'delete'
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
        data: query
    });
};


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

export const fetchData = query => {
    return request({
        url: 'example/baseTable',
        method: 'get',
        params: query
    });
};



import request from '../utils/request';

export const login = (query, headers) => {
    return request({
        url: 'api/auth/login',
        method: 'post',
        data: query,
        headers: headers
    });
};

export const logout = () => {
    return request({
        url: 'api/auth/logout',
        method: 'get'
    });
};

export const getCaptcha = () => {
    return request({
        url: 'api/auth/getCaptcha',
        method: 'post'
    });
};

export const getRsaPublicKey = () => {
    return request({
        url: 'api/auth/getRsaPublicKey',
        method: 'post'
    });
};

export const getUserInfo = () => {
    return request({
        url: 'api/auth/user',
        method: 'get'
    });
};

export const getVueRoute = query => {
    return request({
        url: 'api/menus/getVueRoute',
        method: 'get',
        params: query
    });
};

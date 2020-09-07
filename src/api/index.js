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

export const getNotifications = query => {
    return request({
        url: 'api/notifications/getNotifications',
        method: 'get',
        params: query
    });
};

export const delNotifications = query => {
    return request({
        url: 'api/notifications/delNotifications',
        method: 'delete',
        params: query
    });
};

export const makeRead = query => {
    return request({
        url: 'api/notifications/makeRead',
        method: 'get',
        params: query
    });
};

export const getUnreadNumber = query => {
    return request({
        url: 'api/notifications/getUnreadNumber',
        method: 'get',
        params: query
    });
};


export const baseTable = query => {
    return request({
        url: '/example/baseTable',
        method: 'get',
        params: query
    });
}
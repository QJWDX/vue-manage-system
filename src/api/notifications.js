import request from '../utils/request';

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

export const getNotificationCountStatistics = query => {
    return request({
        url: 'api/notifications/getNotificationCountStatistics',
        method: 'get',
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


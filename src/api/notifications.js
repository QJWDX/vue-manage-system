import request from '../utils/request';

export const getNotifications = query => {
    return request({
        url: 'api/notifications/getNotifications',
        method: 'get',
        params: query
    });
};

export const delNotifications = $id => {
    return request({
        url: 'api/notifications/del/'. $id,
        method: 'delete'
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


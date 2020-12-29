import axios from '../utils/request';

export const getNotifications = query => {
    return axios({
        url: 'api/notifications/getNotifications',
        method: 'get',
        params: query
    });
};

export const delNotifications = query => {
    return axios({
        url: 'api/notifications/delNotifications',
        method: 'delete',
        params: query
    });
};

export const getNotificationCountStatistics = query => {
    return axios({
        url: 'api/notifications/getNotificationCountStatistics',
        method: 'get',
        params: query
    });
};


export const makeRead = query => {
    return axios({
        url: 'api/notifications/makeRead',
        method: 'get',
        params: query
    });
};


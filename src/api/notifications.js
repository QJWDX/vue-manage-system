import axios from '../utils/request';

export const notificationsList = params => {
    return axios({
        url: 'api/Notification/getNotifications',
        method: 'get',
        params: params
    });
};

export const delNotification = params => {
    return axios({
        url: 'api/Notification/delNotifications',
        method: 'delete',
        params: params
    });
};

export const getNotificationCount = () => {
    return axios({
        url: 'api/Notification/getNotificationCount',
        method: 'get',
        params: []
    });
};


export const makeRead = params => {
    return axios({
        url: 'api/Notification/makeRead',
        method: 'get',
        params: params
    });
};


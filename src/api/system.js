import request from '../utils/request';

export const getSystemConfig = () => {
    return request({
        url: 'api/system/getSystemConfig',
        method: 'get'
    });
};


export const setSystemConfig = query => {
    return request({
        url: 'api/system/setSystemConfig',
        method: 'put',
        params: query
    });
};
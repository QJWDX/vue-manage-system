import request from '../utils/request';

export const baseTable = query => {
    return request({
        url: '/example/baseTable',
        method: 'get',
        params: query
    });
}


import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: 'example/baseTable',
        method: 'get',
        params: query
    });
};

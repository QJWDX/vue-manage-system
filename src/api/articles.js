import request from '../utils/request';

export const articles = query => {
    return request({
        url: 'api/articles/list',
        method: 'get',
        params: query
    });
};


export const articleInfo = id => {
    return request({
        url: 'api/articles/show/' + id,
        method: 'get'
    });
};
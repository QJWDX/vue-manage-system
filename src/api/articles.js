import axios from '../utils/request';

export const articles = query => {
    return axios({
        url: 'api/articles/list',
        method: 'get',
        params: query
    });
};


export const articleInfo = id => {
    return axios({
        url: 'api/articles/show/' + id,
        method: 'get'
    });
};
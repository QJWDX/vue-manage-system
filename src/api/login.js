import axios from '../utils/request';

export const login = (params, headers) => {
    return axios.post('api/auth/login', params, {headers:headers});
};

export const logout = () => {
    return axios({
        url: 'api/auth/logout',
        method: 'get'
    });
};

export const getCaptcha = () => {
    return axios({
        url: 'api/auth/getCaptcha',
        method: 'post'
    });
};

export const getRsaPublicKey = () => {
    return axios({
        url: 'api/auth/getRsaPublicKey',
        method: 'post'
    });
};

export const getUserInfo = () => {
    return axios({
        url: 'api/auth/user',
        method: 'get'
    });
};

export const getVueRoute = query => {
    return axios({
        url: 'api/menus/getVueRoute',
        method: 'get',
        params: query
    });
};


export const loginLog = query => {
    return axios({
        url: 'api/loginLog/list',
        method: 'get',
        params: query
    });
};

export const loginLogInfo = id => {
    return axios({
        url: 'api/loginLog/show/' + id,
        method: 'get'
    });
};

export const delLoginLog = query => {
    return axios({
        url: 'api/loginLog/delLoginLog',
        method: 'delete',
        params: query
    });
};
import axios from '../utils/request';

export const login = (params, headers) => {
    return axios.post('auth/user/login', params, {headers:headers});
};

export const logout = () => {
    return axios({
        url: 'auth/user/logout',
        method: 'get'
    });
};

export const getCaptcha = () => {
    return axios({
        url: 'auth/user/captcha',
        method: 'post'
    });
};

export const getRsaPublicKey = () => {
    return axios({
        url: 'auth/user/getRsaPublicKey',
        method: 'post'
    });
};
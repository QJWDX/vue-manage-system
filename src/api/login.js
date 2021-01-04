import axios from '../utils/request';
import qs from 'qs';

export const login = (params, headers) => {
    return axios.post('auth/user/login', qs.stringify(params), {headers:headers});
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
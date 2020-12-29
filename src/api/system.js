import axios from '../utils/request';

export const getSystemConfig = () => {
    return axios({
        url: 'api/system/getSystemConfig',
        method: 'get'
    });
};


export const setSystemConfig = query => {
    return axios({
        url: 'api/system/setSystemConfig',
        method: 'put',
        params: query
    });
};
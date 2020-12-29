import axios from '../utils/request';

export const baseTable = query => {
    return axios({
        url: '/example/baseTable',
        method: 'get',
        params: query
    });
}


import axios from '../utils/request';

export const roleList = query => {
    return axios({
        url: 'api/role/list',
        method: 'get',
        params: query
    });
};

export const storeRole = query => {
    return axios({
        url: 'api/role/store',
        method: 'post',
        data: query
    });
};

export const roleInfo = id => {
    return axios({
        url: 'api/role/show/' + id,
        method: 'get'
    });
};

export const saveRole = (id, query) => {
    return axios({
        url: 'api/role/update/' + id,
        method: 'put',
        data: query
    });
};

export const delRole = query => {
    return axios({
        url: 'api/role/delRole',
        method: 'delete',
        params: query
    });
};

export const getRoleTree = () => {
    return axios({
        url: 'api/role/getRoleTree',
        method: 'get'
    });
};

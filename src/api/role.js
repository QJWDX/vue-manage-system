import request from '../utils/request';

export const roleList = query => {
    return request({
        url: 'api/role',
        method: 'get',
        params: query
    });
};

export const storeRole = query => {
    return request({
        url: 'api/role',
        method: 'post',
        data: query
    });
};

export const roleInfo = id => {
    return request({
        url: 'api/role/' + id,
        method: 'get'
    });
};

export const saveRole = (id, query) => {
    return request({
        url: 'api/role/' + id,
        method: 'put',
        data: query
    });
};

export const delRole = query => {
    return request({
        url: 'api/role/delRole',
        method: 'delete',
        params: query
    });
};

export const getRoleTree = () => {
    return request({
        url: 'api/role/getRoleTree',
        method: 'get'
    });
};

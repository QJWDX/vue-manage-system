import request from '../utils/request';

export const files = query => {
    return request({
        url: 'api/files/list',
        method: 'get',
        params: query
    });
};


export const filesInfo = id => {
    return request({
        url: 'api/files/show/' + id,
        method: 'get'
    });
};

export const types = () => {
    return request({
        url: 'api/files/typeSelect',
        method: 'get'
    });
};

export const folders = () => {
    return request({
        url: 'api/files/folderSelect',
        method: 'get'
    });
};

export const download = id => {
    return request({
        url: 'files/download/' + id,
        method: 'get'
    });
};

export const upload = params => {
    return request({
        url: 'api/files/upload',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

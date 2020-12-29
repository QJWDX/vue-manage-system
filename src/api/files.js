import axios from '../utils/request';

export const files = query => {
    return axios({
        url: 'api/files/list',
        method: 'get',
        params: query
    });
};


export const filesInfo = id => {
    return axios({
        url: 'api/files/show/' + id,
        method: 'get'
    });
};

export const types = () => {
    return axios({
        url: 'api/files/typeSelect',
        method: 'get'
    });
};

export const folders = (query) => {
    return axios({
        url: 'api/files/folderSelect',
        method: 'get',
        params: query
    });
};

export const download = id => {
    return axios({
        url: 'files/download/' + id,
        method: 'get'
    });
};

export const upload = params => {
    return axios({
        url: 'api/files/upload',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

import axios from '../utils/request';

export const fileList = query => {
    return axios({
        url: 'api/File/files',
        method: 'get',
        params: query
    });
};

export const fileInfo = id => {
    return axios({
        url: 'api/File/files/' + id,
        method: 'get'
    });
};

export const typeSelector = () => {
    return axios({
        url: 'api/File/typeSelector',
        method: 'get'
    });
};

export const folderSelector = (query) => {
    return axios({
        url: 'api/File/folderSelector',
        method: 'get',
        params: query
    });
};

export const upload = params => {
    return axios({
        url: 'api/File/upload',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

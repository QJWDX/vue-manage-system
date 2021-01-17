import axios from '../utils/request';

export const fileList = params => {
    return axios({
        url: 'api/File/files',
        method: 'get',
        params: params
    });
};

export const fileInfo = id => {
    return axios({
        url: 'api/File/files/' + id,
        method: 'get'
    });
};

export const delFile = params => {
    return axios({
        url: 'api/File/delFiles',
        method: 'delete',
        params: params
    });
};

export const typeSelector = () => {
    return axios({
        url: 'api/File/typeSelector',
        method: 'get'
    });
};

export const folderSelector = (params) => {
    return axios({
        url: 'api/File/folderSelector',
        method: 'get',
        params: params
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

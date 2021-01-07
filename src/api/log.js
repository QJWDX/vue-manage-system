import axios from '../utils/request';
// import qs from 'qs';
// 登陆日志
export const operationLogList = params => {
    return axios({
        url: 'api/log/operationLog',
        method: 'get',
        params: params
    });
};

export const operationLogInfo = id => {
    return axios({
        url: 'api/log/operationLog/' + id,
        method: 'get'
    });
};

export const operationLogDelete = params => {
    return axios({
        url: 'api/log/log/delOperationLog',
        method: 'delete',
        params: params
    });
};
import axios from '@/request/index';
import qs from 'qs';
const api = {
    login:{
        login(params, headers){
            return axios.post('auth/user/login', qs.stringify(params), {headers:headers});
        },
        
        logout(){
            return axios.get('auth/user/logout');
        },
        
        getCaptcha(){
            return axios.post('auth/user/captcha');
        },
        
        getRsaPublicKey(){
            return axios.post('auth/user/getRsaPublicKey');
        }
    },
    system:{
        getSystemConfig(){
            return axios('api/system/getSystemConfig');
        },
        
        setSystemConfig(params){
            return axios.put('api/system/setSystemConfig', params);
        },
        system(){
            return axios('api/system/system');
        }
    },
    setting:{
        // vue路由
        getUserVueRoute(){
            return axios.post('api/setting/getUserVueRoute');
        },

        // 用户列表
        userList(params){
            return axios.get('api/setting/user', {params});
        },

        // 用户信息
        userInfo(id){
            return axios.get('api/setting/user/' + id);
        },

        // 用户新增
        userStore(params){
            return axios.post('api/setting/user', params);
        },

        // 用户编辑
        userUpate(id, params){
            return axios.put('api/setting/user/' + id, params);
        },

        // 用户删除
        userDelete(id){
            return axios.delete('api/setting/user/' + id);
        },

        // 禁用启用冻结用户
        changeUserStatus(params){
            return axios.get('api/setting/changeUserStatus', {params});
        },

        /**
         * 检查用户密码
         * @param {*} params 
         */
        checkPassword(params, headers){
            return axios.post('api/setting/checkPassword', qs.stringify(params), {headers:headers});
        },

        // 更新用户密码
        userPasswordUpdate(params, headers){
            return axios.post('api/setting/userPasswordUpdate', qs.stringify(params), {headers:headers});
        },

        // 重置用户密码
        resetUserPassword(id){
            return axios.get('api/setting/resetUserPassword/' + id);
        },

        // 角色管理
        roleList(params){
            return axios.get('api/setting/role', params);
        },

        roleStore(params){
            return axios.post('api/setting/role', params);
        },

        roleInfo(id){
            return axios.get('api/setting/role/' + id);
        },

        roleUpdate(id, params){
            return axios.put('api/setting/role/' + id, params);
        },

        roleDelete(id){
            return axios.delete('api/setting/role/' + id);
        },

        refreshRolePermission(){
            return axios.get('api/setting/refreshRolePermission');
        },

        // 禁用启用角色
        changeRoleStatus(params){
            return axios.get('api/setting/changeRoleStatus', {params});
        },

        // 角色用户管理
        roleUserList(id){
            return axios.get('api/setting/roleUserList/' + id);
        },


        getRoleTree(){
            return axios.get('api/role/getRoleTree');
        },

        // 菜单管理
        menuList(params){
            return axios.get('api/setting/menus', {params});
        },

        menuStore(params){
            return axios.post('api/setting/menus', params);
        },

        menuInfo(id){
            return axios.get('api/setting/menus/' + id);
        },

        menuUpdate(id, params){
            return axios.put('api/setting/menus/' + id, params);
        },

        menuDelete(id){
            return axios.delete('api/setting/menus/' + id);
        },

        menuSelect(){
            return axios.get('api/setting/menuSelect');
        },

        getMenuTree(id){
            return axios.get('api/setting/getMenuTree/' + id);
        },

        setRoleMenus(id, params){
            return axios.post('api/setting/setRoleMenus/' + id,params);
        },

        setRoleUsers(params){
            return axios.post('api/setting/setRoleUsers', params);
        },

        menuPermissionTransfer(id){
            return axios.get('api/setting/menuPermissionTransfer/'+ id);
        },

        setMenuPermission(params){
            return axios.post('api/setting/setMenuPermission', params);
        },

        // 权限管理
        permissionList(params){
            return axios.get('api/setting/permission', {params});
        },

        permissionStore(params){
            return axios.post('api/setting/permission', params);
        },

        permissionInfo(id){
            return axios.get('api/setting/permission/' + id);
        },

        permissionUpdate(id, params){
            return axios.put('api/setting/permission/' + id, params);
        },

        permissionDelete(id){
            return axios.delete( 'api/setting/permission/' + id);
        },

        // 登陆日志
        loginLogList(params){
            return axios.get('api/setting/loginLog', {params});
        },

        loginLogInfo(id){
            return axios.get('api/setting/loginLog/' + id);
        },

        loginLogDelete(params){
            return axios.get('api/setting/delLoginLog', {params});
        }
    },
    notifications:{
        notificationsList(params){
            return axios.get('api/Notification/getNotifications', {params});
        },
        
        delNotification(params){
            return axios.delete('api/Notification/delNotifications', {params});
        },
        
        getNotificationCount(){
            return axios.get('api/Notification/getNotificationCount');
        },
        
        makeRead(params){
            return axios.get('api/Notification/makeRead', {params});
        },

        sendNotification(params){
            return axios.post('api/Notification/sendNotification', params);
        },

        notificationType(){
            return axios.get('api/Notification/notificationType');
        }
    },
    log:{
        // 登陆日志
        operationLogList(params){
            return axios.get('api/log/operationLog', {params});
        },

        operationLogInfo(id){
            return axios.get('api/log/operationLog/' + id);
        },

        operationLogDelete(params){
            return axios.delete('api/log/log/delOperationLog', {params});
        }
    },
    files:{
        fileList(params){
            return axios.get('api/File/files', {params});
        },
        
        fileInfo(id){
            return axios.get('api/File/files/' + id);
        },
        
        delFile(params){
            return axios.delete('api/File/delFiles', {params});
        },
        
        typeSelector(){
            return axios.get('api/File/typeSelector');
        },
        
        folderSelector(params){
            return axios.get('api/File/folderSelector', {params});
        },
        
        upload(params){
            return axios({
                url: 'api/File/upload',
                method: 'post',
                data: params,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
    },
    statistics:{
        // 访问分析
        visitData(params){
            return axios.get('api/Statistics/visitData', {params});
        },
        // 地域分析(总数)
        districtTotalData(params){
            return axios.get('api/Statistics/districtTotalData', {params});
        },
        // 地域分析（国家）
        countryListData(params){
            return axios.get('api/Statistics/countryListData', {params});
        },
        // 地域分析（省份
        provinceListData(params){
            return axios.get('api/Statistics/provinceListData', {params});
        },
    }
}

export default api;
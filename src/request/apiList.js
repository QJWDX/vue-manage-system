import axios from "@/request/index";
import qs from "qs";
let baseUrl= process.env.VUE_APP_BASE_URL
let loginUrl = process.env.VUE_APP_LOGIN_URL
let mqttUrl = process.env.VUE_APP_MQTT_URL
let mqttUser = process.env.VUE_APP_MQTT_USER
let mqttPwd = process.env.VUE_APP_MQTT_PWD
let mqttProtocol = window.location.protocol === "https" ? "wss:" : "ws:"
const api = {
    downloadVideo (url){
        return axios({
            method: 'get',
            url:url,
            responseType: 'blob'
        });
    },
    mqttObj:{
        url: mqttProtocol + mqttUrl + "/ws",
        user: mqttUser,
        pwd: mqttPwd,
    },
    login:{
        login(params, headers){
            return axios.post(`${loginUrl}/user/login`, qs.stringify(params), {headers:headers});
        },
        
        logout(){
            return axios.get(`${loginUrl}/user/logout`);
        },
        
        getCaptcha(){
            return axios.post(`${loginUrl}/user/captcha`);
        },
        
        getRsaPublicKey(){
            return axios.post(`${loginUrl}/user/getRsaPublicKey`);
        },
        checkEmail(params){
            return axios.get(`${loginUrl}/user/checkEmail`, {params});
        },
        sendResetPasswordEmail(params){
            return axios.post(`${loginUrl}/user/sendResetPasswordEmail`, params);
        },
        checkEmailCode(params){
            return axios.post(`${loginUrl}/user/checkEmailCode`, params);
        },
        resetPassword(params, headers){
            return axios.post(`${loginUrl}/user/resetPassword`, qs.stringify(params), {headers:headers});
        }
    },
    system:{
        getSystemConfig(){
            return axios.get(`${baseUrl}/system/getSystemConfig`);
        },
        
        setSystemConfig(params){
            return axios.put(`${baseUrl}/system/setSystemConfig`, params);
        },
        system(){
            return axios.get(`${baseUrl}/system/system`);
        }
    },
    setting:{
        // vue路由
        getUserVueRoute(){
            return axios.post(`${baseUrl}/setting/getUserVueRoute`);
        },

        // 用户列表
        userList(params){
            return axios.get(`${baseUrl}/setting/user`, {params});
        },

        // 用户信息
        userInfo(id){
            return axios.get(`${baseUrl}/setting/user/` + id);
        },

        // 用户新增
        userStore(params){
            return axios.post(`${baseUrl}/setting/user`, params);
        },

        // 用户编辑
        userUpate(id, params){
            return axios.put(`${baseUrl}/setting/user/` + id, params);
        },

        // 用户删除
        userDelete(id){
            return axios.delete(`${baseUrl}/setting/user/` + id);
        },

        // 禁用启用冻结用户
        changeUserStatus(params){
            return axios.get(`${baseUrl}/setting/changeUserStatus`, {params});
        },

        /**
         * 检查用户密码
         * @param {*} params 
         */
        checkPassword(params, headers){
            return axios.post(`${baseUrl}/setting/checkPassword`, qs.stringify(params), {headers:headers});
        },

        // 更新用户密码
        userPasswordUpdate(params, headers){
            return axios.post(`${baseUrl}/setting/userPasswordUpdate`, qs.stringify(params), {headers:headers});
        },

        // 重置用户密码
        resetUserPassword(id){
            return axios.get(`${baseUrl}/setting/resetUserPassword/` + id);
        },

        // 角色管理
        roleList(params){
            return axios.get(`${baseUrl}/setting/role`, params);
        },

        roleStore(params){
            return axios.post(`${baseUrl}/setting/role`, params);
        },

        roleInfo(id){
            return axios.get(`${baseUrl}/setting/role/` + id);
        },

        roleUpdate(id, params){
            return axios.put(`${baseUrl}/setting/role/` + id, params);
        },

        roleDelete(id){
            return axios.delete(`${baseUrl}/setting/role/` + id);
        },

        refreshRolePermission(){
            return axios.get(`${baseUrl}/setting/refreshRolePermission`);
        },

        // 禁用启用角色
        changeRoleStatus(params){
            return axios.get(`${baseUrl}/setting/changeRoleStatus`, {params});
        },

        // 角色用户管理
        roleUserList(id){
            return axios.get(`${baseUrl}/setting/roleUserList/` + id);
        },


        getRoleTree(){
            return axios.get(`${baseUrl}/role/getRoleTree`);
        },

        // 菜单管理
        menuList(params){
            return axios.get(`${baseUrl}/setting/menus`, {params});
        },

        menuStore(params){
            return axios.post(`${baseUrl}/setting/menus`, params);
        },

        menuInfo(id){
            return axios.get(`${baseUrl}/setting/menus/` + id);
        },

        menuUpdate(id, params){
            return axios.put(`${baseUrl}/setting/menus/` + id, params);
        },

        menuDelete(id){
            return axios.delete(`${baseUrl}/setting/menus/` + id);
        },

        menuSelect(){
            return axios.get(`${baseUrl}/setting/menuSelect`);
        },

        getMenuTree(id){
            return axios.get(`${baseUrl}/setting/getMenuTree/` + id);
        },

        setRoleMenus(id, params){
            return axios.post(`${baseUrl}/setting/setRoleMenus/` + id,params);
        },

        setRoleUsers(params){
            return axios.post(`${baseUrl}/setting/setRoleUsers`, params);
        },

        menuPermissionTransfer(id){
            return axios.get(`${baseUrl}/setting/menuPermissionTransfer/`+ id);
        },

        setMenuPermission(params){
            return axios.post(`${baseUrl}/setting/setMenuPermission`, params);
        },

        // 权限管理
        permissionList(params){
            return axios.get(`${baseUrl}/setting/permission`, {params});
        },

        permissionStore(params){
            return axios.post(`${baseUrl}/setting/permission`, params);
        },

        permissionInfo(id){
            return axios.get(`${baseUrl}/setting/permission/` + id);
        },

        permissionUpdate(id, params){
            return axios.put(`${baseUrl}/setting/permission/` + id, params);
        },

        permissionDelete(id){
            return axios.delete( `${baseUrl}/setting/permission/` + id);
        },

        // 登陆日志
        loginLogList(params){
            return axios.get(`${baseUrl}/setting/loginLog`, {params});
        },

        loginLogInfo(id){
            return axios.get(`${baseUrl}/setting/loginLog/` + id);
        },

        loginLogDelete(params){
            return axios.delete(`${baseUrl}/setting/delLoginLog`, {params});
        }
    },
    notifications:{
        notificationsList(params){
            return axios.get(`${baseUrl}/Notification/getNotifications`, {params});
        },
        
        delNotification(params){
            console.log(1111)
            return axios.delete(`${baseUrl}/Notification/delNotifications`, {params});
        },
        
        getNotificationCount(){
            return axios.get(`${baseUrl}/Notification/getNotificationCount`);
        },
        
        makeRead(params){
            return axios.get(`${baseUrl}/Notification/makeRead`, {params});
        },

        sendNotification(params){
            return axios.post(`${baseUrl}/Notification/sendNotification`, params);
        },

        notificationType(){
            return axios.get(`${baseUrl}/Notification/notificationType`);
        }
    },
    log:{
        // 登陆日志
        operationLogList(params){
            return axios.get(`${baseUrl}/log/operationLog`, {params});
        },

        operationLogInfo(id){
            return axios.get(`${baseUrl}/log/operationLog/` + id);
        },

        operationLogDelete(params){
            return axios.delete(`${baseUrl}/log/delOperationLog`, {params});
        }
    },
    files:{
        fileList(params){
            return axios.get(`${baseUrl}/File/files`, {params});
        },
        
        fileInfo(id){
            return axios.get(`${baseUrl}/File/files/` + id);
        },
        
        delFile(params){
            return axios.delete(`${baseUrl}/File/delFiles`, {params});
        },
        
        typeSelector(){
            return axios.get(`${baseUrl}/File/typeSelector`);
        },
        
        folderSelector(params){
            return axios.get(`${baseUrl}/File/folderSelector`, {params});
        },
        
        upload(params){
            return axios({
                url: `${baseUrl}/File/upload`,
                method: `post`,
                data: params,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        download(params){
            return axios({
                url: `${baseUrl}/File/download`,
                method: `post`,
                data: params
            });
        },
        getShareLink(params){
            return axios.get(`${baseUrl}/File/getShareLink`, {params});
        },
        refreshShareLink(params){
            return axios.put(`${baseUrl}/File/refreshShareLink`, params);
        },
    },
    statistics:{
        // 访问分析
        visitData(params){
            return axios.get(`${baseUrl}/Statistics/visitData`, {params});
        },
        // 地域分析(总数)
        districtTotalData(params){
            return axios.get(`${baseUrl}/Statistics/districtTotalData`, {params});
        },
        // 地域分析（国家）
        countryListData(params){
            return axios.get(`${baseUrl}/Statistics/countryListData`, {params});
        },
        // 地域分析（省份
        provinceListData(params){
            return axios.get(`${baseUrl}/Statistics/provinceListData`, {params});
        },
    }
}

export default api;
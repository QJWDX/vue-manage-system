<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">
            <!-- <img :src="systemLogo"> -->
            <span>{{systemName}}</span>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="unread?`有${unread}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/Notification">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="unread"></span>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="avatar" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <a href="https://github.com/QJWDX/vue-manage-system" target="_blank">
                                <el-dropdown-item>项目仓库</el-dropdown-item>
                            </a>
                         </el-dropdown-item>
                        <el-dropdown-item command="modPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import Echo from 'laravel-echo'
import io from 'socket.io-client'
import bus from '../common/bus';
import {mapState, mapActions} from 'vuex';
export default {
    data() {
        var newPassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('密码必填'));
            }
            setTimeout(() => {
                var len = this.p_form.new_password.length;
                if(len > 18 || len < 4){
                     callback(new Error('密码长度为4-18个字符'));
                }
                if (this.p_form.new_password == this.p_form.password) {
                    callback(new Error('与旧密码一致,请重新填写'));
                } else {
                    callback();
                }
            }, 100)
        }; 
        var confirmPassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('确认密码必填'));
            }
            setTimeout(() => {
                if (this.p_form.new_password !== this.p_form.confirm_password) {
                    callback(new Error('确认密码与新密码不一致'));
                } else {
                    callback();
                }
            }, 100)
        }; 
        return {
            rsaKey: '',
            publicKey: '',
            collapse: false,
            fullscreen: false,
            name: 'ADMINISTRATOR',
            dialogVisible:false,
            p_form:{
                password:'',
                new_password:'',
                confirm_password:'',
            },
            rules: {
                password: [
                    { required: true, message: '密码必填', trigger: 'blur' },
                    { min:4 , max:18, message: '密码长度为4-18个字符', trigger: 'blur'}
                ],
                new_password: [
                  { validator: newPassword, trigger: 'blur' }
                ],
                confirm_password: [
                  { validator: confirmPassword, trigger: 'blur' }
                ],
            }
        };
    },
    computed: {
        ...mapActions('premisssion', ['delUserInfo']),
        username() {
            let user = this.$store.getters.user;
            let username = user.username;
            return username ? username : this.name;
        },
        unread() {
            let number = this.$store.getters.unreadNumber;
            return number;
        },
        avatar(){
            return this.$store.getters.userAvatar || require('../../assets/img/img.jpg');
        },
        systemName(){
            return this.$store.getters.systemName;
        },
        systemLogo(){
             return this.$store.getters.systemLogo;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            switch(command){
                case 'modPassword':
                    // this.dialogVisible = true;
                    this.$prompt('请输入您的密码', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        // inputPattern: /^[a-zA-Z]\w{5,17}$/,
                        inputErrorMessage: '密码必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
                    }).then(({value}) => {
                        this.$apiList.login.getRsaPublicKey().then(res => {
                            let key = res.data.key; 
                            let publicKey = res.data.public_key;
                            let params = {};
                            var password = value;
                            params.password = password;
                            let encrypt_data = this.$fun.encryptData(params, publicKey);
                            this.$apiList.setting.checkPassword({encrypt_data:encrypt_data}, {encryptKey:key}).then(res => {
                                if(res.code == 500){
                                    return;
                                }
                                this.$prompt('请输入新密码', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    inputPattern: /^[a-zA-Z]\w{5,17}$/,
                                    inputErrorMessage: '密码必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
                                }).then(({ value }) => {
                                    var new_password = value;
                                    this.$prompt('请输入确认密码', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        inputPattern: /^[a-zA-Z]\w{5,17}$/,
                                        inputErrorMessage: '密码必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
                                    }).then(({ value }) => {
                                        var confirm_password = value;
                                        if(new_password !== confirm_password){
                                            this.$fun.msg('两次输入密码不一致', 0);
                                            return
                                        }
                                         this.$apiList.login.getRsaPublicKey().then(res => {
                                            let key = res.data.key; 
                                            let publicKey = res.data.public_key;
                                            let params = {};
                                            params.password = password;
                                            params.new_password = new_password;
                                            params.confirm_password = confirm_password;
                                            let encrypt_data = this.$fun.encryptData(params, publicKey);
                                            this.$apiList.setting.userPasswordUpdate({encrypt_data:encrypt_data},{encryptKey:key}).then(res => {
                                                if(res.code == 500){
                                                    return;
                                                }
                                                 this.$confirm('密码修改成功, 是否退出重新登陆?', '提示', {
                                                    confirmButtonText: '是',
                                                    cancelButtonText: '否',
                                                    type: 'warning'
                                                }).then(() => {
                                                    this.$store.dispatch('delUserInfo');
                                                    this.$router.push('/login');
                                                }).catch(() => {
                                                     this.$fun.msg('您已取消退出重新登陆，下次登录别忘了输入新密码哦！', 2);         
                                                });
                                            });
                                         });
                                       
                                    }).catch(() => {
                                        this.$fun.msg('您已取消输入', 2);
                                    });
                                }).catch(() => {
                                     this.$fun.msg('您已取消输入', 2);
                                });
                            });
                        }).catch(error => {
                            this.$message.error(error);
                        });
                    }).catch(() => {
                         this.$fun.msg('您已取消输入', 2);
                    });
                    break;
                case 'logout':
                    this.$apiList.login.logout().then(res => {
                        this.$store.dispatch('delUserInfo');
                        this.$router.replace({path: '/login'});
                        location.reload();
                    });
                    break;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        submitForm(){
            this.$refs['p_form'].validate((valid) => {
                if (valid) {
                    let params = new URLSearchParams();
                    params.append('password', this.p_form.password)
                    params.append('new_password', this.p_form.new_password)
                    params.append('confirm_password', this.p_form.confirm_password)
                    this.$apiList.setting.userPasswordUpdate(this.$store.getters.user.id, params).then(res => {
                        if(res.code == 200){
                            this.p_form = {};
                            this.dialogVisible = false;
                            this.$store.dispatch('delUserInfo');
                            this.$router.push('/login');
                        }
                    });
                }
            });
        }
    },
    created(){
        this.$apiList.notifications.getNotificationCount().then(res => {
            this.$store.dispatch('setUnreadNumber', res.data.unread);
        });
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
        // const token = this.$store.getters.token;
        // const userId = this.$store.getters.user.id;
        // window.io = io
        // window.Echo = new Echo({
        //     broadcaster: 'socket.io',
        //     host: 'http://localhost:6001',
        //     auth: {
        //         headers: {
        //         Authorization: 'Bearer ' + token
        //         }
        //     }
        // });
        // // 公共频道
        // window.Echo.channel('news').listen('News', (e) => {
        //   console.log('广播消息接收成功：')
        //   console.log(e)
        // })
        // // 私有频道
        // window.Echo.private('news').listen('News', (res) => {
        //   console.log(res)
        // })
        // // 消息通知
        // window.Echo.private('App.Models.User.' + userId).notification((notification) => {
        //     console.log('接收的消息如下：')
        //     // console.log(notification)
        //     this.$notify({
        //         title: notification.title,
        //         message: notification.content,
        //         type: 'warning',
        //         // offset: 100,
        //         showClose: false
        //     });
        //      let params = {
        //         notifiable_id: this.$store.getters.user.id,
        //         type:0,
        //         notifiable_type:0
        //     };
        //     getNotificationCountStatistics(params).then(res => {
        //         this.$store.dispatch('setUnreadNumber', res.data.unread_count);
        //     });
        //     if(this.$route.path == '/notification'){
        //         location.reload();
        //     }
        // })
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 300px;
    line-height: 70px;
    font-weight: bold;
}
.header .logo img {
    vertical-align: middle;
    width: 2.625rem;
    margin-right: 0.3125rem;
}
.header .logo-images image{
    display: inline-block;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu{
    border-radius: 0;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>

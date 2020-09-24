<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">后台管理系统</div>
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
                        <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a>
                        <el-dropdown-item>
                            <router-link to="role">个人中心 </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
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
        return {
            collapse: false,
            fullscreen: false,
            name: '管理员',
        };
    },
    computed: {
        ...mapActions('premisssion', ['delUserInfo']),
        // ...mapActions('notification', ['storeUnreadNumber']),
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
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'logout') {
                this.$apiList.login.logout().then(res => {
                    console.log(res.message);
                    this.$store.dispatch('delUserInfo');
                    this.$router.push('/login');
                });
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
        }
    },
    created(){
        let params = {
            notifiable_id: this.$store.getters.user.id,
            type:0,
            notifiable_type:0
        };
        this.$apiList.notifications.getNotificationCountStatistics(params).then(res => {
            this.$store.dispatch('setUnreadNumber', res.data.unread_count);
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
    width: 250px;
    line-height: 70px;
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
.el-dropdown-menu__item {
    text-align: center;
}
</style>

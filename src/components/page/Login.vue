<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">
                <img :src="systemLogo">
                <span>{{systemName}}</span>
                </div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content" size="medium">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username"  size="medium">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        size="medium"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="captcha_code" style="margin-bottom:4px;">
                    <el-input v-model="param.captcha_code" placeholder="验证码" style="width:200px;"  size="medium">
                        <el-button slot="prepend" icon="el-icon-lx-edit"></el-button>
                    </el-input>
                    <img :src="catcha_img" alt="" @click="getCaptchaInfo" style="margin-left:18px;">
                </el-form-item>
                <div class="wrap_find">
                    <el-checkbox v-model="remember"><span style="color:#ffffff;">记住密码</span></el-checkbox>
                    <span class="findPassword" @click="findPassword">找回密码</span>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()" :disabled="disable" @keyup.enter.native="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import DragDialogVue from './DragDialog.vue';
const Base64 = require('js-base64').Base64;
export default {
    data: function() {
        return {
            disable: false,
            catcha_img:'',
            remember: false,
            param: {
                username: '',
                password: '',
                captcha_code: '',
                captcha_key: '',
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min:2 , max:16, message: '用户名长度为2-16个字符', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min:4 , max:20, message: '密码长度为4-20字符', trigger: 'blur'}
                ],
                captcha_code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min:4 , max:8, message: '验证码长度不在范围内', trigger: 'blur'}
                ]
            },
        };
    },
    created(){
        this.$store.dispatch('getSystemConfig');
        this.getCaptchaInfo();
    },
    mounted(){
        // 绑定enter事件
        document.addEventListener("keyup", this.enterKey);
        // 获取记住的账号密码信息
        let username = this.$fun.getCookie('XXU');
        if(username){
            this.param.username = username;
            this.param.password = Base64.decode(this.$fun.getCookie('XXP'));
            this.remember = true;
        }
    },
    destroyed() {
        // 销毁enter事件
        document.removeEventListener("keyup", this.enterKey);
    },
    computed:{
        systemName(){
            return this.$store.getters.systemName;
        },
        systemLogo(){
            return this.$store.getters.systemLogo;
        }
    },
    methods: {
        getCaptchaInfo(){
            this.$apiList.login.getCaptcha().then(res => {
                this.catcha_img = res.data.img;
                this.param.captcha_key = res.data.key;
            })
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.disable = true;
                    this.$apiList.login.getRsaPublicKey().then(res => {
                            let key = res.data.key; 
                            let publicKey = res.data.public_key;
                            let encrypt_data = this.$fun.encryptData(this.param, publicKey);
                            // const params = new URLSearchParams();
                            // params.append('encrypt_data', encrypt_data);
                            this.$apiList.login.login({encrypt_data:encrypt_data}, {encryptKey:key}).then(res => {
                                this.$store.dispatch('userLogin', res.data);
                                this.rememberPassword();
                                this.$store.dispatch('addMenuData', this.$store.getters.user.role);
                                this.disable = false;
                                this.$router.push('/');
                            }).catch((err) => {
                                console.log(err);
                                this.disable = false;
                            });
                    });
                } else {
                    return false;
                }
            });
        },
        rememberPassword(){
            if(this.remember){
                let expireDays = 1000 * 60 * 60;
                this.$fun.setCookie('XXU', this.param.username, expireDays);
                this.$fun.setCookie('XXP', Base64.encode(this.param.password), expireDays);
            }else{
                this.$fun.setCookie('XXU', '');
                this.$fun.setCookie('XXP', '');
            }
        },
        enterKey(e) {
            const path = this.$route.path;
            if (path == "/login") {
                let key = null;
                if (window.event === undefined) {
                    key = e.keyCode;
                } else {
                    key = window.event.keyCode;
                }
                if (key === 13) {
                    this.submitForm();
                }
            }
        },
        findPassword(){
             this.$fun.msg('功能还在开发中');
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg1.png);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    color: #fff;
}
.ms-title img {
    vertical-align: middle;
    width: 2.625rem;
    margin-right: 0.3125rem;
}
.ms-login {
    height: 25rem;
    background-color: rgba(124, 141, 175, 0.3);
    box-shadow: 0 0.1875rem 1.3125rem 0 rgba(31, 58, 96, 0.2);
    border-radius: 0.125rem;
    position: absolute;
    top: 45%;
    margin-top: -14.625rem;
    left: 50%;
    margin-left: -13rem;
    padding: 0.625rem;
}
.ms-content {
    padding: 15px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 3rem;
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%), linear-gradient(#0870df, #0870df);
    background-blend-mode: overlay, normal;
    box-shadow: inset 0 0 0 0 white;
    border-radius: 0.3125rem;
    border: none !important;
    font-size: 1.125rem;
    color: #ffffff;
}
.login-tips {
    font-size: 0.875em;
    line-height: 2em;
    color: #fff;
}
.el-input >>> .el-input__inner{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-radius: 0px;
}
 .el-input >>> .el-input-group__prepend{
     border-radius: 0px;
}
.wrap_find{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.3125rem 0;
}
.wrap_find /deep/ .el-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 0.875rem !important;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    user-select: none;
    margin-right: 1.875rem;
}

.wrap_find /deep/ .el-checkbox__label{
    font-size: 0.875rem !important;
}
.findPassword{
    font-size: 0.875rem;
    color: white;
    margin-left: 0.9375rem;
    cursor: pointer;
    line-height: 1.1875rem;
}
.el-form-item:last-child {
    margin-bottom: 10px !important;
}
</style>
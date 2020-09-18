<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username" class="login-input">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                        class="login-input"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="captcha_code">
                    <el-input v-model="param.captcha_code" placeholder="验证码" style="width:200px;" class="login-input">
                        <el-button slot="prepend" icon="el-icon-lx-edit"></el-button>
                    </el-input>
                    <img :src="catcha_img" alt="" style="margin-left:16px;" @click="getCaptchaInfo">
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()" :disabled="disable">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import { getCaptcha, getRsaPublicKey } from '../../api/index';
import DragDialogVue from './DragDialog.vue';
export default {
    data: function() {
        return {
            disable: false,
            catcha_img:'',
            param: {
                username: 'admin',
                password: 'admin',
                captcha_code: '',
                captcha_key: '',
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min:2 , max:8, message: '用户名长度为2-8个字符', trigger: 'blur'}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min:4 , max:16, message: '密码长度为4-16字符', trigger: 'blur'}
                ],
                captcha_code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min:4 , max:4, message: '验证码长度为4字符', trigger: 'blur'}
                ]
            },
        };
    },
    created(){
        this.getCaptchaInfo();
    },
    methods: {
        getCaptchaInfo(){
            getCaptcha().then(res => {
                this.catcha_img = res.data.img;
                this.param.captcha_key = res.data.key;
            })
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.disable = true;
                    getRsaPublicKey().then(res => {
                            let key = res.data.key; 
                            let publicKey = res.data.public_key;
                            var crypt = new this.$jsEncrypt({
                                default_key_size: 1024
                            });
                            crypt.setPublicKey(publicKey);
                            let params = { encrypt_data: crypt.encrypt(JSON.stringify(this.param)) };
                            let headers = {encryptKey: key};
                            console.log(headers);
                            this.$store.dispatch('userLogin', {query:params, headers:headers}).then(res => {
                                this.disable = false;
                                this.$router.push('/');
                            }).catch(err => {
                                this.disable = false;
                                console.log(err);
                            });
                        });
                } else {
                    return false;
                }
            });
        },
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
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    margin: -260px 0 0 -200px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 15px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
.login-input >>> .el-input__inner{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
}
</style>
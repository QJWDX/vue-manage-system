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
                <el-form-item prop="captcha_code" style="margin-bottom:0px;">
                    <el-input v-model="param.captcha_code" placeholder="验证码" style="width:65%;"  size="medium">
                        <el-button slot="prepend" icon="el-icon-lx-edit"></el-button>
                    </el-input>
                    <img :src="catcha_img" alt="" @click="getCaptchaInfo" class="catcha">
                </el-form-item>
                <div class="wrap_find">
                    <el-checkbox v-model="remember"><span style="color:#ffffff;">记住密码</span></el-checkbox>
                    <span class="findPassword" @click="recoverPassword=true">找回密码</span>
                </div>
                <el-button type="primary" class="login-btn" @click="submitForm()" :disabled="disable" @keyup.enter.native="submitForm()">登录</el-button>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
            <!-- 找回密码弹框 -->
            <div class="login_dailog">
            <el-dialog title="找回密码" :visible.sync="recoverPassword" :close-on-click-modal="false">
                <div class="dailog_main">
                    <el-row>
                    <el-col :span="22"><div class="dailog_tips">请验证本人身份信息</div></el-col>
                    </el-row>
                    <div class="wrap_form">
                    <el-form label-position="top" v-if="recoverStep==1">
                        <el-form-item label="请输入账号">
                        <el-input autocomplete="off" v-model="account_num" placeholder="请输入您的账号" @change="verifyNext"></el-input>
                        </el-form-item>
                        <el-form-item>
                        <el-button type="primary" class="verify_login login-bnt" @click="verifyNext">下一步</el-button>
                        </el-form-item>
                    </el-form>
                    <el-form label-position="top" :model="emailForm" ref="emailRef" v-else-if="recoverStep==2">
                        <el-form-item label="该账号绑定的邮箱为">
                            <el-input autocomplete="off" v-model="emailForm.email" @change="checkAcountEmail" @input="checkFail=false"></el-input>
                            <div class="isTrue" v-show="isCheck"><img src="@/assets/img/normal.png"/></div>
                        </el-form-item>
                        <el-form-item label="请输入邮箱密令" class="code">
                        <el-input autocomplete="off" v-model="emailForm.code"></el-input>
                        <el-button v-if="readysend" class="login-bnt send" @click="senddDynamicPass">获取动态密码</el-button>
                        <el-button v-else plain disabled>{{countdown}}s后重新获取</el-button>
                        </el-form-item>
                        <el-form-item>
                        <el-button type="primary" class="verify_login login-bnt" @click="verifyLogin">验证身份信息</el-button>
                        </el-form-item>
                    </el-form>
                    <el-form label-position="top" :model="verifyForm" :rules="verifyRules" ref="ruleVerify" v-else-if="recoverStep==3" key="onlyform">
                        <el-form-item label="请输入新密码" prop="pass">
                        <el-input autocomplete="off" type="password"  v-model="verifyForm.pass"></el-input>
                        </el-form-item>
                        <el-form-item label="重新输入新密码" prop="checkPass">
                        <el-input autocomplete="off" type="password" v-model="verifyForm.checkPass"></el-input>
                        </el-form-item>
                        <el-form-item>
                        <el-button type="primary" class="verify_login login-btn" @click="verifyReset">确定修改</el-button>
                        </el-form-item>
                    </el-form>
                    <div v-else>
                        <el-row :gutter="20">
                        <el-col :span="2" :offset="9"><div><img src="@/assets/img/empower/chenggong.png"/></div></el-col>
                        <el-col :span="6"><div class="success">密码修改成功！</div></el-col>
                        </el-row>
                        <div class="suceess_but"><el-button type="success" @click="comfirmPass">确认</el-button></div>
                    </div>
                    </div>
                </div>
            </el-dialog>
            </div>
            <!-- 找回密码弹框 -->
        </div>
    </div>
</template>

<script>
const Base64 = require('js-base64').Base64;
export default {
    data: function() {
        var verifyPass = (rule, value, callback) => {
            var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
            // var reg = /^[A-Za-z0-9]{5,18}$/
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (reg.test(value)) {
                if (this.verifyForm.checkPass !== '') {
                    this.$refs.ruleVerify.validateField('checkPass')
                }
                callback()
                } else {
                return callback(new Error('请输入由字母、数字和字符组成的8位到30位密码'))
                }
            }
        };
        var verifyPass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.verifyForm.pass) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        };
        return {
            recoverPassword:false,
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
            account_num: '',
            recoverStep: 1,
            checkFail: false,
            isCheck: false,
            countdown: 60,
            readysend:true,
            emailForm:{
                email: '',
                code: '',
                token: ''
            },
            verifyForm: {
                pass: '',
                checkPass: ''
            },
            verifyRules: {
                pass: [
                    { required: true, validator: verifyPass, trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, validator: verifyPass2, trigger: 'blur' }
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
        // 监测输入的用户账号绑定的邮箱是否正确
        checkAcountEmail () {
            if (!this.$fun.checkEmail(this.emailForm.email)) {
                this.$fun.msg('邮箱格式有误', 0)
                return
            }
            let param = {
                username: this.account_num,
                email: this.emailForm.email
            }
            this.$apiList.login.checkEmail(param).then(res => {
                if (res.code == 200) {
                    this.isCheck = true 
                } else {
                    this.isCheck = false
                    this.checkFail = true
                }
            }).catch(res => {
                this.isCheck = false
                this.checkFail = true
            })
        },
        // 找回密码的获取邮箱验证码
        senddDynamicPass () {
            if (this.checkFail) {
                this.$fun.msg('账号绑定的手机号码和输入的不一致', 0)
            } else {
                if (this.account_num != '' && this.emailForm.email) {
                if (this.readysend) {
                    this.readysend = false
                    this.countdown = 60
                    let that = this
                    that.sendcountdown = setInterval(() => {
                        that.countdown -= 1
                        if (that.countdown == 0) {
                            clearInterval(that.sendcountdown)
                            that.readysend = true
                        }
                    }, 1000)
                    let param = {
                        username: this.account_num,
                        email: this.emailForm.email
                    }
                    this.$apiList.login.sendResetPasswordEmail(param).then(res => {
                        if (res.code == 200) { this.$fun.msg(res.message) }
                    }).catch(res => {
                        this.readysend = true
                        this.$fun.msg('获取验证码失败', 0)
                    })
                }
                }
            }
        },
        verifyLogin () {
            if (this.emailForm.email && this.emailForm.code && this.isCheck) {
                let param = {
                username: this.account_num,
                email: this.emailForm.email,
                code: this.emailForm.code
            }
            this.$apiList.login.checkEmailCode(param).then(res => {
            if (res.code == 200) {
                this.recoverStep = 3
                this.emailForm.token = res.data.reset_pwd_token
            }
            }).catch(res => {
                this.$fun.msg(res.messge, 0)
            })
        }
        },
        verifyReset(){
            this.$refs['ruleVerify'].validate((valid) => {
                if (valid) {
                    let params = {
                        username: this.account_num,
                        password: this.verifyForm.pass,
                        confirm_password: this.verifyForm.checkPass,
                        reset_pwd_token: this.emailForm.token
                    }
                    this.$apiList.login.getRsaPublicKey().then(res => {
                        let key = res.data.key; 
                        let publicKey = res.data.public_key;
                        let encrypt_data = this.$fun.encryptData(params, publicKey);
                        params = { encrypt_data: encrypt_data }
                        let headerinfo = {
                            encryptKey: key
                        }
                        this.$apiList.login.resetPassword(params, headerinfo).then(res => {
                            if (res.code == 200) {
                                this.recoverStep = 4
                                this.account_num = ''
                                this.$refs['ruleVerify'].resetFields()
                                this.$refs['emailRef'].resetFields()
                            }
                        }).catch(res => {
                            this.$fun.msg(res.messge, 0)
                        })
                    })
                } else {
                    return false
                }
            })
        },
        verifyNext () {
            if (this.account_num != '' && this.account_num != null) {
                this.recoverStep = 2
            }
        },
        comfirmPass () {
            this.param.username = ''
            this.param.password = ''
            this.param.captcha_code = ''
            this.param.captcha_key = ''
            this.recoverPassword = false
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
.login-wrap .ms-login {
    width: 26rem;
    height: 24rem;
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
.login-wrap .ms-login .ms-title {
    width: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    color: #fff;
}
.login-wrap .ms-login .ms-title img {
    vertical-align: middle;
    width: 2.625rem;
    margin-right: 0.3125rem;
}

.login-wrap .ms-login .ms-content {
    padding: 15px 30px;
}
.login-btn{
    text-align: center;
    width: 100%;
    height: 2.8rem;
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%), linear-gradient(#1274db, #3a8ce4);
    background-blend-mode: overlay, normal;
    box-shadow: inset 0 0 0 0 white;
    border-radius: 0.3125rem;
    border: none !important;
    font-size: 1rem;
    color: #ffffff;
    margin-top: 5px;
}
.login-wrap .el-input >>> .el-input__inner{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    border-radius: 0px;
}
.login-wrap .el-input >>> .el-input-group__prepend{
     border-radius: 0px;
}
.login-wrap .ms-login .wrap_find{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.3125rem 0;
}
.login-wrap .ms-login .wrap_find /deep/ .el-checkbox {
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

.login-wrap .ms-login .wrap_find /deep/ .el-checkbox__label{
    font-size: 0.875rem !important;
}
.login-wrap .ms-login .findPassword{
    font-size: 0.875rem;
    color: white;
    margin-left: 0.9375rem;
    cursor: pointer;
    line-height: 1.1875rem;
}
.catcha{
    display: inline-block;
    margin-left: 0.25rem;
    flex: 1;
    height: 40px !important;
}
/* 修改分割线 */
.wrap_form{
    text-align: center;
    padding:40px 0;
}
.verify_login{
    width:100%;
    padding-top:15px;
    padding-bottom:15px;
}
.send{
    height: 40px;
    font-size: 16px;
}
.login_dailog::v-deep .el-dialog{
    padding:20px;
}
.login_dailog::v-deep .el-dialog__title{
    color:#666666;
}
.login_dailog::v-deep .el-dialog__body{
    color:#666666;
    padding:20px;
}
.login_dailog::v-deep .el-dialog__header{
    border-bottom:1px solid #95a7bf;
}
.login_dailog::v-deep.dailog_tips{
    line-height: 24px;
}
.login_dailog::v-deep .el-form{
    width:35%;
    display: inline-block;
}
.login_dailog::v-deep .el-form-item{
    margin-bottom:16px;
}
.login_dailog::v-deep .el-form-item:nth-last-child(2){
    margin-bottom:35px;
}
.login_dailog::v-deep .el-form-item__label{
    width:100%;
    padding:0;
}
.login_dailog::v-deep .code .el-input{
    width:48%;
    margin-right:4%;
}
.login_dailog::v-deep .code .el-button{
    width:48%;
}
.login_dailog::v-deep .inp_phone input{
    background-color: #ccc;
}
.isTrue{
  position: absolute;
  right:-28px;
  top:5px;
}
.isTrue img{
    width:20px;
    height:20px;
}
.success{
  text-align: left;
  line-height: 38px;
  font-size: 18px;
}
.suceess_but{
  margin-top:40px;
}
.suceess_but::v-deep .el-button{
    padding:12px 30px;
}
.login_dailog::v-deep .el-input.is-disabled .el-input__inner{
  color:#fff;
}
.wrap_find{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding:5px 0;
}
.antiShake,.antiShake:hover{
    background: #ccc;
    border-color: #ccc;
}
</style>
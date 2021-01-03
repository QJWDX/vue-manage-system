<template>
     <div style='padding:20px;'>
         <el-row>
            <el-col :span="8">
                <el-form :label-position="labelPosition" label-width="80px" :model="form" class="userForm" :rules="rules"  ref="form">
                    <el-form-item>
                         <el-upload
                            class="upload-demo"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :action="uploadUrl"
                            :headers="headers"
                        >
                            <el-image
                            style="width: 120px; height: 120px;border-radius:50%;"
                            :src="avatar"
                            :fit="fit">
                            </el-image>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="用户名称">
                        <el-input v-model="form.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="用户性别">
                         <el-radio-group v-model="form.sex">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="id_card">
                        <el-input v-model="form.id_card"></el-input>
                    </el-form-item>
                    <el-form-item label="用户地址" prop="address">
                        <el-input type="textarea" v-model="form.address" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存修改</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
         </el-row>
    </div>
</template>
<script>
    export default {
        data: function(){
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('电话号码必填'))
                }
                setTimeout(() => {
                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        if (this.$fun.checkPhone(value)) {
                            callback()
                        } else {
                            callback(new Error('电话号码格式错误'))
                        }
                    }
                }, 100)
            };
            var checkEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('邮箱必填'))
                }
                setTimeout(() => {
                    if (this.$fun.checkEmail(value)) {
                        callback()
                    } else {
                        callback(new Error('邮箱格式错误'))
                    }
                }, 100)
            };
            var checkIdCard = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('身份证号必填'))
                }
                setTimeout(() => {
                    if (this.$fun.checkIdCard(value)) {
                        callback()
                    } else {
                        callback(new Error('身份证号格式错误'))
                    }
                }, 100)
            };
            return {
                uploadUrl: this.$fun.apiUrl() + '/api/setting/userAvatarUpload/' + this.$store.getters.user.id,
                defaultSrc: require('../../assets/img/img.jpg'),
                labelPosition: 'right',
                fit: 'cover',
                form: {},
                rules: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' },
                        { min:2 , max:6, message: '姓名长度为2-6个字符', trigger: 'blur'}
                    ],
                    id_card: [
                       { validator: checkIdCard, trigger: 'blur' }
                    ],
                    tel: [
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '地址不能为空', trigger: 'blur' },
                        { min:1 , max:255, message: '地址长度不能超过255个字符', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            let user = this.$store.getters.user;
            user.sex =  this.$fun.nToS(user.sex);
            this.form = user;
        },
        computed: {
            headers(){
                return {
                    Authorization: 'Bearer ' + this.$store.getters.token
                };
            },
            role() {
                return this.$store.getters.user.role.indexOf('1') !== -1 ? '超级管理员' : '普通用户';
            },
            avatar(){
                return this.$store.getters.userAvatar;
            }
        },
        methods:{
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let query = {
                            username: this.$store.getters.user.username,
                            name: this.form.name,
                            email: this.form.email,
                            phone: this.form.phone,
                            sex: this.form.sex,
                            id_card: this.form.id_card,
                            address: this.form.address
                        };
                        this.$apiList.setting.userUpate(this.$store.getters.user.id, query).then(res => {
                            console.log(res);
                            this.$message.success(res.message);
                        });
                    }
                });
            },
             handleAvatarSuccess(res, file) {
                this.$store.dispatch('storeUserAvatar', res.data.url);
                this.imgSrc = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
    }
}
</script>

<style scoped>
    .upload-demo /deep/  .el-upload--text {
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        box-sizing: border-box;
        width: 121px;
        height: 121px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .userForm /deep/ .el-input__inner{
        border-radius: 0px;
    }
    .userForm /deep/ .el-textarea__inner{
         border-radius: 0px;
    }
</style>
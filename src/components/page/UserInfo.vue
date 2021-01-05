<template>
     <div style='padding:20px;'>
         <el-row>
            <el-col :span="8">
                <el-form :label-position="labelPosition" label-width="80px" :model="form" class="userForm" :rules="rules"  ref="form">
                    <el-form-item label="用户头像">
                         <el-upload
                            :on-success="handleUploadSuccess"
                            :before-upload="beforeUpload"
                            :action="uploadUrl"
                            :headers="headers"
                        >
                            <el-button type="warning">点击上传头像</el-button>
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
                    <el-form-item label="出生日期" prop="email">
                        <div class="block">
                            <el-date-picker
                                v-model="form.birthday"
                                type="date"
                                sie='small'
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                :picker-options="expireTimeOption"
                            >
                            </el-date-picker>
                        </div>
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
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="用户简介" prop="description">
                        <el-input type="textarea" v-model="form.description" rows="3"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="warning">取消编辑</el-button>
                        <el-button type="primary" @click="onSubmit">保存编辑</el-button>
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
                uploadUrl: '/api/setting/userAvatarUpload',
                labelPosition: 'right',
                form: {},
                rules: {
                    name: [
                        { required: true, message: '真实姓名不能为空', trigger: 'blur' },
                        { min:2 , max:6, message: '真实姓名长度为2-6个字符', trigger: 'blur'}
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
                        {max:255, message: '地址长度不能超过255个字符', trigger: 'blur'}
                    ],
                },
                expireTimeOption: {
                    disabledDate(date) {
                        //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
                        return date.getTime() > Date.now();
                    }
                }
            }
        },
        created() {
            // let user = this.$store.getters.user;
            this.getUserInfo();
        },
        inject: ['reload'],
        computed: {
            headers(){
                return {
                    Authorization: 'Bearer ' + this.$store.getters.token
                };
            },
            avatar(){
                return this.$store.getters.userAvatar;
            }
        },
        methods:{
            getUserInfo(){
                this.$apiList.setting.userInfo( this.$store.getters.user.id).then(res => {
                    if(res.code == 200){
                        this.form = res.data;
                        this.form.sex = this.$fun.nToS(this.form.sex);
                    }
                });
            },
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        const params = this.form;
                        this.$apiList.setting.userUpate(this.$store.getters.user.id, params).then(res => {
                            this.$message.success(res.message);
                            // 更新用户信息
                            this.$store.dispatch('updateUserInfo', res.data);
                            // this.reload();
                        });
                    }
                });
            },
             handleUploadSuccess(res, file) {
                if(res.code !== 200){
                    this.$message.error(res.message);
                }
                this.form.avatar = res.data.path;
            },
            beforeUpload(file) {
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
</style>
<template>
     <div class="container">
        <el-card shadow="hover" class="mgb20">
            <div class="user-info">
                <img :src="user.avatar" class="user-avator" alt />
                <div class="user-info-cont">
                    <el-upload
                        class="upload-demo"
                        drag
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :action="uploadUrl"
                        :headers="headers"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将头像文件拖到此处，或<em> 点击上传</em></div>
                    </el-upload>
                </div>
            </div>
            <div>
                <el-form :label-position="labelPosition" label-width="80px" :model="user">
                    <el-form-item label="用户名称">
                        <el-input v-model="user.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码">
                        <el-input v-model="user.password" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="user.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱">
                        <el-input v-model="user.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="user.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="用户性别">
                        <el-input v-model="user.sex"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input v-model="user.id_card"></el-input>
                    </el-form-item>
                    <el-form-item label="用户地址">
                        <el-input type="textarea" v-model="user.address" rows="4"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存修改</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                uploadUrl: 'http://localhost:8090/api/user/uploadAvatar/' + this.$store.getters.user.id,
                defaultSrc: require('../../assets/img/img.jpg'),
                labelPosition: 'right'
            }
        },
        created() {
            
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
            },
            user(){
                return this.$store.getters.user;
            }
        },
        methods:{
             handleAvatarSuccess(res, file) {
                console.log(res);
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
    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }
    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }
    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }
</style>
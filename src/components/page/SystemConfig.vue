<template>
    <div style='padding:20px;'>
        <div class="form-box">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="系统名称" prop="system_name">
                    <el-input v-model="form.system_name"></el-input>
                </el-form-item>
                <el-form-item label="系统版本" prop="system_version">
                    <el-input v-model="form.system_version"></el-input>
                </el-form-item>
                <el-form-item label="系统地址" prop="system_url">
                    <el-input v-model="form.system_url"></el-input>
                </el-form-item>
                <el-form-item label="系统备案" prop="system_icp">
                    <el-input v-model="form.system_icp"></el-input>
                </el-form-item>
                <el-form-item label="系统logo">
                        <el-upload
                        :on-success="handleUploadLogoSuccess"
                        :before-upload="beforeUpload"
                        :action="uploadUrl"
                        :headers="headers"
                    >
                        <el-button type="success">点击上传图片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="水印图片">
                        <el-upload
                        :on-success="handleUploadWatermarkSuccess"
                        :before-upload="beforeUpload"
                        :action="uploadUrl"
                        :headers="headers"
                    >
                        <el-button type="success">点击上传图片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="版权所有" prop="system_copyright">
                    <el-input v-model="form.system_copyright"></el-input>
                </el-form-item>
                <el-form-item label="技术支持" prop="technical_support">
                    <el-input v-model="form.technical_support"></el-input>
                </el-form-item>
                <el-form-item label="系统备注">
                    <el-input type="textarea" rows="5" v-model="form.system_remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning">取消设置</el-button>
                    <el-button type="primary" @click="onSubmit">保存设置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'baseform',
    data() {
        return {
            uploadUrl:"/api/system/systemConfig/upload",
            form: {},
            rules: {
                system_name: [
                    {required: true, message: '系统名称必填', trigger: 'blur' }
                ],
                system_version: [
                    {required: true, message: '系统版本必填', trigger: 'blur' }
                ],
                system_url: [
                    {required: true, message: '系统地址必填', trigger: 'blur' }
                ],
                system_icp: [
                    {required: true, message: '备案号必填', trigger: 'blur' }
                ],    
                system_copyright: [
                    {required: true, message: '版权所有必填', trigger: 'blur' }
                ],
                technical_support: [
                    {required: true, message: '技术支持必填', trigger: 'blur' }
                ],
            }
        };
    },
    created(){
        this.getData();
    },
    computed: {
        headers(){
            return {
                Authorization: 'Bearer ' + this.$store.getters.token
            };
        }
    },
    methods: {
        getData() {
            this.$apiList.system.getSystemConfig().then(res => {
                this.form = res.data;
            });
        },
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$apiList.system.setSystemConfig(this.form).then(res => {
                        this.$message.success(res.message);
                        this.$store.dispatch('getSystemConfig');
                    });
                }
            });
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        handleUploadWatermarkSuccess(res, file) {
            if(res.code !== 200){
                this.$message.error(res.message);
            }
            this.form.system_logo = res.data.path;
        },
        handleUploadLogoSuccess(res, file) {
            if(res.code !== 200){
                this.$message.error(res.message);
            }
            this.form.system_logo = res.data.path;
        },
        beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isJPG) {
            //     this.$message.error('图片只能是JPG格式!');
            // }
            if (!isLt2M) {
                this.$message.error('图片大小不能超过2MB!');
            }
            // return isJPG && isLt2M;
            return isLt2M;
        }
    }
};
</script>
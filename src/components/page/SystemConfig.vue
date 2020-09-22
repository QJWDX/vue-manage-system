<template>
    <div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="mytabs">
                <el-tab-pane label="系统参数" name="first" style='text'>
                    <div class="form-box">
                        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                            <el-form-item label="系统名称" prop="system_name">
                                <el-input v-model="form.system_name"></el-input>
                            </el-form-item>
                            <el-form-item label="系统版本" prop="system_version">
                                <el-input v-model="form.system_version"></el-input>
                            </el-form-item>
                            <el-form-item label="网站名称" prop="site_name">
                                <el-input v-model="form.site_name"></el-input>
                            </el-form-item>
                            <el-form-item label="网站地址" prop="site_url">
                                <el-input v-model="form.site_url"></el-input>
                            </el-form-item>
                            <el-form-item label="网站备案号" prop="site_icp">
                                <el-input v-model="form.site_icp"></el-input>
                            </el-form-item>
                            <el-form-item label="水印图片地址" prop="watermark">
                                <el-input v-model="form.watermark"></el-input>
                            </el-form-item>
                            <el-form-item label="系统logo路径" prop="system_logo">
                                <el-input v-model="form.system_logo"></el-input>
                            </el-form-item>
                            <el-form-item label="版权所有" prop="copyright">
                                <el-input v-model="form.copyright"></el-input>
                            </el-form-item>
                            <el-form-item label="技术支持" prop="technical_support">
                                <el-input v-model="form.technical_support"></el-input>
                            </el-form-item>
                            <el-form-item label="系统备注">
                                <el-input type="textarea" rows="5" v-model="form.remarks"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">保存设置</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="其他设置" name="second">其他设置</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            form: {
                system_name: '',
                system_version: '',
                site_name: '',
                site_url: '',
                site_icp: '',
                watermark: '',
                system_logo: '',
                copyright: '',
                technical_support: '',
                remarks: '',
            },
            activeName: 'first',
            rules: {
                system_name: [
                    {required: true, message: '系统名称必填', trigger: 'blur' }
                ],
                system_version: [
                    {required: true, message: '系统版本必填', trigger: 'blur' }
                ],
                site_name: [
                    {required: true, message: '网站名称必填', trigger: 'blur' }
                ],
                site_url: [
                    {required: true, message: '网站地址必填', trigger: 'blur' }
                ],
                site_icp: [
                    {required: true, message: 'ICP备案号必填', trigger: 'blur' }
                ],
                watermark: [
                    {required: true, message: '水印图片路径必填', trigger: 'blur' }
                ],
                system_logo: [
                    {required: true, message: '系统logo路径必填', trigger: 'blur' }
                ],
                copyright: [
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
                    });
                }
            });
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style scoped>
.mytabs /deep/ .el-tabs__item{
    text-align: center;
    font-size: 18px;
    padding: 0px;
    width: 120px;
}
.mytabs /deep/ .el-tabs__active-bar{
    width: 120px;
    height: 1px;
}
</style>
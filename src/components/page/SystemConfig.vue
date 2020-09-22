<template>
    <div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="mytabs">
                <el-tab-pane label="系统参数" name="first" style='text'>
                    <div class="form-box">
                        <el-form ref="form" :model="form" label-width="100px">
                            <el-form-item label="系统名称">
                                <el-input v-model="form.system_name"></el-input>
                            </el-form-item>
                            <el-form-item label="系统版本">
                                <el-input v-model="form.system_version"></el-input>
                            </el-form-item>
                            <el-form-item label="网站名称">
                                <el-input v-model="form.site_name"></el-input>
                            </el-form-item>
                            <el-form-item label="网站地址">
                                <el-input v-model="form.site_url"></el-input>
                            </el-form-item>
                            <el-form-item label="网站备案号">
                                <el-input v-model="form.site_icp"></el-input>
                            </el-form-item>
                            <el-form-item label="水印图片地址">
                                <el-input v-model="form.watermark"></el-input>
                            </el-form-item>
                            <el-form-item label="系统logo路径">
                                <el-input v-model="form.system_logo"></el-input>
                            </el-form-item>
                            <el-form-item label="版权所有">
                                <el-input v-model="form.copyright"></el-input>
                            </el-form-item>
                            <el-form-item label="技术支持">
                                <el-input v-model="form.technical_support"></el-input>
                            </el-form-item>
                            <el-form-item label="系统备注">
                                <el-input type="textarea" rows="5" v-model="form.remarks"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">保存</el-button>
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
                system_name: '',
                site_url: '',
                site_icp: '',
                watermark: '',
                system_logo: '',
                copyright: '',
                technical_support: '',
                remarks: '',
            },
            activeName: 'first'
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
            this.$message.success('提交成功！');
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
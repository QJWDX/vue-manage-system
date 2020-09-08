<template>
    <div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="系统参数" name="first">
                    <div class="form-box">
                        <el-form ref="form" :model="form" label-width="100px">
                            <el-form-item label="系统名称">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="系统描述">
                                <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
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
                name: '',
                region: '',
            },
            activeName: 'first'
        };
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
        },
        handleClick(tab, event) {
        console.log(tab, event);
      }
    }
};
</script>
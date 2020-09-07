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
                <el-tab-pane label="其他设置1" name="second">其他设置1</el-tab-pane>
                <el-tab-pane label="其他设置2" name="third">其他设置2</el-tab-pane>
                <el-tab-pane label="其他设置3" name="fourth">其他设置3</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            options: [
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: true,
                type: ['步步高'],
                resource: '小天才',
                desc: '',
                options: []
            },
            activeName: 'second'
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
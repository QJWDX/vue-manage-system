<template>
    <div class="container">
        <div class="tabs">
            <ul>
                <li :class="componentName=='BaseParameters'?'active':'' " @click="tabFunc('BaseParameters')">基本参数</li>
                <li :class="componentName=='OtherParameters'?'active':'' " @click="tabFunc('OtherParameters')">其他参数</li>
            </ul>
        </div>
        <div class="tabs_content">
        <component :is="componentName"></component>
        </div>
    </div>
</template>
<script>
import BaseParameters from '@/components/systemManage/systemParameters/BaseParameters';
import OtherParameters from '@/components/systemManage/systemParameters/OtherParameters';
export default {
    name: 'systemParameters',
    data() {
        return {
            componentName: 'BaseParameters',
        };
    },
    components: {
        BaseParameters,
        OtherParameters
    },
    created() {},
    methods: {
      tabFunc (tab) {
        this.componentName = tab
      },
    }
};
</script>
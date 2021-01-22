<template>
    <div class="container">
        <div class="tabs">
            <ul>
                <li :class="componentName=='SystemConfig'?'active':'' " @click="tabFunc('SystemConfig')">系统参数</li>
            </ul>
        </div>
        <div class="tabs_content">
        <component :is="componentName"></component>
        </div>
    </div>
</template>
<script>
import SystemConfig from '@/components/system/SystemConfig';
export default {
    name: 'baseform',
    data() {
        return {
            componentName: 'SystemConfig',
        };
    },
    components: {
      SystemConfig,
    },
    created() {},
    methods: {
      tabFunc (tab) {
        this.componentName = tab
      },
    }
};
</script>
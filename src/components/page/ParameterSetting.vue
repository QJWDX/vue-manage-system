<template>
    <div style="padding:10px;">
        <div class="tabs">
            <ul>
                <li :class="componentName=='SystemConfig'?'active':'' " @click="tabFunc('SystemConfig')">系统参数设置</li>
                <li :class="componentName=='error'?'active':'' " @click="tabFunc('error')">404</li>
            </ul>
        </div>
        <div class="tabs_content">
        <component :is="componentName"></component>
        </div>
    </div>
</template>
<script>
import SystemConfig from '@/components/page/SystemConfig';
import error from '@/components/page/404';
export default {
    name: 'baseform',
    data() {
        return {
            componentName: 'SystemConfig',
        };
    },
    components: {
      SystemConfig,
      error,
    },
    created() {},
    methods: {
      // 切换tab执行
      tabFunc (tab) {
        this.componentName = tab
      },
    }
};
</script>
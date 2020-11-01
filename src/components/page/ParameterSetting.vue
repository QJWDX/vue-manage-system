<template>
    <div style="padding:10px;">
        <div class="tabs">
            <ul>
                <li
                :class="componentName=='SystemConfig'?'active':'' "
                @click="tabFunc('SystemConfig')"
                >基本参数</li>
                <li :class="componentName=='error_404'?'active':'' " @click="tabFunc('error_404')">页面404</li>
                <li :class="componentName=='error_403'?'active':'' " @click="tabFunc('error_403')">页面403</li>
            </ul>
        </div>
        <div class="tabs_content">
        <component :is="componentName"></component>
        </div>
    </div>
</template>
<script>
import SystemConfig from '@/components/page/SystemConfig';
import error_404 from '@/components/page/404';
import error_403 from '@/components/page/403';
export default {
    name: 'baseform',
    data() {
        return {
            componentName: 'SystemConfig',
        };
    },
    components: {
      SystemConfig,
      error_404,
      error_403,
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
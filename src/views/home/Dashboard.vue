<template>
    <div class="container">
        <div class="tabs">
            <ul>
                <li :class="componentName=='VisitStatistics'?'active':'' " @click="tabFunc('VisitStatistics')">访问统计分析</li>
                <li :class="componentName=='RegionStatistics'?'active':'' " @click="tabFunc('RegionStatistics')">地域统计分析</li>
            </ul>
        </div>
        <div class="tabs_content">
        <component :is="componentName"></component>
        </div>
    </div>
</template>
<script>
import VisitStatistics from '@/components/dataStatistics/VisitStatistics';
import RegionStatistics from '@/components/dataStatistics/RegionStatistics';
export default {
    name: 'dashboard',
    data() {
        return {
            componentName: 'VisitStatistics',
        };
    },
    components: {
      VisitStatistics,
      RegionStatistics,
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
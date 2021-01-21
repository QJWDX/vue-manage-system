/**
 * 用来处理每一个有图表的页面添加resize , 离开时移除resize函数
 */
export default {
  data() {
    return {
      doms: []
    };
  },
  methods: {
    chartResize() {
      console.log(1);
      for (let i = 0; i < this.doms.length; i++) {
        setTimeout(() => {
          this.doms[i].resize();
        }, 200);
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.chartResize);
    this.$once('hook:beforeDestroy', () =>
      window.removeEventListener('resize', this.chartResize)
    );
  },
  destroyed() {}
};

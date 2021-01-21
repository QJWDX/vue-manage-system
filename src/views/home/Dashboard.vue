<template>
<div class="container">
  <div class="chart-content">
    <div class="btns">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="date-selector">
      <span>时间区间: </span>
      <el-date-picker
      v-model="date_range"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      unlink-panels
      :picker-options="{
      disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e6;
      }
      }"
      @change="handleDateChange"
      >
      </el-date-picker>
    </div>
    <div class="top-bar">
      <div v-for="item in data_list" :key="item.name" class="top-bar-item">
        <img :src="item.img" alt="" class="item-l" />
        <div class="item-r">
          <div class="item-r-title">{{ item.title }}</div>
          <div class="item-r-total">{{ item.total }}</div>
        </div>
        <div class="cmore" @click="handleExchangeChart(item)">
      查看更多
      </div>
    </div>
    </div>
    <div class="chart">
        <div class="title">
            <div class="border"></div>
            <div class="name">{{ chart_title }}</div>
        </div>
        <div class="chart-wrap" ref="chart"></div>
    </div>
  </div>
</div>
</template>
<script>
import echarts from 'echarts';
import { echartsoption } from '@/vendor/echartsoption';
import chartResize from '@/vendor/chartResize';
let chart = null;
export default {
  name: '',

  mixins: [chartResize],

  components: {},

  data() {
    return {
      date_range: [],
      data_list: [
        {
          title: '公众号访问量（PV）',
          // name: 'wx_visit_count',
          name: 'wx_pv_count',
          img: require('@/assets/img/dataAnalysis/access_count.png'),
          total: 0,
          list: []
        },
        {
          title: '公众开放访问人数（UV）',
          name: 'wx_visitor_count',
          img: require('@/assets/img/dataAnalysis/people_count.png'),
          total: 0,
          list: []
        },
        {
          title: '后台管理访问量（PV）',
          name: 'pv_count',
          // name: 'visit_count',
          img: require('@/assets/img/dataAnalysis/back_state.png'),
          total: 0,
          list: []
        },
        {
          title: '后台管理访问人数（UV）',
          name: 'visitor_count',
          img: require('@/assets/img/dataAnalysis/manage.png'),
          total: 0,
          list: []
        }
      ],
      chart_title: '后台管理访问数'
    };
  },

  computed: {
    category_arr() {
      if (!this.date_range) return;

      if (
        this.$fun.formatDateRange(this.date_range[0], this.date_range[1]).length > 1
      ) {
        return  this.$fun.$formatDateRange(this.date_range[0], this.date_range[1]);
      } else {
        let arr = [];
        for (let i = 0; i < 24; i++) {
          arr.push(`${i >= 10 ? i : '0' + i}:00`);
        }
        return arr;
      }
    }
  },

  watch: {},

  created() {
    this.date_range = [this.$fun.getNowFormatDate(), this.$fun.getNowFormatDate()];
    this.getVisitData(this.date_range);
  },

  mounted() {},

  destroyed() {
    chart.dispose();
    chart = null;
  },

  methods: {
    getVisitData(date_range) {
      const params = {
        time: date_range[0],
        end_time: date_range[1]
      };
      this.$apiList.statistics.visitData(params).then(res => {
          const data = res.data;
          this.data_list.forEach(item => {
            item.total = data[item.name].total;
            item.list = data[item.name].list;
          });
          this.chart_title = this.data_list[0].title.split('/')[0];
          this.$nextTick(() => {
            this.chartInit(this.data_list[0]);
          });
      });
    },

    chartInit(item) {
      if (!chart) {
        chart = echarts.init(this.$refs.chart);
        this.doms.push(chart);
      }
      const yAxis_name = item.title.includes('人次') ? '次数' : '人次';
      const data_unit = item.title.includes('人次') ? '次' : '人';
      const color = '#5190FD';
      const option = echartsoption.lineChart(
        yAxis_name,
        this.category_arr,
        item.list,
        data_unit,
        color
      );
      chart.setOption(option);
    },

    handleDateChange(value) {
      if (!value) {
        this.$message.error('请选择日期');
        return;
      }
      this.getVisitData(value);
    },

    handleExchangeChart(item) {
      if (this.chart_title === item.title.split('/')[0]) return;
      this.chart_title = item.title.split('/')[0];
      this.chartInit(item);
    },

    handleRefresh() {
      this.date_range = [ this.$fun.getNowFormatDate(),  this.$fun.getNowFormatDate()];
      this.getVisitData(this.date_range);
    }
  }
};
</script>
<style scoped>
.chart-content {
    width: 100%;
    height: 90%;
    overflow: hidden;
    padding: 0;
}
.chart-content .btns {
    float: right;
}
.chart-content .date-selector {
    padding: 0 40px;
}
.chart-content .date-selector span {
    margin-right: 10px;
    font-size: 14px;
    color: #666;
}
.chart-content .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 34px;
    margin: 34px 46px;
}
.chart-content .top-bar .top-bar-item {
      position: relative;
      display: flex;
      align-items: center;
      width: 24%;
      height: 100px;
      border: 1px solid #bababa;
}
.chart-content .top-bar .top-bar-item .item-l {
    width: 60px;
    height: 60px;
    margin: 0 31px 0 21px;
}
.chart-content .top-bar .top-bar-item .item-limg {
    width: 100%;
    height: 100%;
}
.chart-content .top-bar .top-bar-item .item-r {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.chart-content .top-bar .top-bar-item .item-r .item-r-title {
    margin-bottom: 15px;
    font-size: 14px;
    color: #666;
}
.chart-content .top-bar .top-bar-item .item-r-total {
    font-size: 26px;
    font-weight: 600;
    font-family: Arial;
    color: #222;
}

.chart-content .top-bar .top-bar-item .cmore {
    position: absolute;
    bottom: 14px;
    right: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #222;
    line-height: 20px;
    cursor: pointer;
}
.chart-content .top-bar .top-bar-item .cmore:hover {
    text-decoration: underline;
    color: #5190fd;
}
.chart {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.chart .title {
    display: flex;
    align-items: center;
    margin-left: 70px;
}
.chart .title .border {
    width: 3px;
    height: 18px;
    margin-right: 6px;
    background: #5190fd;
    border-radius: 2px;
}
.chart.title .chart .name {
    font-size: 16px;
    font-family: 'Microsoft YaHei';
    font-weight: bold;
    color: #222;
}
.chart .chart-wrap {
    width: 100%;
    height: 65%;
    box-sizing: border-box;
}
</style>


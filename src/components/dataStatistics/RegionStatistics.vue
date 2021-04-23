<template>
  <div class="container">
    <div class="btns">
        <el-button
        size="mini"
        :class="!isWx ? 'bgActive' : ''"
        @click="handleSwichBtn('pc')"
        >平台端</el-button
      >
      <el-button
        :class="isWx ? 'bgActive' : ''"
        size="mini"
        @click="handleSwichBtn('wx')"
        >公众号</el-button
      >
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="date-selector">
      <span>时间 </span>
      <div
        v-for="(item, index) in date_list"
        :key="index"
        :class="['date-item', date_index === index ? 'active' : '']"
        @click="handleSwitchDate(item, index)"
      >
        {{ item.title }}
      </div>
      <el-date-picker
        v-model="date_range"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :disabled="date_index != 4"
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
    <div class="chart-tab">
      <div
        :class="[
          'tab-item',
          chart_index === 0 || chart_index === 2 ? 'active' : ''
        ]"
        @click="handleSwitchChart(0)"
      >
        省份
      </div>
      <div
        :class="[
          'tab-item',
          chart_index === 1 || chart_index === 3 ? 'active' : ''
        ]"
        @click="handleSwitchChart(1)"
      >
        国家
      </div>
    </div>
    <div class="data-panel">
      <div v-for="item in panel_list" :key="item.title" class="data-panel-item">
        <div class="title">{{ item.title }}</div>
        <div class="value">{{ item.value }}</div>
      </div>
    </div>
    <div class="chart">
      <div class="chart-data-tab">
        <div class="title">指标:</div>
        <div
          v-for="(item, index) in target_list"
          :key="item.name"
          class="chart-data-tab-item"
        >
          <div
            :class="['img', data_index === index ? 'active' : '']"
            @click="handleSwitchTarget(item, index)"
          ></div>
          <div class="name">{{ item.title }}</div>
        </div>
      </div>
      <div
        v-show="chart_index === 0 || chart_index === 2"
        class="china-chart-wrap"
        ref="china_chart"
      ></div>
      <div
        v-show="chart_index === 1 || chart_index === 3"
        class="world-chart-wrap"
        ref="world_chart"
      ></div>
      <div class="level">
        <div
          v-for="item in range_color"
          :key="item"
          class="level-item"
          :style="`background:${item}`"
        ></div>
        <div class="level-text level-bottom">
          <div class="bottom-l">低</div>
          <div class="bottom-r">高</div>
        </div>
      </div>
      <div v-show="chart_index === 0 || chart_index === 2" class="rank">
        <div class="rank-title">
          <div class="circle"></div>
          <div class="name">省份排名</div>
        </div>
        <div class="rank-content">
          <div class="rank-content-title">
            <div class="title-item">排名</div>
            <div class="title-item">省份</div>
            <div class="title-item">{{ target.title }}</div>
            <div class="title-item">占比</div>
          </div>
          <div
            v-for="(item, index) in province_rank_list"
            :key="index"
            class="rank-content-item"
          >
            <div :class="['no', index <= 2 ? 'active' : '']">
              {{ index + 1 }}
            </div>
            <div class="province">{{ item.name }}</div>
            <div class="value">{{ item.value }}</div>
            <div class="percent">{{ item.percent }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios';
import { echartsoption } from '@/vendor/echartsoption';
import nameMap from '@/vendor/nameMap';
let world_chart = null,
  china_chart = null;
export default {
  name: '',

  components: {},

  data() {
    return {
      date_range: '',
      //wx pc判断
      isWx: false,
      platform: 'pc',
      date_list: [
        {
          title: '今日',
          day_range: [0, 0]
        },
        {
          title: '昨日',
          day_range: [-1, -1]
        },
        {
          title: '最近7日',
          day_range: [-7, -1]
        },
        {
          title: '最近30日',
          day_range: [-30, -1]
        },
        {
          title: '自定义'
        }
      ],
      date_index: null,
      chart_index: 2, // 2，3分别代表公众号的省份和国家
      panel_list: [
        {
          title: '浏览量 (PV)',
          name: 'pv_count',
          value: 0
        },
        {
          title: '访客数 (UV)',
          name: 'visitor_count',
          value: 0
        },
        {
          title: 'IP数',
          name: 'ip_count',
          value: 0
        },
        {
          title: '跳出率',
          name: 'bounce_ratio',
          value: '0%'
        },
        {
          title: '平均访问时长',
          name: 'avg_visit_time',
          value: '00:00:00'
        }
      ],
      range_color: [
        '#E8F7FF',
        '#C0E7FE',
        '#9BD5FE',
        '#78C0FE',
        '#57A9FE',
        '#3E90FE',
        '#2D6DD8',
        '#1F50B2'
      ],
      target_list: [
        {
          title: '浏览量(PV)',
          name: 'pv'
        },
        {
          title: '访问次数',
          name: 'visit'
        },
        {
          title: '访客数',
          name: 'visitor'
        },
        {
          title: '新访客数',
          name: 'new_visitor'
        },
        {
          title: '转化次数',
          name: 'trans'
        }
      ],
      data_index: 0,
      target: {
        title: '浏览量(PV)',
        name: 'pv'
      },
      province_rank_list: [],
      province_list_data: [],
      country_list_data: []
    };
  },
  computed: {},

  watch: {},

  created() {
    window.chartResize = () => {
      china_chart.resize();
      world_chart.resize();
    };
    window.addEventListener('resize', chartResize);
    // 获取总数据
    this.handleSwitchDate(this.date_list[0], 0);
    // 获取中国地图数据和省份排名数据
    this.getProvinceListData();
    // 获取世界地图数据
    this.getCountryListData();
  },
  mounted() {},
  destroyed() {
    window.removeEventListener('resize', chartResize);
    china_chart.dispose();
    china_chart = null;
    world_chart.dispose();
    world_chart = null;
  },
  methods: {
    // 获取总数据
    getDistrictTotalData(date_range) {
      let params = {
        type: this.isWx ? 4 : 1,
        time: `${date_range[0]}/${date_range[1]}`
      };
      this.$apiList.statistics.districtTotalData(params).then(res => {
          let data = res.data;
          data.avg_visit_time = this.formatTime(data.avg_visit_time);
          this.panel_list.forEach((item, index) => {
            this.panel_list[index].value =
              item.name === 'bounce_ratio'
                ? data[item.name] + '%'
                : data[item.name];
          });
      });
    },

    // 获取省份地图和排名数据
    getProvinceListData() {
      let params = {
        target: this.target.name,
        platform_type: this.platform,
        time: `${this.date_range[0]}/${this.date_range[1]}`
      };
      this.$apiList.statistics.provinceListData(params).then(res => {
          const data = res.data.map(item => {
            return {
              name: item.province_name,
              value: Number(item.count),
              percent: item.percent
            };
          });
          this.province_list_data = data;
          data.sort((a, b) => b.value - a.value);
          this.province_rank_list = data.slice(0, 10);
          this.$nextTick(() => {
            this.chinaMapChartInit(data);
          });
      });
    },

    // 获取世界地图数据
    getCountryListData() {
      let params = {
        target: this.target.name,
        platform_type: this.platform,
        time: `${this.date_range[0]}/${this.date_range[1]}`
      };
      this.$apiList.statistics.countryListData(params).then(res => {
         const data = res.data.map(item => {
            return {
              name: item.country_name,
              value: Number(item.count)
            };
          });
          this.country_list_data = data;
          this.$nextTick(() => {
            this.worldMapChartInit(data);
          });
      });
    },

    chinaMapChartInit(data) {
      if (world_chart) world_chart.clear();

      if (!china_chart) china_chart = echarts.init(this.$refs.china_chart);

      axios.get('/json/china.json').then(res => {
        echarts.registerMap('china', res.data);
        const map_data = res.data.features;
        let chart_data = [];
        let obj = {};
        for (let i = 0; i < data.length; i++) {
          obj[data[i].name] = {
            name: data[i].name,
            value: data[i].value
          };
        }

        chart_data = map_data.map(item => {
          return obj[item.properties.name]
            ? obj[item.properties.name]
            : { name: item.properties.name, value: 0 };
        });

        chart_data.push({ value: 0, name: '南海诸岛' });
        const option = echartsoption.mapChart(
          'china',
          chart_data,
          [...this.range_color],
          this.target.title
        );
        setTimeout(() => {
          china_chart.setOption(option);
        }, 0);
      });
    },

    worldMapChartInit(data) {
      if (china_chart) china_chart.clear();

      if (!world_chart) world_chart = echarts.init(this.$refs.world_chart);

      axios.get('/json/world.json').then(res => {
        echarts.registerMap('world', res.data);
        const map_data = res.data.features;
        let chart_data = [];
        let obj = {};
        for (let i = 0; i < data.length; i++) {
          obj[data[i].name] = {
            name: data[i].name,
            value: data[i].value
          };
        }
        chart_data = Object.keys(nameMap).map(item => {
          return obj[nameMap[item]]
            ? obj[nameMap[item]]
            : { name: nameMap[item], value: 0 };
        });
        const option = echartsoption.mapChart(
          'world',
          chart_data,
          [...this.range_color],
          this.target.title,
          nameMap
        );

        setTimeout(() => {
          world_chart.setOption(option);
        }, 300);
      });
    },

    handleSwitchChart(index) {
      if (this.isWx) {
        if (index == 0) {
          this.chart_index = 2;
          this.getDistrictTotalData(this.date_range);
          this.chart_index === 2
            ? this.getProvinceListData()
            : this.getCountryListData();
        } else {
          this.chart_index = 3;
          this.getDistrictTotalData(this.date_range);
          this.chart_index === 2
            ? this.getProvinceListData()
            : this.getCountryListData();
        }
      } else {
        // console.log("log");
        this.chart_index = index;
        this.getDistrictTotalData(this.date_range);
        this.chart_index === 0
          ? this.getProvinceListData()
          : this.getCountryListData();
      }
      //   console.log(this.chart_index, "chart_index");
    },

    handleSwitchTarget(item, index) {
      if (this.data_index === index) {
        return;
      }
      this.data_index = index;
      this.target.title = item.title;
      this.target.name = item.name;
      this.chart_index === 0 || this.chart_index === 2
        ? this.getProvinceListData()
        : this.getCountryListData();
      console.log(this.chart_index, 'chart_index');
    },
    //公众号平台切换
    handleSwichBtn(val) {
      if (val === 'wx') {
        if (this.chart_index == 0) {
          this.platform = val;
          this.chart_index = 2;
          this.getProvinceListData();
        } else if (this.chart_index == 1) {
          this.platform = val;
          this.chart_index = 5;
          this.getCountryListData();
        }
        this.isWx = true;
      } else if (val === 'pc') {
        if (this.chart_index == 2) {
          this.platform = val;
          this.chart_index = 0;
          this.getProvinceListData();
        } else if (this.chart_index == 3) {
          this.platform = val;
          this.chart_index = 1;
          this.getCountryListData();
        }
        this.isWx = false;
      }
      //   this.platform = val;
      this.getDistrictTotalData(this.date_range);
      //   this.getProvinceListData();
      //   this.getCountryListData();
    },
    // 日期tab切换触发事件
    handleSwitchDate(item, index) {
      if (this.date_index === index) return;
      this.date_index = index;
      if (this.date_index === 4) return;
      const start_date = this.formatDate(item.day_range[0]);
      const end_date = this.formatDate(item.day_range[1]);
      this.date_range = [start_date, end_date];
      this.getDistrictTotalData(this.date_range);
      this.chart_index === 0 || this.chart_index === 2
        ? this.getProvinceListData()
        : this.getCountryListData();
    },

    // 日期控件触发事件
    handleDateChange(date_range) {
      this.date_range = date_range;
      this.getDistrictTotalData(date_range);
      this.getProvinceListData();
      this.getCountryListData();
    },

    formatDate(day) {
      const cur_date = new Date();
      const targetdate_millisec =
        cur_date.getTime() + 1000 * 60 * 60 * 24 * day;
      cur_date.setTime(targetdate_millisec);
      const cur_year = cur_date.getFullYear();
      const cur_month = cur_date.getMonth() + 1;
      const cur_day = cur_date.getDate();
      return `${cur_year}-${cur_month < 10 ? '0' + cur_month : cur_month}-${
        cur_day < 10 ? '0' + cur_day : cur_day
      }`;
    },

    formatTime(secs) {
      secs = parseInt(secs);
      let hours, mins, seconds;
      seconds =
        parseInt(secs % 60) < 10
          ? '0' + parseInt(secs % 60)
          : parseInt(secs % 60);
      mins =
        parseInt((secs % 3600) / 60) < 10
          ? '0' + parseInt((secs % 3600) / 60)
          : parseInt((secs % 3600) / 60);
      hours =
        parseInt(secs / 3600) < 10
          ? '0' + parseInt(secs / 3600)
          : parseInt(secs / 3600);
      return `${hours}:${mins}:${seconds}`;
    },

    handleRefresh() {
      // 获取总数据
      this.handleSwitchDate(this.date_list[0], 0);
      // 获取中国地图数据和省份排名数据
      this.getProvinceListData();
      // 获取世界地图数据
      this.getCountryListData();
    }
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.btns {
    float: right;
    margin: 20px 20px 0 0;
}
.btns .bgActive {
    background: #edf6ff;
    color: #6ea8ff;
}
  .date-selector {
    display: flex;
    align-items: center;
    margin: 24px 0 0 46px;
  }
.date-selector span {
    margin-right: 10px;
    font-size: 14px;
    color: #666;
}
.date-selector .date-item {
    padding: 8px 24px;
    margin-right: 8px;
    border: 1px solid #518ffd;
    border-radius: 4px;
    font-size: 14px;
    color: #212121;
    cursor: pointer;
}
.date-selector .date-item.active {
    background-color: #518ffd;
    color: #fff;
}
.chart-tab {
    display: flex;
    margin: 35px 43px;
}
.chart-tab .tab-item {
      position: relative;
      padding-bottom: 6px;
      margin-right: 22px;
      font-size: 18px;
      font-weight: 600;
      color: #212121;
      cursor: pointer;
}
.chart-tab .tab-item::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    margin-left: 0;
    width: 0px;
    height: 4px;
    background: #49a7ff;
    transition: all 0.3s;
    transform-origin: center;
}
.chart-tab .tab-item.active {
    color: #49a7ff;
}
.chart-tab .tab-item.active::after {
    width: 34px;
    margin-left: -17px;
}
.data-panel {
    display: flex;
    justify-content: space-around;
}
.data-panel .data-panel-item {
    position: relative;
    width: 20%;
    text-align: center;
}
.data-panel .data-panel-item:not(:last-child)::after {
    position: absolute;
    top: 50%;
    right: 0;
    display: block;
    content: '';
    width: 1px;
    height: 20px;
    margin-top: -10px;
    background-color: #999;
}
.data-panel .data-panel-item .title {
    margin-bottom: 10px;
    font-size: 14px;
    color: #656565;
}
.data-panel .data-panel-item .value {
    font-size: 26px;
    font-family: Arial;
    font-weight: 600;
    color: #212121;
}
.chart {
    position: relative;
    width: 100%;
    height: 70%;
    box-sizing: border-box;
}

.chart-data-tab {
    display: flex;
    margin: 20px 43px 0;
}

.chart-data-tab .title {
    margin-right: 10px;
    font-size: 14px;
    color: #656565;
    line-height: 15px;
}
.chart-data-tab .chart-data-tab-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 14px;
    color: #212121;
}

.chart-data-tab .chart-data-tab-item .img {
    width: 15px;
    height: 15px;
    margin-right: 5px;
    background: url('../../assets/img/dataAnalysis/circle.png')
    no-repeat center center;
    background-size: 100% 100%;
    cursor: pointer;
}
.chart-data-tab .chart-data-tab-item .img.active {
    background: url('../../assets/img/dataAnalysis/circle_sel.png')
        no-repeat center center;
    background-size: 100% 100%;
}
.chart-data-tab .chart-data-tab-item .name {
    line-height: 15px;
}
.china-chart-wrap {
    float: left;
    /* width: 50%; */
    width: 840px;
    /* height: 90%; */
    height: 480px;
}
.world-chart-wrap {
    float: left;
    width: 1594px;
    height: 480px;
    padding-top: 50px;
}

.rank {
    float: left;
    width: 30%;
    box-sizing: border-box;
}
.rank-title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.rank-title .circle {
    width: 7px;
    height: 7px;
    margin-right: 6px;
    background: rgba(45, 109, 215, 1);
    border-radius: 50%;
}
.rank-title .name {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(33, 33, 33, 1);
    line-height: 1.1;
}
.rank-content .rank-content-title {
    font-weight: 600;
}
.rank-content .rank-content-title,.rank-content-item {
    display: grid;
    grid-template-columns: 40px 1fr minmax(100px, 1fr) 1fr;
    grid-gap: 0px 60px;
    align-items: center;
    height: 40px;
    padding-left: 28px;
    font-size: 14px;
    color: #222;
    line-height: 40px;
}
.rank-content .rank-content-title.no,.rank-content-item.no {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    font-size: 16px;
    font-family: Arial;
    font-weight: bold;
    color: #222;
    text-align: center;
    line-height: 27px;
}
.rank-content .rank-content-title.active, .rank-content-item.active {
    background-color: #5190fd;
    color: #fff;
}
.rank-content-item:hover {
    background-color: #57a9fe;
    color: #fff;
}

.rank-content-item:hover .no {
    color: #fff;
}
.level {
    position: absolute;
    bottom: 2%;
    left: 1%;
}
.level .level-text {
    font-size: 14px;
    color: #222;
}
.level .level-item {
    display: inline-block;
    width: 30px;
    height: 19px;
    margin: 10px 0;
}
.level .level-bottom {
    display: flex;
    justify-content: space-between;
}
</style>

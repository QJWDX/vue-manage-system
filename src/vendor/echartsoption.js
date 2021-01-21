export const echartsoption = {
  // 地图图表配置
  mapChart: (mapname, data, range_color, title, name_map) => {
    let max = Math.max.apply(
      Math,
      data.map(function(o) {
        return o.value;
      })
    );
    let splitListRange = [];

    if (max <= 4000) {
      splitListRange = [
        { start: 0, end: 500 },
        { start: 501, end: 1000 },
        { start: 1001, end: 1500 },
        { start: 1501, end: 2000 },
        { start: 2001, end: 2500 },
        { start: 2501, end: 3000 },
        { start: 3001, end: 3500 },
        { start: 3501 }
      ];
    } else {
      splitListRange = [
        { start: 0, end: 500 },
        { start: 501, end: 2000 },
        { start: 2001, end: 5000 },
        { start: 5001, end: 10000 },
        { start: 10001, end: 25000 },
        { start: 25001, end: 50000 },
        { start: 50001, end: 100000 },
        { start: 100001 }
      ];
    }
    return {
      backgroundColor: '#fff', // 背景
      tooltip: {
        // 窗口外框
        backgroundColor: 'rgba(0,0,0,0)',
        trigger: 'item'
      },
      legend: {
        show: false
      },
      label: {
        show: false
      },
      series: [
        {
          tooltip: {
            // 显示的窗口
            formatter: e => {
              return `<div
              style="padding:15px 12px;background:rgba(255,255,255,1);box-shadow:0px 2px 4px 0px rgba(29,62,92,0.31);border-radius:2px;"
              >
              <div style="display: flex;align-items: center;margin-bottom: 8px;">
                  <div
                  style="width:7px;height:7px;margin-right: 5px;background:rgba(245,111,58,1);border-radius:50%;"
                  ></div>
                  <div style="font-size:16px;font-weight:bold;color: #222;">
                  ${e.name}
                  </div>
              </div>
              <div style="display: flex;">
                  <div
                  class="type"
                  style="margin:0 18px 0 10px;font-size:14px;color: #444;"
                  >
                  ${title}
                  </div>
                  <div>
                  <span
                      class="num"
                      style="font-size:16px;font-weight:bold;color: #222;"
                  >
                      ${e.value}
                  </span>
            
                  </div>
              </div>
              </div>
              `;
              //      <span style="font-size:14px;color: #444;">路</span>
            }
          },
          type: 'map',
          map: mapname, // 自定义扩展图表类型
          showLegendSymbol: false,
          zoom: 1.2,
          itemStyle: {
            //地图样式
            normal: {
              borderColor: '#1F50B2',
              borderWidth: 1
            }
          },
          emphasis: {
            label: {
              show: false
            },
            //鼠标移入动态的时候显示的默认样式
            itemStyle: {
              areaColor: '#F56F3A',
              borderColor: '#F56F3A',
              borderWidth: 1
            }
          },
          markPoint: {
            symbol: 'none'
          },
          nameMap: name_map,
          data: data
        }
      ],
      grid: {
        containLabel: true
      },
      dataRange: {
        x: '-1000',
        y: 'bottom',
        splitList: splitListRange,
        color: range_color.reverse()
      }
    };
  },
  // 排名图表配置
  rankChart: (category_list, data, item_color, xAxis_name) => {
    return {
      legend: {
        show: false
      },
      grid: {
        left: '5%',
        right: '20%',
        top: 20,
        bottom: 0,
        containLabel: true
      },
      xAxis: {
        name: xAxis_name,
        nameLocation: 'end',
        nameGap: 0,
        nameTextStyle: {
          color: '#B3B3B3',
          fontSize: 14,
          padding: [0, 0, 30, 15]
        },
        type: 'value',
        position: 'top',
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          color: '#B4B4B4'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: category_list.reverse(),
        axisLabel: {
          fontSize: 14,
          align: 'right',
          color: '#222',
          formatter: e => {
            if (e.length > 10) {
              return `{a| ${e.substr(0, 10)}...}`;
            } else {
              return `{a| ${e}}`;
            }
          },
          rich: {
            a: {
              fontSize: 14,
              color: '#222'
            }
          }
        }
      },
      series: [
        {
          name: 'value',
          type: 'bar',
          barWidth: 12,
          barCategoryGap: 39,
          data: data.reverse(),
          itemStyle: {
            color: item_color
          },
          label: {
            show: true,
            position: 'right',
            color: '#222',
            fontSize: 16,
            fontWeight: 600
          },
          emphasis: {
            itemStyle: {
              color: '#F56F3A'
            },
            label: {
              color: '#F56F3A'
            }
          }
        }
      ],
      tooltip: {
        trigger: 'item',
        // 显示的窗口
        formatter: e => {
          let unit, item;
          if (xAxis_name) {
            item = xAxis_name.split('/')[0];
            unit = xAxis_name.split('/')[1];
          } else {
            item = '设备数';
            unit = '路';
          }
          return `<div
          style="padding:15px 12px;background:rgba(255,255,255,1);box-shadow:0px 2px 4px 0px rgba(29,62,92,0.31);border-radius:2px;"
          >
          <div style="display: flex;align-items: center;margin-bottom: 8px;">
              <div
              style="width:7px;height:7px;margin-right: 5px;background:rgba(245,111,58,1);border-radius:50%;"
              ></div>
              <div style="font-size:16px;font-weight:bold;color: #222;">
              ${e.name}
              </div>
          </div>
          <div style="display: flex;justify-content:space-between">
              <div
              class="type"
              style="margin:0 18px 0 10px;font-size:14px;color: #444;"
              >
              ${item}
              </div>
              <div>
              <span
                  class="num"
                  style="font-size:16px;font-weight:bold;color: #222;"
              >
                  ${e.value}
              </span>
              <span style="font-size:14px;color: #444;">${unit}</span>
              </div>
          </div>
    </div>
  `;
        },
        extraCssText: 'background-color:transparent'
      }
    };
  },
  // 在线率排名图表配置
  rateRankChart: (category_list, data, item_color) => {
    let dpr = window.devicePixelRatio;
    return {
      legend: {
        show: false
      },
      grid: {
        left: 0,
        top: 20,
        bottom: 0,
        right: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: '100%',
          color: '#B4B4B4',
          formatter: '{value}%'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: category_list.reverse(),
        axisLabel: {
          fontSize: 14,
          align: 'right',
          color: '#222',
          interval: 0,
          formatter: e => {
            if (e.length > 4) {
              return e.substr(0, 4) + '...';
            } else {
              return e;
            }
          }
        }
      },
      series: [
        {
          name: 'value',
          type: 'bar',
          barWidth: 12,
          barCategoryGap: 39,
          data: data.reverse(),
          itemStyle: {
            color: item_color
          },
          label: {
            show: true,
            position: 'right',
            color: '#222',
            fontSize: '100%',
            fontWeight: 600,
            formatter: '{c}%'
          },
          emphasis: {
            itemStyle: {
              color: '#F56F3A'
            },
            label: {
              color: '#F56F3A'
            }
          }
        }
      ],
      tooltip: {
        trigger: 'item',
        // 显示的窗口
        formatter: params => {
          return `<div style="padding:15px 12px;background:rgba(255,255,255,1);box-shadow:0px 2px 4px 0px rgba(29,62,92,0.31);border-radius:2px;">
                            <div style="display: flex;align-items: center;margin-bottom: 8px;">
                                <div
                                style="width:7px;height:7px;margin-right: 5px;background:rgba(245,111,58,1);border-radius:50%;"
                                ></div>
                                <div style="font-size:16px;font-weight:bold;color: #222;">
                                ${params.name}
                                </div>
                            </div>
                            <div style="display: flex;justify-content:space-between">
                                <div
                                class="type"
                                style="margin:0 18px 0 10px;font-size:14px;color: #444;"
                                >
                                在线率
                                </div>
                                <div>
                                <span
                                    class="num"
                                    style="font-size:16px;font-weight:bold;color: #222;"
                                >
                                    ${params.data.value}%
                                </span>
                                </div>
                            </div>
                            <div style="display: flex;justify-content:space-between">
                                <div
                                class="type"
                                style="margin:0 18px 0 10px;font-size:14px;color: #444;"
                                >
                                在线数
                                </div>
                                <div>
                                <span
                                    class="num"
                                    style="font-size:16px;font-weight:bold;color: #222;"
                                >
                                ${params.data.online}
                                </span>
                                <span style="font-size:14px;color: #444;">路</span>
                                </div>
                            </div>
                            <div style="display: flex;justify-content:space-between">
                                <div
                                class="type"
                                style="margin:0 18px 0 10px;font-size:14px;color: #444;"
                                >
                                离线数
                                </div>
                                <div>
                                <span
                                    class="num"
                                    style="font-size:16px;font-weight:bold;color: #222;"
                                >
                                ${params.data.offline}
                                </span>
                                <span style="font-size:14px;color: #444;">路</span>
                                </div>
                            </div>
                      </div>
                    `;
        },

        extraCssText: 'background-color:transparent'
      }
    };
  },
  // 百分比环形图表配置
  percentChart: (color, value, img_url) => {
    return {
      backgroundColor: '#fff',
      color: color,
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['90%', '100%'],
          hoverAnimation: false,
          data: [
            {
              value: value,
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            },
            {
              //画剩余的刻度圆环
              value: 100 - value,
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          ]
        }
      ],
      graphic: {
        type: 'image',
        style: {
          image: img_url,
          width: 54,
          height: 54
        },
        top: 'center',
        left: 'center',
        cursor: 'default'
      }
    };
  },
  // 厂家在线环形图
  proPercentChart: (value, level) => {
    return {
      backgroundColor: '#fff',
      color: ['#73D54D', '#eaebec'],
      series: [
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['90%', '100%'],
          hoverAnimation: false,
          data: [
            {
              value: value,
              label: {
                show: true,
                position: 'center',
                formatter: '{c}%',
                color: '#222',
                fontSize: '100%',
                fontWeight: 800,
                fontFamily: 'Arial'
              },
              labelLine: {
                show: false
              }
            },
            {
              //画剩余的刻度圆环
              value: 100 - value,
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          ],
          zlevel: level
        }
      ],
      gird: {
        containLabel: true
      }
    };
  },
  // 流量/码率统计折线图
  lineChart: (yAxis_name, category_arr, data, data_unit, line_color) => {
    return {
      xAxis: {
        type: 'category',
        data: category_arr,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
            width: 1
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: '#222',
          fontSize: 14,
          fontWeight: 500,
          margin: 15
        },
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        name: yAxis_name,
        nameTextStyle: {
          color: '#222',
          fontSize: 14,
          fontWeight: 400,
          align: 'right',
          padding: [0, 5, 15, 0]
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
            width: 1,
            shadowBlur: 1,
            shadowColor: '#999',
            shadowOffsetY: -47
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: '#222',
          fontSize: 14,
          fontWeight: 500
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(153,153,153,.2)'
          }
        },
        splitNumber: 5
      },
      series: [
        {
          type: 'line',
          zlevel: 2,

          smooth: true,
          symbolSize: 11,
          showSymbol: false,
          lineStyle: {
            color: line_color,
            width: 4
          },
          itemStyle: {
            color: line_color,
            borderWidth: 3
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: line_color // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          data: data
        }
      ],
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '20%'
        // containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        // confine: true,
        axisPointer: {
          snap: true,
          lineStyle: {
            color: line_color
          }
        },
        formatter: `<div
    class="box"
    style="position: relative;;display: flex;justify-content: center; padding:5px 15px;line-height: 51px;background:rgba(255,255,255,1);box-shadow:0px 2px 4px 0px rgba(29,62,92,0.31);border-radius:4px;"
  >
    <div
      class="num"
      style="margin-right:13px;font-size:22px;color:#222;font-family:Arial;font-weight:600"
    >
      {c}
    </div>
    <div class="class" style="font-size:22px;font-family:Arial;color:#222">
      ${data_unit}
    </div>
    <div
      class="triangle"
      style="position: absolute;display: inline-block;bottom:-10px;left: 44%;width: 0;height: 0px;border-style: solid;border-width: 10px;border-color: #fff #fff transparent transparent;transform: rotate(135deg);box-shadow: 2px -2px 4px rgba(29,62,92,0.31);"
    ></div>
  </div>`,
        extraCssText: 'background:transparent',
        position: (point, params, dom, rect, size) => {
          const percentX = (
            (size.viewSize[0] * (1 - 0.15)) /
            (category_arr.length - 1)
          ).toFixed(4);
          const percentY = (
            (size.viewSize[1] - size.viewSize[1] * 0.5) /
            Math.max(...data)
          ).toFixed(4);
          // 计算x的坐标
          let pointX;
          pointX =
            size.viewSize[0] * 0.15 +
            params[0].dataIndex * percentX -
            size.contentSize[0] * 0.5 -
            size.viewSize[0] * 0.05;
          // 计算 y 的坐标
          let pointY = 0;
          if (Math.max(...data) != 0) {
            pointY =
              size.viewSize[1] -
              percentY * params[0].value -
              size.contentSize[1] * 0.5 -
              size.viewSize[1] * 0.4;
          }
          return [pointX, pointY];
        }
      }
    };
  },
  // 柱状图
  barChart: (category_arr, data) => {
    return {
      xAxis: {
        type: 'category',
        data: category_arr,
        axisLine: {
          show: true
        },
        axisLabel: {
          show: true
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        // min: 4000,
        boundaryGap: false
      },
      series: [
        {
          name: '辅助线',
          type: 'bar',
          stack: 'amount',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: [100, 100, 100, 100]
        },
        {
          type: 'bar',
          stack: 'amount',
          label: {
            show: true,
            position: 'top',
            fontSize: 14,
            color: '#222222',
            distance: 5,
            formatter: params => {
              return `${params.value}bps`;
            }
          },

          itemStyle: {
            color: '#5190FD'
          },
          data: data,
          barWidth: 30
        }
      ],
      grid: {
        top: 10,
        bottom: 0,
        left: 0,
        right: 0,
        containLabel: true
      }
    };
  },

  //主机安全分析的图
  hostSecurity:{
    threeBarChart:(color,data)=>{
      return{
        grid:{
          top:"15%",
          left:"8%",
          right:"2%",
          bottom:"10%"
        },
        legend: {
            right:10
        },
        tooltip: {},
        // dataset: {
        //     dimensions: ['product', '未处理', '已处理', '已忽略'],
        //     source: [
        //         {product: '基线配置', '未处理': 43.3, '已处理': 85.8, '已忽略': 93.7},
        //         {product: '木马入侵', '未处理': 83.1, '已处理': 73.4, '已忽略': 55.1},
        //         {product: '暴力破解', '未处理': 86.4, '已处理': 65.2, '已忽略': 82.5},
        //         {product: '异地登录', '未处理': 72.4, '已处理': 53.9, '已忽略': 39.1},
        //         {product: '主机漏洞', '未处理': 72.4, '已处理': 53.9, '已忽略': 39.1}
        //     ]
        // },
        xAxis: {type: 'category',data:data.viewxAxis},
        yAxis: {},
        series: [
            {
                type: 'bar',
                itemStyle:{
                    color:color[0],
                },
                barWidth:'10%',
                data:data.viewData
            },
            // {
            //     type: 'bar',
            //     itemStyle:{
            //         color:color[1]
            //     },
            //     barWidth:'10%'
            // },
            // {
            //     type: 'bar',
            //     itemStyle:{
            //         color:color[2]
            //     },
            //     barWidth:'10%'
            // }
        ]
      }
    },
    ciclePieChart:(color,data)=>{
      return{
        title:{
            text:'本周新增',
            left:'15%'
        },
        grid:{
          top:"15%",
          left:"8%",
          right:"2%",
          bottom:"10%"
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}' //{b}: {c} ({d}%)
        },
        // legend: {
        //     orient: 'vertical',
        //     right: 10,
        //     bottom:'40%',
        //     data: ['未处理', '已处理', '已忽略']
        // },
        series: [
            {
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '60%'],
                label: {
                    position: 'inner',
                    formatter:'{c}',
                    fontSize:18
                },
                data: data,
                color:color
            }
        ]
      }
    },
    singleBarChart:(color,data)=>{
      return{
        grid:{
          top:"15%",
          left:"8%",
          right:"2%",
          bottom:"10%"
        },
        color:color,
        tooltip: {
        },
        xAxis: [
            {
                type: 'category',
                data:data.bugxAxis
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'漏洞监测统计'
            }
        ],
        series: [
            {
                type: 'bar',
                barWidth: '30%',
                data: data.bugData,
                label:{
                    show:true,
                    position:'top',
                    fontSize:18
                }
            }
        ]
      }
    },
    doubleLineChart:(color,data)=>{
      return{
        grid:{
          top:"15%",
          left:"8%",
          right:"2%",
          bottom:"10%"
        },
        color:color,
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: ['异地登录趋势', '暴力破解趋势'],
            icon:'circle',
            right:'10'
        },
        xAxis: {
            type: 'category',
            data:  data.loginXAxis
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name:'异地登录趋势',
            data: data.loginDataLine1,
            type: 'line',
            smooth: true
        },
        {
            name:'暴力破解趋势',
            data: data.loginDataLine2,
            type: 'line',
            smooth: true
        }]
      }
    },
    loopPieChart:(color,name,data)=>{
      if(data.length==0){
        name = '暂无数据'
      }
      return{
        grid:{
          top:"15%",
          left:"8%",
          right:"2%",
          bottom:"10%"
        },
        color:color,
        title: [{
            text: name,
            x: '35%',
            y: '27%',
            textStyle: {
                fontWeight: 'bold',
                fontSize:'100%',
                color: "#444444",
            }
        }],
        legend: {
            orient: 'horizontal',
            bottom: 10,
            data: data
        },
        series: [
            {
                type: 'pie',
                radius: ['35%', '45%'],
                center:['50%','30%'],
                hoverOffset:5,
                label: {
                    padding: [0, -100],
                    show: false,
                    position: 'outside',
                    formatter: function(params, ticket, callback) {
                        return '{name|' + params.name.substr(0,5)+'\n'+params.name.substr(5) + '}\n{value|' + params.value + '}';
                    },
                    rich: {
                        name: {
                            fontSize: 12,
                            color: '#444444',
                            textAlign:'right'
                        },
                        value: {
                            fontSize: 16,
                            color:'#222222',
                            padding: [2, 4],
                        }
                    }
                },
                labelLine: {
                    length: 10,
                    length2: 100,
                    lineStyle:{
                        width:2
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                    },
                    labelLine: {
                        show: true
                    },
                },
                data: data
            }
        ]
      }
    }
  },

  //日常监控数据的图
  videoDaily:{
    loopPieChart:(color,data,radius)=>{
      return{
        grid:{
          top:"15%",
          left:"8%",
          right:"2%",
          bottom:"10%"
        },
        color:color,
        tooltip: {
            show:true,
            trigger: 'item',
            position: ['40.5%', '25.5%'],
            backgroundColor: 'implements',
            textStyle:{
                color: '#fff',
            },
            formatter: function(params){
              return `<div style="text-align: center;">
                        <span style="font-size: 12px;">${params.name}</span></br>
                        <span style="font-size: 20px;font-weight:bold;">${params.value}<span>
                      </div>`
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: 10,
            data: data,
            itemGap:10,
            icon:'circle',
            selectedMode:false,
            textStyle:{
              color:'#fff',
              fontSize:'80%',
              padding:[0,30,0,0],
            }
        },
        series: [
            {
                type: 'pie',
                radius: radius,
                center:['50%','40%'],
                hoverOffset:2,
                selectedOffset:2,
                selectedMode:'single',
                label: {
                  // padding: [0, -60],
                  show: false,
                  lineHeight:15,
                  align:'center',
                  position: 'outside',
                  formatter: function(params) {
                      // return '{name|' + params.name + '}{name|' + params.percent + '%}\n';
                      return  params.name+ params.percent + '%\n';
                  },
                  color:'#fff',
                  fontSize: '80%',
                  rich: {
                      name: {
                          fontSize: '80%',
                          color: '#fff',
                      },
                      percent: {
                          fontSize: '80%',
                          color:'#fff', 
                      },
                  }
                },
                labelLine: {
                    length: 10,
                    // length2: 2,
                    lineStyle:{
                        width:2
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                    },
                    labelLine: {
                        show: true
                    },
                },
                markPoint:{
                  animation :false
                },
                data: data
            }
        ]
      }
    }
  }
};

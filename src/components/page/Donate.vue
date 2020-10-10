<template>
    <div>
        <div class="container">
            <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header"
              :cell-style="cellStyle"
              :header-cell-style="rowClass"
              @selection-change="handleSelectionChange"
          >
              <el-table-column prop="content" align="center" label="消息内容"></el-table-column>
          </el-table>
        </div>
    </div>
</template>
<script>
  import mqtt from 'mqtt';
  var client;
  const options = {
    connectTimeout: 40000,
    clientId: 'myclientid_' + parseInt(Math.random() * 100, 10),
    username: 'test',
    password: 'test123',
    clean: true
  };
  client = mqtt.connect('ws://192.168.1.185:15675/ws', options);
  export default {
    data() {
      return {
        componentName: 'menus',
        tableData: [
          {content : '这是一条mqtt消息！'}
        ]
      }
    },
    created() {
      this.mqttMsg()
    },
    methods: {
      cellStyle({row, column, rowIndex, columnIndex}){
          return 'text-align:center';
      },
      rowClass({row, rowIndex}){
            return 'text-align:center';
      },
      // 多选操作
      handleSelectionChange(val) {
          this.multipleSelection = [];
          for (let index = 0; index < val.length; index++) {
              this.multipleSelection.push(val[index].id);
          }
          this.delList = this.delList.concat(this.multipleSelection);
      },
      mqttMsg() {
        client.on('connect', (e) => {
          console.log("连接成功！！！")
          client.subscribe('test_mqtt', { qos: 1 }, (error) => {
            if (!error) {
              console.log('订阅成功')
            } else {
              console.log('订阅失败')
            }
          })

        })
        // 接收消息处理
        client.on('message', (topic, message) => {
          console.log('收到来自', topic, '的消息', message.toString())
          this.tableData.push = {content : message.toString()};
        })
      }
    }
  }
</script>
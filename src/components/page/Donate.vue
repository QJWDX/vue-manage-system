<template>
  <div id="app">
    <p>mqtt收到的数据：</p>
    <p>{{this.msg}}</p>
  </div>
</template>

<script>

  import mqtt from 'mqtt'

  var client
  const options = {
    connectTimeout: 40000,
    clientId: 'myclientid_' + parseInt(Math.random() * 100, 10),
    username: 'test',
    password: 'test123',
    clean: true
  }
  client = mqtt.connect('ws://192.168.1.185:15675/ws', options)
  export default {
    data() {
      return {
        msg: '--'
      }
    },

    created() {
      this.mqttMsg()
    },

    methods: {
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
          console.log(1111); 
          console.log('收到来自', topic, '的消息', message.toString())
          this.msg = message.toString()
        })
      }
    }


  }
</script>
<style scoped>
</style>
export default {
    /**
     * 时间格式转换
     * @param {*} date 时间对象
     */
    formatDateTime(date){
        　  var y = date.getFullYear(); 
            var m = date.getMonth() + 1;  
                m = m < 10 ? ('0' + m) : m;  
            var d = date.getDate();  
                d = d < 10 ? ('0' + d) : d;  
            var h = date.getHours();  
                h = h < 10 ? ('0' + h) : h;  
            var minute = date.getMinutes();  
                minute = minute < 10 ? ('0' + minute) : minute;  
            var second = date.getSeconds();  
                second = second < 10 ? ('0' + second) : second;  
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },

    /**
     * 
     * 检测手机号格式
     * @param {*} tel 
     */
    checkPhone(tel) {
        if(tel.length == 0){
            return false;
        }
        const reg = "/^1[3|4|5|6|7|8|9][0-9]{9}$/";
        if (reg.test(tel)) {
            return true;
        }
        return false;
    },

    /**
     * 检测邮箱格式
     * @param {*} email 
     */
    checkEmail(email){
        if(email.length == 0){
            return false;
        }
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (reg.test(email)) {
            return true;
        }
        return false;
    }
  }
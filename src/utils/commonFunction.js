import {JSEncrypt} from 'jsencrypt';
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
        const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
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
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (reg.test(email)) {
            return true;
        }
        return false;
    },

     //删除左右两端的空格
    trim(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    //获取cookie
    getCookie(key){
        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(key + '=')
            if (start !== -1) {
              start = start + key.length + 1
              var end = document.cookie.indexOf(';', start)
              if (end === -1) end = document.cookie.length
              return unescape(document.cookie.substring(start, end))
            }
        }
        return ''
    },
   
    //设置cookie
    setCookie(c_name, value, expiredays){
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + decodeURIComponent(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },
   
    //删除cookie
    delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },

    /**
     * 数据加密
     * @param {*} jsonData json数据
     * @param {*} publicKey 公钥
     */
    encryptData(jsonData, publicKey){
        var crypt = new JSEncrypt({
            default_key_size: 1024
        });
        crypt.setPublicKey(publicKey);
        return crypt.encrypt(JSON.stringify(jsonData))
    },

    /**
     * 数据解密
     * @param {*} jsonStr json字符串
     * @param {*} privateKey 私钥
     */
    decryptData(jsonStr, privateKey){
        var crypt = new JSEncrypt({
            default_key_size: 1024
        });
        crypt.setPrivateKey(privateKey);
        return crypt.decrypt(jsonStr);
    }
}

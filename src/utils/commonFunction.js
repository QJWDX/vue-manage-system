import {JSEncrypt} from 'jsencrypt';
import {Message} from 'element-ui';
export default {

    baseUrl(){
        let protocol = window.location.protocol; //协议
        let host = window.location.host; //主机
        let reg = /^localhost+/;
        return reg.test(host) ? protocol + '//127.0.0.1' : protocol + '//www.hhdxdx.cn';
    },

    /**
     * 数组去重
     * @param {*} arr 
     */
    array_unique(arr) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        var array =[];
        for(var i = 0; i < arr.length; i++) {
                if( !array.includes( arr[i]) ) {//includes 检测数组是否有某个值
                        array.push(arr[i]);
                  }
        }
        return array
    },

    /**
     * 默认分页
     */
    getDefaultPerPage(){
        // 1024       1280          1366      1440       1680       1920 
        return document.body.clientWidth > 1920 ? 15 : 12;
    },
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
    },

    /**
     * 
     * 检测身份证号
     * @param {*} idCard 
     */
    checkIdCard(idCard){
        var vcity = { 
            11:"北京",
            12:"天津",
            13:"河北",
            14:"山西",
            15:"内蒙古",  
            21:"辽宁",
            22:"吉林",
            23:"黑龙江",
            31:"上海",
            32:"江苏",  
            33:"浙江",
            34:"安徽",
            35:"福建",
            36:"江西",
            37:"山东",
            41:"河南",  
            42:"湖北",
            43:"湖南",
            44:"广东",
            45:"广西",
            46:"海南",
            50:"重庆",  
            51:"四川",
            52:"贵州",
            53:"云南",
            54:"西藏",
            61:"陕西",
            62:"甘肃",  
            63:"青海",
            64:"宁夏",
            65:"新疆",
            71:"台湾",
            81:"香港",
            82:"澳门",
            91:"国外"  
        };
        //是否为空
        if(idCard === ''){
            return false;
        }
        //校验长度，类型
        if(this.isCardNo(idCard) === false){
            return false;
        }
        //检查省份
        if(this.checkProvince(idCard,vcity) === false){
            return false;
        }
        //校验生日
        if(this.checkBirthday(idCard) === false){
            return false;
        }
        //检验位的检测
        if(this.checkParity(idCard) === false){
            return false;
        }
        return true;
    },

    // 检查号码是否符合规范，包括长度，类型
    isCardNo(card){
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(card) === false){
            return false;
        }
        return true;
    },

    // 取身份证前两位,校验省份
    checkProvince(card,vcity){
        var province = card.substr(0,2);
        if(vcity[province] == undefined){
            return false;
        }
        return true;
    },

    // 检查生日是否正确
    checkBirthday(card){
        var len = card.length;
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
        if(len == '15'){
            var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/; 
            var arr_data = card.match(re_fifteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date('19'+year+'/'+month+'/'+day);
            return this.verifyBirthday('19'+year,month,day,birthday);
        }
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
        if(len == '18'){
            var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
            var arr_data = card.match(re_eighteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date(year+'/'+month+'/'+day);
            return this.verifyBirthday(year,month,day,birthday);
        }
        return false;
    },

    // 校验日期
    verifyBirthday(year,month,day,birthday){
        var now = new Date();
        var now_year = now.getFullYear();
        //年月日是否合理
        if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day)
        {
            //判断年份的范围（0岁到100岁之间)
            var time = now_year - year;
            if(time >= 0 && time <= 100)
            {
                return true;
            }
            return false;
        }
        return false;
    },

    // 校验位的检测
    checkParity(card){
        //15位转18位
        card = this.changeFivteenToEighteen(card);
        var len = card.length;
        if(len == '18'){
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
            var cardTemp = 0, i, valnum; 
            for(i = 0; i < 17; i ++) { 
                cardTemp += card.substr(i, 1) * arrInt[i]; 
            } 
            valnum = arrCh[cardTemp % 11]; 
            if (valnum == card.substr(17, 1).toLocaleUpperCase()) 
            {
                return true;
            }
            return false;
        }
        return false;
    },

    // 15位转18位身份证号
    changeFivteenToEighteen(card){
        if(card.length == '15')
        {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
            var cardTemp = 0, i;   
            card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
            for(i = 0; i < 17; i ++) 
            { 
                cardTemp += card.substr(i, 1) * arrInt[i]; 
            } 
            card += arrCh[cardTemp % 11]; 
            return card;
        }
        return card;
    },

    /**
     * 数字转字符串
     * @param {*} val 
     */
    nToS(val){
       return !isNaN(val) ? val.toString() : val;
    },

    /**
     * 
     * 根据url下载文件
     * @param {*} url 文件地址
     * @param {*} fileName 文件名
     */
    downloadFile(url, fileName = ''){
        if(this.isImage(url)){
            this.downloadImg(url, fileName);
            return;
        }
        let link = document.createElement('a')
        link.href = url;
        link.download = fileName || url.substring(url.lastIndexOf('/')+1);
        document.body.appendChild(a);
        link.click();
        link.remove();
    },
    /**
     * 图片下载
     * @param {*} src 
     * @param {*} fileName 
     */
    downloadImg(src, fileName = ''){
        var image = new Image();
        // 解决跨域 Canvas 污染问题
        image.crossOrigin = "*";
        image.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        
            var a = document.createElement("a"); // 生成一个a元素
            var event = new MouseEvent("click"); // 创建一个单击事件
            a.download = fileName || url.substring(url.lastIndexOf('/')+1); // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = src;
    },
    /**
     * 判断是否是图片
     * @param {*} filePath 
     */
    isImage(filePath) {
        var index = filePath.lastIndexOf(".");
        var ext = filePath.substr(index+1);
        return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1;
    },

    /**
     * 文件大小格式转换
     * @param {*} size 
     * @param {*} format 
     */
    formatSize(size, format) {
        format = format.toUpperCase();
        let p = 0;
        switch(format){
            case 'KB':
                p = 1;
                break;
            case 'MB':
                p = 2;
                break;
            case 'GB':
                p = 3;
                break;
        }
        size /= Math.pow(1024, p);
        return Math.round(size.toFixed(3)*10)/10 + format;
    },

    /**
     * 根据数组值获取数组下标
     * @param {*} array 
     * @param {*} value 
     */
    arrayIndexOf(array, value){
        for(let i=0; i<array.length; i++){
            if(array[i] == value){
                return i;
            }
        }
    },

    /**
     * 消息弹框
     * @param {*} msg 
     * @param {*} type 
     * @param {*} duration 
     * @param {*} showClose 
     * @param {*} offset 
     * @param {*} center 
     */
    msg(msg = '', type = 1, duration = 3000, showClose = false, offset = 40, center = true){
        switch(type){
            case 0:
                type = 'error';
                break;
            case 1:
                type = 'success';
                break;
            case 2:
                type = 'warning';
                break;
            case 3:
                type = 'info';
                break;
            default:
                break;
        }
        Message({
            message: msg,
            center: center,
            showClose: showClose,
            type: type,
            duration:duration,
            offset:offset
        });
    }
}

/*
 * @Author: fengyun2
 * @Date:   2016-04-10 10:23:23
 * @Last Modified by:   fengyun2
 * @Last Modified time: 2016-11-05 12:11:04
 */

/* 时间工具类 */

;
(function(root, factory) {
    // 支持 requirejs 和 amd
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.time = factory();
    }
}(this, function() {
    var root = this || global;
    var previousTimes = root.time;

    // 定义工具方法的版本号
    var time = {};
    time.VERSION = '0.1.0';

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype,
        StringProto = String.prototype;

    // 将原型缓存到变量中
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        arraySlice = ArrayProto.slice,
        hasOwnProperty = ObjProto.hasOwnProperty;

    // 将js原生方法缓存在变量中
    var
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    // 最大值
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    function number(value) {
        return (!nan(value)) && toString.call(value) === '[object Number]';
    }

    function nan(value) { // NaN is number :) Also it is the only value which does not equal itself
        return value !== value;
    }

    // 时间验证
    /*----------------------------------------------------------------------------*/

    // 是否是日期
    time.isDate = function(obj) {
        return toString.call(obj) === '[object Date]';
    };

    // obj 是 时间戳
    time.isToday = function(obj) {
        if (!(number(obj) || number(Number(obj))) && (!time.isDate(obj))) {
            return false;
        }
        if (time.isDate(obj)) {
            obj = time.time;
        }

        var now = new Date();
        // 获取今天日期
        var now_day = time.getLocaleDateTime(now);
        // 获取当前时间
        // var now_time = time.time();
        // 获取当天零时时间(时间戳)
        var start_time = time.str_to_unix(now_day + ' 00:00:00');
        // 获取当天24时时间(时间戳)
        var end_time = time.str_to_unix(now_day + ' 23:59:59');

        obj = Number(obj);
        return (obj <= end_time && obj >= start_time);
    };

    // 获取当前日期
    time.getLocaleDateTime = function(obj) {
        return obj.toLocaleDateString();
    };

    // 格式化日期
    time.formatDate = function(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };

    // 格式化日期时间
    time.formatDateTime = function(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    };

    // 字符串转换为时间戳(微秒)
    time.parseDate = function(date) {
        date = new Date(Date.parse(date.replace(/-/g, '/')));
        return date.getTime();
    };

    // 返回当前时间(微秒)
    time.now = Date.now || function() {
        return new Date().getTime();
    };

    // 当前时间(秒)
    time.time = parseInt(time.now() / 1000);

    /**
     * 将日期时间转为时间戳(秒)
     * 用法:
     * 1. time.str_to_unix('2011-11-11 00:00:00');
     * 2. var now = new Date();
     *    time.str_to_unix(now);
     */
    time.str_to_unix = function(obj) {
        return parseInt((new Date(obj)).getTime() / 1000);
    };

    /** 获取倒计时
     *  参数date可以格式为 xx-xx-xx 或 xxxx-xx-xx 或用 / 或 , 分割,也可以用标准时间(new Date('xxxx-xx-xx'))
     *
     * 用法:
     *  time.getChaTime('xxxx-xx-xx');
     */
    time.getChaTime = function(date) {
        var curr_date = new Date();
        var start_time = 0;
        if (time.isDate(date)) {
            start_time = date.getTime();
        } else if (time.isCheckDate(date)) {
            start_time = date.getTime();
        } else {
            return false;
        }
        var start = start_time - cur_date.getTime();
        var startday = Math.floor(start / (1000 * 60 * 60 * 24));
        if (startday > 0) {
            return startday;
        } else {
            return -1;
        }
    };

    /**
     * 将时间戳转为几月前。几周前，几天前，几分钟前
     * 用法:
     * 1. time.getDateDiff(时间戳(微秒));
     */
    time.getDateDiff = function(dateTimeStamp) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        if (diffValue < 0) {
            return; }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        if (monthC >= 1) {
            result = "" + parseInt(monthC) + "月前";
        } else if (weekC >= 1) {
            result = "" + parseInt(weekC) + "周前";
        } else if (dayC >= 1) {
            result = "" + parseInt(dayC) + "天前";
        } else if (hourC >= 1) {
            result = "" + parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
            result = "" + parseInt(minC) + "分钟前";
        } else
            result = "刚刚";
        return result;
    };

    /**
     * 将标准时间转为时间戳(微秒)
     * 用法:
     * 1. time.getDateTimeStamp('2016-01-01');
     */
    time.getDateTimeStamp = function(dateStr) {
        return Date.parse(dateStr.replace(/-/gi, "/"));
    };
    /**
     * 时间格式化函数
     * @param  {[type]} format
     * @param  {[type]} unix_time 时间戳
     * @return {[type]}           字符串
     *
     * 使用方法:
     * time.date('Y-m-d H:i:s', time.time)  -->   "2016-02-26 00:55:25"
     * time.date('Y-m-d', time.time)      -->   "2016-02-26"
     * time.date('Y/m/d', time.time)      -->   "2016/02/26"
     * time.date('Y:m:d', time.time)      -->   "2016:02:26"
     */
    time.date = function(format, unix_time) {
        var this_Date = new Date(unix_time ? (parseInt(unix_time) * 1000) : (new Date().getTime()));
        var weekday = new Array('Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday');
        return format.replace(/y/i, this_Date.getFullYear()).
        replace('m', parseInt(this_Date.getMonth() + 1) < 10 ?
            '0' + parseInt(this_Date.getMonth() + 1) : parseInt(this_Date.getMonth() + 1)).
        replace('d', parseInt(this_Date.getDate()) < 10 ?
            '0' + this_Date.getDate() : this_Date.getDate()).
        replace(/h/i, this_Date.getHours() < 10 ?
            '0' + this_Date.getHours() : this_Date.getHours()).
        replace('i', this_Date.getMinutes() < 10 ?
            '0' + this_Date.getMinutes() : this_Date.getMinutes()).
        replace('s', this_Date.getSeconds() < 10 ?
            '0' + this_Date.getSeconds() : this_Date.getSeconds()).
        replace('w', this_Date.getDay()).
        replace('W', weekday[this_Date.getDay()]);
    };

    /**
     * 日期格式化
     *
     * @param format 格式化
     * @param date 日期
     *
     * example:
     *  var timestamp=Date.now(); //时间戳
     *  console.log(Date.format("yyyy-MM-dd hh:mm:s",timestamp));
     */
    time.format = function(format, date) {
        date instanceof Date || (date = new Date(date));
        var f = {
                "y+": date.getFullYear(),
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds()
            },
            fd;
        for (var o in f) {
            if (new RegExp(o).test(format)) {
                fd = RegExp.lastMatch;
                format = format.replace(fd, o === "y+" ? f[o].toString().slice(-fd.length) : fd.length === 1 ? f[o] : (f[o] + 100).toString().slice(-fd.length));
            }
        }
        return format;
    };

    /**
     * 获取当前的日期和时间, 并按照 YYYY-MM-DD 格式化
     * @return {[type]} [description]
     */
    time.getNowFormatDate = function () {
      var date = new Date()
      var seperator1 = "-"
      var seperator2 = ":"
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
          month = "0" + month
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
              + " " + date.getHours() + seperator2 + date.getMinutes()
              + seperator2 + date.getSeconds() + seperator2 + date.getMilliseconds()
      return currentdate
    }


    /*------------------------------------------------------------------------------------------------*/


    return time;
}));

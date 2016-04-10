/*
 * @Author: fengyun2
 * @Date:   2016-04-10 11:16:38
 * @Last Modified by:   fengyun2
 * @Last Modified time: 2016-04-10 11:32:35
 */

/*工具类*/

;(function (root, factory) {
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
        root.util = factory();
    }
}(this, function () {
    var root = this || global;
    var previousUtils = root.util;

    // 定义工具方法的版本号
    var util = {};
    util.VERSION = '0.1.0';

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

    // 从 url 中获取参数对象
    util.getParamFromUrl = function () {
        var o = {};
        var url = location.search.substr(1);
        url = url.split('&');
        for (var i = 0; i < url.length; i++) {
            var param = url[i].split('=');
            o[param[0]] = param[1];
        }
        return o;
    };


    /**
     *    @description 获取 url 的fragment (即hash中去掉 # 的剩余部分)
     *
     *    如果没有则返回空字符串
     *    如: http://example.com/path/?query=d#123 => 123
     *
     *    @param {String} url url
     *    @returns {String}
     */
    util.getUrlFragment = function (url) {
        var hashIndex = url.indexOf('#');
        return hashIndex === -1 ? '' : url.slice(hashIndex + 1);
    };


    /**
     * 利用 a 标签自动解析URL
     */
    util.parseURL = function (url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function () {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length, i = 0, s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s1;
                }
                return ret;
            })(),
            // file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])1,
            // hash: a.hash.replace('#',''),
            // path: a.pathname.replace(/^([^\/])/,'/$1'),
            // relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])1,
            // segments: a.pathname.replace(/^\//,'').split('/')
        };
    };

    // 获取手机浏览器版本信息
    util.browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    // 获取域名主机
    util.getHost = function (url) {
        var host = "null";
        if (typeof url === "undefined" || null === url) {
            url = window.location.href;
        }
        var regex = /^\w+\:\/\/([^\/]*).*/;
        var match = url.match(regex);
        if (typeof match !== "undefined" && null !== match) {
            host = match[1];
        }
        return host;
    };

    /**
     * 把图片转为base64编码
     * @param {String} url
     * @param {Function} callback
     * @param {String} [outputFormat='image/png']
     * @example
     convertImgToBase64('https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png', function(base64Img){
	console.log('IMAGE:',base64Img);
	})
     */
    util.convertImgToBase64 = function (url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback.call(this, dataURL);
            canvas = null;
        };
        img.src = url;
    };

    util.hasClass = function (element, className) {
        if (element.classList)
            element.classList.contains(className);
        else
            new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)
    };

    // 判断该对象是否含有该属性(不包含原型)
    util.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };

    // 判断是否是dom节点
    util.isElement = function (ele) {
        return !!(ele && ele.nodeType === 1);
    };

    // 判断是否有某个类
    util.hasClass = function (el, cn) {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    };

    // 添加类
    util.addClass = function (el, cn) {
        if (!util.hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    };

    // 移除某个类
    util.removeClass = function (el, cn) {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    };

    // 判断是否有hash值
    util.hasHash = function (url) {
        url = url || window.location.href;
        var match = url.match(/#(.*)$/);
        var ends = match ? match[1] : '';
        return (ends !== '');
    };


    // 返回一个介于min,max之间的随机数(包括边界)
    util.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    // 字符串
    /*----------------------------------------------------------------------------*/
    // 字符串长度截取
    util.cutstr = function (str, len) {
        var temp;
        var icount = 0;
        var patrn = /[^\x00-\xff]/;
        var strre = "";
        for (var i = 0; i < str.length; i++) {
            if (icount < len - 1) {
                temp = str.substr(i, 1);
                if (patrn.exec(temp) == null) {
                    icount = icount + 1;
                } else {
                    icount = icount + 2;
                }
                strre += temp;
            } else {
                break;
            }
        }
        return strre + "...";
    };

    // 字符串清除空格
    StringProto.trim = function () {
        var reExtraSpace = /^\s*(.*?)\s+$/;
        return this.replace(reExtraSpace, "$1");
    };

    // 替换
    StringProto.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };

    // 转义html标签
    util.htmlEncode = function (text) {
        return text.replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // 还原html标签
    util.htmlDecode = function (text) {
        return text.replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    };

    // 加入收藏夹
    util.addFavorite = function (surl, stitle) {
        try {
            window.external.addFavorite(surl, stitle);
        } catch (e) {
            try {
                window.sidebar.addPanel(stitle, surl, "");
            } catch (e) {
                alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
        }
    };

    // 设为首页
    util.setHomepage = function (surl) {
        if (document.all) {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage(surl);
        } else if (window.sidebar) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
                }
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', surl);
        }
    };

    // 清除脚本内容
    util.trimScript = function (script) {
        return s.replace(/<script.*?>.*?<\/script>/ig, '');
    };

    /**
     * 深拷贝
     * 参数可以是普通类型、数组、对象
     *
     */
    util.deepCopy = function (source) {
        var result;
        // 如果需要深拷贝的是对象（或数组）
        if (utils.isObject(source)) {
            // 如果需要深拷贝的是数组
            if (utils.isArray(source)) {
                result = [];

                // 遍历该数组，对于数组中每一个值做递归的深拷贝
                for (var i = 0; i < source.length; i++) {
                    result[i] = deep_copy(source[i]);
                }
                // 如果需要深拷贝的是对象（但不是数组）
            } else {
                result = {};

                // 遍历该对象，对于对象中每一个值做递归的深拷贝
                for (var i in source) {
                    // 对于对象而言，过滤掉原型链上的属性（仅拷贝自定义的属性）
                    if (source.hasOwnProperty(i)) {
                        result[i] = deep_copy(source[i]);
                    }
                }
            }
            // 如果需要深拷贝的不是对象（和数组），那么直接用等号赋值
        } else {
            result = source;
        }
        return result;
    };


    return util;
}));

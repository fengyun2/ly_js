/*
* @Author: baby
* @Date:   2016-02-26 11:24:47
* @Last Modified by:   fengyun2
* @Last Modified time: 2016-04-10 12:12:32
*/

/**
 * 工具类(已废弃) 【已经拆分为time.js、is.js、util.js】
 */

// 'use strict';
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
        root.utils = factory();
    }
}(this, function () {
	var root = this || global;
	var previousUtils = root.utils;

	// 定义工具方法的版本号
	var utils = {};
	utils.VERSION = '0.1.0';

	// 定义接口
	utils.not = {};
	utils.all = {};
	utils.any = {};

	var ArrayProto = Array.prototype,
	ObjProto = Object.prototype,
	FuncProto = Function.prototype,
	StringProto = String.prototype;

	// 将原型缓存到变量中
	var
	push             = ArrayProto.push,
	slice            = ArrayProto.slice,
	toString         = ObjProto.toString,
	arraySlice 		 = ArrayProto.slice,
	hasOwnProperty   = ObjProto.hasOwnProperty;

	// 将js原生方法缓存在变量中
	var
	nativeIsArray      = Array.isArray,
	nativeKeys         = Object.keys,
	nativeBind         = FuncProto.bind,
	nativeCreate       = Object.create;

	// // 取反函数
	function not(func){
		return function(){
			return !func.apply(null,arraySlice.call(arguments));
		};
	}

	function all(func) {
		return function() {
			var parameters = arraySlice.call(arguments);
			var length = parameters.length;
            if(length === 1 && utils.isArray(parameters[0])) {    // 支持数组
            	parameters = parameters[0];
            	length = parameters.length;
            }
            for (var i = 0; i < length; i++) {
            	if (!func.call(null, parameters[i])) {
            		return false;
            	}
            }
            return true;
        };
    }

    function any(func) {
    	return function() {
    		var parameters = arraySlice.call(arguments);
    		var length = parameters.length;
            if(length === 1 && utils.isArray(parameters[0])) {    // 支持数组
            	parameters = parameters[0];
            	length = parameters.length;
            }
            for (var i = 0; i < length; i++) {
            	if (func.call(null, parameters[i])) {
            		return true;
            	}
            }
            return false;
        };
    }


    var property = function(key) {
    	return function(obj) {
    		return obj == null ? void 0 : obj[key];
    	};
    };
	// 最大值
	var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	var getLength = property('length');




	// 从 url 中获取参数对象
	utils.getParamFromUrl = function() {
		var o = {};
		var url = location.search.substr(1);
		url = url.split('&');
		for(var i = 0;i<url.length;i++){
			var param = url[i].split('=');
			o[param[0]] = param[1];
		}
		return o;
	};


	/**
	 *	@description 获取 url 的fragment (即hash中去掉 # 的剩余部分)
	 *
	 *	如果没有则返回空字符串
	 *	如: http://example.com/path/?query=d#123 => 123
	 *
	 *	@param {String} url url
	 *	@returns {String}
	 */
	 utils.getUrlFragment = function(url) {
	 	var hashIndex = url.indexOf('#');
	 	return hashIndex === -1 ? '':url.slice(hashIndex + 1);
	 };


	 /**
	 * 利用 a 标签自动解析URL
	 *
	 *
	 */
	 utils.parseURL = function(url) {
	 	var a = document.createElement('a');
	 	a.href = url;
	 	return {
	 		source: url,
	 		protocol: a.protocol.replace(':',''),
	 		host: a.hostname,
	 		port: a.port,
	 		query: a.search,
	 		params: (function(){
	 			var ret = {},
	 			seg = a.search.replace(/^\?/,'').split('&'),
	 			len = seg.length, i = 0, s;
	 			for (;i<len;i++) {
	 				if (!seg[i]) { continue; }
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
	utils.browser  = {
		versions : function(){
			var u = navigator.userAgent, app = navigator.appVersion;
	        return {//移动终端浏览器版本信息
	            trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
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
	utils.getHost = function(url) {
		var host = "null";
		if(typeof url === "undefined" || null === url) {
			url = window.location.href;
		}
		var regex = /^\w+\:\/\/([^\/]*).*/;
		var match = url.match(regex);
		if(typeof match !== "undefined" && null !== match) {
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
	utils.convertImgToBase64 = function(url, callback, outputFormat) {
		var canvas = document.createElement('CANVAS'),
		ctx = canvas.getContext('2d'),
		img = new Image;
		img.crossOrigin = 'Anonymous';
		img.onload = function(){
			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img,0,0);
			var dataURL = canvas.toDataURL(outputFormat || 'image/png');
			callback.call(this, dataURL);
			canvas = null;
		};
		img.src = url;
	}


	// 类型检查
	/*----------------------------------------------------------------------------*/


	utils.isArguments = function(obj) {    // fallback check is for IE
		return utils.not.isNull(obj) && (toString.call(obj) === '[object Arguments]' || (typeof obj === 'object' && 'callee' in obj));
	};

	// 判断是否是数组
	utils.isArray = nativeIsArray || function(obj) {
		return toString.call(obj) === '[object Array]';
	};

	// 判断是否是类数组
	utils.isArrayLike = function(collection) {
		var length = getLength(collection);
		return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};

	// 判断是否是对象(或数组)
	utils.isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	// 判断是否是boolean值
	utils.isBoolean = function(obj) {
		return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	};

	// 判断是否是null
	utils.isNull = function(obj){
		return obj === null;
	};

	// 判断是否是纯Json对象
	utils.isJson = function(obj){
		return toString.call(obj) === '[object Object]';
	};

	utils.isRegexp = function(obj) {
		return toString.call(obj) === '[object RegExp]';
	};

    // 比较 obj1 和 obj2 的类型
    // 防止比较 NaN,Number类型比较
    utils.isSameType = function(obj1,obj2){
    	if(utils.isNaN(obj1) || utils.isNaN(obj2)){
    		return utils.isNaN(obj1) === utils.isNaN(obj2);
    	}
    	return toString.call(obj1) === toString.call(obj2);
    };
    // isSameType 方法不支持 'all' 和 'any' 接口
    utils.isSameType.api = ['not'];

    utils.isString = function(obj){
    	return toString.call(obj) === '[object String]';
    };

    utils.isChar = function(obj) {
    	return utils.isString(obj) && obj.length === 1;
    };

	// 判断是否未定义或者赋值为undefined
	utils.isUndefined = function(obj){
		return obj === void 0;
	};

	// 判断object,array,string是否为空
	utils.isEmpty = function(obj) {
		if(utils.isNull(obj) || arguments.length === 0 || utils.isUndefined(obj)){
			return false;
		}
		if(utils.isObject(obj)){
			var num = Object.getOwnPropertyNames(obj).length;
			if(num === 0 || (num === 1 && utils.isArray(obj)) || (num === 2 && utils.isArguments(obj))){
				return true;
			}
			return false;
		} else {
			return obj === '';
		}
	};

    // 判断是否(不是 null 或者 不是undefined)
    utils.isExist = function(obj) {
    	return obj !== null && obj !== undefined;
    };

    // 判断是否真实存在并且不等于false
    utils.isTruth = function(obj) {
    	return utils.isExist(obj) && obj !== false && utils.not.isNaN(obj) && obj !== "" && obj !== 0;
    };

    // 判断是否相等
    utils.isEqual = function(obj1, obj2) {
        // 检查是否 0 and -0 equity with Infinity and -Infinity
        if(utils.all.isNumber(obj1, obj2)) {
        	return obj1 === obj2 && 1 / obj1 === 1 / obj2;
        }
        // 检查是否都是字符串或者正则对象
        if(utils.all.isString(obj1, obj2) || utils.all.isRegexp(obj1, obj2)) {
        	return '' + obj1 === '' + obj2;
        }
        if(utils.all.isBoolean(obj1, obj2)) {
        	return obj1 === obj2;
        }
        return false;
    };
    // isEqual方法 不支持 'all' 和 'any' 接口
    utils.isEqual.api = ['not'];

    // 判断是否是偶数
    utils.isEven = function(obj) {
    	return utils.isNumber(obj) && obj % 2 === 0;
    };

    // 判断是否是奇数
    utils.isOdd = function(obj) {
    	return utils.isNumber(obj) && obj % 2 === 1;
    };

    // 是否是正数
    utils.isPositive = function(obj){
    	return utils.isNumber(obj) && obj > 0;
    };

    // 是否是负数
    utils.isNegative = function(obj){
    	return utils.isNumber(obj) && obj < 0;
    };

    utils.isInteger = function(obj){
    	return utils.isNumber(obj) && obj % 1 === 0;
    };

    utils.hasClass = function(element,className){
    	if(element.classList)
    		element.classList.contains(className);
    	else
    		new RegExp('(^| )' + className + '( |$)','gi').test(element.className)
    };

	// 判断该对象是否含有该属性(不包含原型)
	utils.has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};

	// 判断是否是dom节点
	utils.isElement = function(ele){
		return !!(ele && ele.nodeType === 1);
	};

	// 判断是否有某个类
	utils.hasClass = function(el,cn) {
		return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
	};

	// 添加类
	utils.addClass = function(el,cn) {
		if (!utils.hasClass(el, cn)) {
			el.className = (el.className === '') ? cn : el.className + ' ' + cn;
		}
	};

	// 移除某个类
	utils.removeClass = function(el,cn) {
		el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
	};

	utils.hasHash = function(url) {
		url = url || window.location.href;
		var match = url.match(/#(.*)$/);
		var ends =  match ? match[1] : '';
		return (ends !== '') ;
	};

	// 是否为数字
	utils.isNumber = function(obj){
		return toString.call(obj) === '[object Number]';
	};

	// 是否是方法
	utils.isFunction = function(obj){
		return toString.call(obj) === '[object Function]' || typeof obj === 'function';
	};

	// 是否是日期
	utils.isDate = function(obj){
		return toString.call(obj) === '[object Date]';
	};

	// description:
	// 这个方法可以连闰年都可以正确判断出
	// 参数date可以格式为 xx-xx-xx 或 xxxx-xx-xx或者用 / 或 , 分割
	// 例子:
	// util.isCheckDate('2016-01-01');
	utils.isCheckDate = function(date) {
		return (new Date(date).getDate()==date.substring(date.length-2));
	};



	// 是否是星期
	utils.isWeekend = function(date) {
		var day = date.getDay();
		return day === 0 || day === 6;
	};

	// 是否为闰年
	utils.isLeapYear = function(year)
	{
		return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	};

	utils.isError = function(obj){
		return toString.call(obj) === '[object Error]';
	};

	utils.isNaN = function(obj){
		return obj !== obj;
	};

	// 字符串验证
	/*-------------------------------------------------------------------------------*/

	utils.isUpperCase = function(obj){
		return utils.isString(obj) && obj === obj.toUpperCase();
	};
	utils.isLowerCase = function(obj){
		return utils.isString(obj) && obj === obj.toLowerCase();
	};

	// 返回一个介于min,max之间的随机数(包括边界)
	utils.random = function(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};


	// 字符串
	/*----------------------------------------------------------------------------*/
	// 字符串长度截取
	utils.cutstr = function(str,len) {
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
	utils.cutstr.api = ['not'];

	// 字符串清除空格
	StringProto.trim = function() {
		var reExtraSpace = /^\s*(.*?)\s+$/;
		return this.replace(reExtraSpace, "$1");
	};

	// 替换
	StringProto.replaceAll = function(s1, s2) {
		return this.replace(new RegExp(s1, "gm"), s2);
	};

	// 转义html标签
	utils.htmlEncode = function(text) {
		return text.replace(/&/g, '&amp').replace(/\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	};

	// 还原html标签
	utils.htmlDecode = function(text) {
		return text.replace(/&amp;/g, '&').replace(/&quot;/g, '\"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	};

	// 加入收藏夹
	utils.addFavorite = function(surl,stitle) {
		try {
			window.external.addFavorite(surl, stitle);
		} catch(e) {
			try {
				window.sidebar.addPanel(stitle, surl, "");
			} catch(e) {
				alert("加入收藏失败，请使用Ctrl+D进行添加");
			}
		}
	};

	// 设为首页
	utils.setHomepage = function(surl) {
		if (document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(surl);
		} else if (window.sidebar) {
			if (window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				} catch(e) {
					alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
				}
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage', surl);
		}
	};

	// 清除脚本内容
	utils.trimScript = function (script){
		return s.replace(/<script.*?>.*?<\/script>/ig, '');
	};

	/**
	 * 深拷贝
	 * 参数可以是普通类型、数组、对象
	 *
	 */
	 utils.deepCopy = function(source){
	 	var result;
		// 如果需要深拷贝的是对象（或数组）
		if(utils.isObject(source)){
			// 如果需要深拷贝的是数组
			if(utils.isArray(source)){
				result = [];

				// 遍历该数组，对于数组中每一个值做递归的深拷贝
				for(var i = 0; i < source.length; i++){
					result[i] = deep_copy(source[i]);
				}
			// 如果需要深拷贝的是对象（但不是数组）
		}else{
			result = {};

				// 遍历该对象，对于对象中每一个值做递归的深拷贝
				for(var i in source){
					// 对于对象而言，过滤掉原型链上的属性（仅拷贝自定义的属性）
					if(source.hasOwnProperty(i)) {
						result[i] = deep_copy(source[i]);
					}
				}
			}
		// 如果需要深拷贝的不是对象（和数组），那么直接用等号赋值
	}else{
		result = source;
	}
	return result;
};

	// 正则验证
	/*----------------------------------------------------------------------------*/

	var regexps = {
		qq: /^[1-9[0-9]{4,9}$]/,
		phoneNumber: /^1[3|4|5|7|8]\d{9}$/,
		telPhone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
		url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
		email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
		creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
		alphaNumeric: /^[A-Za-z0-9]+$/,
		timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
		dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
		usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/,
		caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
		ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
		nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
		eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
		socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/,
		affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
		hexadecimal: /^[0-9a-fA-F]+$/,
		hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
		ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
		ipv6: /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
		ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
	};

    // create regexp checks methods from 'regexp' object
    for(var regexp in regexps) {
    	if(regexps.hasOwnProperty(regexp)) {
    		regexpCheck(regexp, regexps);
    	}
    }

    function regexpCheck(regexp, regexps) {
    	utils[regexp] = function(value) {
    		return regexps[regexp].test(value);
    	};
    }



	// 时间验证
	/*----------------------------------------------------------------------------*/


	// obj 是 时间戳
	utils.isToday = function(obj){
		if((utils.not.isNumber(obj) || utils.not.isNumber(Number(obj))) && utils.not.isDate(obj)){
			// console.log('today...');
			return false;
		}
		if(utils.isDate(obj)){
			obj = utils.time;
		}

		// console.log('obj: ',obj);
		var now = new Date();
		// 获取今天日期
		var now_day = utils.getLocaleDateTime(now);
		// 获取当前时间
		// var now_time = utils.time();
		// 获取当天零时时间(时间戳)
		var start_time = utils.str_to_unix(now_day + ' 00:00:00');
		// 获取当天24时时间(时间戳)
		var end_time = utils.str_to_unix(now_day + ' 23:59:59');
		return (obj <= end_time && obj >= start_time);
	};

	// 获取当前日期
	utils.getLocaleDateTime = function(obj){
		return obj.toLocaleDateString();
	};

	// 格式化日期
	utils.formatDate = function (date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? '0' + m : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		return y + '-' + m + '-' + d;
	};

	// 格式化日期时间
	utils.formatDateTime = function (date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		var minute = date.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		return y + '-' + m + '-' + d+' '+h+':'+minute;
	};

	// 字符串转换为时间戳(微秒)
	utils.parseDate = function(date) {
		date = new Date(Date.parse(date.replace(/-/g,'/')));
		return date.getTime();
	};

	// 返回当前时间(微秒)
	utils.now = Date.now || function() {
		return new Date().getTime();
	};

	// 当前时间(秒)
	utils.time = parseInt(utils.now()/ 1000);

	/**
	 * 将日期时间转为时间戳(秒)
	 * 用法:
	 * 1. utils.str_to_unix('2011-11-11 00:00:00');
	 * 2. var now = new Date();
	 *	  utils.str_to_unix(now);
	 */
	 utils.str_to_unix = function(obj){
	 	return parseInt((new Date(obj)).getTime() / 1000);
	 };

	/** 获取倒计时
	 *  参数date可以格式为 xx-xx-xx 或 xxxx-xx-xx 或用 / 或 , 分割,也可以用标准时间(new Date('xxxx-xx-xx'))
	 *
	 * 用法:
	 *	utils.getChaTime('xxxx-xx-xx');
	 */
	 utils.getChaTime = function(date) {
	 	var curr_date = new Date();
	 	var start_time = 0;
	 	if(utils.isDate(date)) {
	 		start_time = date.getTime();
	 	}else if(utils.isCheckDate(date)) {
	 		start_time = date.getTime();
	 	}else {
	 		return false;
	 	}
	 	var start = start_time - cur_date.getTime();
	 	var startday = Math.floor(start/(1000 * 60 * 60 * 24));
	 	if(startday > 0){
	 		return startday;
	 	}else {
	 		return -1;
	 	}
	 };

	/**
	 * 将时间戳转为几月前。几周前，几天前，几分钟前
	 * 用法:
	 * 1. utils.getDateDiff(时间戳(微秒));
	 */
	 utils.getDateDiff = function(dateTimeStamp) {
	 	var minute = 1000 * 60;
	 	var hour = minute * 60;
	 	var day = hour * 24;
	 	var halfamonth = day * 15;
	 	var month = day * 30;
	 	var now = new Date().getTime();
	 	var diffValue = now - dateTimeStamp;
	 	if(diffValue < 0){return;}
	 	var monthC =diffValue/month;
	 	var weekC =diffValue/(7*day);
	 	var dayC =diffValue/day;
	 	var hourC =diffValue/hour;
	 	var minC =diffValue/minute;
	 	if(monthC>=1){
	 		result="" + parseInt(monthC) + "月前";
	 	}
	 	else if(weekC>=1){
	 		result="" + parseInt(weekC) + "周前";
	 	}
	 	else if(dayC>=1){
	 		result=""+ parseInt(dayC) +"天前";
	 	}
	 	else if(hourC>=1){
	 		result=""+ parseInt(hourC) +"小时前";
	 	}
	 	else if(minC>=1){
	 		result=""+ parseInt(minC) +"分钟前";
	 	}else
	 	result="刚刚";
	 	return result;
	 };

	/**
	 * 将标准时间转为时间戳(微秒)
	 * 用法:
	 * 1. utils.getDateTimeStamp('2016-01-01');
	 */
	 utils.getDateTimeStamp = function(dateStr) {
	 	return Date.parse(dateStr.replace(/-/gi,"/"));
	 };
	/**
	 * 时间格式化函数
	 * @param  {[type]} format
	 * @param  {[type]} unix_time 时间戳
	 * @return {[type]}           字符串
	 *
	 * 使用方法:
	 * utils.date('Y-m-d H:i:s', utils.time)	-->		"2016-02-26 00:55:25"
	 * utils.date('Y-m-d', utils.time)			-->		"2016-02-26"
	 * utils.date('Y/m/d', utils.time)			-->		"2016/02/26"
	 * utils.date('Y:m:d', utils.time)			-->		"2016:02:26"
	 */
	 utils.date = function (format,unix_time) {
	 	var this_Date = new Date(unix_time?(parseInt(unix_time)*1000):(new Date().getTime()));
	 	var weekday = new Array('Sunday',
	 		'Monday',
	 		'Tuesday',
	 		'Wednesday',
	 		'Thursday',
	 		'Friday',
	 		'Saturday');
	 	return format.replace(/y/i, this_Date.getFullYear()).
	 	replace('m', parseInt(this_Date.getMonth()+1) < 10 ?
	 		'0'+parseInt(this_Date.getMonth()+1) : parseInt(this_Date.getMonth()+1)).
	 	replace('d', parseInt(this_Date.getDate()) < 10 ?
	 		'0'+this_Date.getDate() : this_Date.getDate()).
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
    utils.format = function(format,date) {
    	date instanceof Date||(date=new Date(date));
    	var f={
    		"y+":date.getFullYear(),
    		"M+":date.getMonth()+1,
    		"d+":date.getDate(),
    		"h+":date.getHours(),
    		"m+":date.getMinutes(),
    		"s+":date.getSeconds()
    	},fd;
    	for(var o in f){
    		if(new RegExp(o).test(format))
    		{
    			fd=RegExp.lastMatch;
    			format=format.replace(fd,o==="y+"?f[o].toString().slice(-fd.length):fd.length===1?f[o]:(f[o]+100).toString().slice(-fd.length));
    		}
    	}
    	return format;
    };


    /*------------------------------------------------------------------------------------------------*/

	 // 环境检测
	 /*-----------------------------------------------------------------------------------------------*/
	 // 判断是不是浏览器环境
	 if(typeof window !== 'undefined') {

        // 缓存navigator 属性
        var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
        var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
        var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

        // is current browser chrome?
        utils.chrome = function() {
        	return /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor);
        };
        // chrome method does not support 'all' and 'any' interfaces
        utils.chrome.api = ['not'];

        // is current browser firefox?
        utils.firefox = function() {
        	return /firefox/i.test(userAgent);
        };
        // firefox method does not support 'all' and 'any' interfaces
        utils.firefox.api = ['not'];

        // is current browser edge?
        utils.edge = function() {
        	return /edge/i.test(userAgent);
        };
        // edge method does not support 'all' and 'any' interfaces
        utils.edge.api = ['not'];

        // is current browser internet explorer?
        // parameter is optional
        utils.ie = function(version) {
        	if(!version) {
        		return /msie/i.test(userAgent) || "ActiveXObject" in window;
        	}
        	if(version >= 11) {
        		return "ActiveXObject" in window;
        	}
        	return new RegExp('msie ' + version).test(userAgent);
        };
        // ie method does not support 'all' and 'any' interfaces
        utils.ie.api = ['not'];

        // is current browser opera?
        utils.opera = function() {
            return /^Opera\//.test(userAgent) || // Opera 12 and older versions
                /\x20OPR\//.test(userAgent); // Opera 15+
            };
        // opera method does not support 'all' and 'any' interfaces
        utils.opera.api = ['not'];

        // is current browser safari?
        utils.safari = function() {
        	return /safari/i.test(userAgent) && /apple computer/i.test(vendor);
        };
        // safari method does not support 'all' and 'any' interfaces
        utils.safari.api = ['not'];

        // is current device ios?
        utils.ios = function() {
        	return utils.iphone() || utils.ipad() || utils.ipod();
        };
        // ios method does not support 'all' and 'any' interfaces
        utils.ios.api = ['not'];

        // is current device iphone?
        utils.iphone = function() {
        	return /iphone/i.test(userAgent);
        };
        // iphone method does not support 'all' and 'any' interfaces
        utils.iphone.api = ['not'];

        // is current device ipad?
        utils.ipad = function() {
        	return /ipad/i.test(userAgent);
        };
        // ipad method does not support 'all' and 'any' interfaces
        utils.ipad.api = ['not'];

        // is current device ipod?
        utils.ipod = function() {
        	return /ipod/i.test(userAgent);
        };
        // ipod method does not support 'all' and 'any' interfaces
        utils.ipod.api = ['not'];

        //  android?
        utils.android = function() {
        	return /android/i.test(userAgent);
        };
        // android method does not support 'all' and 'any' interfaces
        utils.android.api = ['not'];

        //  android phone?
        utils.androidPhone = function() {
        	return /android/i.test(userAgent) && /mobile/i.test(userAgent);
        };
        // androidPhone method does not support 'all' and 'any' interfaces
        utils.androidPhone.api = ['not'];

        //  android tablet?
        utils.androidTablet = function() {
        	return /android/i.test(userAgent) && !/mobile/i.test(userAgent);
        };
        // androidTablet method does not support 'all' and 'any' interfaces
        utils.androidTablet.api = ['not'];

        //  blackberry?
        utils.blackberry = function() {
        	return /blackberry/i.test(userAgent) || /BB10/i.test(userAgent);
        };
        // blackberry method does not support 'all' and 'any' interfaces
        utils.blackberry.api = ['not'];

        //  desktop?
        utils.desktop = function() {
        	return utils.not.mobile() && utils.not.tablet();
        };
        // desktop method does not support 'all' and 'any' interfaces
        utils.desktop.api = ['not'];

        // utils current operating system linux?
        utils.linux = function() {
        	return /linux/i.test(appVersion);
        };
        // linux method does not support 'all' and 'any' interfaces
        utils.linux.api = ['not'];

        // utils current operating system mac?
        utils.mac = function() {
        	return /mac/i.test(appVersion);
        };
        // mac method does not support 'all' and 'any' interfaces
        utils.mac.api = ['not'];

        // utils current operating system windows?
        utils.windows = function() {
        	return /win/i.test(appVersion);
        };
        // windows method does not support 'all' and 'any' interfaces
        utils.windows.api = ['not'];

        //  windows phone?
        utils.windowsPhone = function() {
        	return utils.windows() && /phone/i.test(userAgent);
        };
        // windowsPhone method does not support 'all' and 'any' interfaces
        utils.windowsPhone.api = ['not'];

        //  windows tablet?
        utils.windowsTablet = function() {
        	return utils.windows() && utils.not.windowsPhone() && /touch/i.test(userAgent);
        };
        // windowsTablet method does not support 'all' and 'any' interfaces
        utils.windowsTablet.api = ['not'];

        //  mobile?
        utils.mobile = function() {
        	return utils.iphone() || utils.ipod() || utils.androidPhone() || utils.blackberry() || utils.windowsPhone();
        };
        // mobile method does not support 'all' and 'any' interfaces
        utils.mobile.api = ['not'];

        //  tablet?
        utils.tablet = function() {
        	return utils.ipad() || utils.androidTablet() || utils.windowsTablet();
        };
        // tablet method does not support 'all' and 'any' interfaces
        utils.tablet.api = ['not'];

        // utils current state online?
        utils.online = function() {
        	return navigator.onLine;
        };
        // online method does not support 'all' and 'any' interfaces
        utils.online.api = ['not'];

        // utils current state offline?
        utils.offline = not(utils.online);
        // offline method does not support 'all' and 'any' interfaces
        utils.offline.api = ['not'];

        //  supports touch?
        utils.touchDevice = function() {
        	return 'ontouchstart' in window ||'DocumentTouch' in window && document instanceof DocumentTouch;
        };
        // touchDevice method does not support 'all' and 'any' interfaces
        utils.touchDevice.api = ['not'];

        utils.isBrowser = function() {
        	return !!(typeof window !== 'undefined' && navigator !== 'undefined' && window.document);
        };

        utils.isChromium = function() {
        	var chromium = "mozilla/&&applewebkit/&&chrome/&&safari/".split("&&");
        	for (var i = 0; i < chromium.length; i++)
        		if (userAgent.indexOf(chromium[i]) < 0)
        			return false;
        		return true;
        	};
        };

    // Array 类型
    /*-----------------------------------------------------------------------------*/

    // 判断数组中是否存在某个值
    utils.inArray = function(val,arr){
    	if(utils.not.isArray(arr)){
    		return false;
    	}
    	if(utils.isEmpty(arr)){
    		return true;
    	}
    	for(var i = 0,length = arr.length ; i< length;i++){
    		if(arr[i] === val){
    			return true;
    		}
    	}
    	return false;
    };

    utils.inArray.api = ['not'];

    // 数组排序
    utils.sorted = function(arr){
    	if(utils.not.isArray(arr)){
    		return false;
    	}
    	if(utils.isEmpty(arr)){
    		return true;
    	}
    	for(var i = 0,length = arr.length;i<length;i++){
    		if(arr[i] > arr[i+1]){
    			return false;
    		}
    	}
    	return true;
    };

    // 数组去重
    utils.unique = function(arr){
    	if (utils.not.isArray(arr)) {
    		return false;
    	}
    	if(utils.isEmpty(arr)){
    		return true;
    	}
    	// 临时数组
    	var n = [];
    	for(var i = 0,length=arr.length;i<length;i++){
    		if(n.indexOf(arr[i]) === -1){
    			n.push(arr[i]);
    		}
    	}
    	return n;
    };

    // API
    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
    function setInterfaces() {
    	var options = utils;
    	for(var option in options) {
    		if(hasOwnProperty.call(options, option) && utils.isFunction(options[option])) {
    			var interfaces = options[option].api || ['not', 'all', 'any'];
    			for (var i = 0; i < interfaces.length; i++) {
    				if(interfaces[i] === 'not') {
    					utils.not[option] = not(utils[option]);
    				}
    				if(interfaces[i] === 'all') {
    					utils.all[option] = all(utils[option]);
    				}
    				if(interfaces[i] === 'any') {
    					utils.any[option] = any(utils[option]);
    				}
    			}
    		}
    	}
    }
    setInterfaces();
    return utils;
}));

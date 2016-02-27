/*
* @Author: baby
* @Date:   2016-02-25 12:55:56
* @Last Modified by:   baby
* @Last Modified time: 2016-02-25 13:00:05
*/

'use strict';
var Base = Class.extend({
	init: function(config){
		// 自动保存配置项
		this.__config = config;
		this.bind();
		this.render();
	},
	// 可以使用get来获取配置项
	get: function(key){
		return this.__config[key];
	},
	// 可以使用set来设置配置项
	set: function(key,value){
		this.__config[key] = value;
	},
	// 绑定
	bind: function(){},
	render: function(){},
	// 定义销毁的方法，一些收尾工作都应该在这里
	destroy: function(){

	}
});

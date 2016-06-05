/*
* @Author: fengyun2
* @Date:   2016-06-05 21:00:51
* @Last Modified by:   fengyun2
* @Last Modified time: 2016-06-05 22:07:14
*/
/**
 * 用途: 使用localstorage存储用户登录信息
 * Uage:
 * user.maxAge(1000*60*60*24).set('userinfo', {
 *   name: 'fengyun2',
 *   age: '18'
 * });
 */
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
        root.user = factory();
      }
    }(this, function () {
      var root = this || global;

  // 定义工具方法的版本号
  var user = {};
  user.VERSION = '0.1.0';

  function _isStorageSupported () {
    var supported = false;
    if (localStorage && localStorage.setItem ) {
      supported = true;
      var key = '__' + Math.round(Math.random() * 1e7);
      try {
        localStorage.setItem(key, key);
        localStorage.removeItem(key);
      } catch (err) {
        supported = false;
      }
    }
    return supported;
  }

  user.age = 0; // 生命周期
  /**
   * 设置缓存的最长时间
   * @param  {[type]} age 缓存时间过期周期
   * @return {[type]}     [description]
   */
  user.maxAge = function (age) {
    this.age = age;
    return this;
  };
  /**
   * 设置缓存数据
   * @param {[type]} name 缓存名称
   * @param {[type]} json 缓存数据
   */
  user.set = function (name, json) {
    localStorage.removeItem(name);
    json.__time = new Date().getTime();
    json.__age = this.age;
    localStorage.setItem(name, JSON.stringify(json));
    return this;
  };
  /**
   * 获取缓存信息
   * @param  {[type]} name 缓存名称
   * @return {[type]}      [description]
   */
  user.getInfo = function (name) {
    var info = localStorage.getItem(name);
    return info ? JSON.parse(info) : null;
  };
  /**
   * 判断是缓存否过期
   * @param  {[type]}  name 缓存时间
   * @return {Boolean}      [description]
   */
  user.isExpired = function (name) {
    var logined = localStorage.getItem(name),
    _time = 0,
    iTime = new Date().getTime(),
    timeLength = 0;

    if (logined) {
      logined = JSON.parse(logined);
      _time = logined.__time;
      timeLength = iTime - _time; // 过去了多长时间

      return timeLength >= logined.__age;
    } else {
      return true;
    }
  };
  /**
   * 判断用户是否登录
   * @param  {[type]}   name 缓存名称
   * @param  {Function} fn   回调方法
   * @return {Boolean}       [description]
   */
  user.isLogined = function (name, fn) {
    var user = '',
    age = this.age;
    if (!this.isExpired(name)) {
      user = JSON.parse(localStorage.getItem(name));
    } else {
      localStorage.removeItem(name);
    }
    if (user) {
      fn&&fn(user);
    } else {
      fn&&fn();
    }
  };

  return user;
}));

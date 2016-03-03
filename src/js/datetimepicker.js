/*
* @Author: fengyun2
* @Date:   2016-03-02 12:47:33
* @Last Modified by:   fengyun2
* @Last Modified time: 2016-03-02 12:47:33
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
        root.datetimepicker = factory();
    }
}(this, function () {
	var root = this || global;
	// 定义日期时间类库的版本号
	var datetimepicker = {};
	datetimepicker.VERSION = '0.1.0';

	// 环境检测
	/*-----------------------------------------------------------------------------------------------*/
	 // 判断是不是浏览器环境
	 if(typeof window !== 'undefined') {
	 	var d=document,
	 	w=window,
	 	isIE=w.navigator.appVersion.indexOf("MSIE")>-1,
	 	now=new Date(),
	 	nowM=now.getMonth();
	 	nowY=now.getFullYear();
	 	date=null,
	 	ids=null,
	 	oInput=null;
	 }
	 // 获取日期组件的元素
	 function getIds(idArr){
	 	var oId=[];
	 	for(var i=0,len=idArr.length;i<len;i++){
	 		var ele = '[lyid="'+idArr[i] +'"]';
	 		console.log(ele);
	 		oId[idArr[i]]=d.querySelector('[lyid="'+idArr[i] +'"]');
	 	}
	 	return oId;
	 }
	 // 事件组合
	 var idsArr = ['prev_id-calendar','next_id-calendar','day_id-calendar'];
	 if(!ids){
	 	ids = getIds(idsArr);
	 }

	 // 格式化日历控件
	 function formatDay(timestr){
	 	var t=/(\d+)-(\d+)-(\d+)\s*(\d*):?(\d*):?(\d*)/.exec(timestr);
	 	var da=null;
	 	var dn=getdate(now);
	 	if(t){
	 		da=new Date(t[1],t[2]-1,1,t[4],t[5],t[6]);
	 	}else{
	 		da=new Date(dn['y'],dn['m'],1,dn['h'],dn['i'],dn['s']);
	 	}
	 	date=getdate(da);
	 	var mon=[31,date['y']%4==0?29:28,31,30,31,30,31,31,30,31,30,31];
	 	var str="",day=1;
	 	str+='<table width="100%" border="0" bgcolor="#cecece" cellspacing="1" cellpadding="0">';
	 	for(var md=mon[date['m']-1],wd=md-date['w']+1,n=0;n<6;n++){
	 		str+='<tr bgcolor="#ffffff" height="23">';
	 		for(var nn=0;nn<7;nn++){
	 			if(wd<=md){
	 				str+='<td class="col666">'+wd+'</td>';
	 				wd++;
	 			}else {
	 				if(day<=mon[date['m']]){
	 					if(day==dn['d'] && nowM==now.getMonth()&&nowY==now.getFullYear()){
	 						str+='<td class="bg9ebdd6">'+(day++)+'</td>';
	 					}else{
	 						str+='<td>'+(day++)+'</td>';
	 					}
	 					var day2=1;
	 				}else{
	 					str+='<td class="col666">'+(day2++)+'</td>';
	 				}
	 			}
	 		}
	 		str+='</tr>';
	 	}
	 	str+='</table>';
	 	ids['calenderDay'].innerHTML=str;
	 	var dates=[date['y'],fillzero(date['m']+1),fillzero(date['h']),fillzero(date['i']),fillzero(date['s'])];
	 	each.call([ids['y'],ids['m'],ids['h'],ids['i'],ids['s']],function(o,i){o.innerHTML=dates[i]});
	 	each.call(ids['calenderDay'].getElementsByTagName("td"),function(o,i){
	 		addEvent(o,"mouseover",function(e){
	 			o.style.backgroundColor="#9ebdd6";
	 		})
	 		addEvent(o,"mouseout",function(e){
	 			o.style.backgroundColor="";
	 		})
	 		addEvent(o,"click",function(e){
	 			if(o.className=="col666"){return}
	 				oInput.value=ids['y'].innerHTML+"-"+ids['m'].innerHTML+"-"+ fillzero(o.innerHTML)
	 			+" "+ids['h'].innerHTML+":"+ids['i'].innerHTML+":"+ids['s'].innerHTML;
	 			hide();
	 		})
	 	})
	 }


	 	//获取元素位置
	function getPos(e){
		var x,y,e=typeof e=="string"?d.getElementById(e):e,p=[];
		x=e.offsetLeft;
		y=e.offsetTop;
		while(e=e.offsetParent){
			x+=e.offsetLeft;
			y+=e.offsetTop;
		}
		p['x']=x;p['y']=y;
		return p;
	}

	//上一年
	function yL(){
		now.setFullYear(date['y']-1);
		formatDay();
	}

	//下一年
	function yR(){
		now.setFullYear(date['y']+1);
		formatDay();
	}

	//上一月
	function mL(){
		now.setMonth(date['m']-1);
		formatDay();
	}

	//下一月
	function mR(){
		now.setMonth(date['m']+1);
		formatDay();
	}

	//时增加
	function hR(){
		now.setHours(date['h']+1);
		formatDay();
	}

	//时减少
	function hL(){
		now.setHours(date['h']-1);
		formatDay();
	}

	//分增加
	function iR(){
		now.setMinutes(date['i']+1);
		formatDay();
	}

	//分减少
	function iL(){
		now.setMinutes(date['i']-1);
		formatDay();
	}

	//为SELECT添加事件
	function addEventForSelect(type){
		function changeInner(){
			ids[type].innerHTML=fillzero(oSelect.value);
			now.setFullYear(ids['y'].innerHTML);
			now.setMonth(Number(ids['m'].innerHTML)-1);
			now.setHours(ids['h'].innerHTML);
			now.setMinutes(ids['i'].innerHTML);
			now.setSeconds(ids['s'].innerHTML);
			formatDay();
		}
		var oSelect=gids(['calenderSelect'])['calenderSelect'];
		oSelect.focus();
		addEvent(oSelect,'change',changeInner);
		addEvent(oSelect,"blur",changeInner);
	}

	//生成option选项
	function createOption(type,v){
		var str='',str2='',i=0,i2=0;
		function create(i,i2){
			while(i>=i2){
				if(v==i){
					str2+='<option value="'+i+'" selected>'+i+'</option>';
				}else{
					str2+='<option value="'+i+'">'+i+'</option>';
				}
				i--;
			}
			str+=str2+'</select>';
			ids[type].innerHTML=str;
			addEventForSelect(type);
		}
		str+='<select id="calenderSelect">';
		if(type=="y"){
			i=2011;i2=1990;
			create(i,i2);
			return;
		}
		if(type=="m"){
			i=1;i2=12;
		}
		if(type=="h"){
		   i=00;i2=23;
		}
		if(type=="i"){
			i=00;i2=59;
		}
		if(type=="s"){
			i=00;i2=59;
		}
		create(i2,i);
	}

	//年鼠标点击
	function yClick(e){
		if(getTarget(e).tagName.toLowerCase()=="span"){
			createOption("y",ids['y'].innerHTML);
		}
	}

	//月鼠标点击
	function mClick(e){
		if(getTarget(e).tagName.toLowerCase()=="span"){
			createOption("m",ids['m'].innerHTML);
		}
	}

	//时鼠标点击
	function hClick(e){
		if(getTarget(e).tagName.toLowerCase()=="span"){
			createOption("h",ids['h'].innerHTML);
		}
	}

	//分鼠标点击
	function iClick(e){
		if(getTarget(e).tagName.toLowerCase()=="span"){
			createOption("i",ids['i'].innerHTML);
		}
	}

	//秒鼠标点击
	function sClick(e){
		if(getTarget(e).tagName.toLowerCase()=="span"){
			createOption("s",ids['s'].innerHTML);
		}
	}

	//each方法
	function each(handler){
		var o=null;
		for(var i=0,len=this.length;i<len;i++){
			o=typeof this[i]=="string"?fd.getElementById(this[i]):this[i];
			handler(o,i);
		}
	}

	//如果日期为一位数，则在前面补零
	function fillzero(str){
		var str=typeof str=="string"?str:str.toString();
		if(str.length==1){
			str="0"+str;
		}
		return str;
	}

	//获取时间
	function getdate(da){
		var date=[];
		date['y']=da.getFullYear();
		date['m']=da.getMonth();
		date['d']=da.getDate();
		date['w']=da.getDay();
		date['h']=da.getHours();
		date['i']=da.getMinutes();
		date['s']=da.getSeconds();
		return date;
	}

	//阻止默认事件
	function preventDefault(e){
		var e=e||window.event;
		if(e.preventDefault){
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
	}

	function getTarget(e){
		var e=e||window.event;
		return e.srcElement||e.target;
	}

	//显示日历控件
	function show(o){
		var s=o.value;
		var p=getPos(o);
		if(s){
			formatDay(s);
		}else{
			now=new Date();
			formatDay();
		}
		ff.style.left=p['x']+"px";
		ff.style.top=p['y'] + o.offsetHeight + "px";
		ff.style.display="block";
	}

	//隐藏日历控件
	function hide(){
		ff.style.display="none";
	}

	//添加事件
	function addEvent(element,event,handler){
		var element=typeof element=="string"?d.getElementById(element):element;
		if(element.addEventListener){
			element.addEventListener(event,handler,false)
		}else if(element.attachEvent){
			element.attachEvent("on"+event,handler);
		}else{
			element["on"+event]=handler;
		}
	}

	//获取要实现控件的表单
	function getObj(className){
		var o=d.getElementsByTagName('*'),oArr=[];
		for(var i=0,len=o.length;i<len;i++){
			if(o[i].className==className){
				oArr.push(o[i])
			}
		}
		return oArr;
	}

	each.call(getObj("sang_Calender"),function(o,i){
		addEvent(o,"click",function(e){preventDefault(e);oInput=o,show(o);ff.focus()})
	})

	//var iframeObj=isIE?ff:f;
	// addEvent(isIE?ff:f,"blur",function(e){hide()})

	 console.log(ids);
	 return datetimepicker;
	}));

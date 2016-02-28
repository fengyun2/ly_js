/*
* @Author: fengyun2
* @Date:   2016-02-28 15:50:05
* @Last Modified by:   fengyun2
* @Last Modified time: 2016-02-28 16:27:17
*/

'use strict';

var http = require('http');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	if(req.method == 'POST'){
		var info = '';
		req.on('data',function(data){
			info += data;
		});
		req.on('end',function(){
			info = querystring.parse(info);
			console.log('info: ',info);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(info));
		});

	}else if(req.method == "GET"){
		var data = {key: 'value', hello: 'world'};

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(data));
	}
});

server.listen(3000,function () {
	console.log('listening on localhost:3000.');
});

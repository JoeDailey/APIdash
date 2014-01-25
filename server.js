var $ = require('jQuery');


var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/static'));
app.use(express.bodyParser());
app.set('view options', {
    layout: false
});
app.listen(9001);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);

app.get('/', function(req, res) {
    res.render('index.html');
});
var APIs = $.get(/static/)
//Wunderground////////////////////////////////////////////////////////////////////////
app.get('/wunderground', function(req, res) {
	res.send([
		"alerts",
		"almanac",
		"astronomy",
		"conditions",
		"currenthurricane",
		"forecast",
		"forecast10day",
		"geolookup",
		"history",
		"hourly",
		"hourly10day",
		"planner",
		"rawtide",
		"satellite",
		"tide",
		"webcams",
		"yesterday"]);
});
app.post('/wunderground/:func', function(req, res) { //cdde5330c637ed40
    GET(wunderground+req.params.func+"/q/"+req.body.local+".json", res);
});
//ESPN//////////////////////////////////////////////////////////////////////////////////
app.post('/espn/:function',function(req, res) {
	switch (req.params.function) {
		case 'now':
			// $.ajax({

			// });
			res.send(200, {});
			break;
		}
});



//Rotten Tomatoes//////////////////////////////////////////////////////////////////////
app.post('/rottentomatoes', function(req, res){
	if(req.body.rpp=undefined)req.body.rpp = 10;
	if(req.body.pageNum=undefined)req.body.pageNum = 0;

	var query = "";
	if(req.body.search != undefined){
		query = tomatoes+"&q="+req.body.search.replace(" ","+")+"&page_limit="+req.body.rpp+"&page="+req.body.pageNum;
	}else{
		query = "/"+req.body.rotten_id+tomatoes;
	}
	GET(rotten+query, res);
});



var GET = function(url, res){
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		error:function(error){
			res.send(400, {'message':"Bad Request"});
		},
		success:function(result, status){
			res.send(status, result);
		}
	});
}
var GETcallback = function(url, res, success){
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		error:function(error){
			res.send(400, {'message':"Bad Request"});
		},
		'success':success(result, status)
		//res.send(status, result[must be json]);
	});
}


app.get('/espn/:function', function(req, res) {
	switch (req.params.function) {
		case 'now':
			var url = "http://api.espn.com/v1/now?limit=1&apikey=q37qt8hvvk83u9ppwymr9d2g";
			$.get(url,function(data) {
				console.log(data);
				res.json(data.feed[0].headline);
			});
	}
});

//URL bases///////////////////////////////////////////////////////////
var wunderground = "http://api.wunderground.com/api/cdde5330c637ed40/";
var rotten = "http://api.rottentomatoes.com/api/public/v1.0/movies";
var tomatoes = ".json?apikey=za85re4b6nxhqrhj55j5xtmp";

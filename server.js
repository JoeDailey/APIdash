var $ = require('jQuery');


var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/static'));
app.listen(9001);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);

app.get('/', function(req, res) {
    res.render('index.html');
});
 
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
    GET(wunderground+req.params.func+"/q/"+req.body.param+".json", res);
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

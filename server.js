var $ = require('jQuery');
//Database Start//////////////////////////////////////////////////////////////////////////
var fs = require("fs");
////////CREATE DATABSE IF IT DOESN'T EXIST
var file = "db.sqlite3";
var exists = fs.existsSync(file);
if (!exists) {
    console.log("Creating DB file.");
    fs.openSync(file, "w");
}
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
if (!exists) {
    db.serialize(function() {
        
    });
}
/////////END CREATE DATABASE
//Database End/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//Routing Start//////////////////////////////////////////////////////////////////////////
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use("/static", express.static(__dirname + '/static')); //staticccccccccccccccccccccc files. Wow. Such files --Lucas, get real
app.use(express.bodyParser());
app.set('view options', {
    layout: false
});
app.listen(9001);

app.get('/', function(req, res) {
    res.render('home', {});
});
//Wunderground//////////////////////////////////////////////////////////////////////////

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

//URL bases///////////////////////////////////////////////////////////
var wunderground = "http://api.wunderground.com/api/cdde5330c637ed40/";
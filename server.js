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
app.post('/espn/:function',function(req, res) {
	switch (req.params.function) {
		case 'now':
			$.ajax(
			res.send();
});


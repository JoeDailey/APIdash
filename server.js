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
app.get('/espn/:function', function(req, res) {
	switch (req.params.function) {
		case 'now':
			var url = "http://api.espn.com/v1/now?limit=1&apikey=q37qt8hvvk83u9ppwymr9d2g";
			$.get(url,function(data) {
				console.log(data);
				res.json(data.feed[0].headline);
			});
		case 'headlines':
			var url = "http://api.espn.com/v1/sports/news/headlines?limit=1&apikey=q37qt8hvvk83u9ppwymr9d2g";
			$.get(url,function(data) {
				console.log(data);
				res.json(data.headlines[0].headline);
			});
	}
});


var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/static'));
app.listen(9001);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);

app.get('/', function(req, res) {
    res.render('index.html');
});

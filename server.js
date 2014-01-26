var $ = require('jQuery');

var util = require('util');

var dbox = require("dbox");
var app = dbox.app({
    "app_key": "khf2wcgta1uewtj",
    "app_secret": "naxztmmgalat515"
});
// app.requesttoken(function(status, request_token){
// 	console.log(request_token);
// });
// var t = { oauth_token_secret: 'zQRjFJZd1P7xE0a3',
//   oauth_token: '0dCdTWsRcOgBhl3G',
//  authorize_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token=0dCdTWsRcOgBhl3G' };
// app.accesstoken(t, function(status, access_token){
//   console.log(access_token)
// })
var dboxtoken = {
    oauth_token_secret: '43ibayca9p4yylh',
    oauth_token: '7x0z6sy2b6jhh9c9',
    uid: '260885326'
};
var dbclient = app.client(dboxtoken);

var twitter = require('twitter');
var twit = new twitter({
    consumer_key: '76Ed5HIc8fzkDIPoIqUv4Q',
    consumer_secret: 'NfbenaoE6B08wfDJjzND8WF55KujCBGaEiulhMAn4s',
    access_token_key: '2310743684-dNbEqQxJbJ0KDDXbmhCwI1qc9ImWTxC8BNVmoTG',
    access_token_secret: '7RnqSp0LNn83AKtW1A0rpnGxjT3lYXzJwZshrvXLTZBa5'
});
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/static'));
app.use(express.bodyParser());
app.set('view options', {
    layout: false
});
app.listen(9001);
app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').__express);

app.get('/', function(req, res) {
    res.render('index', {});
});

//Wunderground////////////////////////////////////////////////////////////////////////
app.post('/wunderground/:func', function(req, res) { //cdde5330c637ed40
    GET(wunderground + req.params.func + "/q/" + req.body.local + ".json", res);
});

//ESPN//////////////////////////////////////////////////////////////////////////////////
app.post('/espn/:function', function(req, res) {
    switch (req.params.function) {
        case 'now':
            console.log("in now");
            console.log(req.body.method);
            if (req.body.method == 'top') {
                var url = espnsite + "now/top?limit=1&apikey=" + espnapikey;
                GETcallback(url, res, function(data, status) {
                    console.log(data);
                    res.send(status, data);
                });
            } else if (req.body.method == 'popular') {
                var url = espnsite + "now/popular?limit=1&apikey=" + espnapikey;
                GETcallback(url, res, function(data, status) {
                    console.log(data);
                    res.send(status, data);
                });
            } else {
                var add = "";
                if (req.body.leagues) {
                    add = "leagues=" + req.body.leagues + "&";
                }
                if (req.body.groups) {
                    add = add + "groups=" + red.body.groups + "&";
                }
                if (req.body.teams) {
                    add = add + "teams=" + req.body.teams + "&";
                }
                var url = espnsite + "now?" + add + "limit=1&apikey=" + espnapikey;
                console.log(url);
                GETcallback(url, res, function(data, status) {
                    res.send(status, data.feed);
                });
            }
        case 'headlines':
            var url = espnsite + "sports/news/headlines?limit=1&apikey=" + espnapikey;
            $.get(url, function(data) {
                res.json(data.headlines);
            });
    }
});


//Rotten Tomatoes//////////////////////////////////////////////////////////////////////
app.post('/rottentomatoes', function(req, res) {
    if (req.body.rpp = undefined) req.body.rpp = 10;
    if (req.body.pageNum = undefined) req.body.pageNum = 0;

    var query = "";
    if (req.body.search != undefined) {
        query = tomatoes + "&q=" + req.body.search.replace(" ", "+") + "&page_limit=" + req.body.rpp + "&page=" + req.body.pageNum;
    } else {
        query = "/" + req.body.rotten_id + tomatoes;
    }
    GET(rotten + query, res);
});
//Digital Ocean///////////////////////////////////////////////////////////////////////
app.post('/digitalocean/:func', function(req, res) {
    var ocean = "&api_key=" + req.body.api_key;
    if (req.params.func == "new") {
        var opt1 = "",
            opt2 = "",
            opt3 = "";
        if (req.body.drop_ssh_keys != undefined) opt1 = "&ssh_key_ids=" + req.body.drop_ssh_keys;
        if (req.body.private_networking != undefined) opt2 = "&private_networking=" + req.body.drop_private_networking;
        if (req.body.backups_enabled != undefined) opt3 = "&backups_enabled=" + req.body.drop_backups_enabled;
        GET(digital + "new" + shark + req.body.client_id + ocean + req.body.drop_api_key + "&name=" + req.body.drop_name + "&size_id=" + req.body.drop_size_id + "&image_id=" + req.body.drop_image_id + "&region_id=" + req.body.drop_region_id + opt1 + opt2 + opt3, res);
    } else if (req.params.func == "list") {
        GET(digital + shark + req.body.client_id + ocean + req.body.drop_api_key, res);
    } else if (req.params.func == "resize") {
        GET(digital + req.body.droplet_id + "/" + req.params.func + shark + req.body.client_id + ocean + "&size_id=" + req.body.drop_size_id, res);
    } else if (req.params.func == "power_off") {
        GET(digital + req.body.droplet_id + "/power_off" + shark + req.body.client_id + ocean, res);
    } else if (req.params.func == "power_on") {
        GET(digital + req.body.droplet_id + "/power_on" + shark + req.body.client_id + ocean, res);
    } else if (req.params.func == "restore" || req.params.func == "rebuild") {
        GET(digital + req.body.droplet_id + "/" + req.params.func + shark + req.body.client_id + ocean + "&image_id=" + req.body.drop_image_id, res);
    } else if (req.params.func == "rename") {
        GET(digital + req.body.droplet_id + "/" + req.params.func + shark + req.body.client_id + ocean + "&name=" + req.body.drop_name, res);

    } else if (req.params.func == "rename") {
        var opt1 = ""
        if (req.body.drop_scrub_data != undefined) opt1 = "&scrub_data=" + req.body.drop_scrub_data;
        GET(digital + req.body.droplet_id + "/" + req.params.func + shark + req.body.client_id + ocean + req.body.drop_api_key + opt1, res);
    } else {
        GET(digital + req.body.droplet_id + "/" + req.params.func + shark + req.body.client_id + ocean + req.body.drop_api_key, res);
    }
});
app.post('/sendgrid/send', function(req, res) {
    var json = {
        api_user: sendgrid_user,
        api_key: sendgrid_key,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        from: req.body.from
    };

    $.ajax({
        url: "https://api.sendgrid.com/api/mail.send.json",
        type: "POST",
        dataType: "json",
        data: json,
        error: function(error) {
            res.send(400, {
                'message': error
            });
        },
        success: function(result, status) {
            res.send(status, result);
        }
    });
});

app.post('/twilio/sendmessage', function(req, res) {
    if (req.body.to.length < 10) req.body.to = "1" + req.body.to;
    if (req.body.to.indexOf('+') == -1) req.body.to = "+" + req.body.to;
    $.ajax({
        url: "https://api.twilio.com/2010-04-01/Accounts/ACe088ee6d17bce77541ba206263955b8b/Messages.json",
        type: "POST",
        dataType: "json",
        data: {
            From: "+16087290126",
            To: req.body.to,
            Body: req.body.message
        },
        username: "ACe088ee6d17bce77541ba206263955b8b",
        password: "9e730cd406c655aea6a7e644be15c0fe",
        error: function(error) {
            res.send(400, {
                'message': error
            });
        },
        success: function(result, status) {
            res.send(status, result);
        }
    });
});

app.post('/twitter/:function', function(req, res) {
    switch (req.params.function) {
        case 'tweet':
            twit.verifyCredentials(function(data) {
                console.log(util.inspect(data));
            }).updateStatus(req.body.message, function(data) {
                console.log(util.inspect(data));
                res.send(300, {
                    'data': data
                });
            });
            break;
        case 'feed':
            twit.get('/statuses/home_timeline.json', {
                include_entities: true
            }, function(data) {
                res.send(300, data);
            });
            break;
        case 'user':
            twit.get('/statuses/user_timeline.json', {
                include_entities: true
            }, function(data) {
                res.send(300, data);
            });
            break;
        case 'search':
            twit.get('/search/tweets.json?q=' + req.body.q+'&count='+req.body.count, {
                include_entities: true
            }, function(data) {
                res.send(300, data);
            });
            break;
        case 'sample':
            twit.get('/statuses/sample.json', {
                include_entites: true
            }, function(data) {
                res.send(300, data);
            });
    }
});
app.post('/whisper/:func', function(req, res) {
    switch (req.params.func) {
        case 'distance':
            if (req.body.limit == undefined) req.body.limit = 20;
            if (req.body.page == undefined) req.body.page = 0;
            if (req.body.include_topics == undefined) req.body.include_topics = true;
            GET(whisper + "whispers/nearby/distance/?lat=" + req.body.lat + "&lon=" + req.body.lon + "&limit=" + req.body.limit + "&page=" + req.body.page + "&include_topics=" + req.body.include_topics, res);
            break;
        case 'popular':
            if (req.body.limit == undefined) req.body.limit = 20;
            if (req.body.include_topics == undefined) req.body.include_topics = true;
            GET(whisper + "whispers/popular/popular/?before_wid=" + req.body.before_wid + "&limit=" + req.body.limit + "&include_topics=" + req.body.include_topics, res);
            break;
        case 'all_time':
            GET(whisper + "whispers/popular/all_time", res);
            break;
        case 'search':
            if (req.body.limit == undefined) req.body.limit = 20;
            if (req.body.feed_type == undefined) req.body.feed_type = "all";
            GET(whisper + "search/suggest/" + req.body.query + "/?limit=" + req.body.limit + "&type=" + req.body.feed_type, res);
            break;
        case 'feed':
            if (req.body.limit == undefined) req.body.limit = 20;
            if (req.body.feed_type == undefined) req.body.feed_type = "all";
            GET(whisper + "feeds/whispers/?feed_id=" + req.body.feed_id + "&before_wid=" + req.body.before_wid + "&limit=" + req.body.limit + "&feed_type=" + req.body.feed_type, res);
            break;
    }
});


//DropBox///////////////////////////////////////////////////////////////////////
app.post('/dropbox/:func', function(req, res) {
    if (req.params.func == "write") {
        dbclient.put(req.body.filename, req.body.content, {
            root: "dropbox",
            overwrite: "false"
        }, function(status, reply) {
            res.send(200, {
                'message': success
            });
        })
    }
});

app.post('/cnet/', function(req, res) {
    var url = 'http://developer.api.cnet.com/rest/v1.0/techProduct?productId=' + req.body.id + '&iod=none&viewType=json&partTag=43zw4zhq8adnxex35amrdbw4';
    GET(url, res);
});
//Reddit//////////////////////////////////////////////////////////////////////
app.post('/reddit/comment', function(req, res){
	reddit.login('BJ_Sargood', 'i ride the otter').end(function(err, user) {
		reddit.comment(req.body.thing_id, req.body.text, function(err, success){
			res.send(200, success);
			console.log("wat");
		});
	});
});


var GET = function(url, res) {
    console.log(url);
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        error: function(error) {
            res.send(400, {
                'message': "Bad Request"
            });
        },
        success: function(result, status) {
            res.send(status, result);
        }
    });
}
var GETcallback = function(url, res, sucs) {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(result, status) {
            sucs(result, status);
        },
        error: function(error) {
            res.send(400, {
                'message': "Bad Request"
            });
        }
    });
}



//URL bases///////////////////////////////////////////////////////////
var wunderground = "http://api.wunderground.com/api/cdde5330c637ed40/";
var rotten = "http://api.rottentomatoes.com/api/public/v1.0/movies";
var tomatoes = ".json?apikey=za85re4b6nxhqrhj55j5xtmp";
var espnsite = "http://api.espn.com/v1/";
var espnapikey = "q37qt8hvvk83u9ppwymr9d2g";
var digital = "https://api.digitalocean.com/droplets/";
var shark = "?client_id=";
var ocean = "";
var whisper = "https://hackproxy.whisper.sh/";
var sendgrid_key = "agressivepizza1";
var sendgrid_user = "apidash";

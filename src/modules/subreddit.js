module.config({
    'name': 'subreddit',
    'inputs': 'subreddit',
    'outputs': 'data',
    'category': 'Data Providers'
});

module.process(function() {
    var subreddit = module.input("subreddit");
    var data = {};
    utils.api('reddit/'+subreddit, data, function(data){
    	module.output('result', data);
    });
});

module.config({
    'name': 'Subreddit Posts',
    'inputs': 'subreddit',
    'outputs': 'posts',
    'category': 'Data Providers'
});

module.process(function() {
    var subreddit = module.input("subreddit");
    var data = {};
    utils.api('reddit/'+subreddit, data, function(data){
        if (data.data && data.data.children)
    	    module.send('posts', data.data.children);
    });
});

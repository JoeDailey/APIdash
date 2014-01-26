module.config({
    'name': 'Subreddit',
    'inputs': 'Subreddit',
    'outputs': 'data',
    'category': 'Data Providers'
});

module.process(function() {
    var subreddit = module.input("subreddit");
    var data = {};
    utils.api('reddit/' + subreddit, data, function(data) {
        module.output('result', data);
    });
});
module.config({
    'name': 'Reddit Post',
    'inputs': ['subreddit', 'page_string'],
    'outputs': 'data',
    'category': 'Data Providers'
});

module.process(function() {
    var subreddit = module.input("subreddit");
    var page_string = module.input("page_string");
    var postdata = {
        'page_string': page_string
    };
    utils.api('reddit/' + subreddit, postdata, function(data) {
        module.output('result', data);
    });
});
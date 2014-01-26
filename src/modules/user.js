module.config({
    'name': 'My Twitter User Feed',
    'outputs': 'user',
    'category': 'Data Providers'
});

module.process(function() {
    util.api('twitter/user', {}, function(data) {
        module.output('user', data);
    });
});
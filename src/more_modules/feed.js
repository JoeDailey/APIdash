module.config({
    'name': 'Your Twitter',
    'outputs': 'feed',
    'category': 'Data Providers'
});

module.process(function() {
    utils.api('twitter/feed', {}, function(data) {
        module.output('feed', data);
    });
});
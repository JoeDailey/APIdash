module.config({
    'name': 'Twitter Search',
    'inputs': ['q', 'count'],
    'outputs': 'results',
    'category': 'Data Providers'
});

module.process(function() {
    utils.api('twitter/search', {
        'q': module.input('q'),
        'count': module.input('count')
    }, function(data) {
        module.output('results', data);
    });
});
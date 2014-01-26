module.config({
	'name': 'Twitter Search',
	'inputs': ['q', 'count'],
	'outputs' : 'results'
});

module.process(function() {
	utils.api('twitter/search', {
		'q' : module.input('q'),
		'count' : module.input('count')
	}, function(data) {
		module.output('results',data);
	});
});

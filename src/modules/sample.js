module.config({
	'name':'Twitter Sample',
	'outputs':'tweets',
    'category': 'Data Providers'
});

module.process(function() {
	utils.api('twitter/sample', {} , function(data) {
		module.output('results',data);
	});
});

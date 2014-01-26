module.config({
	'name':'Twitter Sample',
	'outputs':'results'
});

module.process(function() {
	util.api('twitter/sample', {} , function(data) {
		module.output('results',data);
	});
});

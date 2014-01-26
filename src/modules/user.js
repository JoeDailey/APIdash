module.config({
	'name': 'User Feed',
	'outputs': 'user'
});

module.process(function() {
	util.api('twitter/user', {} , function(data) {
		module.output('user',data);
	});
});

module.config({
	'name': 'Your Feed',
	'outputs': 'feed'
});

module.process(function() {
	util.api('twitter/feed', {}, function(data) {
		module.output('feed',data);
	});
});

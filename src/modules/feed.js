module.config({
	'name': 'Your Feed',
	'outputs': 'feed'
});

module.process(function() {
	xhr = $.post('/twitter/feed');

	xhr.done(function(data)) {
		if (data) {
			module.send('feed',data);
		}
	});
});

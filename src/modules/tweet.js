module.config({
	'name': 'Send Tweet',
	'inputs': 'message'
});

module.process(function() {
	utils.api('twitter/tweet', {
		'message': module.input('message')
	}, function(){
		utils.notify("Tweet tweeted!");
	});
});

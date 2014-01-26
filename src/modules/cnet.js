
module.config({
	'name': 'Get Reviews',
	'inputs': 'id',
	'outputs' : 'review'
});

module.process(function() {
	xhr = $.post('/cnet/', {
		local: module.input('id')});

	xhr.done(function(data) {
		if (data.CNETResponse) {
			module.send('review',data.CNETResponse.TechProduct.ReviewURL);
		}
	});
});

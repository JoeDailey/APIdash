module.config({
    'name': 'Get CNET Reviews',
    'inputs': 'id',
    'outputs': 'review',
    'category': 'Data Providers'
});

module.process(function() {
    xhr = $.post('/cnet/', {
        local: module.input('id')
    });

    xhr.done(function(data) {
        if (data.CNETResponse) {
            module.send('review', data.CNETResponse.TechProduct.ReviewURL);
        }
    });
});
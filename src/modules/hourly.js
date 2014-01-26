module.config({
    'name': 'Hourly Forecast',
    'inputs': 'location',
    'outputs': 'hourly',
    'category': 'Data Providers'
});

module.process(function() {
    xhr = $.post('/wunderground/hourly', {
        local: module.input('location')
    });

    xhr.done(function(data) {
        if (data.forecast)
            module.send('hourly', data);
    });
});
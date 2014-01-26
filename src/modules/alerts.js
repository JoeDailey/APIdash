module.config({
    'name': 'Weather Alerts',
    'inputs': 'location',
    'outputs': 'alerts'
});

module.process(function() {
    xhr = $.post('/wunderground/alerts', {
        local: module.input('location')
    });

    xhr.done(function(data) {
        module.send('alerts', data.alerts[0].message);
    });
});
module.config({
    'name': 'Weather Alerts',
    'inputs': 'location',
    'outputs': 'alerts',
    'category': 'Data Providers'
});

module.process(function() {
  xhr = $.post('/wunderground/alerts', {
      local: module.input('location')});

    xhr.done(function(data) {
        if (!data.alerts)
            return;
        module.send('alerts', _.map(data.alerts, function(alert) {
            var msg = alert.message.split('...\n');
            return alert.date + ': ' + msg[0];
        }));
    });
});

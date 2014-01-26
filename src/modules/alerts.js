module.config({
    'name': 'Weather Alerts',
    'inputs': 'location',
    'outputs': 'alerts'
});

module.process(function() {
  xhr = $.post('/wunderground/alerts', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('alerts', data.alerts.description+ ' ' + data.alerts.expires);
  });
});

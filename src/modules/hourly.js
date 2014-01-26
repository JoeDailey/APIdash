module.config({
    'name': 'Today\'s Hourly',
    'inputs': 'location',
    'outputs': 'hourly'
});

module.process(function() {
  xhr = $.post('/wunderground/hourly', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
          module.send('hourly', data);
  });
});

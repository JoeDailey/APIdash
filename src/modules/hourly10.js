module.config({
    'name': 'Today\'s Hourly10',
    'inputs': 'location',
    'outputs': 'hourly10'
});

module.process(function() {
  xhr = $.post('/wunderground/hourly10', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('hourly10', data);
  });
});

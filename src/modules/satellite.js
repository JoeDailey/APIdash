module.config({
    'name': 'Satellite',
    'inputs': 'location',
    'outputs': 'satellite'
});

module.process(function() {
  xhr = $.post('/wunderground/satellite', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('satellite', data);
  });
});

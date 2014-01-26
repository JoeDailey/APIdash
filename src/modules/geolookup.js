module.config({
    'name': 'Today\'s Geolookup',
    'inputs': 'location',
    'outputs': 'geolookup'
});

module.process(function() {
  xhr = $.post('/wunderground/geolookup', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('geolookup', data);
  });
});

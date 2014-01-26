module.config({
    'name': 'Alamanac',
    'inputs': 'location',
    'outputs': 'forecast'
});

module.process(function() {
  xhr = $.post('/wunderground/almanac', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('almanac', data);
  });
});

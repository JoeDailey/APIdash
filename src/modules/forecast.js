module.config({
    'name': 'Wunderground',
    'inputs': 'location',
    'outputs': 'forecast'
});

module.process(function() {
  xhr = $.post('/wunderground/forecast', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('forecast', data.forecast.simpleforecast.forecastday);
  });
});

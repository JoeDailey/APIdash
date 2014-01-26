module.config({
    'name': 'Today\'s Rawtide',
    'inputs': 'location',
    'outputs': 'rawtide'
});

module.process(function() {
  xhr = $.post('/wunderground/rawtide', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('rawtide', data);
  });
});

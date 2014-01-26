module.config({
    'name': 'Yesterday',
    'inputs': 'location',
    'outputs': 'yesterday'
});

module.process(function() {
  xhr = $.post('/wunderground/yesterday', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('yesterday', data);
  });
});

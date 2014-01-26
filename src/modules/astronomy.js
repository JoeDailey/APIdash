module.config({
    'name': 'Astronomy',
    'inputs': 'location',
    'outputs': 'astronomy'
});

module.process(function() {
  xhr = $.post('/wunderground/astronomy', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('astronomy', data);
  });
});

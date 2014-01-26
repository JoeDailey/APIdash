module.config({
    'name': 'Today\'s webcam',
    'inputs': 'location',
    'outputs': 'webcam'
});

module.process(function() {
  xhr = $.post('/wunderground/webcam', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('webcam', data);
  });
});

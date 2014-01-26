module.config({
    'name': 'Today\'s History',
    'inputs': 'location',
    'outputs': 'history'
});

module.process(function() {
  xhr = $.post('/wunderground/history', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('history', data);
  });
});

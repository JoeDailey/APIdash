module.config({
    'name': 'Today\'s Tide',
    'inputs': 'location',
    'outputs': 'tide'
});

module.process(function() {
  xhr = $.post('/wunderground/tide', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('tide', data);
  });
});

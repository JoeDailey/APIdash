module.config({
    'name': 'Today\'s Planner',
    'inputs': 'location',
    'outputs': 'planner'
});

module.process(function() {
  xhr = $.post('/wunderground/planner', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('planner', data);
  });
});

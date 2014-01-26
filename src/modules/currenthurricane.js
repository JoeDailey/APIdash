module.config({
    'name': 'Current Hurricane',
    'inputs': 'location',
    'outputs': 'currenthurricane'
});

module.process(function() {
  xhr = $.post('/wunderground/currenthurricane', {
      local: module.input('location')});

  xhr.done(function(data) {
      if (data.forecast)
      module.send('currenthurricane', data.currenthurricane);
  });
});

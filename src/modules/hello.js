
module.config({
    'name': 'Hello',
    'outputs': 'out'
});

module.process(function() {
    module.send('out', 'hello');
});

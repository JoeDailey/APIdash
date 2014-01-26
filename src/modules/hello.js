module.config({
    'name': 'Hello World',
    'outputs': 'out'
});

module.process(function() {
    module.send('out', 'Hello, World!');
});
module.config({
    'name': 'Hello World',
    'outputs': 'out',
    'category': 'Misc'
});

module.process(function() {
    module.send('out', 'Hello, World!');
});

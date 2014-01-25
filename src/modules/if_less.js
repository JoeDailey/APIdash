
module.config({
    'name': 'If A < B send A',
    'inputs': ['A', 'B'],
    'outputs': 'A'
});

module.process(function() {
    var a = module.input('A');
    var b = module.input('B');

    if (utils.compare(a, b) < 0)
        module.send('A', a);
});

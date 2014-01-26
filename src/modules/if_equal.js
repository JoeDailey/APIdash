module.config({
    'name': 'If A==B send A',
    'inputs': ['A', 'B'],
    'outputs': 'A',
    'category': 'Logic'
});

module.process(function() {
    var out = null;
    var a = module.input("A");
    var b = module.input("B");
    if (utils.equal(a, b))
        module.send('A', a);
});

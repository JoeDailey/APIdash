module.config({
    'name': 'If A Contains B',
    'inputs': ['A', 'B'],
    'outputs': 'A',
    'category': 'Logic'
});

module.process(function() {
    var a = module.input('A').toString().toLowerCase(),
        b = module.input('B').toString().toLowerCase();
    if (a.indexOf(b) != -1) {
        module.send("A", module.input("A"));
    }
});

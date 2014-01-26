module.config({
    'name': 'If A < B send A',
    'inputs': ['A', 'B'],
    'outputs': 'A',
    'category': 'Logic'
});

module.process(function() {
    var out = null;
    var a = Number(module.input("A"));
    var b = Number(module.input("B"));
    if (a < b) {
        module.send("A", module.input("A"));
    }
});

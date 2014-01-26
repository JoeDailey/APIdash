module.config({
    'name': 'If A Contains B',
    'inputs': ['A', 'B'],
    'outputs': 'A',
    'category': 'Logic'
});

module.process(function() {
    if (module.input("A").toLowerCase().indexOf(module.input("B").toLowerCase()) != -1) {
        module.send("A", module.input("A"));
    }
});
module.config({
    'name': 'If A Equal To B',
    'inputs': ['A', 'B'],
    'outputs': 'A',
    'category': 'adsadasd'
});

module.process(function() {
    var out = null;
    var a = Number(module.input("A"));
    var b = Number(module.input("B"));
    if (a == b || module.input("A") === module.input("B")) {
        module.send("A", module.input("A"));
    }
});

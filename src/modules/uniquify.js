module.config({
    'name': 'Uniquify',
    'inputs': 'data',
    'outputs': 'data'
});

module.process(function() {
    if (module.input("data") != module.last) {
        module.last = module.input("data");
        module.send("data", module.input("data"));
    }
});
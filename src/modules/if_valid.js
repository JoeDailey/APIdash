module.config({
    'name': 'If Trigger Send A',
    'inputs': ['Trigger', 'A'],
    'outputs': 'A',
    'category': 'adsadasd'
});

module.process(function() {
    if (module.input("Trigger")) {
        module.send("A", module.input("A"));
    }
});
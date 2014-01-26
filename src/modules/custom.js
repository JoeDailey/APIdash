module.config({
    'name': 'Custom Module',
    'inputs': ['input'],
    'outputs': ['output'],
    'category': 'Misc'
});

module.process(function() {
    module.send('output', module.input("input"));
});
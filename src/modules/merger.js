module.config({
    'name': 'Merger',
    'inputs': ['data1', 'data2', 'data3'],
    'outputs': 'data'
});

module.process(function() {
    module.send('data', module.input("data1") + module.input("data2") + module.input("data3"));
});
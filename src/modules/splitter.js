module.config({
    'name': 'Splitter',
    'inputs': 'data',
    'outputs': ['data1', 'data2', 'data3'],
    'category': 'Processors'
});

module.process(function() {
    module.send('data1', module.input("data"));
    module.send('data2', module.input("data"));
    module.send('data3', module.input("data"));
});

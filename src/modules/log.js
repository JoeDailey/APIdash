

module.config({
    'name': 'Log to Console',
    'inputs': 'data'
});

module.process(function() {
    console.log(module.input('data'));
});

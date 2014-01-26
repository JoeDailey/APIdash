

module.config({
    'name': 'Log to Console',
    'inputs': 'data',
    'category': 'Actions'
});

module.process(function() {
    console.log(module.input('data'));
    utils.notify(module.input("data"));
});

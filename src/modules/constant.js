
module.config({
    'name': 'Fixed Value',
    'outputs': ['out'],
    'fixed': true
});

module.process(function() {
    module.send('out', module.fixedValue);
});

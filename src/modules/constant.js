
module.config({
    'name': 'Fixed Value',
    'outputs': ['out'],
    'fixed': true,
    'category': 'Misc'
});

module.process(function() {
    module.send('out', module.fixedValue);
});

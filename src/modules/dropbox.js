module.config({
    'name': 'Save To Dropbox',
    'inputs': ['filename', 'content'],
    'category': "Actions"
});

module.process(function() {
    utils.api('dropbox/write', {
        'filename': module.input("filename"),
        'content': module.input('content')
    }, function() {
        utils.notify("Successfully saved " + module.input('filename'));
    });
});
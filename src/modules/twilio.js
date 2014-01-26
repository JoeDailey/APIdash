
module.config({
    'name': 'Send Text',
    'inputs': ['to', 'message']
});

module.process(function() {
    utils.api('twilio/sendmessage', {
        'to': module.input('to'),
        'message': module.input('message')
    });
});

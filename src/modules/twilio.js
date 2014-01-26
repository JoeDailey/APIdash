
module.config({
    'name': 'Send Text',
    'inputs': ['to', 'message'],
    'category': 'Actions'
});

module.process(function() {
    var inp = module.input('to');
    if (inp.length > 0 && inp.charAt(0) != '+')
        inp = '+1' + inp;

    utils.api('twilio/sendmessage', {
        'to': inp,
        'message': module.input('message')
    }, function() {
        utils.notify("Successfully texted " + module.input('to'));
    });
});

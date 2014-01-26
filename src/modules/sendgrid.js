
module.config({
    'name': 'Send Email',
    'inputs': ['to', 'subject', 'body', 'from'],
    'category': 'Actions'
});

module.process(function() {
    utils.api('sendgrid/send', {
        'to': module.input('to'),
        'subject': module.input('subject'),
        'text': module.input('body'),
        'from': module.input('from')
    }, function(){
    	utils.notify("Email sent to " + module.input('to') + ".");
    });
});

module.config({
    'name': 'Text To Speech',
    'inputs': 'data',
    'category': 'Actions'
});

module.process(function() {
    speak(module.input("data").toString(), {
        wordgap: 1,
        speed: 150
    });
});

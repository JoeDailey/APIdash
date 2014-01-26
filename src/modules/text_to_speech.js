module.config({
    'name': 'Text To Speech',
    'inputs': 'data'
});

module.process(function() {
    speak(module.input("data"), {
        wordgap: 1,
        speed: 150
    });
});
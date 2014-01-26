module.config({
    'name': 'ESPN Headline',
    'outputs': ['headline']
});

module.process(function() {
    xhr = $.post('/espn/headlines', {});

    xhr.done(function(data) {
        module.send("headline", data[0].headline);
    });
});
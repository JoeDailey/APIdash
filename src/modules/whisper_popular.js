module.config({
    'name': 'Get Popular Whisper',
    'outputs': ['text', 'nickname', 'replies', 'shouts', 'image'],
    'category': 'Data Providers'
});

module.process(function() {
    xhr = $.post('/whisper/popular', {
        before_wid: 99999999,
        limit: 100
    });

    xhr.done(function(data) {
        var whisper = data.popular[Math.floor(Math.random() * 100)];
        console.log(whisper);
        module.send("text", whisper.text);
        module.send("nickname", whisper.nickname);
        module.send("replies", whisper.replies);
        module.send("shouts", whisper.shouts);
        module.send("image", whisper.url);
    });
});
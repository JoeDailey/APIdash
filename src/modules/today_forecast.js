module.config({
    'name': 'Today\'s Forecast',
    'inputs': 'location',
    'outputs': ['high (F)', 'low (F)', 'wind (MPH)', 'humidity', 'rain (in)', 'snow (in)', 'condition']
});

module.process(function() {
    xhr = $.post('/wunderground/forecast', {
        local: module.input('location')
    });

    xhr.done(function(data) {
        if (data.forecast) {
            var day = data.forecast.simpleforecast.forecastday[0];
            module.send('high (F)', day.high.fahrenheit);
            module.send('low (F)', day.low.fahrenheit);
            module.send('wind (MPH)', day.avewind.mph);
            module.send('humidity', day.avehumidity);
            module.send('rain (in)', day.qpf_allday['in']);
            module.send('snow (in)', day.snow_allday['in']);
            module.send('condition', day.conditions);
        }
    });
});
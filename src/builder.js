(function() {

    var G = createjs;

    var createStage = function(width, height) {
        var canvas = $('<canvas width="'+width+'" height="'+height+'"></canvas>').get(0);
        var ctx = canvas.getContext('2d');

        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                      ctx.mozBackingStorePixelRatio ||
                      ctx.msBackingStorePixelRatio ||
                      ctx.oBackingStorePixelRatio ||
                      ctx.backingStorePixelRatio || 1;

        var ratio = devicePixelRatio / backingStoreRatio;

        if (ratio != 1) {
            var oldWidth = canvas.width;
            var oldHeight = canvas.height;
            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;
            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';
        }

        var stage = new G.Stage(canvas);
        stage.scaleX = stage.scaleY = ratio;
        stage.canvas = canvas;
        stage.ratio = ratio;
        return stage;
    };

    //------------------------------------------------------
    // MODULE INSTANCE
    //------------------------------------------------------
    var addModule = function(mod, stage) {

        var titleHeight = 25,
            bodyWidth = 120,
            connWidth = 70,
            connHeight = 18,
            connSpace = connHeight + 7,
            pinMargin = 3,
            pinRadius = (connHeight - pinMargin * 2) / 2,
            connProtrude = pinRadius * 2 + 4;

        var size = Math.max(mod.inputList.length, mod.outputList.length);

        var c = new G.Container;
        c.cursor = 'pointer';
        c.x = 50;
        c.y = 50;
        stage.addChild(c);

        var body = new G.Shape;
        c.addChild(body);

        // using vector drawing shortcuts
        // f = fill, ss = stroke size, s = begin stroke, r = rect
        // ef = end fill, es = end stroke.
        // http://www.createjs.com/Docs/EaselJS/classes/Graphics.html
        body.graphics.f('#ABCDEF').ss(1).s('#000')
            .r(connProtrude, 0, bodyWidth, titleHeight + connSpace * size)
            .ef().es();

        var t = new G.Text(mod.name, '10px verdana', '#000');
        t.x = connProtrude + bodyWidth / 2;
        t.y = titleHeight / 2;
        t.regX = t.getBounds().width / 2;
        t.regY = t.getBounds().height / 2;
        c.addChild(t);

        var createPort = function(name, isInput) {
            var port = new G.Container;
            var s = new G.Shape();

            s.graphics.f('#abcdef').ss(1).s('#00');

            var rad = connHeight / 2;
            if (isInput)
                s.graphics.drawRoundRectComplex(0, 0, connWidth, connHeight, rad, 0, 0, rad);
            else
                s.graphics.drawRoundRectComplex(0, 0, connWidth, connHeight, 0, rad, rad, 0);

            port.addChild(s);

            var pin = new G.Shape;
            pin.graphics.f('#777');
            if (isInput)
                pin.graphics.drawCircle(pinMargin + pinRadius, pinRadius + pinMargin, pinRadius).ef();
            else
                pin.graphics.drawCircle(connWidth - pinRadius - pinMargin, pinRadius + pinMargin, pinRadius).ef();

            port.addChild(pin);

            var text = new G.Text(name, '10px verdana', '#000');
            text.y = connHeight / 2 - 1;
            text.regY = text.getBounds().height / 2;
            text.x = isInput ? connWidth - text.getBounds().width - 5 : 5;
            port.addChild(text);

            return port;
        };

        var inputs = [], outputs = [];

        _.each(mod.inputList, function(name, i) {
            var p = createPort(name, true);
            p.y = titleHeight + connSpace * i;
            c.addChild(p);
        });

        _.each(mod.outputList, function(name, i) {
            var p = createPort(name, false);
            p.x = connProtrude + bodyWidth - (connWidth - connProtrude);
            p.y = titleHeight + connSpace * i;
            c.addChild(p);
        });

        dragOffset = {'x': 0, 'y': 0};
        c.on('mousedown', function (evt) {
            dragOffset.x = c.x - evt.stageX / stage.ratio;
            dragOffset.y = c.y - evt.stageY / stage.ratio;
        });
        c.on('pressmove', function (evt) {
            c.x = evt.stageX / stage.ratio + dragOffset.x;
            c.y = evt.stageY / stage.ratio + dragOffset.y;
        });
    };

    //------------------------------------------------------
    // BUILDER
    //------------------------------------------------------
    exports.createBuilder = function(container) {
        var stage = createStage(640, 480);
        stage.enableMouseOver();

        container = $(container).append(stage.canvas).append(
            '<div id="builder-modules"></div>');

        loadBuiltinModules('/static/builtin_modules.txt', function(factories) {
            _.each(factories, function (fact) {
                var btn = $("<button>" + fact.name + "</button>");
                $("#builder-modules").append(btn);
                btn.click(function() {
                    addModule(fact.create(), stage);
                });
            });
        });

        G.Ticker.setFPS(35);
        G.Ticker.addEventListener('tick', function() {
            stage.update();
        });
    };

})();

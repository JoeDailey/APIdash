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
        stage.ctx = ctx;
        stage.ratio = ratio;
        return stage;
    };

    var titleHeight = 25,
        bodyWidth = 120,
        connWidth = 70,
        connHeight = 20,
        connSpace = connHeight + 4,
        pinMargin = 3,
        pinRadius = (connHeight - pinMargin * 2) / 2,
        connProtrude = pinRadius * 2 + 4;

    var BuilderPort = function(module, name, isInput) {
        this.module = module;
        this.isInput = isInput;
        this.name = name;

        var c = this.container = new G.Container;

        var s = new G.Shape();
        s.graphics.f('#abcdef').ss(1).s('#000');
        var rad = connHeight / 2;
        if (isInput)
            s.graphics.drawRoundRectComplex(0, 0, connWidth, connHeight, rad, 0, 0, rad);
        else
            s.graphics.drawRoundRectComplex(0, 0, connWidth, connHeight, 0, rad, rad, 0);

        c.addChild(s);

        var pin = this.pin = new G.Shape;
        pin.graphics.f('#777').drawCircle(0, 0, pinRadius).ef();
        if (isInput) {
            pin.x = pinMargin + pinRadius;
            pin.y = pinRadius + pinMargin;
        } else {
            pin.x = connWidth - pinRadius - pinMargin;
            pin.y = pinRadius + pinMargin;
        }

        c.addChild(pin);

        var text = new G.Text(name, '10px verdana', '#000');
        text.y = connHeight / 2 - 1;
        text.regY = text.getBounds().height / 2;
        text.x = isInput ? connWidth - text.getBounds().width - 5 : 5;
        c.addChild(text);
    };

    BuilderPort.prototype.pinPos = function() {
        var pt = this.pin.localToGlobal(0, 0);
        pt.x /= 2;
        pt.y /= 2;
        return pt;
    };

    //------------------------------------------------------
    // MODULE INSTANCE
    //------------------------------------------------------
    var BuilderModule = function(mod, stage) {

        this.module = mod;
        var c = this.container = new G.Container;
        c.cursor = 'pointer';
        c.x = 50;
        c.y = 50;
        stage.addChild(c);
        this.ports = [];
        this.update();

        var self = this;
        this.module.onChange = function(portsChanged) {
            if (portsChanged)
                self.update();
            else
                self.text.text = self.module.name;
        };
    };

    BuilderModule.prototype.update = function() {

        var size = Math.max(this.module.inputList.length, this.module.outputList.length);

        var c = this.container;
        c.removeAllChildren();

        _.each(this.ports, function (port) {
            if (port.wire)
                port.wire.remove();
        });

        var body = new G.Shape;
        c.addChild(body);

        // using vector drawing shortcuts
        // f = fill, ss = stroke size, s = begin stroke, r = rect
        // ef = end fill, es = end stroke.
        // http://www.createjs.com/Docs/EaselJS/classes/Graphics.html
        body.graphics.f('#ABCDEF').ss(1).s('#000')
            .drawRoundRectComplex(connProtrude, 0, bodyWidth, titleHeight + connSpace * size, 5, 5, 0, 0)
            .ef().es();

        var t = new G.Text(this.module.name, '10px verdana', '#000');
        t.x = connProtrude + bodyWidth / 2;
        t.y = titleHeight / 2;
        t.regX = t.getBounds().width / 2;
        t.regY = t.getBounds().height / 2;
        c.addChild(t);
        this.text = t;

        var ports = this.ports = [];

        var self = this;
        _.each(this.module.inputList, function(name, i) {
            var b = new BuilderPort(self.module, name, true);
            ports.push(b);
            b.container.y = titleHeight + connSpace * i;
            c.addChild(b.container);
        });

        _.each(this.module.outputList, function(name, i) {
            var b = new BuilderPort(self.module, name, false);
            ports.push(b);
            b.container.x = connProtrude + bodyWidth - (connWidth - connProtrude);
            b.container.y = titleHeight + connSpace * i;
            c.addChild(b.container);
        });
    };

    var drawWire = function(g, fromx, fromy, tox, toy) {
        g.clear();

        g.f('#444').drawCircle(fromx, fromy, pinRadius)
            .drawCircle(tox, toy, pinRadius).ef();

        g.ss(pinRadius).s('#444')
            .moveTo(fromx, fromy)
            .bezierCurveTo(
                (fromx * 1 + tox * 1) / 2,
                fromy,
                (fromx * 1 + tox * 1) / 2,
                toy,
                tox,
                toy);
    };

    var Wire = function(from, to) {
        this.from = from;
        this.to = to;
        this.from.wire = this;
        this.to.wire = this;
        this.container = new G.Shape();
        this.container.hitArea = null;
        this.g = this.container.graphics;
        this.update();
        this.conn = new Connection(from.module, from.name, to.module, to.name);
    };

    Wire.prototype.update = function() {
        var frompos = this.from.pinPos(),
            topos = this.to.pinPos();
        drawWire(this.g, frompos.x, frompos.y, topos.x, topos.y);
    };

    Wire.prototype.remove = function() {
        this.from.wire = null;
        this.to.wire = null;
        this.conn.remove();
        this.container.parent.removeChild(this.container);
    };

    //------------------------------------------------------
    // BUILDER
    //------------------------------------------------------
    exports.createBuilder = function(elem) {
        var stage = createStage(640, 480);
        stage.width = 640;
        stage.height = 480;
        stage.enableMouseOver();

        $(elem).append(stage.canvas).append(
            '<div id="builder-modules"></div>');

        var container = new G.Container;
        container.ratio = stage.ratio;
        stage.addChild(container);

        var wireContainer = new G.Container;
        stage.addChild(wireContainer);

        var bg = new G.Shape;
        bg.graphics.f('#ccc').r(0, 0, 640, 480);
        container.addChild(bg);

        var srcPort = null;
        var wire = new G.Shape;
        wireContainer.addChild(wire);
        wireContainer.mouseEnabled = false;

        var clearWiring = function() {
            wire.graphics.clear();
            srcPort = null;
        };

        stage.on('stagemousemove', function (evt) {
            if (srcPort) {
                var pos = srcPort.pinPos();
                drawWire(wire.graphics, pos.x, pos.y, evt.stageX / stage.ratio, evt.stageY / stage.ratio);
            }
        });

        stage.on('click', clearWiring);

        var editing = null, oldCode = '';

        var setupPorts = function(bm) {
            _.each(bm.ports, function (port) {
                if (port.pin.hasEventListener("click"))
                    return;
                port.pin.on("click", function (evt) {

                    evt.stopPropagation();
                    if (!srcPort) {
                        if (port.wire)
                            port.wire.remove();
                        srcPort = port;
                    } else {
                        if (!srcPort || srcPort == port || srcPort.isInput == port.isInput) {
                            clearWiring();
                            return;
                        }
                        if (port.wire)
                            port.wire.remove();
                        var w = new Wire(srcPort, port);
                        wireContainer.addChild(w.container);
                        clearWiring();
                    }
                });
            });
        };

        var modules = [];

        var addModule = function(module) {
            var b = new BuilderModule(module, container);
            modules.push(b);
            setupPorts(b);
            dragOffset = {'x': 0, 'y': 0};
            b.container.on('mousedown', function (evt) {
                dragOffset.x = b.container.x - evt.stageX / stage.ratio;
                dragOffset.y = b.container.y - evt.stageY / stage.ratio;
            });
            b.container.on('pressmove', function (evt) {
                b.container.x = evt.stageX / stage.ratio + dragOffset.x;
                b.container.y = evt.stageY / stage.ratio + dragOffset.y;
                _.each(b.ports, function (port) {
                    if (port.wire)
                        port.wire.update();
                });
            });

            b.container.on('dblclick', function (evt) {
                $("#codemodal").dialog('open');
                $("#codemodal textarea").val(b.module.source);
                oldCode = b.module.source;
                editing = b;
            });
        };

        $("#codemodal textarea").keyup(function() {
            if (!editing)
                return;
            var source = $("#codemodal textarea").val();
            if (source == oldCode)
                return;
            editing.module.source = source;
            try {
                editing.module.compile();
                setupPorts(editing);
                $("#codemodal textarea").removeClass("error");
            } catch (err) {
                $("#codemodal textarea").addClass("error");
            };
        });

        loadBuiltinModules('/static/builtin_modules.txt', function(factories) {
            _.each(factories, function (fact) {
                var btn = $("<button>" + fact.name + "</button>");
                $("#builder-modules").append(btn);
                btn.click(function() {
                    addModule(fact.create());
                });
            });
        });

        G.Ticker.setFPS(35);
        G.Ticker.addEventListener('tick', function() {
            stage.update();
        });


        $('#run').click(function() {
            var r = new ModuleRunner(_.map(modules, function(m) { return m.module }));
            r.run();
        });
    };

})();

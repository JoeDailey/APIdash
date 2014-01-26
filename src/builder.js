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
        connWidth = 82,
        connHeight = 20,
        connSpace = connHeight + 4,
        pinMargin = 3,
        pinRadius = (connHeight - pinMargin * 2) / 2,
        connProtrude = pinRadius * 2 + 10;

    var fixedWidth = 180,
        fixedHeight = 23;

    var BuilderPort = function(module, name, isInput) {
        this.module = module;
        this.isInput = isInput;
        this.name = name;

        var c = this.container = new G.Container;
        //long thing
        var s = this.s = new G.Shape();
        s.graphics.f('#98b7ef');
        var rad = connHeight / 2;
        /*
        if (isInput)
            s.graphics.drawRoundRectComplex(0, 0, connWidth, connHeight, rad, 0, 0, rad);
        else
            s.graphics.drawRoundRectComplex(0, 0, connWidth, connHeight, 0, rad, rad, 0);
         */
        if (name)
            s.graphics.drawRoundRect(0, 0, connWidth, connHeight, rad);
        else
            s.graphics.drawRoundRect(0, 0, fixedWidth, fixedHeight, rad);
        c.addChild(s);

        var pin = this.pin = new G.Shape;
        pin.graphics.f('#759eda').drawCircle(0, 0, pinRadius).ef();
        if (isInput) {
            pin.x = pinMargin + pinRadius;
            pin.y = pinRadius + pinMargin;
        } else {
            pin.x = connWidth - pinRadius - pinMargin;
            pin.y = pinRadius + pinMargin;
        }

        if (!name) {
            pin.x = fixedWidth - pinRadius - pinMargin;
            pin.y += 2;
        }

        pin.shadow = new G.Shadow('#666', 1, 1, 1);
        s.shadow = new G.Shadow('#666', 1, 1, 1);

        c.addChild(pin);

        if (name) {
            var text = new G.Text(name, '10px verdana', '#000');
            text.y = connHeight / 2 - 1;
            text.regY = text.getBounds().height / 2;
            text.x = isInput ? connWidth - text.getBounds().width - 5 : 5;
            c.addChild(text);
            text.mouseEnabled = false;
        }
        pin.mouseEnabled = false;
    };

    BuilderPort.prototype.pinPos = function() {
        var pt = this.pin.localToGlobal(0, 0);
        pt.x /= this.container.getStage().ratio;
        pt.y /= this.container.getStage().ratio;
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

        // delete button
        var del = this.delbtn = new G.Shape;
        del.graphics.ss(3).s('#333').moveTo(0, 0).lineTo(8, 8)
            .moveTo(8, 0).lineTo(0, 8).es();
        var hit = new G.Shape;
        hit.graphics.beginFill('#000').drawRect(-2, -2, 10, 10);
        del.hitArea = hit;
        del.alpha = 0.7;
        del.on('mouseover', function() { del.alpha = 1; });
        del.on('mouseout', function() { del.alpha = 0.7; });

        var self = this;
        var setupNonFixed = function() {
            self.module.onChange = function(portsChanged) {
                if (portsChanged)
                    self.update();
                else
                    self.text.text = self.module.name;
            };
            del.x = connProtrude + bodyWidth - 13;
            del.y = 5;
            self.update();
        };

        var setupFixed = function() {
            self.port = new BuilderPort(mod, '', false);
            self.port.name = 'out';
            self.ports = [self.port];
            c.addChild(self.port.container);

            mod.fixedValue = 'value';

            var elem = $('<div class="inp"><input type="text" value="value" style="width: 135px;" /></div>');
            elem.prependTo($('#container'));
            elem.keyup(function() {
                mod.fixedValue = elem.children('input').val();
            });

            var ratio = stage.getStage().ratio;

            var dom = new G.DOMElement(elem.get(0));
            dom.scaleX = dom.scaleY = 1 / ratio;

            dom.addEventListener('tick', function() {
                dom.x = (c.x + 24) / ratio;
                dom.y = (c.y + 0.5) / ratio;
            });
            dom.mouseEnabled = false;
            c.getStage().addChild(dom);

            var block = new G.Shape();
            block.alpha = 0.01;
            block.graphics.f('#fff').drawRect(0, 0, 24, fixedHeight);
            c.addChild(block);
        };

        if (mod.fixed)
            setupFixed();
        else
            setupNonFixed();

    };

    BuilderModule.prototype.removeConnections = function() {
        _.each(this.ports, function (port) {
            if (port.wire)
                port.wire.remove();
        });
    };

    BuilderModule.prototype.update = function() {

        var size = Math.max(this.module.inputList.length, this.module.outputList.length);

        var c = this.container;
        c.removeAllChildren();
        this.removeConnections();

        var body = new G.Shape;
        c.addChild(body);

        c.addChild(this.delbtn);

        // Using drawing shortcuts
        // f = fill, ss = stroke size, s = begin stroke, r = rect
        // ef = end fill, es = end stroke.
        // http://www.createjs.com/Docs/EaselJS/classes/Graphics.html
        body.graphics.f('#759eda')
            .drawRoundRect(connProtrude, 0, bodyWidth, titleHeight + connSpace * size, 5)
            .ef().es();

        body.shadow = new G.Shadow('#666', 1, 1, 1);

        var t = new G.Text(this.module.name, '10px verdana', '#000');
        t.x = connProtrude + 5;
        t.y = titleHeight / 2 - 2;
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

    var FixedValue = function() {

    };

    var drawWire = function(g, fromx, fromy, tox, toy) {
        g.clear();

        g.f('#666').drawCircle(fromx, fromy, pinRadius)
            .drawCircle(tox, toy, pinRadius).ef();

        g.ss(pinRadius).s('#666')
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
        var self = this;
        this.conn.onValue = function() {
            self.container.alpha = 0.7;
            G.Tween.get(self.container).to({alpha: 1}, 750);
        };
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
        var stage = createStage(1024, 650);
        stage.width = 1024;
        stage.height = 650;
        stage.enableMouseOver();

        $(elem).append(stage.canvas);

        var container = new G.Container;
        container.ratio = stage.ratio;
        stage.addChild(container);

        var wireContainer = new G.Container;
        stage.addChild(wireContainer);

        var bg = new G.Shape;
        bg.graphics.f('#f9f9f9').r(0, 0, stage.width, stage.height);
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
                if (port.s.hasEventListener("click"))
                    return;
                port.s.on("click", function (evt) {

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

                        var w;
                        if (port.isInput)
                            w = new Wire(srcPort, port);
                        else
                            w = new Wire(port, srcPort);

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

            !b.fixed && b.container.on('dblclick', function (evt) {
                $("#codemodal").dialog('open');
                $("#codemodal textarea").val(b.module.source);
                oldCode = b.module.source;
                editing = b;
            });

            b.delbtn.on('click', function() {
                container.removeChild(b.container);
                b.removeConnections();
                modules = _.without(modules, b);
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

            var cats = {};
            _.each(factories, function (mod) {
                cats[mod.category] = cats[mod.category] || [];
                cats[mod.category].push(mod);
            });

            var openedCat = null,
                sortedCats = _.keys(cats);
            sortedCats.sort();

            _.each(sortedCats, function (catName) {
                var mods = cats[catName];
                var cat = $('<button class="menu">' + catName + '</button>').appendTo($('#left-main-panel'));

                var submenu = $('<div></div>').appendTo($('#left-sub-panel'));
                _.each(mods, function(mod) {
                    btn = $('<button>' + mod.name + '</button>').appendTo(submenu);
                    btn.click(function() {
                        addModule(mod.create());
                    });
                });

                cat.click(function() {
                    $('#left-sub-panel div').hide();
                    if (openedCat != cat) {
                        submenu.show();
                        openedCat = cat;
                    } else
                        openedCat = null;
                });
            });

            $("#left-main-panel").append($('<button id="run">Run</button>'));

        });

        G.Ticker.setFPS(30);
        G.Ticker.addEventListener('tick', function() {
            stage.update();
        });

        $('#run').click(function() {
            var r = new ModuleRunner(_.map(modules, function(m) { return m.module }));
            r.run();
        });
    };

})();

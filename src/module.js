
var Connection = function(from, fromName, to, toName) {
    this.from = from;
    this.to = to;
    this.fromName = fromName;
    this.toName = toName;
    from.outputs[fromName] = this;
    to.inputs[toName] = this;

    this.val = null;
};

Connection.prototype.remove = function() {
    this.from.outputs[this.fromName] = null;
    this.to.inputs[this.toName] = null;
};

Connection.prototype.hasValue = function() {
    return this.val != null;
};

Connection.prototype.setVal = function(val) {
    this.val = val;
};

Connection.prototype.getValue = function() {
    return this.val;
};

var Module = function() {
    this.name = "Untitled Module";

    // mapping from input/output name to a Connection instance;
    this.inputs = {};
    this.outputs = {};

    // array of input/output names (so we know what order they're in)
    this.inputList = [];
    this.outputList = [];

    this.func = null;
    this.source = "";

    this.onChange = function() {};

    this.fired = false;
};

Module.prototype.input = function(key) {
    return this.inputs[key].val;
};

Module.prototype.send = function(output, data) {
    this.outputs[output].setVal(data);
};

Module.prototype.hasValidInputs = function() {
    var self = this;
    return _.every(this.inputs, function(conn) {
        return conn.hasValue();
    });
};

Module.prototype.run = function() {
    this.func();
};

Module.prototype.config = function(obj) {
    var self = this;
    self.name = obj.name;

    obj.inputs = obj.inputs || [];
    obj.outputs = obj.outputs || [];

    if (!_.isArray(obj.inputs)) obj.inputs = [obj.inputs];
    if (!_.isArray(obj.outputs)) obj.outputs = [obj.outputs];

    if (JSON.stringify(obj.inputs)==JSON.stringify(self.inputList) &&
        JSON.stringify(obj.outputs)==JSON.stringify(self.outputList))
        return;

    _.each(obj.inputs, function(inp) {
        self.inputs[inp] = null;
    });
    _.each(obj.outputs, function(out) {
        self.outputs[out] = null;
    });

    this.inputList = obj.inputs;
    this.outputList = obj.outputs;
};

/* set the module's function to execute */
Module.prototype.process = function(func) {
    this.func = func || function() {};
};

/* retrieve an input by name */
Module.prototype.input = function(name) {
    return this.inputs[name].getValue();
};

Module.prototype.compile = function() {
    var script = "with (scope) {\n" + this.source + "\n}";
    script = Function('scope', script);

    var oldInputs = this.inputList,
        oldOutputs = this.outputList;

    script({
        'module': this,
        'utils': ModuleUtils
    });

    if (JSON.stringify(oldInputs)!=JSON.stringify(this.inputList) ||
        JSON.stringify(oldOutputs)!=JSON.stringify(this.outputList))
        this.onChange(true);
    else
        this.onChange(false);
};

Module.prototype.create = function() {
    var mod = new Module;
    mod.source = this.source;
    mod.compile();
    return mod;
};

var ModuleRunner = exports.ModuleRunner = function(modules) {
    this.modules = modules;
    _.each(modules, function(mod) { mod.fired = false; });
};

ModuleRunner.prototype.run = function() {
    var more = true;
    while (more) {
        more = false;
        _.each(this.modules, function(module) {
            if (module.hasValidInputs() && !module.fired) {
                module.run();
                more = true;
                module.fired = true;
            }
        });
    };
};

var loadBuiltinModules = function (path, cb) {
    $.get(path, function (data) {
        var sources = data.split('%%%%%%%%%%%%! MODULE SEPARATOR !%%%%%%%%%%%%');
        cb(_.map(sources, function (src) {
            var mod = new Module();
            mod.source = src.trim();
            mod.compile();
            return mod;
        }));
    });
};


// 192.168.43.65:9001

var Connection = function(from, to) {
    this.from  = from;
    this.to = to;
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
};

Module.prototype.config = function(obj) {
    var self = this;
    self.name = obj.name;
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

var ModuleFactory = function(source, name) {
    this.source = source;
    this.name = name || 'module';

    var script = "with (scope) {\n" + source + "\n}";

    try {
        this.scriptFunc = Function('scope', script);
    } catch (err) {
        console.log("Error in module " + this.name);
        throw err;
    };
};

ModuleFactory.prototype.create = function() {
    var mod = new Module;
    mod.source = this.source;
    this.scriptFunc({
        'module': mod,
        'utils': ModuleUtils
    });
    return mod;
};

var loadBuiltinModules = function (path, cb) {
    $.get(path, function (data) {
        var sources = data.split('%%%%%%%%%%%%! MODULE SEPARATOR !%%%%%%%%%%%%');
        cb(_.map(sources, function (src) {
            var match = src.match(/^\s*\/\/\~module:\s+(\w+)\s*$/m);
            src = src.split(match[0]);
            return new ModuleFactory(src[1].trim(), match[1]);
        }));
    });
};

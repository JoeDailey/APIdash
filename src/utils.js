
var ModuleUtils = function(module) {
    this.module = module;
};

ModuleUtils.prototype.api = function(path, data, cb) {
    xhr = $.post('/' + path, data);
    xhr.done(cb);
    this.module.addXHR(xhr);
};

ModuleUtils.prototype.notify = function(string){
	$("#console").append(JSON.stringify(string) + "<br />");
	$('#console').scrollTop($('#console')[0].scrollHeight);
};

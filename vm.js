
function yile(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    observe(data);
    this.compile = new Compile(options.el, this)
}
yile.prototype={}

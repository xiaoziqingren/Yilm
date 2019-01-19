function Compile(el, vm) { //el = id:app
    this.$vm = vm;
    this.el = document.querySelector(el);

    if (this.el) {
        this.fragment = this.node2Fragment(this.el);
        this.compileElement(this.fragment);
        this.el.appendChild(this.fragment);
    }
}

Compile.prototype = {
    node2Fragment: function(el) {
        var fragment = document.createDocumentFragment(), child;

        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },

    compileElement: function(el) {
        var childNodes = el.childNodes,
            me = this;

        [].slice.call(childNodes).forEach(function(node) {
            var text = node.textContent;
            //寻找形如{{name}}
            var reg = /\{\{(.*)\}\}/;
            if (node.nodeType == 1 && reg.test(text)){
                let exp = RegExp.$1;
                let data = getVmodelDate(me,exp);
                node.textContent = typeof data == 'undefined' ? '' : data;
                new Watcher(me.$vm,exp,function (value) {
                    node.textContent = typeof value == 'undefined' ? '' : value;
                })
            }
        });
    },

};


function getVmodelDate (vm, exp) {
    let mvm = vm;
    exp = exp.split('.')
    exp.forEach(function(k) {
        mvm = vm.$vm._data[k];
    });
    return mvm
}
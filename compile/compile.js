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
            // 处理元素节点，例如<p>
            if (node.nodeType == 1) {
                var nodeAttrs = node.attributes;
                [].slice.call(nodeAttrs).forEach(function(attribute) {
                    let attrName = attribute.name;
                    if (attrName.indexOf('v-')==0){
                        let cmd = attrName.substring(2);
                        var exp = attribute.value;
                        if(cmd.indexOf('on') == 0){

                        }
                        else if(cmd.indexOf('for') == 0){
                            let data = getVmodelDate(me,exp)
                            //TODO 支持对象数组:{{array.index}}


                        }
                        else if(cmd.indexOf('model') == 0){
                            let data = getVmodelDate(me,exp);
                            node.value = typeof data == 'undefined' ? '' : data;
                            new Watcher(me.$vm,exp,function (value) {
                                node.value = typeof value == 'undefined' ? '' : value;
                            });

                            //TODO 暂时使用keyup，keydown在数据为空时需要处理，所以双向绑定时会存在延时
                            node.addEventListener('keyup',function(e) {
                                var newValue = e.target.value;
                                if (data === newValue) {
                                    return;
                                }

                                setVmodelDate(me, exp, newValue);
                                data = newValue;
                            })
                        }
                    }
                })

            }
            // 处理文本节点，包含空白点
            else if (node.nodeType == 3 && reg.test(text)){
                    let exp = RegExp.$1;
                    let data = getVmodelDate(me,exp);
                    node.textContent = typeof data == 'undefined' ? '' : data;
                    new Watcher(me.$vm,exp,function (value) {
                        node.textContent = typeof value == 'undefined' ? '' : value;
                    })
            }
            if(node.childNodes  && node.childNodes.length){
                me.compileElement(node)
            }
        });
    },

};


function getVmodelDate (vm, exp) {
    let mvm = vm;
    exp = exp.split('.')
    exp.forEach(function (k) {
        mvm = vm.$vm._data[k];
    });
    return mvm
}
function setVmodelDate (vm, exp, newValue) {
    let mvm = vm;
    exp = exp.split('.')
    exp.forEach(function(k) {
        vm.$vm._data[k] = newValue;
    });
}
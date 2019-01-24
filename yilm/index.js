 function Zbserver(value) {
    this.data = value;
    this.walk(value)
}
Zbserver.prototype={
    walk: function(data) {
        var me = this;
        Object.keys(data).forEach(function(key) {
            me.convert(key, data[key]);
        });
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val);
    },
    defineReactive:function(obj, key, val) {
        var dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: ()=>{
                if (Dep.target) {
                    dep.depend();
                }
                return val
            },
            set:newVal=> {
                val = newVal;
                dep.notify()
            }
        })
    },
};
 function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Zbserver(value);
};

var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    },
    depend: function() {
        Dep.target.addDep(this);
    },
};

Dep.target = null;


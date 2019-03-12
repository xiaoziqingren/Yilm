
function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    let dep = new Dep();

    return new Proxy(value,{
        get: (target, key, receiver)=>{
            if (Dep.target) {
                dep.depend();
            }
            return Reflect.get(target, key, receiver)
        },
        set:(target, key, receiver)=> {
            Reflect.set(target, key, receiver);
            dep.notify();
        }
    })
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


function observe(value, cb) {
    Object.keys(value).forEach((key) => defineReactive(value, key, value[key] , cb))
}

function defineReactive (obj, key, val, cb) {
    let dep = Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: ()=>{

            return val
        },
        set:newVal=> {
            val = newVal;
            cb();/*订阅者收到消息的回调*/
            dep.notify()
        }
    })
}

export class Vue {
    constructor(options) {
        this._data = options.data;
        observe(this._data, options.render)
    }
}

let app = new Vue({
    el: '#app',
    data: {
        text: 'text',
        text2: 'text2'
    },
    render(){
        console.log("render");
    },

});

function Dep() {
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
    }
};

Dep.target = null;
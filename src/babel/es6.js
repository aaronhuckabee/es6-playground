//babel, not ff39 nor chrome44

///1.  proper tail calls (tail call optimisation)
// direct recursion
var babel_1 = function(){

    "use strict";
    return (function f(n){
            if (n <= 0) {
                return  "foo";
            }
            return f(n - 1);
        }(1e6)) === "foo";
};

console.log(babel_1());
// temporal dead zone
var babel_2 = function(){

    return (function(x = 1) {
        try {
            eval("(function(a=a){}())");
            return false;
        } catch(e) {}
        try {
            eval("(function(a=b,b){}())");
            return false;
        } catch(e) {}
        return true;
    }());
};

// separate scope
var babel_3 = function(){

    return (function(a=function(){
        return typeof b === 'undefined';
    }){
        var b = 1;
        return a();
    }());
};

// arguments object interaction
var babel_4 = function(){

    return (function (foo, ...args) {
        foo = "qux";
        // The arguments object is not mapped to the
        // parameters, even outside of strict mode.
        return arguments.length === 3
            && arguments[0] === "foo"
            && arguments[1] === "bar"
            && arguments[2] === "baz";
    }("foo", "bar", "baz"));
};

// iterator closing, break
var babel_5 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    for (var it of iter) break;
    return closed;
};

// iterator closing, throw
var babel_6 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    try {
        for (var it of iter) throw 0;
    } catch(e){}
    return closed;
};

// "u" flag
var babel_7 = function(){

    return "𠮷".match(/^.$/u)[0].length === 2;
};

// iterator closing
var babel_8 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    var [a, b] = iter;
    return closed;
};

// nested rest
var babel_9 = function(){

    var a = [1, 2, 3], first, last;
    [first, ...[a[2], last]] = a;
    return first === 1 && last === 3 && (a + "") === "1,2,2";
};

// defaults
var babel_10 = function(){

    var {a = 1, b = 0, z:c = 3} = {b:2, z:undefined};
    var [d = 0, e = 5, f = 6] = [4,,undefined];
    return a === 1 && b === 2 && c === 3
        && d === 4 && e === 5 && f === 6;
};

// defaults in parameters
var babel_11 = function(){

    return (function({a = 1, b = 0, c = 3, x:d = 0, y:e = 5},
        [f = 6, g = 0, h = 8]) {
        return a === 1 && b === 2 && c === 3 && d === 4 &&
            e === 5 && f === 6 && g === 7 && h === 8;
    }({b:2, c:undefined, x:4},[, 7, undefined]));
};

// defaults in parameters, separate scope
var babel_12 = function(){

    return (function({a=function(){
        return typeof b === 'undefined';
    }}){
        var b = 1;
        return a();
    }({}));
};

///2.  Unicode code point escapes
// in strings
var babel_13 = function(){

    return '\u{1d306}' == '\ud834\udf06';
};

///3.  let
// basic support
var babel_14 = function(){

    let foo = 123;
    return (foo === 123);
};

// is block-scoped
var babel_15 = function(){

    let bar = 123;
    { let bar = 456; }
    return bar === 123;
};

// for-loop statement scope
var babel_16 = function(){

    let baz = 1;
    for(let baz = 0; false; false) {}
    return baz === 1;
};

// for-loop iteration scope
var babel_17 = function(){

    let scopes = [];
    for(let i = 0; i < 2; i++) {
        scopes.push(function(){ return i; });
    }
    let passed = (scopes[0]() === 0 && scopes[1]() === 1);

    scopes = [];
    for(let i in { a:1, b:1 }) {
        scopes.push(function(){ return i; });
    }
    passed &= (scopes[0]() === "a" && scopes[1]() === "b");
    return passed;
};

// basic support (strict mode)
var babel_18 = function(){

    'use strict';
    let foo = 123;
    return (foo === 123);
};

// is block-scoped (strict mode)
var babel_19 = function(){

    'use strict';
    let bar = 123;
    { let bar = 456; }
    return bar === 123;
};

// for-loop statement scope (strict mode)
var babel_20 = function(){

    'use strict';
    let baz = 1;
    for(let baz = 0; false; false) {}
    return baz === 1;
};

// for-loop iteration scope (strict mode)
var babel_21 = function(){

    'use strict';
    let scopes = [];
    for(let i = 0; i < 2; i++) {
        scopes.push(function(){ return i; });
    }
    let passed = (scopes[0]() === 0 && scopes[1]() === 1);

    scopes = [];
    for(let i in { a:1, b:1 }) {
        scopes.push(function(){ return i; });
    }
    passed &= (scopes[0]() === "a" && scopes[1]() === "b");
    return passed;
};

// block-level function declaration[13]
var babel_22 = function(){

    'use strict';
    function f() { return 1; }
    {
        function f() { return 2; }
    }
    return f() === 1;
};

// lexical "arguments" binding
var babel_23 = function(){

    var f = (function() { return z => arguments[0]; }(5));
    return f(6) === 5;
};

// lexical "super" binding
var babel_24 = function(){

    class B {
        qux() {
            return "quux";
        }
    }
    class C extends B {
        baz() {
            return x => super.qux();
        }
    }
    var arrow = new C().baz();
    return arrow() === "quux";
};

// methods aren't enumerable
var babel_25 = function(){

    class C {
        foo() {}
        static bar() {}
    }
    return !C.prototype.propertyIsEnumerable("foo") && !C.propertyIsEnumerable("bar");
};

// constructor requires new
var babel_26 = function(){

    class C {}
    try {
        C();
    }
    catch(e) {
        return true;
    }
};

///4.  super
// statement in constructors
var babel_27 = function(){

    var passed = false;
    class B {
        constructor(a) { passed = (a === "barbaz"); }
    }
    class C extends B {
        constructor(a) { super("bar" + a); }
    }
    new C("baz");
    return passed;
};

// expression in constructors
var babel_28 = function(){

    class B {
        constructor(a) { return ["foo" + a]; }
    }
    class C extends B {
        constructor(a) { return super("bar" + a); }
    }
    return new C("baz")[0] === "foobarbaz";
};

// in methods, property access
var babel_29 = function(){

    class B {}
    B.prototype.qux = "foo";
    B.prototype.corge = "baz";
    class C extends B {
        quux(a) { return super.qux + a + super["corge"]; }
    }
    C.prototype.qux = "garply";
    return new C().quux("bar") === "foobarbaz";
};

// in methods, method calls
var babel_30 = function(){

    class B {
        qux(a) { return "foo" + a; }
    }
    class C extends B {
        qux(a) { return super.qux("bar" + a); }
    }
    return new C().qux("baz") === "foobarbaz";
};

// method calls use correct "this" binding
var babel_31 = function(){

    class B {
        qux(a) { return this.foo + a; }
    }
    class C extends B {
        qux(a) { return super.qux("bar" + a); }
    }
    var obj = new C();
    obj.foo = "foo";
    return obj.qux("baz") === "foobarbaz";
};

// is statically bound
var babel_32 = function(){

    class B {
        qux() { return "bar"; }
    }
    class C extends B {
        qux() { return super.qux() + this.corge; }
    }
    var obj = {
        qux: C.prototype.qux,
        corge: "ley"
    };
    return obj.qux() === "barley";
};

// yield *, iterator closing
var babel_33 = function(){

    var closed = '';
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){
        closed += 'a';
        return {done: true};
    }
    var gen = (function* generator(){
        try {
            yield *iter;
        } finally {
            closed += 'b';
        }
    })();
    gen.next();
    gen['return']();
    return closed === 'ab';
};

// yield *, iterator closing via throw()
var babel_34 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['throw'] = undefined;
    iter['return'] = function(){
        closed = true;
        return {done: true};
    }
    var gen = (function*(){
        try {
            yield *iter;
        } catch(e){}
    })();
    gen.next();
    gen['throw']();
    return closed;
};

// iterator closing
var babel_35 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    try {
        new Map(iter);
    } catch(e){}
    return closed;
};

// iterator closing
var babel_36 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    var add = Set.prototype.add;
    Set.prototype.add = function(){ throw 0 };
    try {
        new Set(iter);
    } catch(e){}
    Set.prototype.add = add;
    return closed;
};

// iterator closing
var babel_37 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    try {
        new WeakMap(iter);
    } catch(e){}
    return closed;
};

// iterator closing
var babel_38 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    try {
        new WeakSet(iter);
    } catch(e){}
    return closed;
};

///5.  Reflect
// Reflect.get
var babel_39 = function(){

    return Reflect.get({ qux: 987 }, "qux") === 987;
};

// Reflect.set
var babel_40 = function(){

    var obj = {};
    Reflect.set(obj, "quux", 654);
    return obj.quux === 654;
};

// Reflect.has
var babel_41 = function(){

    return Reflect.has({ qux: 987 }, "qux");
};

// Reflect.deleteProperty
var babel_42 = function(){

    var obj = { bar: 456 };
    Reflect.deleteProperty(obj, "bar");
    return !("bar" in obj);
};

// Reflect.getOwnPropertyDescriptor
var babel_43 = function(){

    var obj = { baz: 789 };
    var desc = Reflect.getOwnPropertyDescriptor(obj, "baz");
    return desc.value === 789 &&
        desc.configurable && desc.writable && desc.enumerable;
};

// Reflect.defineProperty
var babel_44 = function(){

    var obj = {};
    Reflect.defineProperty(obj, "foo", { value: 123 });
    return obj.foo === 123;
};

// Reflect.getPrototypeOf
var babel_45 = function(){

    return Reflect.getPrototypeOf([]) === Array.prototype;
};

// Reflect.isExtensible
var babel_46 = function(){

    return Reflect.isExtensible({}) &&
        !Reflect.isExtensible(Object.preventExtensions({}));
};

// Reflect.preventExtensions
var babel_47 = function(){

    var obj = {};
    Reflect.preventExtensions(obj);
    return !Object.isExtensible(obj);
};

// Reflect.enumerate
var babel_48 = function(){

    var obj = { foo: 1, bar: 2 };
    var iterator = Reflect.enumerate(obj);
    var passed = 1;
    if (typeof Symbol === 'function' && 'iterator' in Symbol) {
        passed &= Symbol.iterator in iterator;
    }
    var item = iterator.next();
    passed &= item.value === "foo" && item.done === false;
    item = iterator.next();
    passed &= item.value === "bar" && item.done === false;
    item = iterator.next();
    passed &= item.value === undefined && item.done === true;
    return passed === 1;
};

// Reflect.apply
var babel_49 = function(){

    return Reflect.apply(Array.prototype.push, [1,2], [3,4,5]) === 5;
};

// Reflect.construct
var babel_50 = function(){

    return Reflect.construct(function(a, b, c) {
            this.qux = a + b + c;
        }, ["foo", "bar", "baz"]).qux === "foobarbaz";
};

// Symbol.species
var babel_51 = function(){

    return RegExp[Symbol.species] === RegExp
        && Array[Symbol.species] === Array
        && !(Symbol.species in Object);
};

// Symbol.toStringTag
var babel_52 = function(){

    var a = {};
    a[Symbol.toStringTag] = "foo";
    return (a + "") === "[object foo]";
};

// variables (function)
var babel_53 = function(){

    var foo = function() {};
    var bar = function baz() {};
    return foo.name === "foo" && bar.name === "baz";
};

// object methods (function)
var babel_54 = function(){

    var o = { foo: function(){}, bar: function baz(){}};
    o.qux = function(){};
    return o.foo.name === "foo" &&
        o.bar.name === "baz" &&
        o.qux.name === "";
};

// variables (class)
var babel_55 = function(){

    var foo = class {};
    var bar = class baz {};
    var qux = class { static name() {} };
    return foo.name === "foo" &&
        bar.name === "baz" &&
        typeof qux.name === "function";
};

// object methods (class)
var babel_56 = function(){

    var o = { foo: class {}, bar: class baz {}};
o.qux = class {};
return o.foo.name === "foo" &&
    o.bar.name === "baz" &&
    o.qux.name === "";
};

// String.prototype.includes
var babel_57 = function(){

    return typeof String.prototype.includes === 'function'
        && "foobar".includes("oba");
};

// Array.from, iterator closing
var babel_58 = function(){

    var closed = false;
    var iter = __createIterableObject(1, 2, 3);
    iter['return'] = function(){ closed = true; return {}; }
    try {
        Array.from(iter, function() { throw 42 });
    } catch(e){}
    return closed;
};

// Array.prototype.values
var babel_59 = function(){

    return typeof Array.prototype.values === 'function';
};

// Array.prototype[Symbol.unscopables]
var babel_60 = function(){

    var unscopables = Array.prototype[Symbol.unscopables];
    if (!unscopables) {
        return false;
    }
    var ns = "find,findIndex,fill,copyWithin,entries,keys,values".split(",");
    for (var i = 0; i < ns.length; i++) {
        if (Array.prototype[ns[i]] && !unscopables[ns[i]]) return false;
    }
    return true;
};

///6.  Array is subclassable
// basic functionality
var babel_61 = function(){

    class C extends Array {}
    var c = new C();
    var len1 = c.length;
    c[2] = 'foo';
    var len2 = c.length;
    c.length = 1;
    return len1 === 0 && len2 === 3 && c.length === 1 && !(2 in c);
};

///7.  RegExp is subclassable
// basic functionality
var babel_62 = function(){

    class R extends RegExp {}
    var r = new R("baz","g");
    return r.global && r.source === "baz";
};

// RegExp.prototype.exec
var babel_63 = function(){

    class R extends RegExp {}
    var r = new R("baz","g");
    return r.exec("foobarbaz")[0] === "baz" && r.lastIndex === 9;
};

// RegExp.prototype.test
var babel_64 = function(){

    class R extends RegExp {}
    var r = new R("baz");
    return r.test("foobarbaz");
};

///8.  Function is subclassable
// can be called
var babel_65 = function(){

    class C extends Function {}
    var c = new C("return 'foo';");
    return c() === 'foo';
};

// can be used with "new"
var babel_66 = function(){

    class C extends Function {}
    var c = new C("this.bar = 2;");
    c.prototype.baz = 3;
    return new c().bar === 2 && new c().baz === 3;
};

// Function.prototype.call
var babel_67 = function(){

    class C extends Function {}
    var c = new C("x", "return this.bar + x;");
    return c.call({bar:1}, 2) === 3;
};

// Function.prototype.apply
var babel_68 = function(){

    class C extends Function {}
    var c = new C("x", "return this.bar + x;");
    return c.apply({bar:1}, [2]) === 3;
};

///9.  miscellaneous subclassables
// Boolean is subclassable
var babel_69 = function(){

    class C extends Boolean {}
    var c = new C(true);
    return c instanceof Boolean
        && c == true;
}

// Number is subclassable
var babel_70 = function(){

    class C extends Number {}
    var c = new C(6);
    return c instanceof Number
        && +c === 6;
};

// String is subclassable
var babel_71 = function(){

    class C extends String {}
    var c = new C("golly");
    return c instanceof String
        && c + '' === "golly"
        && c[0] === "g"
        && c.length === 5;
};

// Map is subclassable
var babel_72 = function(){

    var key = {};
    class M extends Map {}
    var map = new M();

    map.set(key, 123);

    return map.has(key) && map.get(key) === 123;
};

// Set is subclassable
var babel_73 = function(){

    var obj = {};
    class S extends Set {}
    var set = new S();

    set.add(123);
    set.add(123);

    return set.has(123);
};

// no assignments allowed in for-in head
var babel_74 = function(){

    try {
        eval('for (var i = 0 in {}) {}');
    }
    catch(e) {
        return true;
    }
};

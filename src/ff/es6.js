//Firefox 39, not Chrome 44
///1.  default function parameters
// basic functionality
var firefox_1 = function(){

    return (function (a = 1, b = 2) { return a === 3 && b === 2; }(3));
};

// explicit undefined defers to the default
var firefox_2 = function(){

    return (function (a = 1, b = 2) { return a === 1 && b === 3; }(undefined, 3));
};

// defaults can refer to previous params
var firefox_3 = function(){

    return (function (a, b = a) { return b === 5; }(5));
};

///2.  rest parameters
// basic functionality
var firefox_4 = function(){

    return (function (foo, ...args) {
        return args instanceof Array && args + "" === "bar,baz";
    }("foo", "bar", "baz"));
};

// function 'length' property
var firefox_5 = function(){

    return function(a, ...b){}.length === 1 && function(...c){}.length === 0;
};

// can't be used in setters
var firefox_6 = function(){

    return (function (...args) {
        try {
            eval("({set e(...args){}})");
        } catch(e) {
            return true;
        }
    }());
};

// new Function() support
var firefox_7 = function(){

    return new Function("a", "...b",
        "return b instanceof Array && a+b === 'foobar,baz';"
    )('foo','bar','baz');
};

///3.  spread (...) operator
// with arrays, in function calls
var firefox_8 = function(){

    return Math.max(...[1, 2, 3]) === 3
};

// with arrays, in array literals
var firefox_9 = function(){

    return [...[1, 2, 3]][2] === 3;
};

// with strings, in function calls
var firefox_10 = function(){

    return Math.max(..."1234") === 4;
};

// with strings, in array literals
var firefox_11 = function(){

    return ["a", ..."bcd", "e"][3] === "d";
};

// with astral plane strings, in function calls
var firefox_12 = function(){

    return Array(..."𠮷𠮶")[0] === "𠮷";
};

// with astral plane strings, in array literals
var firefox_13 = function(){

    return [..."𠮷𠮶"][0] === "𠮷";
};

// with generic iterables, in calls
var firefox_14 = function(){

    var iterable = global.__createIterableObject(1, 2, 3);
    return Math.max(...iterable) === 3;
};

// with generic iterables, in arrays
var firefox_15 = function(){

    var iterable = global.__createIterableObject("b", "c", "d");
    return ["a", ...iterable, "e"][3] === "d";
};

// with instances of iterables, in calls
var firefox_16 = function(){

    var iterable = global.__createIterableObject(1, 2, 3);
    return Math.max(...Object.create(iterable)) === 3;
};

// with instances of iterables, in arrays
var firefox_17 = function(){

    var iterable = global.__createIterableObject("b", "c", "d");
    return ["a", ...Object.create(iterable), "e"][3] === "d";
};

///4.  RegExp "y" and "u" flags
// "y" flag
var firefox_18 = function(){

    var re = new RegExp('\\w');
    var re2 = new RegExp('\\w', 'y');
    re.exec('xy');
    re2.exec('xy');
    return (re.exec('xy')[0] === 'x' && re2.exec('xy')[0] === 'y');
};

///5.  destructuring
// with arrays
var firefox_19 = function(){

    var [a, , [b], c] = [5, null, [6]];
    var d, e;
    [d,e] = [7,8];
    return a === 5 && b === 6 && c === undefined
        && d === 7 && e === 8;
};

// with strings
var firefox_20 = function(){

    var [a, b, c] = "ab";
    var d, e;
    [d,e] = "de";
    return a === "a" && b === "b" && c === undefined
        && d === "d" && e === "e";
};

// with astral plane strings
var firefox_21 = function(){

    var c;
    [c] = "𠮷𠮶";
    return c === "𠮷";
};

// with generic iterables
var firefox_22 = function(){

    var [a, b, c] = global.__createIterableObject(1, 2);
    var d, e;
    [d, e] = global.__createIterableObject(3, 4);
    return a === 1 && b === 2 && c === undefined
        && d === 3 && e === 4;
};

// with instances of generic iterables
var firefox_23 = function(){

    var [a, b, c] = Object.create(global.__createIterableObject(1, 2))
    var d, e;
    [d, e] = Object.create(global.__createIterableObject(3, 4));
    return a === 1 && b === 2 && c === undefined
        && d === 3 && e === 4;
};

// iterable destructuring expression
var firefox_24 = function(){

    var a, b, iterable = [1,2];
    return ([a, b] = iterable) === iterable;
};

// chained iterable destructuring
var firefox_25 = function(){

    var a,b,c,d;
    [a,b] = [c,d] = [1,2];
    return a === 1 && b === 2 && c === 1 && d === 2;
};

// trailing commas in iterable patterns
var firefox_26 = function(){

    var [a,] = [1];
    return a === 1;
};

// with objects
var firefox_27 = function(){

    var {c, x:d, e} = {c:7, x:8};
    var f, g;
    ({f,g} = {f:9,g:10});
    return c === 7 && d === 8 && e === undefined
        && f === 9 && g === 10;
};

// object destructuring with primitives
var firefox_28 = function(){

    var {toFixed} = 2;
    var {slice} = '';
    var toString, match;
    ({toString} = 2);
    ({match} = '');
    return toFixed === Number.prototype.toFixed
        && toString === Number.prototype.toString
        && slice === String.prototype.slice
        && match === String.prototype.match;
};

// trailing commas in object patterns
var firefox_29 = function(){

    var {a,} = {a:1};
    return a === 1;
};

// object destructuring expression
var firefox_30 = function(){

    var a, b, obj = { a:1, b:2 };
    return ({a,b} = obj) === obj;
};

// chained object destructuring
var firefox_31 = function(){

    var a,b,c,d;
    ({a,b} = {c,d} = {a:1,b:2,c:3,d:4});
    return a === 1 && b === 2 && c === 3 && d === 4;
};

// throws on null and undefined
var firefox_32 = function(){

    try {
        var {a} = null;
        return false;
    } catch(e) {}
    try {
        var {b} = undefined;
        return false;
    } catch(e) {}
    return true;
};

// computed properties
var firefox_33 = function(){

    var qux = "corge";
    var { [qux]: grault } = { corge: "garply" };
return grault === "garply";
};

// multiples in a single var statement
var firefox_34 = function(){

    var [a,b] = [5,6], {c,d} = {c:7,d:8};
    return a === 5 && b === 6 && c === 7 && d === 8;
};

// nested
var firefox_35 = function(){

    var [e, {x:f, g}] = [9, {x:10}];
    var {h, x:[i]} = {h:11, x:[12]};
    return e === 9 && f === 10 && g === undefined
        && h === 11 && i === 12;
};

// in parameters
var firefox_36 = function(){

    return (function({a, x:b, y:e}, [c, d]) {
        return a === 1 && b === 2 && c === 3 &&
            d === 4 && e === undefined;
    }({a:1, x:2}, [3, 4]));
};

// in parameters, function 'length' property
var firefox_37 = function(){

    return function({a, b}, [c, d]){}.length === 2;
};

// in for-in loop heads
var firefox_38 = function(){

    for(var [i, j, k] in { qux: 1 }) {
        return i === "q" && j === "u" && k === "x";
    }
};

// in for-of loop heads
var firefox_39 = function(){

    for(var [i, j, k] of [[1,2,3]]) {
        return i === 1 && j === 2 && k === 3;
    }
};

// rest
var firefox_40 = function(){

    var [a, ...b] = [3, 4, 5];
    var [c, ...d] = [6];
    return a === 3 && b instanceof Array && (b + "") === "4,5" &&
        c === 6 && d instanceof Array && d.length === 0;
};

// is block-scoped
var firefox_41 = function(){

    const bar = 123;
    { const bar = 456; }
    return bar === 123;
};

// redefining a const is an error
var firefox_42 = function(){

    const baz = 1;
    try {
        Function("const foo = 1; foo = 2;")();
    } catch(e) {
        return true;
    }
};

// temporal dead zone
var firefox_43 = function(){

    var passed = (function(){ try { qux; } catch(e) { return true; }}());
    const qux = 456;
    return passed;
};

///6.  arrow functions
// 0 parameters
var firefox_44 = function(){

    return (() => 5)() === 5;
};

// 1 parameter, no brackets
var firefox_45 = function(){

    var b = x => x + "foo";
    return (b("fee fie foe ") === "fee fie foe foo");
};

// multiple parameters
var firefox_46 = function(){

    var c = (v, w, x, y, z) => "" + v + w + x + y + z;
    return (c(6, 5, 4, 3, 2) === "65432");
};

// lexical "this" binding
var firefox_47 = function(){

    var d = { x : "bar", y : function() { return z => this.x + z; }}.y();
    var e = { x : "baz", y : d };
    return d("ley") === "barley" && e.y("ley") === "barley";
};

// "this" unchanged by call or apply
var firefox_48 = function(){

    var d = { x : "foo", y : function() { return () => this.x; }};
    var e = { x : "bar" };
    return d.y().call(e) === "foo" && d.y().apply(e) === "foo";
};

// can't be bound, can be curried
var firefox_49 = function(){

    var d = { x : "bar", y : function() { return z => this.x + z; }};
    var e = { x : "baz" };
    return d.y().bind(e, "ley")() === "barley";
};

// no line break between params and =>
var firefox_50 = function(){

    return (() => {
            try { Function("x\n => 2")(); } catch(e) { return true; }
};)();
};

// no "prototype" property
var firefox_51 = function(){

    var a = () => 5;
    return !a.hasOwnProperty("prototype");
};

///7.  class
// class statement
var firefox_52 = function(){

    class C {}
    return typeof C === "function";
};

// is block-scoped
var firefox_53 = function(){

    class C {}
    var c1 = C;
    {
        class C {}
        var c2 = C;
    }
    return C === c1;
};

// class expression
var firefox_54 = function(){

    return typeof class C {} === "function";
};

// anonymous class
var firefox_55 = function(){

    return typeof class {} === "function";
};

// constructor
var firefox_56 = function(){

    class C {
        constructor() { this.x = 1; }
    }
    return C.prototype.constructor === C
        && new C().x === 1;
};

// prototype methods
var firefox_57 = function(){

    class C {
        method() { return 2; }
    }
    return typeof C.prototype.method === "function"
        && new C().method() === 2;
};

// string-keyed methods
var firefox_58 = function(){

    class C {
    "foo bar"() { return 2; }
};
return typeof C.prototype["foo bar"] === "function"
    && new C()["foo bar"]() === 2;
};

// computed prototype methods
var firefox_59 = function(){

    var foo = "method";
    class C {
    [foo]() { return 2; }
    }
    return typeof C.prototype.method === "function"
        && new C().method() === 2;
};

// static methods
var firefox_60 = function(){

    class C {
        static method() { return 3; }
    }
    return typeof C.method === "function"
        && C.method() === 3;
};

// computed static methods
var firefox_61 = function(){

    var foo = "method";
    class C {
    static [foo]() { return 3; }
    }
    return typeof C.method === "function"
        && C.method() === 3;
};

// accessor properties
var firefox_62 = function(){

    var baz = false;
    class C {
        get foo() { return "foo"; }
        set bar(x) { baz = x; }
    }
    new C().bar = true;
    return new C().foo === "foo" && baz;
};

// computed accessor properties
var firefox_63 = function(){

    var garply = "foo", grault = "bar", baz = false;
    class C {
        get [garply]() { return "foo"; }
        set [grault](x) { baz = x; }
    }
    new C().bar = true;
    return new C().foo === "foo" && baz;
};

// static accessor properties
var firefox_64 = function(){

    var baz = false;
    class C {
        static get foo() { return "foo"; }
        static set bar(x) { baz = x; }
    }
    C.bar = true;
    return C.foo === "foo" && baz;
};

// computed static accessor properties
var firefox_65 = function(){

    var garply = "foo", grault = "bar", baz = false;
    class C {
        static get [garply]() { return "foo"; }
        static set [grault](x) { baz = x; }
    }
    C.bar = true;
    return C.foo === "foo" && baz;
};

// class name is lexically scoped
var firefox_66 = function(){

    class C {
        method() { return typeof C === "function"; }
    }
    var M = C.prototype.method;
    C = undefined;
    return C === undefined && M();
};

// computed names, temporal dead zone
var firefox_67 = function(){

    try {
        var B = class C {
        [C](){}
        }
    } catch(e) {
        return true;
    }
};

// implicit strict mode
var firefox_68 = function(){

    class C {
        static method() { return this === undefined; }
    }
    return (0,C.method)();
};

// extends
var firefox_69 = function(){

    class B {}
    class C extends B {}
    return new C() instanceof B
        && B.isPrototypeOf(C);
};

// extends expressions
var firefox_70 = function(){

    var B;
    class C extends (B = class {}) {}
    return new C() instanceof B
        && B.isPrototypeOf(C);
};

// extends null
var firefox_71 = function(){

    class C extends null {
        constructor() { return Object.create(null); }
    }
    return Function.prototype.isPrototypeOf(C)
        && Object.getPrototypeOf(C.prototype) === null;
};

// %GeneratorPrototype%.return
var firefox_72 = function(){

    function * generator(){
        yield 5; yield 6;
    };
    var iterator = generator();
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.return("quxquux");
    passed    &= item.value === "quxquux" && item.done === true;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// shorthand generator methods, classes
var firefox_73 = function(){

    class C {
        * generator() {
            yield 5; yield 6;
        }
    };
    var iterator = new C().generator();
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// computed shorthand generators, classes
var firefox_74 = function(){

    var garply = "generator";
    class C {
        * [garply] () {
        yield 5; yield 6;
    }
    }
    var iterator = new C().generator();
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// %TypedArray%.from
var firefox_75 = function(){

    return typeof Int8Array.from === "function" &&
        typeof Uint8Array.from === "function" &&
        typeof Uint8ClampedArray.from === "function" &&
        typeof Int16Array.from === "function" &&
        typeof Uint16Array.from === "function" &&
        typeof Int32Array.from === "function" &&
        typeof Uint32Array.from === "function" &&
        typeof Float32Array.from === "function" &&
        typeof Float64Array.from === "function";
};

// %TypedArray%.of
var firefox_76 = function(){

    return typeof Int8Array.of === "function" &&
        typeof Uint8Array.of === "function" &&
        typeof Uint8ClampedArray.of === "function" &&
        typeof Int16Array.of === "function" &&
        typeof Uint16Array.of === "function" &&
        typeof Int32Array.of === "function" &&
        typeof Uint32Array.of === "function" &&
        typeof Float32Array.of === "function" &&
        typeof Float64Array.of === "function";
};

// %TypedArray%.prototype.join
var firefox_77 = function(){

    return typeof Int8Array.prototype.join === "function" &&
        typeof Uint8Array.prototype.join === "function" &&
        typeof Uint8ClampedArray.prototype.join === "function" &&
        typeof Int16Array.prototype.join === "function" &&
        typeof Uint16Array.prototype.join === "function" &&
        typeof Int32Array.prototype.join === "function" &&
        typeof Uint32Array.prototype.join === "function" &&
        typeof Float32Array.prototype.join === "function" &&
        typeof Float64Array.prototype.join === "function";
};

// %TypedArray%.prototype.indexOf
var firefox_78 = function(){

    return typeof Int8Array.prototype.indexOf === "function" &&
        typeof Uint8Array.prototype.indexOf === "function" &&
        typeof Uint8ClampedArray.prototype.indexOf === "function" &&
        typeof Int16Array.prototype.indexOf === "function" &&
        typeof Uint16Array.prototype.indexOf === "function" &&
        typeof Int32Array.prototype.indexOf === "function" &&
        typeof Uint32Array.prototype.indexOf === "function" &&
        typeof Float32Array.prototype.indexOf === "function" &&
        typeof Float64Array.prototype.indexOf === "function";
};

// %TypedArray%.prototype.lastIndexOf
var firefox_79 = function(){

    return typeof Int8Array.prototype.lastIndexOf === "function" &&
        typeof Uint8Array.prototype.lastIndexOf === "function" &&
        typeof Uint8ClampedArray.prototype.lastIndexOf === "function" &&
        typeof Int16Array.prototype.lastIndexOf === "function" &&
        typeof Uint16Array.prototype.lastIndexOf === "function" &&
        typeof Int32Array.prototype.lastIndexOf === "function" &&
        typeof Uint32Array.prototype.lastIndexOf === "function" &&
        typeof Float32Array.prototype.lastIndexOf === "function" &&
        typeof Float64Array.prototype.lastIndexOf === "function";
};

// %TypedArray%.prototype.slice
var firefox_80 = function(){

    return typeof Int8Array.prototype.slice === "function" &&
        typeof Uint8Array.prototype.slice === "function" &&
        typeof Uint8ClampedArray.prototype.slice === "function" &&
        typeof Int16Array.prototype.slice === "function" &&
        typeof Uint16Array.prototype.slice === "function" &&
        typeof Int32Array.prototype.slice === "function" &&
        typeof Uint32Array.prototype.slice === "function" &&
        typeof Float32Array.prototype.slice === "function" &&
        typeof Float64Array.prototype.slice === "function";
};

// %TypedArray%.prototype.every
var firefox_81 = function(){

    return typeof Int8Array.prototype.every === "function" &&
        typeof Uint8Array.prototype.every === "function" &&
        typeof Uint8ClampedArray.prototype.every === "function" &&
        typeof Int16Array.prototype.every === "function" &&
        typeof Uint16Array.prototype.every === "function" &&
        typeof Int32Array.prototype.every === "function" &&
        typeof Uint32Array.prototype.every === "function" &&
        typeof Float32Array.prototype.every === "function" &&
        typeof Float64Array.prototype.every === "function";
};

// %TypedArray%.prototype.filter
var firefox_82 = function(){

    return typeof Int8Array.prototype.filter === "function" &&
        typeof Uint8Array.prototype.filter === "function" &&
        typeof Uint8ClampedArray.prototype.filter === "function" &&
        typeof Int16Array.prototype.filter === "function" &&
        typeof Uint16Array.prototype.filter === "function" &&
        typeof Int32Array.prototype.filter === "function" &&
        typeof Uint32Array.prototype.filter === "function" &&
        typeof Float32Array.prototype.filter === "function" &&
        typeof Float64Array.prototype.filter === "function";
};

// %TypedArray%.prototype.forEach
var firefox_83 = function(){

    return typeof Int8Array.prototype.forEach === "function" &&
        typeof Uint8Array.prototype.forEach === "function" &&
        typeof Uint8ClampedArray.prototype.forEach === "function" &&
        typeof Int16Array.prototype.forEach === "function" &&
        typeof Uint16Array.prototype.forEach === "function" &&
        typeof Int32Array.prototype.forEach === "function" &&
        typeof Uint32Array.prototype.forEach === "function" &&
        typeof Float32Array.prototype.forEach === "function" &&
        typeof Float64Array.prototype.forEach === "function";
};

// %TypedArray%.prototype.map
var firefox_84 = function(){

    return typeof Int8Array.prototype.map === "function" &&
        typeof Uint8Array.prototype.map === "function" &&
        typeof Uint8ClampedArray.prototype.map === "function" &&
        typeof Int16Array.prototype.map === "function" &&
        typeof Uint16Array.prototype.map === "function" &&
        typeof Int32Array.prototype.map === "function" &&
        typeof Uint32Array.prototype.map === "function" &&
        typeof Float32Array.prototype.map === "function" &&
        typeof Float64Array.prototype.map === "function";
};

// %TypedArray%.prototype.reduce
var firefox_85 = function(){

    return typeof Int8Array.prototype.reduce === "function" &&
        typeof Uint8Array.prototype.reduce === "function" &&
        typeof Uint8ClampedArray.prototype.reduce === "function" &&
        typeof Int16Array.prototype.reduce === "function" &&
        typeof Uint16Array.prototype.reduce === "function" &&
        typeof Int32Array.prototype.reduce === "function" &&
        typeof Uint32Array.prototype.reduce === "function" &&
        typeof Float32Array.prototype.reduce === "function" &&
        typeof Float64Array.prototype.reduce === "function";
};

// %TypedArray%.prototype.reduceRight
var firefox_86 = function(){

    return typeof Int8Array.prototype.reduceRight === "function" &&
        typeof Uint8Array.prototype.reduceRight === "function" &&
        typeof Uint8ClampedArray.prototype.reduceRight === "function" &&
        typeof Int16Array.prototype.reduceRight === "function" &&
        typeof Uint16Array.prototype.reduceRight === "function" &&
        typeof Int32Array.prototype.reduceRight === "function" &&
        typeof Uint32Array.prototype.reduceRight === "function" &&
        typeof Float32Array.prototype.reduceRight === "function" &&
        typeof Float64Array.prototype.reduceRight === "function";
};

// %TypedArray%.prototype.reverse
var firefox_87 = function(){

    return typeof Int8Array.prototype.reverse === "function" &&
        typeof Uint8Array.prototype.reverse === "function" &&
        typeof Uint8ClampedArray.prototype.reverse === "function" &&
        typeof Int16Array.prototype.reverse === "function" &&
        typeof Uint16Array.prototype.reverse === "function" &&
        typeof Int32Array.prototype.reverse === "function" &&
        typeof Uint32Array.prototype.reverse === "function" &&
        typeof Float32Array.prototype.reverse === "function" &&
        typeof Float64Array.prototype.reverse === "function";
};

// %TypedArray%.prototype.some
var firefox_88 = function(){

    return typeof Int8Array.prototype.some === "function" &&
        typeof Uint8Array.prototype.some === "function" &&
        typeof Uint8ClampedArray.prototype.some === "function" &&
        typeof Int16Array.prototype.some === "function" &&
        typeof Uint16Array.prototype.some === "function" &&
        typeof Int32Array.prototype.some === "function" &&
        typeof Uint32Array.prototype.some === "function" &&
        typeof Float32Array.prototype.some === "function" &&
        typeof Float64Array.prototype.some === "function";
};

// %TypedArray%.prototype.copyWithin
var firefox_89 = function(){

    return typeof Int8Array.prototype.copyWithin === "function" &&
        typeof Uint8Array.prototype.copyWithin === "function" &&
        typeof Uint8ClampedArray.prototype.copyWithin === "function" &&
        typeof Int16Array.prototype.copyWithin === "function" &&
        typeof Uint16Array.prototype.copyWithin === "function" &&
        typeof Int32Array.prototype.copyWithin === "function" &&
        typeof Uint32Array.prototype.copyWithin === "function" &&
        typeof Float32Array.prototype.copyWithin === "function" &&
        typeof Float64Array.prototype.copyWithin === "function";
};

// %TypedArray%.prototype.find
var firefox_90 = function(){

    return typeof Int8Array.prototype.find === "function" &&
        typeof Uint8Array.prototype.find === "function" &&
        typeof Uint8ClampedArray.prototype.find === "function" &&
        typeof Int16Array.prototype.find === "function" &&
        typeof Uint16Array.prototype.find === "function" &&
        typeof Int32Array.prototype.find === "function" &&
        typeof Uint32Array.prototype.find === "function" &&
        typeof Float32Array.prototype.find === "function" &&
        typeof Float64Array.prototype.find === "function";
};

// %TypedArray%.prototype.findIndex
var firefox_91 = function(){

    return typeof Int8Array.prototype.findIndex === "function" &&
        typeof Uint8Array.prototype.findIndex === "function" &&
        typeof Uint8ClampedArray.prototype.findIndex === "function" &&
        typeof Int16Array.prototype.findIndex === "function" &&
        typeof Uint16Array.prototype.findIndex === "function" &&
        typeof Int32Array.prototype.findIndex === "function" &&
        typeof Uint32Array.prototype.findIndex === "function" &&
        typeof Float32Array.prototype.findIndex === "function" &&
        typeof Float64Array.prototype.findIndex === "function";
};

// %TypedArray%.prototype.fill
var firefox_92 = function(){

    return typeof Int8Array.prototype.fill === "function" &&
        typeof Uint8Array.prototype.fill === "function" &&
        typeof Uint8ClampedArray.prototype.fill === "function" &&
        typeof Int16Array.prototype.fill === "function" &&
        typeof Uint16Array.prototype.fill === "function" &&
        typeof Int32Array.prototype.fill === "function" &&
        typeof Uint32Array.prototype.fill === "function" &&
        typeof Float32Array.prototype.fill === "function" &&
        typeof Float64Array.prototype.fill === "function";
};

///8.  Proxy
// "get" handler
var firefox_93 = function(){

    var proxied = { };
    var proxy = new Proxy(proxied, {
        get: function (t, k, r) {
            return t === proxied && k === "foo" && r === proxy && 5;
        }
    });
    return proxy.foo === 5;
};

// "get" handler, instances of proxies
var firefox_94 = function(){

    var proxied = { };
    var proxy = Object.create(new Proxy(proxied, {
        get: function (t, k, r) {
            return t === proxied && k === "foo" && r === proxy && 5;
        }
    }));
    return proxy.foo === 5;
};

// "set" handler
var firefox_95 = function(){

    var proxied = { };
    var passed = false;
    var proxy = new Proxy(proxied, {
        set: function (t, k, v, r) {
            passed = t === proxied && k + v === "foobar" && r === proxy;
        }
    });
    proxy.foo = "bar";
    return passed;
};

// "set" handler, instances of proxies
var firefox_96 = function(){

    var proxied = { };
    var passed = false;
    var proxy = Object.create(new Proxy(proxied, {
        set: function (t, k, v, r) {
            passed = t === proxied && k + v === "foobar" && r === proxy;
        }
    }));
    proxy.foo = "bar";
    return passed;
};

// "has" handler
var firefox_97 = function(){

    var proxied = {};
    var passed = false;
    "foo" in new Proxy(proxied, {
        has: function (t, k) {
            passed = t === proxied && k === "foo";
        }
    });
    return passed;
};

// "has" handler, instances of proxies
var firefox_98 = function(){

    var proxied = {};
    var passed = false;
    "foo" in Object.create(new Proxy(proxied, {
        has: function (t, k) {
            passed = t === proxied && k === "foo";
        }
    }));
    return passed;
};

// "deleteProperty" handler
var firefox_99 = function(){

    var proxied = {};
    var passed = false;
    delete new Proxy(proxied, {
        deleteProperty: function (t, k) {
            passed = t === proxied && k === "foo";
        }
    }).foo;
    return passed;
};

// "getOwnPropertyDescriptor" handler
var firefox_100 = function(){

    var proxied = {};
    var fakeDesc = { value: "foo", configurable: true };
    var returnedDesc = Object.getOwnPropertyDescriptor(
        new Proxy(proxied, {
            getOwnPropertyDescriptor: function (t, k) {
                return t === proxied && k === "foo" && fakeDesc;
            }
        }),
        "foo"
    );
    return (returnedDesc.value     === fakeDesc.value
    && returnedDesc.configurable === fakeDesc.configurable
    && returnedDesc.writable     === false
    && returnedDesc.enumerable   === false);
};

// "defineProperty" handler
var firefox_101 = function(){

    var proxied = {};
    var passed = false;
    Object.defineProperty(
        new Proxy(proxied, {
            defineProperty: function (t, k, d) {
                passed = t === proxied && k === "foo" && d.value === 5;
                return true;
            }
        }),
        "foo",
        { value: 5, configurable: true }
    );
    return passed;
};

// "isExtensible" handler
var firefox_102 = function(){

    var proxied = {};
    var passed = false;
    Object.isExtensible(
        new Proxy(proxied, {
            isExtensible: function (t) {
                passed = t === proxied; return true;
            }
        })
    );
    return passed;
};

// "preventExtensions" handler
var firefox_103 = function(){

    var proxied = {};
    var passed = false;
    Object.preventExtensions(
        new Proxy(proxied, {
            preventExtensions: function (t) {
                passed = t === proxied;
                return Object.preventExtensions(proxied);
            }
        })
    );
    return passed;
};

// "enumerate" handler
var firefox_104 = function(){

    var proxied = {};
    var passed = false;
    for (var i in
        new Proxy(proxied, {
            enumerate: function (t) {
                passed = t === proxied;
                return {
                    next: function(){ return { done: true, value: null };}
                };
            }
        })
        ) { }
    return passed;
};

// "ownKeys" handler
var firefox_105 = function(){

    var proxied = {};
    var passed = false;
    Object.keys(
        new Proxy(proxied, {
            ownKeys: function (t) {
                passed = t === proxied; return [];
            }
        })
    );
    return passed;
};

// "apply" handler
var firefox_106 = function(){

    var proxied = function(){};
    var passed = false;
    var host = {
        method: new Proxy(proxied, {
            apply: function (t, thisArg, args) {
                passed = t === proxied && thisArg === host && args + "" === "foo,bar";
            }
        })
    };
    host.method("foo", "bar");
    return passed;
};

// "construct" handler
var firefox_107 = function(){

    var proxied = function(){};
    var passed = false;
    new new Proxy(proxied, {
        construct: function (t, args) {
            passed = t === proxied && args + "" === "foo,bar";
            return {};
        }
    })("foo","bar");
    return passed;
};

// Proxy.revocable
var firefox_108 = function(){

    var obj = Proxy.revocable({}, { get: function() { return 5; } });
    var passed = (obj.proxy.foo === 5);
    obj.revoke();
    try {
        obj.proxy.foo;
    } catch(e) {
        passed &= e instanceof TypeError;
    }
    return passed;
};

// Array.isArray support
var firefox_109 = function(){

    return Array.isArray(new Proxy([], {}));
};

// Object(symbol)
var firefox_110 = function(){

    var symbol = Symbol();
    var symbolObject = Object(symbol);

    return typeof symbolObject === "object" &&
        symbolObject == symbol &&
        symbolObject !== symbol &&
        symbolObject.valueOf() === symbol;
};

// Object.assign
var firefox_111 = function(){

    var o = Object.assign({a:true}, {b:true}, {c:true});
    return "a" in o && "b" in o && "c" in o;
};

// new Function
var firefox_112 = function(){

    return (new Function).name === "anonymous";
};

// class prototype methods
var firefox_113 = function(){

    class C { foo(){} };
    return (new C).foo.name === "foo";
};

// class static methods
var firefox_114 = function(){

    class C { static foo(){} };
    return C.foo.name === "foo";
};

///9.  RegExp.prototype properties
// RegExp.prototype.flags
var firefox_115 = function(){

    return /./igm.flags === "gim" && /./.flags === "";
};

///10.  Array static methods
// Array.from, array-like objects
var firefox_116 = function(){

    return Array.from({ 0: "foo", 1: "bar", length: 2 }) + '' === "foo,bar";
};

// Array.from, generic iterables
var firefox_117 = function(){

    var iterable = global.__createIterableObject(1, 2, 3);
    return Array.from(iterable) + '' === "1,2,3";
};

// Array.from, instances of generic iterables
var firefox_118 = function(){

    var iterable = global.__createIterableObject(1, 2, 3);
    return Array.from(Object.create(iterable)) + '' === "1,2,3";
};

// Array.from map function, array-like objects
var firefox_119 = function(){

    return Array.from({ 0: "foo", 1: "bar", length: 2 }, function(e, i) {
            return e + this.baz + i;
        }, { baz: "d" }) + '' === "food0,bard1";
};

// Array.from map function, generic iterables
var firefox_120 = function(){

    var iterable = global.__createIterableObject("foo", "bar", "bal");
    return Array.from(iterable, function(e, i) {
            return e + this.baz + i;
        }, { baz: "d" }) + '' === "food0,bard1,bald2";
};

// Array.from map function, instances of iterables
var firefox_121 = function(){

    var iterable = global.__createIterableObject("foo", "bar", "bal");
    return Array.from(Object.create(iterable), function(e, i) {
            return e + this.baz + i;
        }, { baz: "d" }) + '' === "food0,bard1,bald2";
};

// Array.of
var firefox_122 = function(){

    return typeof Array.of === 'function' &&
        Array.of(2)[0] === 2;
};

// Array.prototype.copyWithin
var firefox_123 = function(){

    return typeof Array.prototype.copyWithin === 'function';
};

// Array.prototype.find
var firefox_124 = function(){

    return typeof Array.prototype.find === 'function';
};

// Array.prototype.findIndex
var firefox_125 = function(){

    return typeof Array.prototype.findIndex === 'function';
};

// Array.prototype.fill
var firefox_126 = function(){

    return typeof Array.prototype.fill === 'function';
};

// no escaped reserved words as identifiers
var firefox_127 = function(){

    var \u0061;
    try {
        eval('var v\\u0061r');
    } catch(e) {
        return true;
    }
};

// RegExp constructor can alter flags
var firefox_128 = function(){

    return new RegExp(/./im, "g").global === true;
};

// hoisted block-level function declaration
var firefox_129 = function(){

// Note: only available outside of strict mode.
    { function f() { return 1; } }
    function g() { return 1; }
    { function g() { return 2; } }
    { function h() { return 1; } }
    function h() { return 2; }

    return f() === 1 && g() === 2 && h() === 1;
};
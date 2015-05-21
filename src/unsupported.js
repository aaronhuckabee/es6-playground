//contains all headings, plus any functionality not supported in babel + core-js, ff39, or chrome44

///1.  proper tail calls (tail call optimisation)
// mutual recursion
var unused_1 = function(){

    "use strict";
    function f(n){
        if (n <= 0) {
            return  "foo";
        }
        return g(n - 1);
    }
    function g(n){
        if (n <= 0) {
            return  "bar";
        }
        return f(n - 1);
    }
    return f(1e6) === "foo" && f(1e6+1) === "bar";
}

///2.  default function parameters
// new Function() support
var unused_2 = function(){

    return new Function("a = 1", "b = 2",
        "return a === 3 && b === 2;"
    )(3);
}

///3.  rest parameters
///4.  spread (...) operator
///5.  object literal extensions
///6.  for..of loops
///7.  octal and binary literals
///8.  template strings
///9.  RegExp "y" and "u" flags
///10.  destructuring
// in parameters, new Function() support
var unused_3 = function(){

    return new Function("{a, x:b, y:e}","[c, d]",
        "return a === 1 && b === 2 && c === 3 && "
        + "d === 4 && e === undefined;"
    )({a:1, x:2}, [3, 4]);
}

// defaults, let temporal dead zone
var unused_4 = function(){

    var {a, b = 2} = {a:1};
    try {
        eval("let {c = c} = {};");
        return false;
    } catch(e){}
    try {
        eval("let {c = d, d} = {d:1};");
        return false;
    } catch(e){}
    return a === 1 && b === 2;
}

// defaults in parameters, new Function() support
var unused_5 = function(){

    return new Function("{a = 1, b = 0, c = 3, x:d = 0, y:e = 5}",
        "return a === 1 && b === 2 && c === 3 && d === 4 && e === 5;"
    )({b:2, c:undefined, x:4});
}

///11.  Unicode code point escapes
// in identifiers
var unused_6 = function(){

    var \u{102C0} = { \u{102C0} : 2 };
return \u{102C0}['\ud800\udec0'] === 2;
}

///12.  new.target
// in constructors
var unused_7 = function(){

    var passed = false;
    new function f() {
        passed = (new.target === f);
    }();
    (function() {
        passed &= (new.target === undefined);
    }());
    return passed;
}

// can't be assigned to
var unused_8 = function(){

    var passed = false;
    new function f() {
        passed = (new.target === f);
    }();

    try {
        Function("new.target = function(){};");
    } catch(e) {
        return passed;
    }
}

///13.  const
///14.  let
// temporal dead zone
var unused_9 = function(){

    var passed = (function(){ try {  qux; } catch(e) { return true; }}());
    let qux = 456;
    return passed;
}

// temporal dead zone (strict mode)
var unused_10 = function(){

    'use strict';
    var passed = (function(){ try {  qux; } catch(e) { return true; }}());
    let qux = 456;
    return passed;
}

///15.  arrow functions
// lexical "new.target" binding
var unused_11 = function(){

    function C() {
        return x => new.target;
    }
    return new C()() === C && C()() === undefined;
}

///16.  class
// new.target
var unused_12 = function(){

    var passed = false;
    new function f() {
        passed = new.target === f;
    }();

    class A {
        constructor() {
            passed &= new.target === B;
        }
    }
    class B extends A {}
    new B();
    return passed;
}

///17.  super
// constructor calls use correct "new.target" binding
var unused_13 = function(){

    var passed;
    class B {
        constructor() { passed = (new.target === C); }
    }
    class C extends B {
        constructor() { super(); }
    }
    new C();
    return passed;
}

///18.  generators
// can't use "this" with new
var unused_14 = function(){

    function * generator(){
        yield this.x; yield this.y;
    };
    try {
        (new generator()).next();
    }
    catch (e) {
        return true;
    }
}

///19.  typed arrays
// %TypedArray%.prototype.sort
var unused_15 = function(){

    return typeof Int8Array.prototype.sort === "function" &&
        typeof Uint8Array.prototype.sort === "function" &&
        typeof Uint8ClampedArray.prototype.sort === "function" &&
        typeof Int16Array.prototype.sort === "function" &&
        typeof Uint16Array.prototype.sort === "function" &&
        typeof Int32Array.prototype.sort === "function" &&
        typeof Uint32Array.prototype.sort === "function" &&
        typeof Float32Array.prototype.sort === "function" &&
        typeof Float64Array.prototype.sort === "function";
}

///20.  Map
///21.  Set
///22.  WeakMap
///23.  WeakSet
///24.  Proxy
// "getPrototypeOf" handler
var unused_16 = function(){

    var proxied = {};
    var fakeProto = {};
    var proxy = new Proxy(proxied, {
        getPrototypeOf: function (t) {
            return t === proxied && fakeProto;
        }
    });
    return Object.getPrototypeOf(proxy) === fakeProto;
}

// "setPrototypeOf" handler
var unused_17 = function(){

    var proxied = {};
    var newProto = {};
    var passed = false;
    Object.setPrototypeOf(
        new Proxy(proxied, {
            setPrototypeOf: function (t, p) {
                passed = t === proxied && p === newProto;
                return true;
            }
        }),
        newProto
    );
    return passed;
}

// JSON.stringify support
var unused_18 = function(){

    return JSON.stringify(new Proxy(['foo'], {})) === '["foo"]';
}

///25.  Reflect
// Reflect.setPrototypeOf
var unused_19 = function(){

    var obj = {};
    Reflect.setPrototypeOf(obj, Array.prototype);
    return obj instanceof Array;
}

// Reflect.ownKeys
var unused_20 = function(){

    var obj = {
        2:    true,
        0:    true,
        1:    true,
        ' ':  true,
        9:    true,
        D:    true,
        B:    true,
        '-1': true,
    };
    obj.A = true;
    obj[3] = true;
    Object.defineProperty(obj, 'C', { value: true, enumerable: true });
    Object.defineProperty(obj, '4', { value: true, enumerable: true });
    delete obj[2];
    obj[2] = true;

    return Reflect.ownKeys(obj).join('') === "012349 DB-1AC";
}

// Reflect.ownKeys, symbol order
var unused_21 = function(){

    var sym1 = Symbol(), sym2 = Symbol(), sym3 = Symbol();
    var obj = {
        1:    true,
        A:    true,
    };
    obj.B = true;
    obj[sym1] = true;
    obj[2] = true;
    obj[sym2] = true;
    Object.defineProperty(obj, 'C', { value: true, enumerable: true });
    Object.defineProperty(obj, sym3,{ value: true, enumerable: true });
    Object.defineProperty(obj, 'D', { value: true, enumerable: true });

    var result = Reflect.ownKeys(obj);
    var l = result.length;
    return result[l-3] === sym1 && result[l-2] === sym2 && result[l-1] === sym3;
}

// Reflect.construct, new.target
var unused_22 = function(){

    return Reflect.construct(function(a, b, c) {
            if (new.target === Object) {
                this.qux = a + b + c;
            }
        }, ["foo", "bar", "baz"], Object).qux === "foobarbaz";
}

///26.  Promise
///27.  Symbol
///28.  well-known symbols
// Symbol.hasInstance
var unused_23 = function(){

    var passed = false;
    var obj = { foo: true };
    var C = function(){};
    Object.defineProperty(C, Symbol.hasInstance, {
        value: function(inst) { passed = inst.foo; return false; }
    });
    obj instanceof C;
    return passed;
}

// Symbol.isConcatSpreadable
var unused_24 = function(){

    var a = [], b = [];
    b[Symbol.isConcatSpreadable] = false;
    a = a.concat(b);
    return a[0] === b;
}

// Symbol.toPrimitive
var unused_25 = function(){

    var a = {}, b = {}, c = {};
    var passed = 0;
    a[Symbol.toPrimitive] = function(hint) { passed += hint === "number";  return 0; };
    b[Symbol.toPrimitive] = function(hint) { passed += hint === "string";  return 0; };
    c[Symbol.toPrimitive] = function(hint) { passed += hint === "default"; return 0; };

    a >= 0;
    b in {};
    c == 0;
    return passed === 3;
}

// Symbol.unscopables
var unused_26 = function(){

    var a = { foo: 1, bar: 2 };
    a[Symbol.unscopables] = { bar: true };
    with (a) {
        return foo === 1 && typeof bar === "undefined";
    }
}

///29.  Object static methods
///30.  function "name" property
// bound functions
var unused_27 = function(){

    function foo() {};
    return foo.bind({}).name === "bound foo" &&
        (function(){}).bind({}).name === "bound ";
}

// accessor properties
var unused_28 = function(){

    var o = { get foo(){}, set foo(x){} };
    var descriptor = Object.getOwnPropertyDescriptor(o, "foo");
    return descriptor.get.name === "get foo" &&
        descriptor.set.name === "set foo";
}

// symbol-keyed methods
var unused_29 = function(){

    var sym1 = Symbol("foo");
    var sym2 = Symbol();
    var o = {
        [sym1]: function(){},
    [sym2]: function(){}
};

return o[sym1].name === "[foo]" &&
    o[sym2].name === "";
}

// class statements
var unused_30 = function(){

    class foo {};
    class bar { static name() {} };
    return foo.name === "foo" &&
        typeof bar.name === "function";
}

// class expressions
var unused_31 = function(){

    return class foo {}.name === "foo" &&
    typeof class bar { static name() {} }.name === "function";
}

///31.  String static methods
///32.  String.prototype methods
///33.  RegExp.prototype properties
// RegExp.prototype[Symbol.match]
var unused_32 = function(){

    return typeof RegExp.prototype[Symbol.match] === 'function';
}

// RegExp.prototype[Symbol.replace]
var unused_33 = function(){

    return typeof RegExp.prototype[Symbol.replace] === 'function';
}

// RegExp.prototype[Symbol.split]
var unused_34 = function(){

    return typeof RegExp.prototype[Symbol.split] === 'function';
}

// RegExp.prototype[Symbol.search]
var unused_35 = function(){

    return typeof RegExp.prototype[Symbol.search] === 'function';
}

///34.  Array static methods
///35.  Array.prototype methods
///36.  Number properties
///37.  Math methods
///38.  Array is subclassable
// correct prototype chain
var unused_36 = function(){

    class C extends Array {}
    var c = new C();
    return c instanceof C && c instanceof Array && Object.getPrototypeOf(C) === Array;
}

// Array.prototype.slice
var unused_37 = function(){

    class C extends Array {}
    var c = new C();
    c.push(2,4,6);
    return c.slice(1,2) instanceof C;
}

// Array.from
var unused_38 = function(){

    class C extends Array {}
    return C.from({ length: 0 }) instanceof C;
}

// Array.of
var unused_39 = function(){

    class C extends Array {}
    return C.of(0) instanceof C;
}

///39.  RegExp is subclassable
// correct prototype chain
var unused_40 = function(){

    class R extends RegExp {}
    var r = new R("baz","g");
    return r instanceof R && r instanceof RegExp && Object.getPrototypeOf(R) === RegExp;
}

///40.  Function is subclassable
// correct prototype chain
var unused_41 = function(){

    class C extends Function {}
    var c = new C("return 'foo';");
    return c instanceof C && c instanceof Function && Object.getPrototypeOf(C) === Function;
}

// Function.prototype.bind
var unused_42 = function(){

    class C extends Function {}
    var c = new C("x", "y", "return this.bar + x + y;").bind({bar:1}, 2);
    return c(6) === 9 && c instanceof C;
}

///41.  Promise is subclassable
// basic functionality
var unused_43 = function(){

    class P extends Promise {}
    var p1 = new P(function(resolve, reject) { resolve("foo"); });
    var p2 = new P(function(resolve, reject) { reject("quux"); });
    var score = +(p1 instanceof P);

    function thenFn(result)  { score += (result === "foo");  check(); }
    function catchFn(result) { score += (result === "quux"); check(); }
    function shouldNotRun(result)  { score = -Infinity;   }

    p1.then(thenFn, shouldNotRun);
    p2.then(shouldNotRun, catchFn);
    p1.catch(shouldNotRun);
    p2.catch(catchFn);

    p1.then(function() {
        // P.prototype.then() should return a new P
        score += p1.then() instanceof P && p1.then() !== p1;
        check();
    });

    function check() {
        if (score === 5) asyncTestPassed();
    }
}

// correct prototype chain
var unused_44 = function(){

    class C extends Promise {}
    var c = new C(function(resolve, reject) { resolve("foo"); });
    return c instanceof C && c instanceof Promise && Object.getPrototypeOf(C) === Promise;
}

// Promise.all
var unused_45 = function(){

    class P extends Promise {}
    var fulfills = P.all([
        new Promise(function(resolve)   { setTimeout(resolve,200,"foo"); }),
        new Promise(function(resolve)   { setTimeout(resolve,100,"bar"); }),
    ]);
    var rejects = P.all([
        new Promise(function(_, reject) { setTimeout(reject, 200,"baz"); }),
        new Promise(function(_, reject) { setTimeout(reject, 100,"qux"); }),
    ]);
    var score = +(fulfills instanceof P);
    fulfills.then(function(result) { score += (result + "" === "foo,bar"); check(); });
    rejects.catch(function(result) { score += (result === "qux"); check(); });

    function check() {
        if (score === 3) asyncTestPassed();
    }
}

// Promise.race
var unused_46 = function(){

    class P extends Promise {}
    var fulfills = P.race([
        new Promise(function(resolve)   { setTimeout(resolve,200,"foo"); }),
        new Promise(function(_, reject) { setTimeout(reject, 300,"bar"); }),
    ]);
    var rejects = P.race([
        new Promise(function(_, reject) { setTimeout(reject, 200,"baz"); }),
        new Promise(function(resolve)   { setTimeout(resolve,300,"qux"); }),
    ]);
    var score = +(fulfills instanceof P);
    fulfills.then(function(result) { score += (result === "foo"); check(); });
    rejects.catch(function(result) { score += (result === "baz"); check(); });

    function check() {
        if (score === 3) asyncTestPassed();
    }
}

///42.  miscellaneous subclassables
///43.  Object static methods accept primitives
///44.  own property order
// Object.getOwnPropertyNames
var unused_47 = function(){

    var obj = {
        2:    true,
        0:    true,
        1:    true,
        ' ':  true,
        9:    true,
        D:    true,
        B:    true,
        '-1': true,
    };
    obj.A = true;
    obj[3] = true;
    Object.defineProperty(obj, 'C', { value: true, enumerable: true });
    Object.defineProperty(obj, '4', { value: true, enumerable: true });
    delete obj[2];
    obj[2] = true;

    return Object.getOwnPropertyNames(obj).join('') === "012349 DB-1AC";
}

// Object.assign
var unused_48 = function(){

    function f(key) {
        return {
            get: function() { result += key; return true; },
            set: Object,
            enumerable: true
        };
    };
    var result = '';
    var obj = Object.defineProperties({}, {
        2:    f(2),
        0:    f(0),
        1:    f(1),
        ' ':  f(' '),
        9:    f(9),
        D:    f('D'),
        B:    f('B'),
        '-1': f('-1'),
    });
    Object.defineProperty(obj,'A',f('A'));
    Object.defineProperty(obj,'3',f('3'));
    Object.defineProperty(obj,'C',f('C'));
    Object.defineProperty(obj,'4',f('4'));
    delete obj[2];
    obj[2] = true;

    Object.assign({}, obj);

    return result === "012349 DB-1AC";
}

///45.  miscellaneous
// accessors aren't constructors
var unused_49 = function(){

    try {
        new (Object.getOwnPropertyDescriptor({get a(){}}, 'a')).get;
    } catch(e) {
        return true;
    }
}

// built-in prototypes are not instances
var unused_50 = function(){

    try {
        Boolean.prototype.valueOf(); return false;
    } catch(e) {}
    try {
        Number.prototype.valueOf(); return false;
    } catch(e) {}
    try {
        String.prototype.toString(); return false;
    } catch(e) {}
    try {
        RegExp.prototype.source; return false;
    } catch(e) {}
    try {
        Date.prototype.valueOf(); return false;
    } catch(e) {}
    return true;
}

///46.  __proto__ in object literals[33]
///47.  Object.prototype.__proto__
// present in Object.getOwnPropertyNames()
var unused_51 = function(){

    return Object.getOwnPropertyNames(Object.prototype).indexOf('__proto__') > -1;
}

///48.  String.prototype HTML methods
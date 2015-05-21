///1.  object literal extensions
// computed properties
var chrome_1 = function(){

    var x = 'y';
    return ({ [x]: 1 }).y === 1;
};

// shorthand properties
var chrome_2 = function(){

    var a = 7, b = 8, c = {a,b};
    return c.a === 7 && c.b === 8;
};

// shorthand methods
var chrome_3 = function(){

    return ({ y() { return 2; } }).y() === 2;
};

// string-keyed shorthand methods
var chrome_4 = function(){

    return ({ "foo bar"() { return 4; } })["foo bar"]() === 4;
};

// computed shorthand methods
var chrome_5 = function(){

    var x = 'y';
    return ({ [x](){ return 1 } }).y() === 1;
};

// computed accessors
var chrome_6 = function(){

    var x = 'y',
        valueSet,
        obj = {
            get [x] () { return 1 },
    set [x] (value) { valueSet = value }
};
obj.y = 'foo';
return obj.y === 1 && valueSet === 'foo';
};

///2.  for..of loops
// with arrays
var chrome_7 = function(){

    var arr = [5];
    for (var item of arr)
    return item === 5;
};

// with strings
var chrome_8 = function(){

    var str = "";
    for (var item of "foo")
    str += item;
    return str === "foo";
};

// with astral plane strings
var chrome_9 = function(){

    var str = "";
    for (var item of "𠮷𠮶")
    str += item + " ";
    return str === "𠮷 𠮶 ";
};

// with generic iterables
var chrome_10 = function(){

    var result = "";
    var iterable = global.__createIterableObject(1, 2, 3);
    for (var item of iterable) {
        result += item;
    }
    return result === "123";
};

// with instances of generic iterables
var chrome_11 = function(){

    var result = "";
    var iterable = global.__createIterableObject(1, 2, 3);
    for (var item of Object.create(iterable)) {
        result += item;
    }
    return result === "123";
};

///3.  octal and binary literals
// octal literals
var chrome_12 = function(){

    return 0o10 === 8 && 0O10 === 8;
};

// binary literals
var chrome_13 = function(){

    return 0b10 === 2 && 0B10 === 2;
};

// octal supported by Number()
var chrome_14 = function(){

    return Number('0o1') === 1;
};

// binary supported by Number()
var chrome_15 = function(){

    return Number('0b1') === 1;
};

///4.  template strings
// basic functionality
var chrome_16 = function(){

    var a = "ba", b = "QUX";
    return `foo bar
    ${a + "z"} ${b.toLowerCase()}` === "foo bar\nbaz qux";
};

// tagged template strings
var chrome_17 = function(){

    var called = false;
    function fn(parts, a, b) {
        called = true;
        return parts instanceof Array &&
            parts[0]     === "foo"      &&
            parts[1]     === "bar\n"    &&
            parts.raw[0] === "foo"      &&
            parts.raw[1] === "bar\\n"   &&
            a === 123                   &&
            b === 456;
    }
    return fn `foo${123}bar\n${456}` && called;
};

///5.  const
// basic support
var chrome_18 = function(){

    const foo = 123;
    return (foo === 123);
};

// basic support (strict mode)
var chrome_19 = function(){

    "use strict";
    const foo = 123;
    return (foo === 123);
};

// is block-scoped (strict mode)
var chrome_20 = function(){

    'use strict';
    const bar = 123;
    { const bar = 456; }
    return bar === 123;
};

// redefining a const (strict mode)
var chrome_21 = function(){

    'use strict';
    const baz = 1;
    try {
        Function("'use strict'; const foo = 1; foo = 2;")();
    } catch(e) {
        return true;
    }
};

// temporal dead zone (strict mode)
var chrome_22 = function(){

    'use strict';
    var passed = (function(){ try { qux; } catch(e) { return true; }}());
    const qux = 456;
    return passed;
};

///6.  let
// basic support (strict mode)
var chrome_23 = function(){

    'use strict';
    let foo = 123;
    return (foo === 123);
};

// is block-scoped (strict mode)
var chrome_24 = function(){

    'use strict';
    let bar = 123;
    { let bar = 456; }
    return bar === 123;
};

// for-loop statement scope (strict mode)
var chrome_25 = function(){

    'use strict';
    let baz = 1;
    for(let baz = 0; false; false) {}
    return baz === 1;
};

// temporal dead zone (strict mode)
var chrome_26 = function(){

    'use strict';
    var passed = (function(){ try {  qux; } catch(e) { return true; }}());
    let qux = 456;
    return passed;
};

// for-loop iteration scope (strict mode)
var chrome_27 = function(){

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
var chrome_28 = function(){

    'use strict';
    function f() { return 1; }
    {
        function f() { return 2; }
    }
    return f() === 1;
};

///7.  generators
// basic functionality
var chrome_29 = function(){

    function * generator(){
        yield 5; yield 6;
    };
    var iterator = generator();
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// generator function expressions
var chrome_30 = function(){

    var generator = function * (){
        yield 5; yield 6;
    };
    var iterator = generator();
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// correct "this" binding
var chrome_31 = function(){

    function * generator(){
        yield this.x; yield this.y;
    };
    var iterator = { g: generator, x: 5, y: 6 }.g();
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// sending
var chrome_32 = function(){

    var sent;
    function * generator(){
        sent = [yield 5, yield 6];
    };
    var iterator = generator();
    iterator.next();
    iterator.next("foo");
    iterator.next("bar");
    return sent[0] === "foo" && sent[1] === "bar";
};

// %GeneratorPrototype%
var chrome_33 = function(){

    function * generatorFn(){}
    var ownProto = Object.getPrototypeOf(generatorFn());
    var passed = ownProto === generatorFn.prototype;

    var sharedProto = Object.getPrototypeOf(ownProto);
    passed &= sharedProto !== Object.prototype &&
    sharedProto === Object.getPrototypeOf(function*(){}.prototype) &&
    sharedProto.hasOwnProperty('next');

    return passed;
};

// %GeneratorPrototype%.throw
var chrome_34 = function(){

    var passed = false;
    function * generator(){
        try {
            yield 5; yield 6;
        } catch(e) {
            passed = (e === "foo");
        }
    }
    var iterator = generator();
    iterator.next();
    iterator.throw("foo");
    return passed;
};

// yield operator precedence
var chrome_35 = function(){

    var passed;
    function * generator(){
        passed = yield 0 ? true : false;
    }
    var iterator = generator();
    iterator.next();
    iterator.next(true);
    return passed;
};

// yield *, arrays
var chrome_36 = function(){

    var iterator = (function * generator() {
        yield * [5, 6];
    }());
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// yield *, strings
var chrome_37 = function(){

    var iterator = (function * generator() {
        yield * "56";
    }());
    var item = iterator.next();
    var passed = item.value === "5" && item.done === false;
    item = iterator.next();
    passed    &= item.value === "6" && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// yield *, astral plane strings
var chrome_38 = function(){

    var iterator = (function * generator() {
        yield * "𠮷𠮶";
    }());
    var item = iterator.next();
    var passed = item.value === "𠮷" && item.done === false;
    item = iterator.next();
    passed    &= item.value === "𠮶" && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// yield *, generic iterables
var chrome_39 = function(){

    var iterator = (function * generator() {
        yield * global.__createIterableObject(5, 6, 7);
    }());
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 7 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// yield *, instances of iterables
var chrome_40 = function(){

    var iterator = (function * generator() {
        yield * Object.create(__createIterableObject(5, 6, 7));
    }());
    var item = iterator.next();
    var passed = item.value === 5 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 6 && item.done === false;
    item = iterator.next();
    passed    &= item.value === 7 && item.done === false;
    item = iterator.next();
    passed    &= item.value === undefined && item.done === true;
    return passed;
};

// shorthand generator methods
var chrome_41 = function(){

    var o = {
        * generator() {
        yield 5; yield 6;
    },
};;
var iterator = o.generator();
var item = iterator.next();
var passed = item.value === 5 && item.done === false;
item = iterator.next();
passed    &= item.value === 6 && item.done === false;
item = iterator.next();
passed    &= item.value === undefined && item.done === true;
return passed;
};

// string-keyed shorthand generator methods
var chrome_42 = function(){

    var o = {
        * "foo bar"() {
        yield 5; yield 6;
    },
};;
var iterator = o["foo bar"]();
var item = iterator.next();
var passed = item.value === 5 && item.done === false;
item = iterator.next();
passed    &= item.value === 6 && item.done === false;
item = iterator.next();
passed    &= item.value === undefined && item.done === true;
return passed;
};

// computed shorthand generators
var chrome_43 = function(){

    var garply = "generator";
    var o = {
        * [garply] () {
        yield 5; yield 6;
    },
};;
var iterator = o.generator();
var item = iterator.next();
var passed = item.value === 5 && item.done === false;
item = iterator.next();
passed    &= item.value === 6 && item.done === false;
item = iterator.next();
passed    &= item.value === undefined && item.done === true;
return passed;
};

///8.  typed arrays
// Int8Array
var chrome_44 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Int8Array(buffer);         view[0] = 0x80;
    return view[0] === -0x80;
};

// Uint8Array
var chrome_45 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Uint8Array(buffer);        view[0] = 0x100;
    return view[0] === 0;
};

// Uint8ClampedArray
var chrome_46 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Uint8ClampedArray(buffer); view[0] = 0x100;
    return view[0] === 0xFF;
};

// Int16Array
var chrome_47 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Int16Array(buffer);        view[0] = 0x8000;
    return view[0] === -0x8000;
};

// Uint16Array
var chrome_48 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Uint16Array(buffer);       view[0] = 0x10000;
    return view[0] === 0;
};

// Int32Array
var chrome_49 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Int32Array(buffer);        view[0] = 0x80000000;
    return view[0] === -0x80000000;
};

// Uint32Array
var chrome_50 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Uint32Array(buffer);       view[0] = 0x100000000;
    return view[0] === 0;
};

// Float32Array
var chrome_51 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Float32Array(buffer);       view[0] = 0.1;
    return view[0] === 0.10000000149011612;
};

// Float64Array
var chrome_52 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new Float64Array(buffer);       view[0] = 0.1;
    return view[0] === 0.1;
};

// DataView (Int8)
var chrome_53 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setInt8 (0, 0x80);
    return view.getInt8(0) === -0x80;
};

// DataView (Uint8)
var chrome_54 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setUint8(0, 0x100);
    return view.getUint8(0) === 0;
};

// DataView (Int16)
var chrome_55 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setInt16(0, 0x8000);
    return view.getInt16(0) === -0x8000;
};

// DataView (Uint16)
var chrome_56 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setUint16(0, 0x10000);
    return view.getUint16(0) === 0;
};

// DataView (Int32)
var chrome_57 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setInt32(0, 0x80000000);
    return view.getInt32(0) === -0x80000000;
};

// DataView (Uint32)
var chrome_58 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setUint32(0, 0x100000000);
    return view.getUint32(0) === 0;
};

// DataView (Float32)
var chrome_59 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setFloat32(0, 0.1);
    return view.getFloat32(0) === 0.10000000149011612;
};

// DataView (Float64)
var chrome_60 = function(){

    var buffer = new ArrayBuffer(64);
    var view = new DataView(buffer);
    view.setFloat64(0, 0.1);
    return view.getFloat64(0) === 0.1;
};

// %TypedArray%.prototype.subarray
var chrome_61 = function(){

    return typeof Int8Array.prototype.subarray === "function" &&
        typeof Uint8Array.prototype.subarray === "function" &&
        typeof Uint8ClampedArray.prototype.subarray === "function" &&
        typeof Int16Array.prototype.subarray === "function" &&
        typeof Uint16Array.prototype.subarray === "function" &&
        typeof Int32Array.prototype.subarray === "function" &&
        typeof Uint32Array.prototype.subarray === "function" &&
        typeof Float32Array.prototype.subarray === "function" &&
        typeof Float64Array.prototype.subarray === "function";
};

// %TypedArray%.prototype.keys
var chrome_62 = function(){

    return typeof Int8Array.prototype.keys === "function" &&
        typeof Uint8Array.prototype.keys === "function" &&
        typeof Uint8ClampedArray.prototype.keys === "function" &&
        typeof Int16Array.prototype.keys === "function" &&
        typeof Uint16Array.prototype.keys === "function" &&
        typeof Int32Array.prototype.keys === "function" &&
        typeof Uint32Array.prototype.keys === "function" &&
        typeof Float32Array.prototype.keys === "function" &&
        typeof Float64Array.prototype.keys === "function";
};

// %TypedArray%.prototype.values
var chrome_63 = function(){

    return typeof Int8Array.prototype.values === "function" &&
        typeof Uint8Array.prototype.values === "function" &&
        typeof Uint8ClampedArray.prototype.values === "function" &&
        typeof Int16Array.prototype.values === "function" &&
        typeof Uint16Array.prototype.values === "function" &&
        typeof Int32Array.prototype.values === "function" &&
        typeof Uint32Array.prototype.values === "function" &&
        typeof Float32Array.prototype.values === "function" &&
        typeof Float64Array.prototype.values === "function";
};

// %TypedArray%.prototype.entries
var chrome_64 = function(){

    return typeof Int8Array.prototype.entries === "function" &&
        typeof Uint8Array.prototype.entries === "function" &&
        typeof Uint8ClampedArray.prototype.entries === "function" &&
        typeof Int16Array.prototype.entries === "function" &&
        typeof Uint16Array.prototype.entries === "function" &&
        typeof Int32Array.prototype.entries === "function" &&
        typeof Uint32Array.prototype.entries === "function" &&
        typeof Float32Array.prototype.entries === "function" &&
        typeof Float64Array.prototype.entries === "function";
};

///9.  Map
// basic functionality
var chrome_65 = function(){

    var key = {};
    var map = new Map();

    map.set(key, 123);

    return map.has(key) && map.get(key) === 123;
};

// constructor arguments
var chrome_66 = function(){

    var key1 = {};
    var key2 = {};
    var map = new Map([[key1, 123], [key2, 456]]);

    return map.has(key1) && map.get(key1) === 123 &&
        map.has(key2) && map.get(key2) === 456;
};

// Map.prototype.set returns this
var chrome_67 = function(){

    var map = new Map();
    return map.set(0, 0) === map;
};

// -0 key converts to +0
var chrome_68 = function(){

    var map = new Map();
    map.set(-0, "foo");
    var k;
    map.forEach(function (value, key) {
        k = 1 / key;
    });
    return k === Infinity && map.get(+0) == "foo";
};

// Map.prototype.size
var chrome_69 = function(){

    var key = {};
    var map = new Map();

    map.set(key, 123);

    return map.size === 1;
};

// Map.prototype.delete
var chrome_70 = function(){

    return typeof Map.prototype.delete === "function";
};

// Map.prototype.clear
var chrome_71 = function(){

    return typeof Map.prototype.clear === "function";
};

// Map.prototype.forEach
var chrome_72 = function(){

    return typeof Map.prototype.forEach === "function";
};

// Map.prototype.keys
var chrome_73 = function(){

    return typeof Map.prototype.keys === "function";
};

// Map.prototype.values
var chrome_74 = function(){

    return typeof Map.prototype.values === "function";
};

// Map.prototype.entries
var chrome_75 = function(){

    return typeof Map.prototype.entries === "function";
};

///10.  Set
// basic functionality
var chrome_76 = function(){

    var obj = {};
    var set = new Set();

    set.add(123);
    set.add(123);

    return set.has(123);
};

// constructor arguments
var chrome_77 = function(){

    var obj1 = {};
    var obj2 = {};
    var set = new Set([obj1, obj2]);

    return set.has(obj1) && set.has(obj2);
};

// Set.prototype.add returns this
var chrome_78 = function(){

    var set = new Set();
    return set.add(0) === set;
};

// -0 key converts to +0
var chrome_79 = function(){

    var set = new Set();
    set.add(-0);
    var k;
    set.forEach(function (value) {
        k = 1 / value;
    });
    return k === Infinity && set.has(+0);
};

// Set.prototype.size
var chrome_80 = function(){

    var obj = {};
    var set = new Set();

    set.add(123);
    set.add(123);
    set.add(456);

    return set.size === 2;
};

// Set.prototype.delete
var chrome_81 = function(){

    return typeof Set.prototype.delete === "function";
};

// Set.prototype.clear
var chrome_82 = function(){

    return typeof Set.prototype.clear === "function";
};

// Set.prototype.forEach
var chrome_83 = function(){

    return typeof Set.prototype.forEach === "function";
};

// Set.prototype.keys
var chrome_84 = function(){

    return typeof Set.prototype.keys === "function";
};

// Set.prototype.values
var chrome_85 = function(){

    return typeof Set.prototype.values === "function";
};

// Set.prototype.entries
var chrome_86 = function(){

    return typeof Set.prototype.entries === "function";
};

///11.  WeakMap
// basic functionality
var chrome_87 = function(){

    var key = {};
    var weakmap = new WeakMap();

    weakmap.set(key, 123);

    return weakmap.has(key) && weakmap.get(key) === 123;
};

// constructor arguments
var chrome_88 = function(){

    var key1 = {};
    var key2 = {};
    var weakmap = new WeakMap([[key1, 123], [key2, 456]]);

    return weakmap.has(key1) && weakmap.get(key1) === 123 &&
        weakmap.has(key2) && weakmap.get(key2) === 456;
};

// WeakMap.prototype.set returns this
var chrome_89 = function(){

    var weakmap = new WeakMap();
    var key = {};
    return weakmap.set(key, 0) === weakmap;
};

// WeakMap.prototype.delete
var chrome_90 = function(){

    return typeof WeakMap.prototype.delete === "function";
};

// Support frozen objects as keys
var chrome_91 = function(){

    var f = Object.freeze({});
    var m = new WeakMap;
    m.set(f, 42);
    return m.get(f) === 42;
};

///12.  WeakSet
// basic functionality
var chrome_92 = function(){

    var obj1 = {};
    var weakset = new WeakSet();

    weakset.add(obj1);
    weakset.add(obj1);

    return weakset.has(obj1);
};

// constructor arguments
var chrome_93 = function(){

    var obj1 = {}, obj2 = {};
    var weakset = new WeakSet([obj1, obj2]);

    return weakset.has(obj1) && weakset.has(obj2);
};

// WeakSet.prototype.add returns this
var chrome_94 = function(){

    var weakset = new WeakSet();
    var obj = {};
    return weakset.add(obj) === weakset;
};

// WeakSet.prototype.delete
var chrome_95 = function(){

    return typeof WeakSet.prototype.delete === "function";
};

///13.  Promise
// basic functionality
var chrome_96 = function(){

    var p1 = new Promise(function(resolve, reject) { resolve("foo"); });
    var p2 = new Promise(function(resolve, reject) { reject("quux"); });
    var score = 0;

    function thenFn(result)  { score += (result === "foo");  check(); }
    function catchFn(result) { score += (result === "quux"); check(); }
    function shouldNotRun(result)  { score = -Infinity;   }

    p1.then(thenFn, shouldNotRun);
    p2.then(shouldNotRun, catchFn);
    p1.catch(shouldNotRun);
    p2.catch(catchFn);

    p1.then(function() {
        // Promise.prototype.then() should return a new Promise
        score += p1.then() !== p1;
        check();
    });

    function check() {
        if (score === 4) asyncTestPassed();
    }
};

// Promise.all
var chrome_97 = function(){

    var fulfills = Promise.all([
        new Promise(function(resolve)   { setTimeout(resolve,200,"foo"); }),
        new Promise(function(resolve)   { setTimeout(resolve,100,"bar"); }),
    ]);
    var rejects = Promise.all([
        new Promise(function(_, reject) { setTimeout(reject, 200,"baz"); }),
        new Promise(function(_, reject) { setTimeout(reject, 100,"qux"); }),
    ]);
    var score = 0;
    fulfills.then(function(result) { score += (result + "" === "foo,bar"); check(); });
    rejects.catch(function(result) { score += (result === "qux"); check(); });

    function check() {
        if (score === 2) asyncTestPassed();
    }
};

// Promise.race
var chrome_98 = function(){

    var fulfills = Promise.race([
        new Promise(function(resolve)   { setTimeout(resolve,200,"foo"); }),
        new Promise(function(_, reject) { setTimeout(reject, 300,"bar"); }),
    ]);
    var rejects = Promise.race([
        new Promise(function(_, reject) { setTimeout(reject, 200,"baz"); }),
        new Promise(function(resolve)   { setTimeout(resolve,300,"qux"); }),
    ]);
    var score = 0;
    fulfills.then(function(result) { score += (result === "foo"); check(); });
    rejects.catch(function(result) { score += (result === "baz"); check(); });

    function check() {
        if (score === 2) asyncTestPassed();
    }
};

///14.  Symbol
// basic functionality
var chrome_99 = function(){

    var object = {};
    var symbol = Symbol();
    var value = {};
    object[symbol] = value;
    return object[symbol] === value;
};

// typeof support
var chrome_100 = function(){

    return typeof Symbol() === "symbol";
};

// symbol keys are hidden to pre-ES6 code
var chrome_101 = function(){

    var object = {};
    var symbol = Symbol();
    object[symbol] = 1;

    for (var x in object){}
    var passed = !x;

    if (Object.keys && Object.getOwnPropertyNames) {
        passed &= Object.keys(object).length === 0
        && Object.getOwnPropertyNames(object).length === 0;
    }

    return passed;
};

// Object.defineProperty support
var chrome_102 = function(){

    var object = {};
    var symbol = Symbol();
    var value = {};

    if (Object.defineProperty) {
        Object.defineProperty(object, symbol, { value: value });
        return object[symbol] === value;
    }

    return passed;
};

// cannot coerce to string or number
var chrome_103 = function(){

    var symbol = Symbol();

    try {
        symbol + "";
        return false;
    }
    catch(e) {}

    try {
        symbol + 0;
        return false;
    } catch(e) {}

    return true;
};

// can convert with String()
var chrome_104 = function(){

    return String(Symbol("foo")) === "Symbol(foo)";
};

// new Symbol() throws
var chrome_105 = function(){

    var symbol = Symbol();
    try {
        new Symbol();
    } catch(e) {
        return true;
    }
};

// global symbol registry
var chrome_106 = function(){

    var symbol = Symbol.for('foo');
    return Symbol.for('foo') === symbol &&
        Symbol.keyFor(symbol) === 'foo';
};

///15.  well-known symbols
// Symbol.iterator
var chrome_107 = function(){

    var a = 0, b = {};
    b[Symbol.iterator] = function() {
        return {
            next: function() {
                return {
                    done: a++ === 1,
                    value: "foo"
                };
            }
        };
    };
    var c;
    for (c of b) {}
    return c === "foo";
};

// Symbol.toStringTag
var chrome_108 = function(){

    var a = {};
    a[Symbol.toStringTag] = "foo";
    return (a + "") === "[object foo]";
};

// Symbol.unscopables
var chrome_109 = function(){

    var a = { foo: 1, bar: 2 };
    a[Symbol.unscopables] = { bar: true };
    with (a) {
        return foo === 1 && typeof bar === "undefined";
    }
};

///16.  Object static methods
// Object.is
var chrome_110 = function(){

    return typeof Object.is === 'function' &&
        Object.is(NaN, NaN) &&
        !Object.is(-0, 0);
};

// Object.getOwnPropertySymbols
var chrome_111 = function(){

    var o = {};
    var sym = Symbol(), sym2 = Symbol(), sym3 = Symbol();
    o[sym]  = true;
    o[sym2] = true;
    o[sym3] = true;
    var result = Object.getOwnPropertySymbols(o);
    return result[0] === sym
        && result[1] === sym2
        && result[2] === sym3;
};

// Object.setPrototypeOf
var chrome_112 = function(){

    return Object.setPrototypeOf({}, Array.prototype) instanceof Array;
};

///17.  function "name" property
// function statements
var chrome_113 = function(){

    function foo(){};
    return foo.name === 'foo' &&
        (function(){}).name === '';
};

// function expressions
var chrome_114 = function(){

    return (function foo(){}).name === 'foo' &&
        (function(){}).name === '';
};

// shorthand methods
var chrome_115 = function(){

    var o = { foo(){} };
return o.foo.name === "foo";
};

// shorthand methods (no lexical binding)
var chrome_116 = function(){

    var f = "foo";
    return ({f() { return f; }}).f() === "foo";
};

// isn't writable, is configurable
var chrome_117 = function(){

    var descriptor = Object.getOwnPropertyDescriptor(function f(){},"name");
    return descriptor.enumerable   === false &&
        descriptor.writable     === false &&
        descriptor.configurable === true;
};

///18.  String static methods
// String.raw
var chrome_118 = function(){

    return typeof String.raw === 'function';
};

// String.fromCodePoint
var chrome_119 = function(){

    return typeof String.fromCodePoint === 'function';
};

///19.  String.prototype methods
// String.prototype.codePointAt
var chrome_120 = function(){

    return typeof String.prototype.codePointAt === 'function';
};

// String.prototype.normalize
var chrome_121 = function(){

    return typeof String.prototype.normalize === "function"
        && "c\u0327\u0301".normalize("NFC") === "\u1e09"
        && "\u1e09".normalize("NFD") === "c\u0327\u0301";
};

// String.prototype.repeat
var chrome_122 = function(){

    return typeof String.prototype.repeat === 'function'
        && "foo".repeat(3) === "foofoofoo";
};

// String.prototype.startsWith
var chrome_123 = function(){

    return typeof String.prototype.startsWith === 'function'
        && "foobar".startsWith("foo");
};

// String.prototype.endsWith
var chrome_124 = function(){

    return typeof String.prototype.endsWith === 'function'
        && "foobar".endsWith("bar");
};

// String.prototype.includes
var chrome_125 = function(){

    return typeof String.prototype.includes === 'function'
        && "foobar".includes("oba");
};

///20.  Array.prototype methods
// Array.prototype.keys
var chrome_126 = function(){

    return typeof Array.prototype.keys === 'function';
};

// Array.prototype.entries
var chrome_127 = function(){

    return typeof Array.prototype.entries === 'function';
};

// Array.prototype[Symbol.unscopables]
var chrome_128 = function(){

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

///21.  Number properties
// Number.isFinite
var chrome_129 = function(){

    return typeof Number.isFinite === 'function';
};

// Number.isInteger
var chrome_130 = function(){

    return typeof Number.isInteger === 'function';
};

// Number.isSafeInteger
var chrome_131 = function(){

    return typeof Number.isSafeInteger === 'function';
};

// Number.isNaN
var chrome_132 = function(){

    return typeof Number.isNaN === 'function';
};

// Number.EPSILON
var chrome_133 = function(){

    return typeof Number.EPSILON === 'number';
};

// Number.MIN_SAFE_INTEGER
var chrome_134 = function(){

    return typeof Number.MIN_SAFE_INTEGER === 'number';
};

// Number.MAX_SAFE_INTEGER
var chrome_135 = function(){

    return typeof Number.MAX_SAFE_INTEGER === 'number';
};

///22.  Math methods
// Math.clz32
var chrome_136 = function(){

    return typeof Math.clz32 === "function";
};

// Math.imul
var chrome_137 = function(){

    return typeof Math.imul === "function";
};

// Math.sign
var chrome_138 = function(){

    return typeof Math.sign === "function";
};

// Math.log10
var chrome_139 = function(){

    return typeof Math.log10 === "function";
};

// Math.log2
var chrome_140 = function(){

    return typeof Math.log2 === "function";
};

// Math.log1p
var chrome_141 = function(){

    return typeof Math.log1p === "function";
};

// Math.expm1
var chrome_142 = function(){

    return typeof Math.expm1 === "function";
};

// Math.cosh
var chrome_143 = function(){

    return typeof Math.cosh === "function";
};

// Math.sinh
var chrome_144 = function(){

    return typeof Math.sinh === "function";
};

// Math.tanh
var chrome_145 = function(){

    return typeof Math.tanh === "function";
};

// Math.acosh
var chrome_146 = function(){

    return typeof Math.acosh === "function";
};

// Math.asinh
var chrome_147 = function(){

    return typeof Math.asinh === "function";
};

// Math.atanh
var chrome_148 = function(){

    return typeof Math.atanh === "function";
};

// Math.trunc
//Math.floor for positive numbers, Math.ceil for negatives. rounds towards zero
var chrome_149 = function(){

    return typeof Math.trunc === "function";
};

// Math.fround
var chrome_150 = function(){

    return typeof Math.fround === "function";
};

// Math.cbrt
var chrome_151 = function(){

    return typeof Math.cbrt === "function";
};

// Math.hypot
var chrome_152 = function(){

    return Math.hypot() === 0 &&
        Math.hypot(1) === 1 &&
        Math.hypot(9, 12, 20) === 25 &&
        Math.hypot(27, 36, 60, 100) === 125;
};

///23.  Object static methods accept primitives
// Object.getPrototypeOf
var chrome_153 = function(){

    return Object.getPrototypeOf('a').constructor === String;
};

// Object.getOwnPropertyDescriptor
var chrome_154 = function(){

    return Object.getOwnPropertyDescriptor("foo", 0).value === 'f';
};

// Object.getOwnPropertyNames
var chrome_155 = function(){

    var s = Object.getOwnPropertyNames('a');
    return s.length === 2 &&
        ((s[0] === 'length' && s[1] === '0') || (s[0] === '0' && s[1] === 'length'));
};

// Object.seal
var chrome_156 = function(){

    return Object.seal('a') === 'a';
};

// Object.freeze
var chrome_157 = function(){

    return Object.freeze('a') === 'a';
};

// Object.preventExtensions
var chrome_158 = function(){

    return Object.preventExtensions('a') === 'a';
};

// Object.isSealed
var chrome_159 = function(){

    return Object.isSealed('a') === true;
};

// Object.isFrozen
var chrome_160 = function(){

    return Object.isFrozen('a') === true;
};

// Object.isExtensible
var chrome_161 = function(){

    return Object.isExtensible('a') === false;
};

// Object.keys
var chrome_162 = function(){

    var s = Object.keys('a');
    return s.length === 1 && s[0] === '0';
};

///24.  own property order
// for..in

//objects order is as follows:
//integer indexes(*) in ascending order
//strings in creation order
//Symbols in creation order
var chrome_163 = function(){

    var obj = {
        2:    true,
        0:    true,
        1:    true,
        ' ':  true,
        9:    true,
        D:    true,
        B:    true,
        '-1': true
    };
    obj.A = true;
    obj[3] = true;
    Object.defineProperty(obj, 'C', { value: true, enumerable: true });
    Object.defineProperty(obj, '4', { value: true, enumerable: true });
    delete obj[2];
    obj[2] = true;

    var result = '';
    for(var i in obj) {
        result += i;
    }
    return result === "012349 DB-1AC";
};

// Object.keys
var chrome_164 = function(){

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

    return Object.keys(obj).join('') === "012349 DB-1AC";
};

// Object.getOwnPropertyNames
var chrome_165 = function(){

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
};

// JSON.stringify
var chrome_166 = function(){

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

    return JSON.stringify(obj) ===
        '{"0":true,"1":true,"2":true,"3":true,"4":true,"9":true," ":true,"D":true,"B":true,"-1":true,"A":true,"C":true}';
};

// JSON.parse
var chrome_167 = function(){

    var result = '';
    JSON.parse(
        '{"0":true,"1":true,"2":true,"3":true,"4":true,"9":true," ":true,"D":true,"B":true,"-1":true,"A":true,"C":true}',
        function reviver(k,v) {
            result += k;
            return v;
        }
    );
    return result === "012349 DB-1AC";
};

///25.  miscellaneous
// duplicate property names in strict mode
var chrome_168 = function(){

    'use strict';
    return this === undefined && ({ a:1, a:1 }).a === 1;
};

// no semicolon needed after do-while
var chrome_169 = function(){

    do {} while (false) return true;
};

// accessors aren't constructors
var chrome_170 = function(){

    try {
        new (Object.getOwnPropertyDescriptor({get a(){}}, 'a')).get;
    } catch(e) {
        return true;
    }
};

// Invalid Date
var chrome_171 = function(){

    return new Date(NaN) + "" === "Invalid Date";
};

///26.  __proto__ in object literals[33]
// basic support
var chrome_172 = function(){

    return { __proto__ : [] } instanceof Array
        && !({ __proto__ : null } instanceof Object);
};

// multiple __proto__ is an error
var chrome_173 = function(){

    try {
        eval("({ __proto__ : [], __proto__: {} })");
    }
    catch(e) {
        return true;
    }
};

// not a computed property
var chrome_174 = function(){

        if (!({ __proto__ : [] } instanceof Array)) {
            return false;
        }
        var a = "__proto__";
        return !({ [a] : [] } instanceof Array);
};

// not a shorthand property
var chrome_175 = function(){

    if (!({ __proto__ : [] } instanceof Array)) {
        return false;
    }
    var __proto__ = [];
    return !({ __proto__ } instanceof Array);
};

// not a shorthand method
var chrome_176 = function(){

        if (!({ __proto__ : [] } instanceof Array)) {
            return false;
        }
        return !({ __proto__(){} } instanceof Function);
};

///27.  Object.prototype.__proto__
// get prototype
var chrome_177 = function(){

    var A = function(){};
    return (new A()).__proto__ === A.prototype;
};

// set prototype
var chrome_178 = function(){

    var o = {};
    o.__proto__ = Array.prototype;
    return o instanceof Array;
};

// absent from Object.create(null)
var chrome_179 = function(){

    var o = Object.create(null), p = {};
    o.__proto__ = p;
    return Object.getPrototypeOf(o) !== p;
};

// present in hasOwnProperty()
var chrome_180 = function(){

    return Object.prototype.hasOwnProperty('__proto__');
};

// correct property descriptor
var chrome_181 = function(){

    var desc = Object.getOwnPropertyDescriptor(Object.prototype,"__proto__");
    var A = function(){};

    return (desc
    && "get" in desc
    && "set" in desc
    && desc.configurable
    && !desc.enumerable);
};

// present in Object.getOwnPropertyNames()
var chrome_182 = function(){

    return Object.getOwnPropertyNames(Object.prototype).indexOf('__proto__') > -1;
};

///28.  String.prototype HTML methods
// existence
var chrome_183 = function(){

    var i, names = ["anchor", "big", "bold", "fixed", "fontcolor", "fontsize",
        "italics", "link", "small", "strike", "sub", "sup"];
    for (i = 0; i < names.length; i++) {
        if (typeof String.prototype[names[i]] !== 'function') {
            return false;
        }
    }
    return true;
};

// tags' names are lowercase
var chrome_184 = function(){

    var i, names = ["anchor", "big", "bold", "fixed", "fontcolor", "fontsize",
        "italics", "link", "small", "strike", "sub", "sup"];
    for (i = 0; i < names.length; i++) {
        if (""[names[i]]().toLowerCase() !== ""[names[i]]()) {
            return false;
        }
    }
    return true;
};

// quotes in arguments are escaped
var chrome_185 = function(){

    var i, names = ["anchor", "fontcolor", "fontsize", "link"];
    for (i = 0; i < names.length; i++) {
        if (""[names[i]]('"') !== ""[names[i]]('&' + 'quot;')) {
            return false;
        }
    }
    return true;
};

// RegExp.prototype.compile
//confusing point -- mdn says this functionality is dropped
var chrome_186 = function(){
    return typeof RegExp.prototype.compile === 'function';
};
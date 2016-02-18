const assert = require('assert');

function match(value, params) {
    const func = params[value];
    if (func) {
        return func.call();
    }

    const defaultFunc = params['default'];
    if (defaultFunc) {
        return defaultFunc.call();
    }

}

function check(value, type) {
    if (type == String) {
        return (typeof value == 'string');
    }

    if (type == Number) {
        return (typeof value == 'number');
    }

    if (type == Function) {
        return (typeof value == 'function');
    }

    if (type == Array) {
        return (Array.isArray(value));
    }

    if (type == Object) {
        return (Object.prototype.toString.call(value) == '[object Object]');
    }

    console.log(Object.prototype.toString.call(value));
    return false;
}

function typeToString(type) {
    return match(type, {
        [String]: () => 'String',
        [Number]: () => 'Number',
        [Function]: () => 'Function',
        [Array]: () => 'Array',
        [Object]: () => 'Object',
        default: () => 'Unknown',
    });
}

function assertType(value, type) {
    if (!check(value, type)) {
        const msg = `Expected ${type}, but got ${value}`;
        throw new Error();
    }
}

assert(
    check('some string', String),
    'String is of type String'
);

assert(
    !check(42, String),
    'Number is not of type String'
);

assert(
    check(42, Number),
    'Number is of type Number'
);

assert(
    check(() => {}, Function),
    'Function is of type Function'
);

assert(
    check([], Array),
    'Array is of type Array'
);

assert(
    check({}, Object),
    'Object is of type Object'
);

assert(
    !check(null, Object),
    'Null is not of type Object'
);

assert(
    !check(undefined, Object),
    'Undefined is not of type Object'
);

function struct(conf) {
    assertType(conf, Object);
    const keys = Object.keys(conf);
    return function(params) {
        return keys.map(key => {
            if (!check(params[key], conf[key])) {
                const msg = `Expected '${key}' to be of type ${typeToString(conf[key])}`;
                throw new Error(msg);
            }
            return params[key];
        });
    }
}

const User = struct({
    name: String,
    email: String,
    age: Number
});

const bob = User({
    name: 'Bob',
    email: 'bob@example.com',
    age: 30
});

const Post = struct({
    title: String,
    text: String,
    author: User
});

const post = Post({
    title: 'Important',
    text: 'Some text',
    author: bob
});

'use strict';

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

    if (value.constructor == type) {
        return true;
    }

    return false;
}

function typeToString(type) {
    return match(type, {
        [String]: () => 'String',
        [Number]: () => 'Number',
        [Function]: () => 'Function',
        [Array]: () => 'Array',
        [Object]: () => 'Object',
        default: () => type.name || 'Unknown',
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

//const User = struct({
//    name: String,
//    email: String,
//    age: Number
//});
//
//const bob = User({
//    name: 'Bob',
//    email: 'bob@example.com',
//    age: 30
//});
//
//const Post = struct({
//    title: String,
//    text: String,
//    author: User
//});


class Struct {
    constructor(params) {
        const name = this.constructor.name;
        const schema = this.constructor.schema;
        if (!schema) {
            const msg = `No schema found for structure ${name}`;
            throw new Error(msg);
        }

        Object.keys(schema).forEach(key => {
            if (!check(params[key], schema[key])) {
                const msg = `Expected '${name}.${key}' to be of type ${typeToString(schema[key])}`;
                throw new Error(msg);
            }
            this[key] = params[key];
        });

        Object.freeze(this);
    }

    update(param) {
        const name = this.constructor.name;
        const schema = this.constructor.schema;
        let func;

        if (check(param, Function)) {
            func = param;
        }

        if (check(param, Object)) {
            func = () => param;
        }

        if (func) {
            const mods = func.call(null, this);
            Object.keys(mods).forEach(key => {
                if (schema[key] && !check(mods[key], schema[key])) {
                    const msg = `Expected '${name}.${key}' to be of type ${typeToString(schema[key])}`;
                    throw new Error(msg);
                }
            });

            const data = Object.assign({}, this, mods);

            return new this.constructor(data);
        } else {
            throw new Error('Struct update method accepts only object or function as argument');
        }
    }
}

class User extends Struct {
    static schema = {
        name: String,
        email: String,
        age: Number
    };
}

const bob = new User({
    name: 'Bob',
    email: 'bob@example.com',
    age: 30
});

console.log(bob);

class Post extends Struct {
    static schema = {
        title: String,
        text: String,
        author: User
    };
}

const post = new Post({
    title: 'Important',
    text: 'Some text',
    author: bob
});

console.log(post);

const updatedPost = post.update({text: 'Cool text'});

console.log(updatedPost);

const updatedPost2 = post.update(obj => ({
    title: 'Very ' + obj.title
}));

console.log(updatedPost2);

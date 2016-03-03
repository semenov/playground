import assert from 'assert';

export function match(value, params) {
  const func = params[value];
  if (func) {
    return func.call();
  }

  const defaultFunc = params['default'];
  if (defaultFunc) {
    return defaultFunc.call();
  }

}

export function check(value, type) {
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

export function typeToString(type) {
  return match(type, {
    [String]: () => 'String',
    [Number]: () => 'Number',
    [Function]: () => 'Function',
    [Array]: () => 'Array',
    [Object]: () => 'Object',
    default: () => type.name || 'Unknown',
  });
}

export function assertType(value, type) {
  if (!check(value, type)) {
    const msg = `Expected ${type}, but got ${value}`;
    throw new Error(msg);
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
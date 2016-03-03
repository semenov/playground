import {match, check, typeToString, assertType} from './utils';

export default class Struct {
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
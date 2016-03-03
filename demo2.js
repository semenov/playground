'use strict';

import assert from 'assert';
import {match, check, typeToString, assertType} from './utils';
import Struct from './struct';

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

console.log(Object.keys(Post));

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

class Person extends Struct {
  static schema = {
    firstName: String,
    lastName: String,
    age: Number
  };

  get fullName() {
    return this.firstName + this.lastName;
  }
}

const jack = new Person({
  firstName: 'Jack',
  lastName: 'Black',
  age: 35
});

console.log(jack.fullName);

function List() {}

class State extends Struct {
  static schema = {
    posts: Array
  };

}
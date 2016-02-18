function Person(name, age) {
	console.log('Person constructor', this.incrementAge);
	this.name = name;
	this.age = age;
}

Person.prototype = {
	incrementAge: function() {
		this.age++;
	}
};


var man = new Person('John', 25);

console.log(man);
man.incrementAge();
console.log(man);
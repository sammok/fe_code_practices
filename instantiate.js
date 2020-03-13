//  https://github.com/mqyqingfeng/Blog/issues/15

// 创建对象的多种方式以及优缺点

// 1.工厂模式
function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function () {
      console.log(this.name);
  };

  return o;
}

var person1 = createPerson('kevin');

// 缺点：对象无法识别，因为所有的实例都指向一个原型

// 2.构造函数模式
function Person(name) {
  this.name = name;
  this.getName = function () {
      console.log(this.name);
  };
}

var person1 = new Person('kevin');
// 优点：实例可以识别为一个特定的类型
// 缺点：每次创建实例时，每个方法都要被创建一次

// 2.1 构造函数模式优化
function Person(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
}

var person1 = new Person('kevin');

// 3.原型模式
function Person(name) {

}

Person.prototype.name = 'keivn';
Person.prototype.getName = function () {
    console.log(this.name);
};

var person1 = new Person();
// 优点：方法不会重新创建
// 缺点：1. 所有的属性和方法都共享 2. 不能初始化参数

// 3.1 原型模式优化
function Person(name) {

}

Person.prototype = {
    name: 'kevin',
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
// 优点：封装性好了一点
// 缺点：重写了原型，丢失了 constructor 属性


// 3.2 原型模式优化
function Person(name) {

}

Person.prototype = {
    constructor: Person,
    name: 'kevin',
    getName: function () {
        console.log(this.name);
    }
};

var person1 = new Person();
// 优点：实例可以通过 constructor 属性找到所属构造函数
// 缺点：原型模式该有的缺点还是有


// 4.组合模式
// 构造函数模式与原型模式双剑合璧
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  getName: function () {
      console.log(this.name);
  }
};

var person1 = new Person();

// 优点：该共享的共享，该私有的私有，使用最广泛的方式
// 缺点：有的人就是希望全部都写在一起，即更好的封装性

// 4.1 动态原型模式
function Person(name) {
  this.name = name;
  if (typeof this.getName != "function") {
      Person.prototype.getName = function () {
          console.log(this.name);
      }
  }
}

var person1 = new Person();

// 5.1 寄生构造函数模式
function Person(name) {

  var o = new Object();
  o.name = name;
  o.getName = function () {
      console.log(this.name);
  };

  return o;

}

var person1 = new Person('kevin');
console.log(person1 instanceof Person) // false
console.log(person1 instanceof Object)  // true

// 5.2 稳妥构造函数模式
function person(name){
  var o = new Object();
  o.sayName = function(){
      console.log(name);
  };
  return o;
}

var person1 = person('kevin');

person1.sayName(); // kevin

person1.name = "daisy";

person1.sayName(); // kevin

console.log(person1.name); // daisy
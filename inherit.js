//  https://github.com/mqyqingfeng/Blog/issues/16

//  1.原型链继承
(() => {
  function Parent () {
    this.name = 'kevin';
  }
  
  Parent.prototype.getName = function () {
    console.log(this.name);
  }
  
  function Child () {
  }
  
  Child.prototype = new Parent();
  Child.prototype.constructor = Child;
  
  var child = new Child();
  
  console.log(child.getName()) // kevin
})();

//  缺点：
//  原型对象中的引用类型的属性被所有实例共享
//  在创建 Child 的实例时，不能向 Parent 传参

// -------------------------------------------
// 2.借用构造函数（经典继承）
(() => {
  function Parent () {
      this.names = ['kevin', 'daisy'];
  }

  //  not working in Child instance, just Parent constructor works
  Parent.prototype.hi = 123;  

  function Child () {
      Parent.call(this);
  }

  var child1 = new Child();

  child1.names.push('yayu');

  console.log(child1.names); // ["kevin", "daisy", "yayu"]

  var child2 = new Child();

  console.log(child2.names); // ["kevin", "daisy"]
  console.log(child1.hi, 'should be undefined');
})();
//  优点：
//  1.避免引用类型的属性被所有实例共享
//  2.可以在 Child 中向 Parent 传参
//  缺点:
//  1.Parent 的方法都在构造函数中定义，每次创建实例都会创建一遍方法(空间开销)

// -------------------------------------------------------
// 3.组合继承（原型链继承+借用构造函数继承）
(() => {
  function Parent (name) {
      this.name = name;
      this.colors = ['red', 'blue', 'green'];
  }

  Parent.prototype.getName = function () {
      console.log(this.name)
  }

  function Child (name, age) {
      //  借用构造函数来覆盖 prototype 对象的属性
      //  因此 Parent 构造函数内声明的属性被复制到 Child 身上
      Parent.call(this, name);
      this.age = age;

  }

  Child.prototype = new Parent();
  //  修复构造函数的指向
  Child.prototype.constructor = Child;
  
  var child1 = new Child('kevin', '18');

  child1.colors.push('black');

  console.log(child1.name); // kevin
  console.log(child1.age); // 18
  console.log(child1.colors); // ["red", "blue", "green", "black"]

  var child2 = new Child('daisy', '20');

  console.log(child2.name); // daisy
  console.log(child2.age); // 20
  console.log(child2.colors); // ["red", "blue", "green"]
  console.log(child2.__proto__.colors, 'parent still have duplicate properties');
})();
//  优点：
//  融合了原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式

// 4.原型式继承
//  ES5 Object.create()  的模拟实现，将传入的对象作为创建的对象的原型
(() => {
  function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
  }

  var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
  }

  var person1 = createObj(person);
  var person2 = createObj(person);

  person1.name = 'person1';
  console.log(person2.name); // kevin

  person1.friends.push('taylor');
  // ["daisy", "kelly", "taylor"], true
  console.log(person2.friends, person1.friends === person2.friends); 
})();
//  缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样
//  修改了对象的值不会共享是因为并非修改了原型链对象的值，而是给自己赋值

// 5.寄生式继承
(() => {
  function createObj (o) {
    var clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
  }
})();
//  创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象
//  缺点: 跟借用构造函数模式一样，每次创建对象都会创建一遍方法，占空间

// 6.寄生组合继承
// 改进组合继承最大的缺点：会调用两次父构造函数，
// 一次在 Child.prototype = new Parent();
// 一次在创建子类实例时，子类构造函数执行 Parent.call(this, name);
(() => {
  function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
  }

  Parent.prototype.getName = function () {
      console.log(this.name)
  }

  function Child (name, age) {
      //  借用 Parent 构造函数
      Parent.call(this, name);
      this.age = age;
  }

  // 关键的三步
  var F = function () {};

  F.prototype = Parent.prototype; //  借用 Parent 对象 prototype

  Child.prototype = new F(); //  设置子对象原型对象为 F

  var child1 = new Child('kevin', '18');

  console.log(child1);

  //  最后封装一下这种方法
  function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
  }

  function prototype(child, parent) {
      var prototype = object(parent.prototype);
      //  修正 constructor
      prototype.constructor = child;
      child.prototype = prototype;
  }

  // 当我们使用的时候：
  prototype(Child, Parent);
})();

//  优点：
//  这种方式的高效率体现它只调用了一次 Parent 构造函数，
//  并且因此避免了在 Child.prototype 对象上面创建不必要的、多余的属性。
//  与此同时，原型链还能保持不变；
//  因此，还能够正常使用 instanceof 和 isPrototypeOf。
//  开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。


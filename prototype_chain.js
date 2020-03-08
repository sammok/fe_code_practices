//  https://github.com/mqyqingfeng/Blog/issues/2
function Person() {
}

let person = new Person();
person.name = 'Wolf';
// 构造函数的 prototype 是个带有 constructor: Person 属性的字面量对象, 调用构造函数时作为实例的原型
console.log(Person.prototype); 

//  Person(构造函数) -> prototype -> Person.prototype(实例原型)
//  prototype(实例原型) 是：每一个 Javascript 对象(null 除外)在创建的时候就会与之关联另外一个对象，
//  每个对象都会从 prototype 继承与共享属性

//  Javascript 对象(null 除外)都具有一个 __proto__ 属性，这属性指向该对象的原型对象
console.log(person.__proto__ === Person.prototype); // true

//  原型对象会有一个 constructor: Fn 属性指向构造函数
Person.prototype.age = 21;
console.log(person.age);

//  读取属性的对象，如果在实例找不到，就会沿着实例的原型链(原型的原型)向上查找，直到查到 Object.prototype
//  Object.prototype.__proto__ == null 也就是没有

//  因为 person 没有 constructor 属性，所以会从 Person.prototype 读取
console.log(person.constructor === Person.prototype.constructor); //  true

//  __proto__ 其实是属于 Object.prototype 的属性，并且是个 getter/setter
//  当使用 obj.__proto__ 时，可以理解成返回了 Object.getPrototypeOf(obj)

//  more:
//  继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，
//  相反，JavaScript 只是在两个对象之间创建一个关联，
//  这样，一个对象就可以通过委托访问另一个对象的属性和函数，
//  所以与其叫继承，委托的说法反而更准确些
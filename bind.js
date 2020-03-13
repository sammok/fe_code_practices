//  https://github.com/mqyqingfeng/Blog/issues/12
//  bind
//  bind() 方法会创建一个新的函数，当这个函数被调用时，
//  bind() 的第一个参数会作为运行时的 this, 
//  之后的一系列参数将会在传递实参前传入作为它的参数

//  bind 函数两个特点
//  1.返回一个函数
//  2.可以传入参数

//  第一版
Function.prototype.bind2 = function (context) {
  var self = this;
  return function () {
      //  改变 this 的指向
      return self.apply(context);
  }
}

//  传参的模拟实现
//  第二版
Function.prototype.bind2 = function (context) {
  var self = this;
  // 获取 bind2 函数从第二个参数到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1);

  return function () {
      // 这个时候的 arguments 是指 bind 返回的函数传入的参数
      var bindArgs = Array.prototype.slice.call(arguments);
      return self.apply(context, args.concat(bindArgs));
  }
}

//  构造函数效果的模拟实现
//  一个绑定函数也能使用 new 操作符创建对象：这种行为就像把原函数当成构造器。
//  提供的 this 值被忽略，同时调用时的参数被提供给模拟函数

// 第三版
// 🌰
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin

// 实现
Function.prototype.bind2 = function (context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fBound = function () {
      var bindArgs = Array.prototype.slice.call(arguments);
      // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
      // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
      // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
      return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
  }
  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  fBound.prototype = this.prototype;
  return fBound;
}

// 第四版 构造函数效果的优化实现
// 举个🌰
function bar() {}
var bindFoo = bar.bind2(null);
bindFoo.prototype.value = 1;
console.log(bar.prototype.value) // 1 我们改变的是 bindFoo, 可是直接改了 bar

// 优化
Function.prototype.bind2 = function (context) {

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  // 我们直接将 fBound.prototype = this.prototype，
  // 我们直接修改 fBound.prototype 的时候，
  // 也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：
  var fNOP = function () {};

  var fBound = function () {
      var bindArgs = Array.prototype.slice.call(arguments);
      return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
  }

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}

//  两个小问题
//  1.调用 bind 的不是函数咋办
//  不行，我们要报错
if (typeof this !== "function") {
  throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
}

//  2.我要在线上用
//  做个兼容
Function.prototype.bind = Function.prototype.bind || function () {
  ……
};

//  最终版本
Function.prototype.bind2 = function (context) {
  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
      var bindArgs = Array.prototype.slice.call(arguments);
      return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
  }

  // fNOP.prototype = this.prototype;
  // fBound.prototype = new fNOP();
  fBound.prototype = Object.create(this.prototype);
  return fBound;
}


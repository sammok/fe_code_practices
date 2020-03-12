// https://github.com/mqyqingfeng/Blog/issues/11

//  call：
//  call() 方法在使用一个指定的 this 和若干个指定的参数值的前提下
//  调用某个函数或方法

//  举个🌰
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1

//  注意：
//  1.call 改变了 this 的指向
//  2.函数执行了

//  模拟 call 第一步
//  试想当调用 call 的时候，把 foo 对象改造成如下
var foo = {
  value: 1,
  bar: function() {
      console.log(this.value)
  }
};

foo.bar(); // 1

//  但是这样会给 foo 添加一个属性，这就不好了，
//  但是我们用 delete 再删除它就好了

// 所以我们的模拟步骤可以分为：
//  1.将函数设为对象的属性
//  2.执行该函数
//  3.删除该函数

//  举个🌰
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn

//  第一版
Function.prototype.call2 = function(context) {
  // 首先要获取调用call的函数，用this可以获取
  context.fn = this;
  context.fn();
  delete context.fn;
}

// 测试一下
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call2(foo); // 1

//  模拟实现第二步
//  call 函数还能给定参数执行函数，所以我们可以从 arguments 参数中取值，
//  取出第二个到最后一个参数，然后放到一个数组里

//  第二版
Function.prototype.call2 = function(context) {
  context.fn = this;
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }
  //  拼接一个 eval string 用于执行, 以下的 args 会被自动调用 toString()
  eval('context.fn(' + args +')');
  delete context.fn;
}

// 测试一下
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1

//  模拟实现第三步
//  还剩两点需要注意：
//  1.this 参数可以传 null，当为 null 的时候，视为指向 window
//  举个🌰
var value = 1;

function bar() {
    console.log(this.value);
}

bar.call(null); // 1

//  2.函数是可以有返回值的
//  举个🌰
var obj = {
  value: 1
}

function bar(name, age) {
  return {
      value: this.value,
      name: name,
      age: age
  }
}

console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }


// 第三版
Function.prototype.call2 = function (context) {
  var context = context || window;
  context.fn = this;

  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }

  var result = eval('context.fn(' + args +')');

  delete context.fn
  return result;
}

// 测试一下
var value = 2;

var obj = {
  value: 1
}

function bar(name, age) {
  console.log(this.value);
  return {
      value: this.value,
      name: name,
      age: age
  }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }



//  apply 的模拟实现
Function.prototype.apply2 = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  
  if (!arr) {
    result = context.fn();
  }
  else {
    var args = [];
    for (var i = 0; i < arr.length; ++i) 
      args.push('arr[' + i + ']');
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn;
  return result;
};
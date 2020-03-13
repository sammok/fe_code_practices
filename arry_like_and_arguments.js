// https://github.com/mqyqingfeng/Blog/issues/14s

// array-like
//   拥有一个 length 属性和若干索引属性的对象
// 举个🌰
var array = ['name', 'age', 'sex'];

var arrayLike = {
    0: 'name',
    1: 'age',
    2: 'sex',
    length: 3
}

// 为什么叫做类数组对象呢？
// 那让我们从读写、获取长度、遍历三个方面看看这两个对象

console.log(array[0]); // name
console.log(arrayLike[0]); // name

array[0] = 'new name';
arrayLike[0] = 'new name';

console.log(array.length); // 3
console.log(arrayLike.length); // 3

for(var i = 0, len = array.length; i < len; i++) {
  ……
}
for(var i = 0, len = arrayLike.length; i < len; i++) {
   ……
}

// 但是无法使用数组方法，所以叫 array-like

// 调用数组方法
// Array-Like object 可以通过 Function.call 间接调用
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

Array.prototype.join.call(arrayLike, '&'); // name&age&sex

Array.prototype.slice.call(arrayLike, 0); // ["name", "age", "sex"] 
// slice可以做到类数组转数组

Array.prototype.map.call(arrayLike, function(item){
    return item.toUpperCase();
}); 
// ["NAME", "AGE", "SEX"]


// 类数组转数组
// arguments 就是个 array-like 对象，在 DOM 中，一些 DOM 方法也会返回 array-like 对象
// (document.getElementsByTagName()等)

// Arguments 对象
//   它只定义在函数中，包括了函数的参数和其他属性
//   在函数体中，arguments 指代该函数的 Arguments 对象。

// Arguments 对象结构
// 1.length
// 2.callee 属性
//   通过它可以调用函数自身

// 举个🌰
// 讲个闭包经典面试题使用 callee 的解决方法
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) 
    }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2

// arguments 和对应参数的绑定
// 1.传入的参数，实参和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享
// 2.除此之外，以上是在非严格模式下，如果是在严格模式下，实参和 arguments 是不会共享的

// 传递参数
//    将参数从一个函数传入到另一个函数
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
  bar.apply(this, arguments);
}
function bar(a, b, c) {
 console.log(a, b, c);
}

foo(1, 2, 3)

//  ES6 将 arguments 转数组
function func(...arguments) {
  console.log(arguments); // [1, 2, 3]
}

func(1, 2, 3);

// 应用
// 1.参数不定长
// 2.函数柯里化
// 3.递归调用
// 4.函数重载
// ...
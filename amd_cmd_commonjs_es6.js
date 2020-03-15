// https://github.com/mqyqingfeng/Blog/issues/108
// AMD:  Asynchronous Module Definition
// CMD: 与 AMD 一样，CMD 其实就是 SeaJS 在推广过程中对模块定义的规范化产出。

// AMD vs CMD:
// 1.CMD 推崇依赖就近，AMD 推崇依赖前置。看两个项目中的 main.js：
// 2.对于依赖的模块，AMD 是提前执行，CMD 是延迟执行

// AMD: require.js 例子中的 main.js
// 依赖必须一开始就写好
require(['./add', './square'], function(addModule, squareModule) {
  console.log(addModule.add(1, 1))
  console.log(squareModule.square(3))
});

// CMD: sea.js 例子中的 main.js
define(function(require, exports, module) {
  var addModule = require('./add');
  console.log(addModule.add(1, 1))

  // 依赖可以就近书写
  var squareModule = require('./square');
  console.log(squareModule.square(3))
});

// CommonJS 是服务端的模块规范
// main.js
var add = require('./add.js');
console.log(add.add(1, 1))

var square = require('./square.js');
console.log(square.square(3));

// add.js
console.log('加载了 add 模块')

var add = function(x, y) {　
    return x + y;
};

module.exports.add = add;

// CommonJS 与 AMD
// CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。
// AMD规范则是非同步加载模块，允许指定回调函数。
// 由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。
// 但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。

// ES6
// ECMAScript2015 规定了新的模块加载方案。
// 注意！浏览器加载 ES6 模块，也使用 <script> 标签，但是要加入 type="module" 属性。

// ES6 与 CommonJS
// 它们有两个重大差异。
// CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
// CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

// Babel 转 ES6
// 你会发现 Babel 只是把 ES6 模块语法转为 CommonJS 模块语法，
// 然而浏览器是不支持这种模块语法的，所以直接跑在浏览器会报错的，
// 如果想要在浏览器中运行，还是需要使用打包工具将代码打包
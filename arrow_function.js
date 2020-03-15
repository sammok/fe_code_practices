// https://github.com/mqyqingfeng/Blog/issues/85

// 1.没有 this, 会沿着作用域查找最近的一个非箭头函数的作用域
// 2.没有 arguments, 但我们可以通过 (...args) => console.log(args) 来访问 arguments
// 3.不能通过 new 关键字调用
// 4.没有 new.target
// 5.没有原型，所以也没有 Function.prototype 这个属性
// 6.没有 super
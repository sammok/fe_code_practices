// https://github.com/mqyqingfeng/Blog/issues/82

// JS为了加强对变量生命周期的控制，引入了块级作用域
// 块级作用域存在于：
// 1.函数内部
// 2.块中: {} 之间的区域

// let 和 const 都是块级声明的一种
// 1.不能重复声明
// 2.不会被提升
// 3.不绑定全局作用域

// TDZ 临时死区
// let 和 const 不会提升到作用域顶部，如果在声明之前访问这些变量会导致报错


// 循环中的 let 和 const
// for 无法使用 const
// for..in 可以使用

// babel
// 编译 let 到 var 的时候，如果涉及到块，则改变块中的变量名字
let value = 1;
{
    let value = 2;
}
value = 3;
var value = 1;
{
    var _value = 2;
}
value = 3;
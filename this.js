//  https://github.com/mqyqingfeng/Blog/issues/7

// 什么是 Reference 类型:
// Reference 是一个 Specification Type，
// 也就是 “只存在于规范里的抽象类型”。
// 它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中

//  Reference 的构成，由三个组成部分，分别是:
//  1.base value
//    属性所在的对象或者就是 EnvironmentRecord，
//    它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种
//  2.referenced name
//    referenced name 就是属性的名称
//  3.strict reference

//  举例
var foo = 1;

// 对应的Reference是：
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

//  举例2
var foo = {
  bar: function () {
      return this;
  }
};

foo.bar(); // foo

// bar对应的Reference是：
var BarReference = {
  base: foo,
  propertyName: 'bar',
  strict: false
};

//  GetValue
//  用于从 Reference 类型获取对应值的方法
//  重点: 调用 GetValue，返回的将是具体的值，而不再是一个 Reference

/***
 * 如何确定 this 的值？
 * 1. 计算 MemberExpression 的结果赋值给 ref
 * 2. 判断 ref 是不是一个 Reference 类型
 * 
 * MemberExpression 是：
 *    PrimaryExpression // 原始表达式 可以参见《JavaScript权威指南第四章》
 *    FunctionExpression // 函数定义表达式
 *    MemberExpression [ Expression ] // 属性访问表达式
 *    MemberExpression . IdentifierName // 属性访问表达式
 *    new MemberExpression Arguments // 对象创建表达式
 */

//  举例
function foo() {
  console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
  return function() {
      console.log(this)
  }
}

foo()(); // MemberExpression 是 foo()

var foo = {
  bar: function () {
      return this;
  }
}

foo.bar(); // MemberExpression 是 foo.bar

//  所以简单理解 MemberExpression 其实就是()左边的部分

//  -------------------------------------------------

//  习题：
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}

//示例1
console.log(foo.bar());  //  2
//示例2
//  Group Operator 不影响 this
console.log((foo.bar)()); //  2
//示例3
//  Simple Assignment( = ) 
//  因为使用了 GetValue, 所以返回的值不是 Reference 类型
console.log((foo.bar = foo.bar)()); // 1
//示例4
//  Binary Logical Operators
//  因为使用了 GetValue，导所以返回的值不是 Reference 类型
console.log((false || foo.bar)()); // 1
//示例5
//  Comma Operator ( , )
//  因为使用了 GetValue，导所以返回的值不是 Reference 类型
console.log((foo.bar, foo.bar)()); // 1
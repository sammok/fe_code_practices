//  https://github.com/mqyqingfeng/Blog/issues/3
//  https://github.com/mqyqingfeng/Blog/issues/4
//  https://github.com/mqyqingfeng/Blog/issues/5
//  https://github.com/mqyqingfeng/Blog/issues/6

/*
  作用域：程序源代码中定义变量的区域
    - 作用域规定了程序如何查找变量，
      也就是确定当前执行代码对变量的访问权限

  JS是一段一段来分析执行程序的，
  当遇到可执行代码(全局代码、函数代码、eval) 时会进行准备工作：
  
  执行上下文(execution context)：
    程序的函数那么多如何管理上下文呢？JS引擎会创建
    执行上下文栈(Execution context stack：ECS)来管理执行上下文

  执行上下文包含：
  1.变量对象(variable object)
    - 变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明
  2.作用域链(scope chain)
  3.this

  函数上下文：
  1.函数有 活动对象(activation object, AO) 来表示变量对象
    活动对象和变量对象其实是一个东西，
    只有当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 AO

  2.活动对象是在进入函数上下文时被创建的

  执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

  执行过程：
  进入执行上下文
  代码执行

  变量对象包括：
  1.函数的所有刑参
  2.函数声明
  3.变量声明

  代码执行阶段：
  会顺序执行代码，根据代码，修改变量对象的值
*/

function foo() {
  function bar() {
      ...
  }
}

//  函数创建时，将作用域链的信息保存至函数的内部属性 [[scope]] 上
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];

//  当函数激活时
//  将活动对象添加到作用域前端
Scope = [AO].concat([[Scope]]);
//  至此，作用域链创建完毕

// --------------------------------------
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
//  执行过程如下：
//  1. checkscope 函数被创建，保存作用域链到内部属性 [[scope]]
checkscope.[[scope]] = [
  globalContext.VO
];

//  2.执行 checkscope 函数，创建此函数执行上下文，此函数执行上下文被压入执行上下文栈
ECStack = [
  checkscopeContext,
  globalContext //  globalContext always in ECS
];

//  3.checkscope 函数并不立刻执行, 并开始进行准备工作
//  3.1 复制函数 [[scope]] 属性创建作用域链
checkscopeContext = {
  Scope: checkscope.[[scope]],
}

//  3.2 用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明
checkscopeContext = {
  AO: {
      arguments: {
          length: 0
      },
      scope2: undefined
  }，
  Scope: checkscope.[[scope]],
}

//  3.3 将活动对象压入 checkscope 作用域链顶端
checkscopeContext = {
  AO: {
      arguments: {
          length: 0
      },
      scope2: undefined
  },
  Scope: [AO, [[Scope]]]
}

//  4.准备工作做完后，开始执行函数，随着函数的执行，修改 AO 的属性值
checkscopeContext = {
  AO: {
      arguments: {
          length: 0
      },
      scope2: 'local scope'
  },
  Scope: [AO, [[Scope]]]
}

//  5.查到 scope2 的值，返回后函数执行完毕，函数从上下文执行栈中弹出
ECStack = [
  globalContext
];
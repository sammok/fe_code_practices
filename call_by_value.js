//  https://github.com/mqyqingfeng/Blog/issues/10

//  JS 的函数是按值传递
//  按值传递：把函数外部的值复制给函数内部的参数，就和把值从一个变量复制到另一个变量一样
//  你可能会问，既然是复制了，为啥我给函数传入一个引用类型，我在函数内改了，这个引用类型也会发生变化？
//  这涉及到 JS 对函数参数的分别处理：
//  1.如果给函数传递原始类型，那么就会进行按值传递来复制值给函数内部参数
//  2.如果给函数传递引用类型，那么就会进行共享传递
//    共享传递：给函数参数复制一份引用类型的副本
//            如果函数内部对这个参数变量重新赋值，那么会抛弃副本，然后完成赋值，所以不会影响原始的引用类型


//  共享传递的🌰
var obj = {
  value: 1
};
function foo(o) {
  o = 2;
  console.log(o); //2
}
foo(obj);
console.log(obj.value) // 1

// https://github.com/mqyqingfeng/Blog/issues/92

// 1. 在 DOM 对象上保存相关数据
// DOM 被回收后，WeakSet 内的内容也会被自动回收
let wm = new WeakMap(), element = document.querySelector(".element");
wm.set(element, "data");

let value = wm.get(elemet);
console.log(value); // data

element.parentNode.removeChild(element);
element = null;

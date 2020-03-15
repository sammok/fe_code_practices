// https://github.com/mqyqingfeng/Blog/issues/90

// 想要迭代对象，就必须部署 Iterator 接口
const obj = {
  value: 1
};

//  部署
obj[Symbol.iterator] = function() {
  return createIterator([1, 2, 3]);
};

for (value of obj) {
  console.log(value);
}

// 1
// 2
// 3

function createIterator(items) {
  var i = 0;
  //  迭代器结构
  return {
      next: function() {
          var done = i >= item.length;
          var value = !done ? items[i++] : undefined;

          return {
              done: done,
              value: value
          };
      }
  };
}

// for...of 循环可以使用的范围包括：
// 1.数组
// 2.Set
// 3.Map
// 4.类数组对象，如 arguments 对象、DOM NodeList 对象
// 5.Generator 对象
// 6.字符串


//  模拟 for..of
function forOf(obj, cb) {
  let iterable, result;

  if (typeof obj[Symbol.iterator] !== "function")
      throw new TypeError(result + " is not iterable");
  if (typeof cb !== "function") throw new TypeError("cb must be callable");

  iterable = obj[Symbol.iterator]();

  result = iterable.next();
  while (!result.done) {
      cb(result.value);
      result = iterable.next();
  }
}

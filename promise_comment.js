//  https://hackernoon.com/implementing-javascript-promise-in-70-lines-of-code-b3592565af0f
const states = {
  pending: "Pending",
  resolved: "Resolved",
  rejected: "Rejected"
};

/*
  设计要点:
  0. 核心是状态机，Promise 不同状态下访问 Promise 的方法，Promise 会在内部切换到不同的方法
  1. then(handler) 调用时的行为取决于当前 Promise 状态, 
     如果是 resolved/ rejected  那么 handler 会立即被调用
     如果是 pending 那么 then(handler) 整个都会入队 laterCalls[] 数组，待 Promise 发生状态变更后才会被调用 
  2. then(handler) 的链式调用是因为虽然接口叫 then，但在 Promise 内部对应了其他的方法(见设计要点 0)
     当你执行 then(handler) 时, 内部会包装你外部使用者(比如 then)的 handler 函数，并在包装函数返回一个 Promise，所以可以链式调用
  3. 调用 then(handler) 时, 程序会检查 handler 被调用后的 return value，这个 value 将作为 then(handler) 被调用时包装函数返回的新的 Promise 的 value
  4. 某些状态下访问 then|catch 返回 _ => this, 是为了忽略非法调用而返回this(比如 rejected 状态下你使用了 p.then 就会直接返回 this 为后续链式调用使用)
*/

class Nancy {
  constructor(executor) {
    //  solved "Sync" resolve() call:
    //  1.wrapped original function call,
    //  2.in Nancy.try() return a new Promise(for chainable) with value from callback(this.value) return(maybe promise);
    const tryCall = callback => Nancy.try(() => callback(this.value));
    const laterCalls = [];
    //  solved "Async" resolve() call:
    //  1.wrapped original function call
    //  2.return a new promise(for chainable) with a delayed call based on laterCalls' called,
    //  3.the new promise's then callback will get the value from original function called
    const callLater = getMember => callback => new Nancy(resolve => aterCalls.push(() => resolve(getMember()(callback))));

    //  state machine
    const members = {
      [states.resolved]: {
        state: states.resolved,
        then: tryCall,
        catch: _ => this
      },
      [states.rejected]: {
        state: states.rejected,
        then: _ => this,
        catch: tryCall
      },
      [states.pending]: {
        state: states.pending,
        then: callLater(() => this.then),
        catch: callLater(() => this.catch)
      }
    };

    const changeState = state => Object.assign(this, members[state]);

    const apply = (value, state) => {
      if (this.state === states.pending) {
        this.value = value;
        changeState(state);
        for (const laterCall of laterCalls) {
          laterCall();
        }
      }
    };

    const getCallback = state => value => {
      if (value instanceof Nancy && state === states.resolved) {
        value.then(value => apply(value, states.resolved));
        value.catch(value => apply(value, states.rejected));
      } else {
        apply(value, state);
      }
    };

    const resolve = getCallback(states.resolved);
    const reject = getCallback(states.rejected);

    changeState(states.pending);

    try {
      executor(resolve, reject);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  }

  static resolve(value) {
    return new Nancy(resolve => resolve(value));
  }

  static reject(value) {
    return new Nancy((_, reject) => reject(value));
  }

  static try(callback) {
    //  @callback: original callback called with promise's value,
    //  return a promise for chainable
    //  the return promise's value is callback function's return value
    return new Nancy(resolve => resolve(callback()));
  }
}

// let p = new Nancy((res, rej) => {
//      res('sync result');
// });

// p.then(res => console.log(res, 'returned Promise with undefined value'));

// let p2 = new Nancy((res, rej) => {
//      setTimeout(() => res('async result'), 500);
// });

// p2.then(res => console.log(res, 'returned Promise with undefined value'));

// let p3 = new Nancy((res, rej) => {
//      res('sync result');
// });

// p3.then(res => {
//     console.log(res);
//     // return 'from then 1';
//     // return new Nancy(res => res('return a promise'))
// }).then(res => console.log(res)).catch(e => console.log(e));

let p4 = new Nancy((res, rej) => {
  setTimeout(() => rej(123), 100);
})
  .then(res => console.log(res))
  .catch(e => console.error(e, "handled"));

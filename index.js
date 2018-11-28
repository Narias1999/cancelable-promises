var devices = [];
var next;
var cancel;

function promiseSimulator (what) {
  time = 3000
  return new Promise((resolve, rejection) => {
    setTimeout(() => {
      resolve({
        data: [what, what, what],
        next() {
          return promiseSimulator(what);
        }
      })
    }, time)
  })
}

function cancelablePromise (promise) {
  return new Promise((resolve, rejection) => {
    promise.then(res => resolve(res))
    cancel = function () {
      rejection('canceled promise');
    }
  });
}

function getDevices (what) {
  if (cancel) {
    cancel();
    devices = [];
  }
  var promise = cancelablePromise(promiseSimulator(what))
  promise.then(function (result) {
    devices = result.data;
    next = result.next;
    console.log(devices);
    getNextDevices();
  }).catch(console.log);
}

function getNextDevices () {
  var promise = cancelablePromise(next());
  promise.then(function (result) {
    devices = [...devices, ...result.data];
    next = result.next;
    console.log(devices);
    getNextDevices();
  }).catch(console.log);
}

import { getQuickJS, newQuickJSAsyncWASMModule } from 'quickjs-emscripten';
import mocha from 'mocha';
// import { NodeVM } from 'vm2';
// import request from 'request';

// const vm = new NodeVM({
//   sandbox: {
//     result: 0,
//     request,
//   },
//   require: {
//     external: true,
//   },
// });

// const result = vm.run(
//   `
//   module.exports = function(callback) {
//     // var request = require('request');
//     request('http://www.google.com', function (error, response, body) {
//         console.error(error);
//         if (!error && response.statusCode == 200) {
//             // console.log(body); // Show the HTML for the Google homepage.
//             result = 12346789
//             callback(body)
//         }
//     });
//   }
// `
// );

// result((res) => console.log(res));

// console.log(result);

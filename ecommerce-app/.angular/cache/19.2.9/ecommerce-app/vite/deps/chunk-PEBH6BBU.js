import {
  __read,
  __spreadArray,
  argsOrArgArray,
  filter,
  not,
  raceWith
<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-PEBH6BBU.js
} from "./chunk-4S3KYZTJ.js";
=======
} from "./chunk-NUMT5ELH.js";
>>>>>>> 344f59c4a7c6e04db0e20678e6d54d670419e3a1:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-FUKUZFP3.js

// node_modules/rxjs/dist/esm5/internal/operators/partition.js
function partition(predicate, thisArg) {
  return function(source) {
    return [filter(predicate, thisArg)(source), filter(not(predicate, thisArg))(source)];
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/race.js
function race() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return raceWith.apply(void 0, __spreadArray([], __read(argsOrArgArray(args))));
}

export {
  partition,
  race
};
<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-PEBH6BBU.js
//# sourceMappingURL=chunk-PEBH6BBU.js.map
=======
//# sourceMappingURL=chunk-FUKUZFP3.js.map
>>>>>>> 344f59c4a7c6e04db0e20678e6d54d670419e3a1:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-FUKUZFP3.js

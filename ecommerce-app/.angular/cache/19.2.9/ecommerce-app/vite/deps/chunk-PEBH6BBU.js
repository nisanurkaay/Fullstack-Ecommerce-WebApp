import {
  __read,
  __spreadArray,
  argsOrArgArray,
  filter,
  not,
  raceWith
<<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-Q7YHLGLO.js
} from "./chunk-4GNDKFTC.js";
========
} from "./chunk-4S3KYZTJ.js";
>>>>>>>> 1933d9acb7b07929052db2ebf2e8cd9c5a71bfae:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-PEBH6BBU.js

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
<<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-Q7YHLGLO.js
//# sourceMappingURL=chunk-Q7YHLGLO.js.map
========
//# sourceMappingURL=chunk-PEBH6BBU.js.map
>>>>>>>> 1933d9acb7b07929052db2ebf2e8cd9c5a71bfae:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-PEBH6BBU.js

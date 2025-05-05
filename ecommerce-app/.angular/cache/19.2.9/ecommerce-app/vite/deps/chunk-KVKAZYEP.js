import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  Injector,
  VERSION,
  createComponent,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-KVKAZYEP.js
} from "./chunk-WZFYOW4A.js";
=======
} from "./chunk-JSWM5O77.js";
>>>>>>> 59966a1e6514d918922983717fb8a0a545cb849f:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-E3YEYTGH.js

// node_modules/@angular/cdk/fesm2022/style-loader-WcmCyO2o.mjs
var appsWithLoaders = /* @__PURE__ */ new WeakMap();
var _CdkPrivateStyleLoader = class __CdkPrivateStyleLoader {
  _appRef;
  _injector = inject(Injector);
  _environmentInjector = inject(EnvironmentInjector);
  /**
   * Loads a set of styles.
   * @param loader Component which will be instantiated to load the styles.
   */
  load(loader) {
    const appRef = this._appRef = this._appRef || this._injector.get(ApplicationRef);
    let data = appsWithLoaders.get(appRef);
    if (!data) {
      data = {
        loaders: /* @__PURE__ */ new Set(),
        refs: []
      };
      appsWithLoaders.set(appRef, data);
      appRef.onDestroy(() => {
        appsWithLoaders.get(appRef)?.refs.forEach((ref) => ref.destroy());
        appsWithLoaders.delete(appRef);
      });
    }
    if (!data.loaders.has(loader)) {
      data.loaders.add(loader);
      data.refs.push(createComponent(loader, {
        environmentInjector: this._environmentInjector
      }));
    }
  }
  static ɵfac = function _CdkPrivateStyleLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __CdkPrivateStyleLoader)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: __CdkPrivateStyleLoader,
    factory: __CdkPrivateStyleLoader.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkPrivateStyleLoader, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/backwards-compatibility-DYuVCOXM.mjs
function _bindEventWithOptions(renderer, target, eventName, callback, options) {
  const major = parseInt(VERSION.major);
  const minor = parseInt(VERSION.minor);
  if (major > 19 || major === 19 && minor > 0 || major === 0 && minor === 0) {
    return renderer.listen(target, eventName, callback, options);
  }
  target.addEventListener(eventName, callback, options);
  return () => {
    target.removeEventListener(eventName, callback, options);
  };
}

export {
  _CdkPrivateStyleLoader,
  _bindEventWithOptions
};
<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-KVKAZYEP.js
//# sourceMappingURL=chunk-KVKAZYEP.js.map
=======
//# sourceMappingURL=chunk-E3YEYTGH.js.map
>>>>>>> 59966a1e6514d918922983717fb8a0a545cb849f:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-E3YEYTGH.js

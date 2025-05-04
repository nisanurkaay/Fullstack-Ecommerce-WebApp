import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
<<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-HVCQPBXH.js
} from "./chunk-7W27O5A6.js";
========
} from "./chunk-JSWM5O77.js";
>>>>>>>> 1933d9acb7b07929052db2ebf2e8cd9c5a71bfae:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-5EILR6J5.js

// node_modules/@angular/material/fesm2022/error-options-BPhcAVoK.mjs
var ShowOnDirtyErrorStateMatcher = class _ShowOnDirtyErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.dirty || form && form.submitted));
  }
  static ɵfac = function ShowOnDirtyErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShowOnDirtyErrorStateMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ShowOnDirtyErrorStateMatcher,
    factory: _ShowOnDirtyErrorStateMatcher.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShowOnDirtyErrorStateMatcher, [{
    type: Injectable
  }], null, null);
})();
var ErrorStateMatcher = class _ErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.touched || form && form.submitted));
  }
  static ɵfac = function ErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorStateMatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ErrorStateMatcher,
    factory: _ErrorStateMatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/error-state-DAicm3pw.mjs
var _ErrorStateTracker = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  /** Whether the tracker is currently in an error state. */
  errorState = false;
  /** User-defined matcher for the error state. */
  matcher;
  constructor(_defaultMatcher, ngControl, _parentFormGroup, _parentForm, _stateChanges) {
    this._defaultMatcher = _defaultMatcher;
    this.ngControl = ngControl;
    this._parentFormGroup = _parentFormGroup;
    this._parentForm = _parentForm;
    this._stateChanges = _stateChanges;
  }
  /** Updates the error state based on the provided error state matcher. */
  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.matcher || this._defaultMatcher;
    const control = this.ngControl ? this.ngControl.control : null;
    const newState = matcher?.isErrorState(control, parent) ?? false;
    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
};

export {
  ErrorStateMatcher,
  _ErrorStateTracker
};
<<<<<<<< HEAD:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-HVCQPBXH.js
//# sourceMappingURL=chunk-HVCQPBXH.js.map
========
//# sourceMappingURL=chunk-5EILR6J5.js.map
>>>>>>>> 1933d9acb7b07929052db2ebf2e8cd9c5a71bfae:ecommerce-app/.angular/cache/19.2.9/ecommerce-app/vite/deps/chunk-5EILR6J5.js

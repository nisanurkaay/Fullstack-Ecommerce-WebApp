import {
  MatFormFieldModule
<<<<<<< HEAD
} from "./chunk-Y5VX5NWS.js";
=======
} from "./chunk-B7UIVCGW.js";
>>>>>>> 1933d9acb7b07929052db2ebf2e8cd9c5a71bfae
import {
  MAT_ERROR,
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MAT_PREFIX,
  MAT_SUFFIX,
  MatError,
  MatFormField,
  MatFormFieldControl,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
  getMatFormFieldDuplicatedHintError,
  getMatFormFieldMissingControlError,
  getMatFormFieldPlaceholderConflictError
<<<<<<< HEAD
} from "./chunk-EFQCKP35.js";
import "./chunk-QADRLZXQ.js";
import "./chunk-4JDRUFVM.js";
import "./chunk-SVVIGFXE.js";
import "./chunk-MNHZP7IT.js";
import "./chunk-CQF2LB5Q.js";
import "./chunk-Q5FHN2ZP.js";
import "./chunk-6NZFXLU6.js";
import "./chunk-7ZF6DXPD.js";
import "./chunk-JINLRPIQ.js";
import "./chunk-SWX5W6VE.js";
import "./chunk-7W27O5A6.js";
import "./chunk-2LVKW5TZ.js";
import "./chunk-Q7YHLGLO.js";
import "./chunk-4GNDKFTC.js";
=======
} from "./chunk-JIQUMTHD.js";
import "./chunk-5CZHM5UE.js";
import "./chunk-6JSTKULT.js";
import "./chunk-SVVIGFXE.js";
import "./chunk-DOR2O6BL.js";
import "./chunk-IJ3KGSPX.js";
import "./chunk-Q5GE6IRN.js";
import "./chunk-E3YEYTGH.js";
import "./chunk-KLGHZHJC.js";
import "./chunk-OFWNEWDS.js";
import "./chunk-7MFUTISS.js";
import "./chunk-JSWM5O77.js";
import "./chunk-PEBH6BBU.js";
import "./chunk-WPM5VTLQ.js";
import "./chunk-4S3KYZTJ.js";
import "./chunk-WDMUDEB6.js";
>>>>>>> 1933d9acb7b07929052db2ebf2e8cd9c5a71bfae

// node_modules/@angular/material/fesm2022/form-field.mjs
var matFormFieldAnimations = {
  // Represents:
  // trigger('transitionMessages', [
  //   // TODO(mmalerba): Use angular animations for label animation as well.
  //   state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
  //   transition('void => enter', [
  //     style({opacity: 0, transform: 'translateY(-5px)'}),
  //     animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
  //   ]),
  // ])
  /** Animation that transitions the form field's error and hint messages. */
  transitionMessages: {
    type: 7,
    name: "transitionMessages",
    definitions: [{
      type: 0,
      name: "enter",
      styles: {
        type: 6,
        styles: {
          opacity: 1,
          transform: "translateY(0%)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "void => enter",
      animation: [{
        type: 6,
        styles: {
          opacity: 0,
          transform: "translateY(-5px)"
        },
        offset: null
      }, {
        type: 4,
        styles: null,
        timings: "300ms cubic-bezier(0.55, 0, 0.55, 0.2)"
      }],
      options: null
    }],
    options: {}
  }
};
export {
  MAT_ERROR,
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MAT_PREFIX,
  MAT_SUFFIX,
  MatError,
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
  getMatFormFieldDuplicatedHintError,
  getMatFormFieldMissingControlError,
  getMatFormFieldPlaceholderConflictError,
  matFormFieldAnimations
};
//# sourceMappingURL=@angular_material_form-field.js.map

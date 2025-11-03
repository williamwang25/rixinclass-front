"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const common_vendor = require("../../../../common/vendor.js");
const __default__ = {
  name: "u-form",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.FormProps,
  setup(__props, { expose: __expose }) {
    const props = __props;
    common_vendor.useParent("u-form");
    const fields = common_vendor.ref([]);
    const rules = common_vendor.ref(props.rules);
    function setRules(newRules) {
      rules.value = newRules;
    }
    function resetFields() {
      fields.value.forEach((field) => {
        field.resetField && field.resetField();
      });
    }
    function validate(callback) {
      return new Promise((resolve) => {
        let valid = true;
        let count = 0;
        let errorArr = [];
        if (fields.value.length === 0) {
          resolve(true);
          if (typeof callback === "function")
            callback(true);
          return;
        }
        fields.value.forEach((field) => {
          field.validation && field.validation("", (error) => {
            if (error) {
              valid = false;
              errorArr.push(error);
            }
            if (++count === fields.value.length) {
              resolve(valid);
              if (props.errorType.indexOf("none") === -1 && props.errorType.indexOf("toast") >= 0 && errorArr.length) {
                common_vendor.$u.toast(errorArr[0]);
              }
              if (typeof callback === "function")
                callback(valid);
            }
          });
        });
      });
    }
    __expose({
      setRules,
      resetFields,
      validate,
      addField(field) {
        if (!fields.value.includes(field))
          fields.value.push(field);
      },
      removeField(field) {
        fields.value = fields.value.filter((f) => f !== field);
      },
      fields,
      rules,
      props,
      model: props.model
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(_ctx.customClass),
        b: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle(_ctx.customStyle)),
        c: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c53c6302"]]);
wx.createComponent(Component);

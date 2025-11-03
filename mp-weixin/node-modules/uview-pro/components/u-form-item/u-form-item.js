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
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const __default__ = {
  name: "u-form-item",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.FormItemProps,
  setup(__props, { expose: __expose }) {
    common_vendor.Schema.warning = function() {
    };
    const props = __props;
    const { parentExposed } = common_vendor.useChildren("u-form-item", "u-form");
    const instance = common_vendor.getCurrentInstance();
    const initialValue = common_vendor.ref("");
    const validateState = common_vendor.ref("");
    const validateMessage = common_vendor.ref("");
    const errorType = common_vendor.ref(["message"]);
    const fieldValue = common_vendor.ref("");
    const parentData = common_vendor.ref({
      borderBottom: true,
      // 父表单下划线边框
      labelWidth: 90,
      // 父表单 label 宽度
      labelPosition: "left",
      // 父表单 label 位置
      labelStyle: {},
      // 父表单 label 样式
      labelAlign: "left"
      // 父表单 label 对齐
    });
    common_vendor.watch(validateState, () => {
      broadcastInputError();
    });
    common_vendor.watch(
      () => {
        var _a, _b;
        return (_b = (_a = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a.props) == null ? void 0 : _b.errorType;
      },
      (val) => {
        if (val)
          errorType.value = val;
        broadcastInputError();
      },
      { immediate: true }
    );
    const uLabelWidth = common_vendor.computed(() => {
      return elLabelPosition.value == "left" ? props.label === "true" || props.label === "" ? "auto" : common_vendor.$u.addUnit(elLabelWidth.value) : "100%";
    });
    const showError = common_vendor.computed(() => (type) => {
      if (errorType.value.indexOf("none") >= 0)
        return false;
      else if (errorType.value.indexOf(type) >= 0)
        return true;
      else
        return false;
    });
    const elLabelWidth = common_vendor.computed(() => {
      return props.labelWidth != 0 && props.labelWidth !== "" ? props.labelWidth : parentData.value.labelWidth ? parentData.value.labelWidth : 90;
    });
    const elLabelStyle = common_vendor.computed(() => {
      return Object.keys(props.labelStyle).length ? props.labelStyle : parentData.value.labelStyle ? parentData.value.labelStyle : {};
    });
    const elLabelPosition = common_vendor.computed(() => {
      return props.labelPosition ? props.labelPosition : parentData.value.labelPosition ? parentData.value.labelPosition : "left";
    });
    const elLabelAlign = common_vendor.computed(() => {
      return props.labelAlign ? props.labelAlign : parentData.value.labelAlign ? parentData.value.labelAlign : "left";
    });
    const elBorderBottom = common_vendor.computed(() => {
      return props.borderBottom !== "" ? props.borderBottom : parentData.value.borderBottom ? parentData.value.borderBottom : true;
    });
    function broadcastInputError() {
      if (instance) {
        common_vendor.broadcast(
          instance,
          "u-input",
          "on-form-item-error",
          validateState.value === "error" && showError.value("border")
        );
      }
    }
    function getRules() {
      var _a, _b;
      let rules = ((_b = (_a = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a.rules) == null ? void 0 : _b.value) || {};
      rules = rules ? rules[props.prop] : [];
      return [].concat(rules || []);
    }
    function onFieldBlur() {
      validation("blur");
    }
    function onFieldChange() {
      validation("change");
    }
    function onFormBlur() {
      onFieldBlur();
    }
    function onFormChange() {
      onFieldChange();
    }
    function getFilteredRule(triggerType = "") {
      const rules = getRules();
      if (!triggerType)
        return rules;
      return rules.filter((res) => res.trigger && res.trigger.indexOf(triggerType) !== -1);
    }
    function validation(trigger, callback = () => {
    }) {
      var _a, _b;
      fieldValue.value = (_b = (_a = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a.model) == null ? void 0 : _b[props.prop];
      let rules = getFilteredRule(trigger);
      if (!rules || rules.length === 0) {
        callback("");
        return;
      }
      validateState.value = "validating";
      let validator = new common_vendor.Schema({ [props.prop]: rules });
      validator.validate({ [props.prop]: fieldValue.value }, { firstFields: true }, (errors, fields) => {
        validateState.value = !errors ? "success" : "error";
        validateMessage.value = errors ? errors[0].message : "";
        callback(validateMessage.value);
      });
    }
    function resetField() {
      var _a;
      if (((_a = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a.model) && props.prop) {
        parentExposed.value.model[props.prop] = initialValue.value;
      }
      validateState.value = "success";
    }
    common_vendor.onMounted(() => {
      common_vendor.nextTick$1(() => {
        var _a, _b, _c, _d, _e;
        if (parentExposed.value) {
          Object.keys(parentData.value).forEach((key) => {
            var _a2;
            parentData.value[key] = (_a2 = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a2.props[key];
          });
          if (props.prop) {
            ((_a = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a.addField) && ((_b = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _b.addField({
              validation,
              resetField,
              prop: props.prop
            }));
            errorType.value = ((_c = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _c.errorType) || errorType.value;
            fieldValue.value = (_e = (_d = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _d.model) == null ? void 0 : _e[props.prop];
            initialValue.value = fieldValue.value;
          }
        }
      });
    });
    common_vendor.onBeforeUnmount(() => {
      var _a;
      if ((parentExposed == null ? void 0 : parentExposed.value) && props.prop) {
        (_a = parentExposed == null ? void 0 : parentExposed.value) == null ? void 0 : _a.removeField({ prop: props.prop });
      }
    });
    __expose({
      validation,
      resetField,
      onFormBlur,
      onFormChange
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.required || _ctx.leftIcon || _ctx.label
      }, _ctx.required || _ctx.leftIcon || _ctx.label ? common_vendor.e({
        b: _ctx.required
      }, _ctx.required ? {} : {}, {
        c: _ctx.leftIcon
      }, _ctx.leftIcon ? {
        d: common_vendor.p({
          name: _ctx.leftIcon,
          ["custom-style"]: _ctx.leftIconStyle
        })
      } : {}, {
        e: common_vendor.t(_ctx.label),
        f: common_vendor.s(elLabelStyle.value),
        g: common_vendor.s({
          "justify-content": elLabelAlign.value == "left" ? "flex-start" : elLabelAlign.value == "center" ? "center" : "flex-end"
        })
      }) : {}, {
        h: uLabelWidth.value,
        i: `0 0 ${uLabelWidth.value}`,
        j: elLabelPosition.value == "left" ? 0 : "10rpx",
        k: _ctx.$slots.right || _ctx.rightIcon
      }, _ctx.$slots.right || _ctx.rightIcon ? common_vendor.e({
        l: _ctx.rightIcon
      }, _ctx.rightIcon ? {
        m: common_vendor.p({
          ["custom-style"]: _ctx.rightIconStyle,
          name: _ctx.rightIcon
        })
      } : {}) : {}, {
        n: elLabelPosition.value == "left" ? "row" : "column",
        o: validateState.value === "error" && showError.value("message")
      }, validateState.value === "error" && showError.value("message") ? {
        p: common_vendor.t(validateMessage.value),
        q: elLabelPosition.value == "left" ? common_vendor.unref(common_vendor.$u).addUnit(elLabelWidth.value) : "0"
      } : {}, {
        r: common_vendor.n({
          "u-border-bottom": elBorderBottom.value,
          "u-form-item__border-bottom--error": validateState.value === "error" && showError.value("border-bottom"),
          "u-form-item__border--error": validateState.value === "error" && showError.value("border")
        }),
        s: common_vendor.n(_ctx.customClass),
        t: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle(_ctx.customStyle)),
        v: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-759dc3ff"]]);
wx.createComponent(Component);

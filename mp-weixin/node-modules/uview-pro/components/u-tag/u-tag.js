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
  name: "u-tag",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.TagProps,
  emits: ["click", "close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const customStyle = common_vendor.computed(() => {
      let style = {};
      if (props.color)
        style.color = props.color;
      if (props.bgColor)
        style.backgroundColor = props.bgColor;
      if (props.mode === "plain" && props.color && !props.borderColor)
        style.borderColor = props.color;
      else
        style.borderColor = props.borderColor;
      return style;
    });
    const iconStyle = common_vendor.computed(() => {
      if (!props.closeable)
        return void 0;
      let style = {};
      if (props.size === "mini")
        style.fontSize = "20rpx";
      else
        style.fontSize = "22rpx";
      if (props.mode === "plain" || props.mode === "light")
        style.color = props.type;
      else if (props.mode === "dark")
        style.color = "#ffffff";
      if (props.closeColor)
        style.color = props.closeColor;
      return style;
    });
    const closeIconColor = common_vendor.computed(() => {
      if (props.closeColor)
        return props.closeColor;
      else if (props.color)
        return props.color;
      else if (props.mode === "dark")
        return "#ffffff";
      else
        return props.type;
    });
    function clickTag() {
      if (props.disabled)
        return;
      emit("click", props.index);
    }
    function close() {
      emit("close", props.index);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.show
      }, _ctx.show ? common_vendor.e({
        b: common_vendor.t(_ctx.text),
        c: _ctx.closeable
      }, _ctx.closeable ? {
        d: common_vendor.o(close),
        e: common_vendor.s(iconStyle.value),
        f: common_vendor.p({
          size: "22",
          color: closeIconColor.value,
          name: "close"
        })
      } : {}, {
        g: common_vendor.o(() => {
        }),
        h: common_vendor.n(_ctx.disabled ? "u-disabled" : ""),
        i: common_vendor.n("u-size-" + _ctx.size),
        j: common_vendor.n("u-shape-" + _ctx.shape),
        k: common_vendor.n("u-mode-" + _ctx.mode + "-" + _ctx.type),
        l: common_vendor.n(_ctx.customClass),
        m: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle(customStyle.value)),
        n: common_vendor.o(clickTag),
        o: common_vendor.gei(_ctx, "")
      }) : {});
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2ea57d76"]]);
wx.createComponent(Component);

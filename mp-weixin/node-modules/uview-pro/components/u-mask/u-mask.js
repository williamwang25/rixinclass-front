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
  name: "u-mask",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.MaskProps,
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const zoomStyle = common_vendor.ref({ transform: "" });
    const scale = "scale(1.2, 1.2)";
    common_vendor.watch(
      () => props.show,
      (n) => {
        if (n && props.zoom) {
          zoomStyle.value.transform = "scale(1, 1)";
        } else if (!n && props.zoom) {
          zoomStyle.value.transform = scale;
        }
      }
    );
    const maskStyle = common_vendor.computed(() => {
      let style = {};
      style.backgroundColor = "rgba(0, 0, 0, 0.6)";
      if (props.show)
        style.zIndex = props.zIndex ? props.zIndex : common_vendor.$u.zIndex.mask;
      else
        style.zIndex = -1;
      style.transition = `all ${Number(props.duration) / 1e3}s ease-in-out`;
      return style;
    });
    function click() {
      if (!props.maskClickAble)
        return;
      emit("click");
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle(maskStyle.value, zoomStyle.value, _ctx.customStyle)),
        b: common_vendor.o(click),
        c: common_vendor.o(() => {
        }),
        d: common_vendor.n({
          "u-mask-zoom": props.zoom,
          "u-mask-show": props.show
        }),
        e: common_vendor.n(_ctx.customClass),
        f: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-db7121f0"]]);
wx.createComponent(Component);

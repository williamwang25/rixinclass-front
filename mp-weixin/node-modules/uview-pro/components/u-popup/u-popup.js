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
  const _easycom_u_mask2 = common_vendor.resolveComponent("u-mask");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  (_easycom_u_mask2 + _easycom_u_icon2)();
}
const _easycom_u_mask = () => "../u-mask/u-mask.js";
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  (_easycom_u_mask + _easycom_u_icon)();
}
const __default__ = {
  name: "u-popup",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.PopupProps,
  emits: ["update:modelValue", "open", "close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visibleSync = common_vendor.ref(false);
    const showDrawer = common_vendor.ref(false);
    const timer = common_vendor.ref(null);
    const closeFromInner = common_vendor.ref(false);
    const style = common_vendor.computed(() => {
      let style2 = {};
      if (props.mode == "left" || props.mode == "right") {
        style2 = {
          width: props.width ? getUnitValue(props.width) : getUnitValue(props.length),
          height: "100%",
          transform: `translate3D(${props.mode == "left" ? "-100%" : "100%"},0px,0px)`
        };
      } else if (props.mode == "top" || props.mode == "bottom") {
        style2 = {
          width: "100%",
          height: props.height ? getUnitValue(props.height) : getUnitValue(props.length),
          transform: `translate3D(0px,${props.mode == "top" ? "-100%" : "100%"},0px)`
        };
      }
      style2.zIndex = uZindex.value;
      if (props.borderRadius) {
        switch (props.mode) {
          case "left":
            style2.borderRadius = `0 ${props.borderRadius}rpx ${props.borderRadius}rpx 0`;
            break;
          case "top":
            style2.borderRadius = `0 0 ${props.borderRadius}rpx ${props.borderRadius}rpx`;
            break;
          case "right":
            style2.borderRadius = `${props.borderRadius}rpx 0 0 ${props.borderRadius}rpx`;
            break;
          case "bottom":
            style2.borderRadius = `${props.borderRadius}rpx ${props.borderRadius}rpx 0 0`;
            break;
        }
        style2.overflow = "hidden";
      }
      if (props.duration)
        style2.transition = `all ${Number(props.duration) / 1e3}s linear`;
      return style2;
    });
    const centerStyle = common_vendor.computed(() => {
      let style2 = {};
      style2.width = props.width ? getUnitValue(props.width) : getUnitValue(props.length);
      style2.height = props.height ? getUnitValue(props.height) : "auto";
      style2.zIndex = uZindex.value;
      style2.marginTop = `-${common_vendor.$u.addUnit(props.negativeTop)}`;
      if (props.borderRadius) {
        style2.borderRadius = `${props.borderRadius}rpx`;
        style2.overflow = "hidden";
      }
      return style2;
    });
    const uZindex = common_vendor.computed(() => props.zIndex ? props.zIndex : common_vendor.$u.zIndex.popup);
    common_vendor.watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          open();
        } else if (!closeFromInner.value) {
          close();
        }
        closeFromInner.value = false;
      }
    );
    common_vendor.onMounted(() => {
      if (props.modelValue)
        open();
    });
    function getUnitValue(val) {
      if (/(%|px|rpx|auto)$/.test(String(val)))
        return val;
      else
        return val + "rpx";
    }
    function maskClick() {
      close();
    }
    function close() {
      closeFromInner.value = true;
      change("showDrawer", "visibleSync", false);
    }
    function modeCenterClose(mode) {
      if (mode != "center" || !props.maskCloseAble)
        return;
      close();
    }
    function open() {
      change("visibleSync", "showDrawer", true);
    }
    function change(param1, param2, status) {
      if (props.popup === true) {
        emit("update:modelValue", status);
      }
      (param1 === "showDrawer" ? showDrawer : visibleSync).value = status;
      if (status) {
        timer.value = setTimeout(() => {
          (param2 === "showDrawer" ? showDrawer : visibleSync).value = status;
          emit(status ? "open" : "close");
        }, 50);
      } else {
        timer.value = setTimeout(() => {
          (param2 === "showDrawer" ? showDrawer : visibleSync).value = status;
          emit(status ? "open" : "close");
        }, Number(props.duration));
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: visibleSync.value
      }, visibleSync.value ? common_vendor.e({
        b: common_vendor.o(maskClick),
        c: common_vendor.p({
          duration: _ctx.duration,
          ["custom-style"]: _ctx.maskCustomStyle,
          maskClickAble: _ctx.maskCloseAble,
          ["z-index"]: Number(uZindex.value) - 2,
          show: showDrawer.value && _ctx.mask
        }),
        d: _ctx.mode == "center"
      }, _ctx.mode == "center" ? common_vendor.e({
        e: _ctx.closeable
      }, _ctx.closeable ? {
        f: common_vendor.o(close),
        g: common_vendor.n("u-close--" + _ctx.closeIconPos),
        h: common_vendor.p({
          name: _ctx.closeIcon,
          color: _ctx.closeIconColor,
          size: _ctx.closeIconSize
        })
      } : {}, {
        i: common_vendor.o(() => {
        }),
        j: common_vendor.o(() => {
        }),
        k: common_vendor.s(centerStyle.value)
      }) : {}, {
        l: _ctx.mode != "center" && _ctx.closeable
      }, _ctx.mode != "center" && _ctx.closeable ? {
        m: common_vendor.p({
          name: _ctx.closeIcon,
          color: _ctx.closeIconColor,
          size: _ctx.closeIconSize
        })
      } : {}, {
        n: common_vendor.o(close),
        o: common_vendor.n("u-close--" + _ctx.closeIconPos),
        p: common_vendor.o(($event) => modeCenterClose(_ctx.mode)),
        q: common_vendor.n(_ctx.safeAreaInsetBottom ? "safe-area-inset-bottom" : ""),
        r: common_vendor.n("u-drawer-" + _ctx.mode),
        s: common_vendor.n(showDrawer.value ? "u-drawer-content-visible" : ""),
        t: common_vendor.n(_ctx.zoom && _ctx.mode == "center" ? "u-animation-zoom" : ""),
        v: common_vendor.o(() => {
        }),
        w: common_vendor.o(() => {
        }),
        x: common_vendor.s(style.value),
        y: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle({
          zIndex: Number(uZindex.value) - 1
        }, _ctx.customStyle)),
        z: common_vendor.n(_ctx.customClass),
        A: common_vendor.gei(_ctx, "")
      }) : {});
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4924bdd9"]]);
wx.createComponent(Component);

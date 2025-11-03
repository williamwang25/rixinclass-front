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
  name: "u-icon",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.IconProps,
  emits: ["click", "touchstart"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const customClass = common_vendor.computed(() => {
      let classes = [];
      classes.push(props.customPrefix + "-" + props.name);
      if (props.customPrefix === "uicon") {
        classes.push("u-iconfont");
      } else {
        classes.push(props.customPrefix);
      }
      if (props.showDecimalIcon && props.inactiveColor && common_vendor.$u.config.type.includes(props.inactiveColor)) {
        classes.push("u-icon__icon--" + props.inactiveColor);
      } else if (props.color && common_vendor.$u.config.type.includes(props.color)) {
        classes.push("u-icon__icon--" + props.color);
      }
      return classes;
    });
    const iconStyle = common_vendor.computed(() => {
      const style = {
        fontSize: props.size === "inherit" ? "inherit" : common_vendor.$u.addUnit(props.size),
        fontWeight: props.bold ? "bold" : "normal",
        // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
        top: common_vendor.$u.addUnit(props.top)
      };
      if (props.showDecimalIcon && props.inactiveColor && !common_vendor.$u.config.type.includes(props.inactiveColor)) {
        style.color = props.inactiveColor;
      } else if (props.color && !common_vendor.$u.config.type.includes(props.color)) {
        style.color = props.color;
      }
      return style;
    });
    const isImg = common_vendor.computed(() => {
      return props.name.indexOf("/") !== -1;
    });
    const imgStyle = common_vendor.computed(() => {
      const style = {
        width: props.width ? common_vendor.$u.addUnit(props.width) : common_vendor.$u.addUnit(props.size),
        height: props.height ? common_vendor.$u.addUnit(props.height) : common_vendor.$u.addUnit(props.size)
      };
      return style;
    });
    const decimalIconStyle = common_vendor.computed(() => {
      const style = {
        fontSize: props.size === "inherit" ? "inherit" : common_vendor.$u.addUnit(props.size),
        fontWeight: props.bold ? "bold" : "normal",
        // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
        top: common_vendor.$u.addUnit(props.top),
        width: props.percent + "%"
      };
      if (props.color && !common_vendor.$u.config.type.includes(props.color)) {
        style.color = props.color;
      }
      return style;
    });
    const decimalIconClass = common_vendor.computed(() => {
      let classes = [];
      classes.push(props.customPrefix + "-" + props.name);
      if (props.customPrefix === "uicon") {
        classes.push("u-iconfont");
      } else {
        classes.push(props.customPrefix);
      }
      if (props.color && common_vendor.$u.config.type.includes(props.color)) {
        classes.push("u-icon__icon--" + props.color);
      } else {
        classes.push("u-icon__icon--primary");
      }
      return classes;
    });
    const labelStyle = common_vendor.computed(() => {
      return {
        color: props.labelColor,
        fontSize: common_vendor.$u.addUnit(props.labelSize),
        marginLeft: props.labelPos === "right" ? common_vendor.$u.addUnit(props.space || props.marginLeft) : 0,
        marginTop: props.labelPos === "bottom" ? common_vendor.$u.addUnit(props.space || props.marginTop) : 0,
        marginRight: props.labelPos === "left" ? common_vendor.$u.addUnit(props.space || props.marginRight) : 0,
        marginBottom: props.labelPos === "top" ? common_vendor.$u.addUnit(props.space || props.marginBottom) : 0
      };
    });
    function onClick(event) {
      emit("click", props.index || event);
    }
    function onTouchstart() {
      emit("touchstart", props.index);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isImg.value
      }, isImg.value ? {
        b: _ctx.name,
        c: _ctx.imgMode,
        d: common_vendor.s(imgStyle.value)
      } : common_vendor.e({
        e: _ctx.showDecimalIcon
      }, _ctx.showDecimalIcon ? {
        f: common_vendor.s(decimalIconStyle.value),
        g: common_vendor.n(decimalIconClass.value),
        h: _ctx.hoverClass
      } : {}, {
        i: common_vendor.n(customClass.value),
        j: common_vendor.s(iconStyle.value),
        k: _ctx.hoverClass,
        l: common_vendor.o(onTouchstart)
      }), {
        m: _ctx.label !== ""
      }, _ctx.label !== "" ? {
        n: common_vendor.t(_ctx.label),
        o: common_vendor.s(labelStyle.value)
      } : {}, {
        p: common_vendor.s(_ctx.customStyle),
        q: common_vendor.o(onClick),
        r: common_vendor.n("u-icon--" + _ctx.labelPos),
        s: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b85e76d0"]]);
wx.createComponent(Component);

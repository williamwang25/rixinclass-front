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
  name: "u-button",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.ButtonProps,
  emits: [
    "click",
    "getuserinfo",
    "contact",
    "getphonenumber",
    "error",
    "launchapp",
    "opensetting",
    "chooseavatar",
    "agreeprivacyauthorization"
  ],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const rippleTop = common_vendor.ref(0);
    const rippleLeft = common_vendor.ref(0);
    const fields = common_vendor.ref({});
    const waveActive = common_vendor.ref(false);
    const getHoverClass = common_vendor.computed(() => {
      if (props.loading || props.disabled || props.ripple)
        return "";
      if (props.hoverClass)
        return props.hoverClass;
      let hoverClass = "";
      hoverClass = props.plain ? "u-" + props.type + "-plain-hover" : "u-" + props.type + "-hover";
      return hoverClass;
    });
    const showHairLineBorder = common_vendor.computed(() => {
      if (["primary", "success", "error", "warning"].indexOf(props.type) >= 0 && !props.plain) {
        return "";
      } else {
        return "u-hairline-border";
      }
    });
    function click(e) {
      common_vendor.$u.throttle(() => {
        if (props.loading === true || props.disabled === true)
          return;
        if (props.ripple) {
          waveActive.value = false;
          common_vendor.nextTick$1(() => {
            getWaveQuery(e);
          });
        }
        emit("click", e);
      }, Number(props.throttleTime));
    }
    function getWaveQuery(e) {
      getElQuery().then((res) => {
        let data = res[0];
        if (!data.width || !data.width)
          return;
        data.targetWidth = data.height > data.width ? data.height : data.width;
        if (!data.targetWidth)
          return;
        fields.value = data;
        let touchesX = "", touchesY = "";
        touchesX = e.touches[0].clientX;
        touchesY = e.touches[0].clientY;
        rippleTop.value = Number(touchesY) - data.top - data.targetWidth / 2;
        rippleLeft.value = Number(touchesX) - data.left - data.targetWidth / 2;
        common_vendor.nextTick$1(() => {
          waveActive.value = true;
        });
      });
    }
    function getElQuery() {
      return new Promise((resolve) => {
        let queryInfo = "";
        queryInfo = common_vendor.index.createSelectorQuery().in(null);
        queryInfo.select(".u-btn").boundingClientRect();
        queryInfo.exec((data) => {
          resolve(data);
        });
      });
    }
    function getphonenumber(event) {
      emit("getphonenumber", event);
    }
    function getuserinfo(event) {
      emit("getuserinfo", event);
    }
    function error(event) {
      emit("error", event);
    }
    function opensetting(event) {
      emit("opensetting", event);
    }
    function launchapp(event) {
      emit("launchapp", event);
    }
    function getAuthorize(event) {
      if (props.scope === "phoneNumber") {
        getphonenumber(event);
      } else if (props.scope === "userInfo") {
        getuserinfo(event);
      }
    }
    function contact(event) {
      emit("contact", event);
    }
    function chooseavatar(event) {
      emit("chooseavatar", event);
    }
    function agreeprivacyauthorization(event) {
      emit("agreeprivacyauthorization", event);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.ripple
      }, _ctx.ripple ? {
        b: common_vendor.n(waveActive.value ? "u-wave-active" : ""),
        c: rippleTop.value + "px",
        d: rippleLeft.value + "px",
        e: fields.value.targetWidth + "px",
        f: fields.value.targetWidth + "px",
        g: _ctx.rippleBgColor || "rgba(0, 0, 0, 0.15)"
      } : {}, {
        h: common_vendor.n("u-size-" + _ctx.size),
        i: common_vendor.n(_ctx.plain ? "u-btn--" + _ctx.type + "--plain" : ""),
        j: common_vendor.n(_ctx.loading ? "u-loading" : ""),
        k: common_vendor.n(_ctx.shape === "circle" ? "u-round-circle" : ""),
        l: common_vendor.n(_ctx.hairLine ? showHairLineBorder.value : "u-btn--bold-border"),
        m: common_vendor.n("u-btn--" + _ctx.type),
        n: common_vendor.n(_ctx.disabled ? `u-btn--${_ctx.type}--disabled` : ""),
        o: common_vendor.n(_ctx.customClass),
        p: Number(_ctx.hoverStartTime),
        q: Number(_ctx.hoverStayTime),
        r: _ctx.disabled,
        s: _ctx.formType,
        t: _ctx.disabled || _ctx.loading ? void 0 : _ctx.openType,
        v: _ctx.appParameter,
        w: _ctx.hoverStopPropagation,
        x: _ctx.sendMessageTitle,
        y: _ctx.lang,
        z: _ctx.dataName,
        A: _ctx.sessionFrom,
        B: _ctx.sendMessageImg,
        C: _ctx.showMessageCard,
        D: common_vendor.o(getAuthorize),
        E: common_vendor.o(getuserinfo),
        F: common_vendor.o(contact),
        G: common_vendor.o(getphonenumber),
        H: common_vendor.o(error),
        I: common_vendor.o(launchapp),
        J: common_vendor.o(opensetting),
        K: common_vendor.o(chooseavatar),
        L: common_vendor.o(agreeprivacyauthorization),
        M: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle({
          overflow: _ctx.ripple ? "hidden" : "visible"
        }, _ctx.customStyle)),
        N: common_vendor.o(($event) => click($event)),
        O: getHoverClass.value,
        P: _ctx.loading,
        Q: common_vendor.gei(_ctx, "u-wave-btn")
      });
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6df07486"]]);
wx.createComponent(Component);

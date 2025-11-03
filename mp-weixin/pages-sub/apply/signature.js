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
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _easycom_u_button2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../node-modules/uview-pro/components/u-button/u-button.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "Signature"
}), {
  __name: "signature",
  setup(__props) {
    let ctx = null;
    let canvas = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    const hasSignature = common_vendor.ref(false);
    const isDrawing = common_vendor.ref(false);
    function initCanvas() {
      const query = common_vendor.index.createSelectorQuery();
      query.select("#signatureCanvas").fields({ node: true, size: true }).exec((res) => {
        if (res && res[0]) {
          canvas = res[0].node;
          ctx = canvas.getContext("2d");
          const dpr = common_vendor.index.getSystemInfoSync().pixelRatio;
          canvasWidth = res[0].width;
          canvasHeight = res[0].height;
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
          ctx.scale(dpr, dpr);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#000000";
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          console.log("Canvas初始化成功:", { canvasWidth, canvasHeight, dpr });
        }
      });
    }
    function touchStart(e) {
      if (!ctx)
        return;
      isDrawing.value = true;
      const touch = e.touches[0];
      const x = touch.x;
      const y = touch.y;
      console.log("Touch Start:", { x, y });
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    function touchMove(e) {
      if (!ctx || !isDrawing.value)
        return;
      hasSignature.value = true;
      const touch = e.touches[0];
      const x = touch.x;
      const y = touch.y;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    function touchEnd() {
      isDrawing.value = false;
    }
    function clearCanvas() {
      if (!ctx) {
        common_vendor.index.showToast({
          title: "画布未初始化",
          icon: "none"
        });
        return;
      }
      if (!hasSignature.value) {
        common_vendor.index.showToast({
          title: "画布已是空白",
          icon: "none"
        });
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      hasSignature.value = false;
      common_vendor.index.showToast({
        title: "已清空",
        icon: "success"
      });
    }
    function saveSignature() {
      if (!hasSignature.value) {
        common_vendor.index.showToast({
          title: "请先签名",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "保存中..."
      });
      common_vendor.index.canvasToTempFilePath(
        {
          canvas,
          fileType: "png",
          quality: 1,
          success: (res) => {
            common_vendor.index.hideLoading();
            console.log("签名保存成功:", res.tempFilePath);
            common_vendor.index.$emit("signatureConfirm", res.tempFilePath);
            common_vendor.index.showToast({
              title: "保存成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 500);
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            console.error("保存签名失败：", err);
            common_vendor.index.showModal({
              title: "保存失败",
              content: `签名保存失败: ${err.errMsg || "未知错误"}`,
              showCancel: false
            });
          }
        }
      );
    }
    common_vendor.onMounted(() => {
      setTimeout(() => {
        initCanvas();
      }, 500);
    });
    common_vendor.onUnmounted(() => {
      ctx = null;
      canvas = null;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(touchStart),
        b: common_vendor.o(touchMove),
        c: common_vendor.o(touchEnd),
        d: common_vendor.o(touchEnd),
        e: !hasSignature.value
      }, !hasSignature.value ? {} : {}, {
        f: common_vendor.p({
          name: "info-circle",
          size: "16",
          color: "#0096C2"
        }),
        g: common_vendor.p({
          name: "reload",
          size: "18",
          color: "#666666"
        }),
        h: common_vendor.o(clearCanvas),
        i: common_vendor.p({
          type: "default",
          ["custom-style"]: {
            marginRight: "20rpx",
            flex: 1
          }
        }),
        j: common_vendor.p({
          name: "checkmark",
          size: "18",
          color: "#ffffff"
        }),
        k: common_vendor.o(saveSignature),
        l: common_vendor.p({
          type: "primary",
          ["custom-style"]: {
            flex: 1
          }
        }),
        m: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ae7813de"]]);
wx.createPage(MiniProgramPage);

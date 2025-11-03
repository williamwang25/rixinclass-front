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
const utils_systemInfo = require("../../utils/systemInfo.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_select2 = common_vendor.resolveComponent("u-select");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _easycom_u_button2 + _easycom_u_select2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../node-modules/uview-pro/components/u-button/u-button.js";
const _easycom_u_select = () => "../../node-modules/uview-pro/components/u-select/u-select.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_button + _easycom_u_select)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "Feedback"
}), {
  __name: "index",
  setup(__props) {
    const feedbackTypes = common_vendor.ref([
      { label: "功能建议", value: "suggestion" },
      { label: "问题反馈", value: "problem" },
      { label: "使用咨询", value: "question" },
      { label: "其他", value: "other" }
    ]);
    const formData = common_vendor.reactive({
      type: "",
      content: "",
      contact: ""
    });
    const showTypePicker = common_vendor.ref(false);
    function onTypeConfirm(value) {
      formData.type = value[0].label;
      showTypePicker.value = false;
    }
    function submitFeedback() {
      if (!formData.type) {
        common_vendor.index.showToast({
          title: "请选择反馈类型",
          icon: "none"
        });
        return;
      }
      if (!formData.content || formData.content.trim().length < 5) {
        common_vendor.index.showToast({
          title: "请输入至少5个字的反馈内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "提交反馈",
        content: "确认提交反馈意见吗？",
        success: (res) => {
          if (res.confirm) {
            console.log("提交反馈：", formData);
            common_vendor.index.showToast({
              title: "提交成功",
              icon: "success"
            });
            setTimeout(() => {
              formData.type = "";
              formData.content = "";
              formData.contact = "";
              common_vendor.index.navigateBack();
            }, 1500);
          }
        }
      });
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      var _a;
      return {
        a: common_vendor.p({
          name: "arrow-left",
          size: "20",
          color: "#333333"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.p({
          name: "chat",
          size: "32",
          color: "#0096C2"
        }),
        d: common_vendor.t(formData.type || "请选择反馈类型"),
        e: common_vendor.n(formData.type ? "value" : "placeholder"),
        f: common_vendor.p({
          name: "arrow-down",
          size: "16",
          color: "#999999"
        }),
        g: common_vendor.o(($event) => showTypePicker.value = true),
        h: formData.content,
        i: common_vendor.o(($event) => formData.content = $event.detail.value),
        j: common_vendor.t(formData.content.length),
        k: formData.contact,
        l: common_vendor.o(($event) => formData.contact = $event.detail.value),
        m: common_vendor.o(submitFeedback),
        n: common_vendor.p({
          type: "primary",
          ["custom-style"]: {
            width: "100%",
            marginTop: "40rpx"
          }
        }),
        o: common_vendor.o(onTypeConfirm),
        p: common_vendor.o(($event) => showTypePicker.value = $event),
        q: common_vendor.p({
          list: feedbackTypes.value,
          mode: "single-column",
          modelValue: showTypePicker.value
        }),
        r: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        s: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-59af13d5"]]);
wx.createPage(MiniProgramPage);

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
const common_assets = require("../../common/assets.js");
const utils_systemInfo = require("../../utils/systemInfo.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "HomeStyle3"
}), {
  __name: "index",
  setup(__props) {
    const services = [
      {
        icon: "calendar",
        title: "排课申请",
        desc: "快速提交实验室预约",
        color: "#0096C2",
        url: "/pages-sub/apply/index"
      },
      {
        icon: "search",
        title: "申请查询",
        desc: "查看审核进度",
        color: "#0078A8",
        url: "/pages-sub/query/index"
      },
      {
        icon: "file-text",
        title: "历史记录",
        desc: "查看往年记录",
        color: "#006B8F",
        url: "/pages-sub/record/index"
      }
    ];
    const notices = [
      { title: "关于2024-2025学年第二学期实验室排课的通知", time: "2024-10-08" },
      { title: "实验室设备维护通知", time: "2024-10-05" }
    ];
    const quickActions = [
      { name: "使用指南", icon: "info-circle", url: "/pages-sub/guide/index" },
      { name: "常见问题", icon: "question-circle", url: "/pages-sub/faq/index" },
      { name: "意见反馈", icon: "chat", url: "/pages-sub/feedback/index" },
      { name: "关于我们", icon: "more-circle", url: "/pages-sub/about/index" }
    ];
    function navigateTo(url) {
      if (url) {
        common_vendor.index.navigateTo({ url });
      } else {
        common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      var _a;
      return {
        a: common_assets._imports_0$1,
        b: common_assets._imports_1,
        c: common_vendor.o(($event) => navigateTo("")),
        d: common_vendor.f(notices, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.time),
            c: index,
            d: common_vendor.o(($event) => navigateTo(""), index)
          };
        }),
        e: common_vendor.f(services, (item, index, i0) => {
          return {
            a: "83a5a03c-2-" + i0 + ",83a5a03c-1",
            b: common_vendor.p({
              name: item.icon,
              size: "36",
              color: "#ffffff"
            }),
            c: item.color,
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.desc),
            f: "83a5a03c-3-" + i0 + ",83a5a03c-1",
            g: index,
            h: common_vendor.o(($event) => navigateTo(item.url), index)
          };
        }),
        f: common_vendor.p({
          name: "arrow-right",
          size: "20",
          color: "#cccccc"
        }),
        g: common_vendor.f(quickActions, (item, index, i0) => {
          return {
            a: "83a5a03c-4-" + i0 + ",83a5a03c-1",
            b: common_vendor.p({
              name: item.icon,
              size: "32",
              color: "#0096C2"
            }),
            c: common_vendor.t(item.name),
            d: index,
            e: common_vendor.o(($event) => navigateTo(item.url), index)
          };
        }),
        h: common_assets._imports_2,
        i: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        j: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);

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
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "UserGuide"
}), {
  __name: "index",
  setup(__props) {
    const steps = common_vendor.ref([
      {
        id: 1,
        title: "登录系统",
        desc: "使用教师账号登录日新智课系统",
        icon: "account",
        color: "#0096C2"
      },
      {
        id: 2,
        title: "提交申请",
        desc: "填写排课申请表单，包含课程信息、实验时间等",
        icon: "edit-pen",
        color: "#0078A8"
      },
      {
        id: 3,
        title: "等待审核",
        desc: "管理员将审核您的申请，并安排实验室",
        icon: "clock",
        color: "#006B8F"
      },
      {
        id: 4,
        title: "查看结果",
        desc: "在申请查询页面查看审核进度和排课结果",
        icon: "checkmark-circle",
        color: "#52c41a"
      }
    ]);
    const features = common_vendor.ref([
      {
        title: "排课申请",
        items: [
          "填写完整的课程信息和教师信息",
          "选择实验时间段，支持多个时段",
          "说明软件环境和其他要求",
          "提供电子签名确认申请"
        ]
      },
      {
        title: "申请查询",
        items: [
          "查看所有申请的审核状态",
          "已拒绝申请可以修改后重新提交",
          "待审核申请可以取消",
          "查看详细的申请信息"
        ]
      },
      {
        title: "历史记录",
        items: [
          "查看往年已完成的排课记录",
          "按学年筛选历史数据",
          "查看已分配的实验室信息",
          "导出或打印排课记录"
        ]
      }
    ]);
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
          name: "info-circle-fill",
          size: "48",
          color: "#f7f7f7"
        }),
        d: common_vendor.f(steps.value, (step, index, i0) => {
          return common_vendor.e({
            a: "47b912fb-4-" + i0 + ",47b912fb-1",
            b: common_vendor.p({
              name: step.icon,
              size: "24",
              color: "#ffffff"
            }),
            c: step.color,
            d: index < steps.value.length - 1
          }, index < steps.value.length - 1 ? {} : {}, {
            e: common_vendor.t(step.title),
            f: common_vendor.t(step.desc),
            g: step.id
          });
        }),
        e: common_vendor.f(features.value, (feature, index, i0) => {
          return {
            a: common_vendor.t(feature.title),
            b: common_vendor.f(feature.items, (item, idx, i1) => {
              return {
                a: common_vendor.t(item),
                b: idx
              };
            }),
            c: index
          };
        }),
        f: common_vendor.p({
          name: "info-circle",
          size: "18",
          color: "#0096C2"
        }),
        g: common_vendor.p({
          name: "info-circle",
          size: "18",
          color: "#0096C2"
        }),
        h: common_vendor.p({
          name: "info-circle",
          size: "18",
          color: "#0096C2"
        }),
        i: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        j: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-47b912fb"]]);
wx.createPage(MiniProgramPage);

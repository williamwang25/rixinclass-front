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
  name: "About"
}), {
  __name: "index",
  setup(__props) {
    const teamMembers = common_vendor.ref([
      {
        role: "组长",
        name: "张三",
        duties: "项目管理、需求分析",
        icon: "star",
        color: "#0096C2"
      },
      {
        role: "组员",
        name: "李四",
        duties: "前端开发、UI设计",
        icon: "account",
        color: "#0078A8"
      },
      {
        role: "组员",
        name: "王五",
        duties: "后端开发、数据库设计",
        icon: "account",
        color: "#0078A8"
      },
      {
        role: "组员",
        name: "赵六",
        duties: "系统测试、文档编写",
        icon: "account",
        color: "#0078A8"
      }
    ]);
    const teachers = common_vendor.ref([
      {
        name: "陈教授",
        title: "指导老师",
        dept: "软件工程系"
      }
    ]);
    const systemInfo = common_vendor.ref({
      name: "日新智课",
      version: "v1.0.0",
      description: "北京工业大学智慧排课系统",
      features: [
        "智能排课算法",
        "实验室资源管理",
        "移动端便捷申请",
        "审核流程可视化"
      ]
    });
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
          name: "home",
          size: "64",
          color: "#0096C2"
        }),
        d: common_vendor.t(systemInfo.value.name),
        e: common_vendor.t(systemInfo.value.version),
        f: common_vendor.t(systemInfo.value.description),
        g: common_vendor.f(systemInfo.value.features, (feature, index, i0) => {
          return {
            a: common_vendor.t(feature),
            b: index
          };
        }),
        h: common_vendor.p({
          name: "star-fill",
          size: "20",
          color: "#0096C2"
        }),
        i: common_vendor.f(teamMembers.value, (member, index, i0) => {
          return {
            a: "62839a82-5-" + i0 + ",62839a82-1",
            b: common_vendor.p({
              name: member.icon,
              size: "24",
              color: "#ffffff"
            }),
            c: member.color,
            d: common_vendor.t(member.name),
            e: common_vendor.t(member.role),
            f: common_vendor.t(member.duties),
            g: index
          };
        }),
        j: common_vendor.f(teachers.value, (teacher, index, i0) => {
          return {
            a: "62839a82-6-" + i0 + ",62839a82-1",
            b: common_vendor.t(teacher.name),
            c: common_vendor.t(teacher.title),
            d: common_vendor.t(teacher.dept),
            e: index
          };
        }),
        k: common_vendor.p({
          name: "account-fill",
          size: "32",
          color: "#0096C2"
        }),
        l: common_vendor.p({
          name: "email",
          size: "20",
          color: "#0096C2"
        }),
        m: common_vendor.p({
          name: "map",
          size: "20",
          color: "#0096C2"
        }),
        n: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        o: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-62839a82"]]);
wx.createPage(MiniProgramPage);

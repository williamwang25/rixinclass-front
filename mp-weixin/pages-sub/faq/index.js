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
  name: "FAQ"
}), {
  __name: "index",
  setup(__props) {
    const faqList = common_vendor.ref([
      {
        id: 1,
        question: "如何提交排课申请？",
        answer: '在首页点击"排课申请"，填写完整的课程信息、实验时间和教师信息后，添加电子签名即可提交。',
        expanded: false
      },
      {
        id: 2,
        question: "申请被拒绝了怎么办？",
        answer: '申请被拒绝后，您可以在"申请查询"页面查看拒绝原因，然后点击"修改"按钮重新编辑申请信息并提交。',
        expanded: false
      },
      {
        id: 3,
        question: "可以选择多个实验时间段吗？",
        answer: '可以。在填写申请表时，点击"添加时间段"按钮可以添加多个实验时间，系统会自动安排合适的实验室。',
        expanded: false
      },
      {
        id: 4,
        question: "如何查看申请审核进度？",
        answer: '在首页点击"申请查询"，可以查看所有申请的状态。待审核、已通过、已拒绝的申请会用不同颜色标识。',
        expanded: false
      },
      {
        id: 5,
        question: "实验室是如何分配的？",
        answer: "系统会根据您的软件环境要求、学生人数和时间安排自动匹配合适的实验室。如有冲突，管理员会手动调整。",
        expanded: false
      },
      {
        id: 6,
        question: "可以取消已提交的申请吗？",
        answer: '待审核状态的申请可以取消。在"申请查询"页面找到对应申请，点击"取消"按钮即可。',
        expanded: false
      },
      {
        id: 7,
        question: "电子签名有什么作用？",
        answer: "电子签名用于确认您对申请内容的真实性负责，是申请的必要组成部分。",
        expanded: false
      },
      {
        id: 8,
        question: "如何查看历史排课记录？",
        answer: '在首页点击"历史记录"，可以查看往年已完成的排课记录，并支持按学年筛选。',
        expanded: false
      }
    ]);
    function toggleItem(index) {
      faqList.value[index].expanded = !faqList.value[index].expanded;
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
          name: "question-circle",
          size: "24",
          color: "#0096C2"
        }),
        d: common_vendor.f(faqList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.question),
            b: "ab4dafec-4-" + i0 + ",ab4dafec-1",
            c: common_vendor.p({
              name: item.expanded ? "arrow-up" : "arrow-down",
              size: "20",
              color: "#999999"
            }),
            d: item.expanded
          }, item.expanded ? {
            e: common_vendor.t(item.answer)
          } : {}, {
            f: item.id,
            g: common_vendor.o(($event) => toggleItem(index), item.id)
          });
        }),
        e: common_vendor.o(($event) => common_vendor.index.navigateTo({
          url: "/pages-sub/feedback/index"
        })),
        f: common_vendor.p({
          type: "primary",
          ["custom-style"]: {
            marginTop: "24rpx"
          }
        }),
        g: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        h: common_vendor.gei(_ctx, "")
      };
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ab4dafec"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
if (!Math) {
  RequestComp();
}
const RequestComp = () => "./components/request.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    function gotoScroll() {
      common_vendor.index.navigateTo({
        url: "/pages-sub/demo/scroll"
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(gotoScroll),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dec79174"]]);
wx.createPage(MiniProgramPage);

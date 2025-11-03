"use strict";
const common_vendor = require("../../common/vendor.js");
const router_config = require("../../router/config.js");
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "register",
  setup(__props) {
    function doRegister() {
      common_vendor.index.showToast({
        title: "注册成功"
      });
      common_vendor.index.navigateTo({
        url: router_config.LOGIN_PAGE
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(doRegister),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4273ae4b"]]);
wx.createPage(MiniProgramPage);

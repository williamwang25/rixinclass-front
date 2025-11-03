"use strict";
const common_vendor = require("./common/vendor.js");
const tabbar_store = require("./tabbar/store.js");
const utils_index = require("./utils/index.js");
if (!Math) {
  FgTabbar();
}
const FgTabbar = () => "./tabbar/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App.ku",
  setup(__props, { expose: __expose }) {
    const isCurrentPageTabbar = common_vendor.ref(true);
    common_vendor.onShow(() => {
      console.log("App.ku.vue onShow", utils_index.currRoute());
      const { path } = utils_index.currRoute();
      if (path === "/") {
        isCurrentPageTabbar.value = true;
      } else {
        isCurrentPageTabbar.value = tabbar_store.isPageTabbar(path);
      }
    });
    const helloKuRoot = common_vendor.ref("Hello AppKuVue");
    const exposeRef = common_vendor.ref("this is form app.Ku.vue");
    __expose({
      exposeRef
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(helloKuRoot.value),
        b: isCurrentPageTabbar.value
      }, isCurrentPageTabbar.value ? {} : {});
    };
  }
});
exports._sfc_main = _sfc_main;

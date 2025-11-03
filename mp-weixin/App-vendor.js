"use strict";
const common_vendor = require("./common/vendor.js");
const router_interceptor = require("./router/interceptor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch((options) => {
      console.log("App Launch", options);
      common_vendor.wx$1.cloud.init({
        traceUser: true
      });
      console.log("云开发初始化完成");
    });
    common_vendor.onShow((options) => {
      console.log("App Show", options);
      if (options == null ? void 0 : options.path) {
        router_interceptor.navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query });
      } else {
        router_interceptor.navigateToInterceptor.invoke({ url: "/" });
      }
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
});
exports._sfc_main = _sfc_main;

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const AppVendor = require("./App-vendor.js");
const http_interceptor = require("./http/interceptor.js");
const router_interceptor = require("./router/interceptor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/me/me.js";
  "./pages/notice/index.js";
  "./pages/test/index.js";
  "./pages-fg/404/index.js";
  "./pages-fg/login/login.js";
  "./pages-fg/login/register.js";
  "./pages-sub/about/about.js";
  "./pages-sub/about/alova.js";
  "./pages-sub/about/index.js";
  "./pages-sub/apply/index.js";
  "./pages-sub/apply/signature.js";
  "./pages-sub/demo/index.js";
  "./pages-sub/demo/scroll.js";
  "./pages-sub/faq/index.js";
  "./pages-sub/feedback/index.js";
  "./pages-sub/guide/index.js";
  "./pages-sub/query/index.js";
  "./pages-sub/record/index.js";
  "./pages-sub/test/auth.js";
  "./pages-sub/test/index.js";
}
const GlobalKuRoot = () => "./App.ku.js";
function createApp() {
  const app = common_vendor.createSSRApp(AppVendor._sfc_main);
  app.use(store_index.store);
  app.use(router_interceptor.routeInterceptor);
  app.use(http_interceptor.requestInterceptor);
  app.use(common_vendor.uViewPro);
  app.component("layout-default-uni", Layout_Default_Uni);
  app.component("global-ku-root", GlobalKuRoot);
  return {
    app
  };
}
const Layout_Default_Uni = () => "./layouts/default.js";
createApp().app.mount("#app");
exports.createApp = createApp;

"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const router_config = require("../../router/config.js");
require("../../store/index.js");
const store_token = require("../../store/token.js");
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
if (!Math) {
  (RequestOpenApiComp + RequestComp + VBindCss)();
}
const RequestOpenApiComp = () => "./components/request-openapi.js";
const RequestComp = () => "./components/request.js";
const VBindCss = () => "./components/VBindCss.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "about",
  setup(__props) {
    const tokenStore = store_token.useTokenStore();
    console.log({ isApp: common_vendor.isApp, isAppAndroid: common_vendor.isAppAndroid, isAppHarmony: common_vendor.isAppHarmony, isAppIOS: common_vendor.isAppIOS, isAppPlus: common_vendor.isAppPlus, isH5: common_vendor.isH5, isMpWeixin: common_vendor.isMpWeixin, isWeb: common_vendor.isWeb });
    function gotoLogin() {
      if (tokenStore.hasLogin) {
        common_vendor.index.showToast({
          title: "已登录，不能去登录页",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `${router_config.LOGIN_PAGE}?redirect=${encodeURIComponent("/pages-sub/about/about?a=1&b=2")}`
      });
    }
    function logout() {
      tokenStore.logout();
      common_vendor.index.showToast({
        title: "退出登录成功",
        icon: "success"
      });
    }
    function gotoScroll() {
      common_vendor.index.navigateTo({
        url: "/pages-sub/demo/scroll"
      });
    }
    function gotoAlova() {
      common_vendor.index.navigateTo({
        url: "/pages/about/alova"
      });
    }
    function gotoSubPage() {
      common_vendor.index.navigateTo({
        url: "/pages-sub/demo/index"
      });
    }
    const uniLayout = common_vendor.ref();
    common_vendor.onLoad(() => {
      console.log("onLoad:", uniLayout.value);
    });
    common_vendor.onReady(() => {
      console.log("onReady:", uniLayout.value);
      console.log("onReady:", uniLayout.value.testUniLayoutExposedData);
    });
    common_vendor.onShow(() => {
      var _a;
      console.log("onShow:", uniLayout.value);
      console.log("onShow:", (_a = uniLayout.value) == null ? void 0 : _a.testUniLayoutExposedData);
    });
    const uniKuRoot = common_vendor.ref();
    common_vendor.onReady(() => {
      var _a;
      console.log("onReady uniKuRoot exposeRef", (_a = uniKuRoot.value) == null ? void 0 : _a.exposeRef);
    });
    common_vendor.onShow(() => {
      var _a;
      console.log("onShow uniKuRoot exposeRef", (_a = uniKuRoot.value) == null ? void 0 : _a.exposeRef);
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$3,
        b: common_vendor.t(common_vendor.unref(tokenStore).hasLogin),
        c: common_vendor.o(gotoLogin),
        d: common_vendor.o(logout),
        e: common_vendor.o(gotoScroll),
        f: common_vendor.o(gotoAlova),
        g: common_vendor.o(gotoSubPage),
        h: common_vendor.sr(uniLayout, "d164e6f2-1,d164e6f2-0", {
          "k": "uniLayout"
        }),
        i: common_vendor.sr(uniKuRoot, "d164e6f2-0", {
          "k": "uniKuRoot"
        })
      };
    };
  }
});
wx.createPage(_sfc_main);

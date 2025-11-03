"use strict";
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const common_vendor = require("../../common/vendor.js");
const store_token = require("../../store/token.js");
const store_user = require("../../store/user.js");
const tabbar_config = require("../../tabbar/config.js");
const tabbar_store = require("../../tabbar/store.js");
const utils_index = require("../../utils/index.js");
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const redirectUrl = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      console.log("login options: ", options);
      if (options.redirect) {
        redirectUrl.value = utils_index.ensureDecodeURIComponent(options.redirect);
      } else {
        redirectUrl.value = tabbar_config.tabbarList[0].pagePath;
      }
      console.log("redirectUrl.value: ", redirectUrl.value);
    });
    store_user.useUserStore();
    const tokenStore = store_token.useTokenStore();
    function doLogin() {
      return __async(this, null, function* () {
        if (tokenStore.hasLogin) {
          common_vendor.index.navigateBack();
          return;
        }
        try {
          yield tokenStore.login({
            username: "菲鸽",
            password: "123456"
          });
          console.log(redirectUrl.value);
        } catch (error) {
          console.log("登录失败", error);
        }
        let path = redirectUrl.value;
        if (!path.startsWith("/")) {
          path = `/${path}`;
        }
        const { path: _path, query } = utils_index.parseUrlToObj(path);
        console.log("_path:", _path, "query:", query, "path:", path);
        console.log("isPageTabbar(_path):", tabbar_store.isPageTabbar(_path));
        if (tabbar_store.isPageTabbar(_path)) {
          common_vendor.index.switchTab({
            url: path
          });
        } else {
          common_vendor.index.navigateBack();
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(doLogin),
        b: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a60ee33f"]]);
wx.createPage(MiniProgramPage);

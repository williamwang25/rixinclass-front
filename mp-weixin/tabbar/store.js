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
const common_vendor = require("../common/vendor.js");
const router_config = require("../router/config.js");
const router_interceptor = require("../router/interceptor.js");
const store_token = require("../store/token.js");
const tabbar_config = require("./config.js");
const tabbarList = common_vendor.reactive(tabbar_config.tabbarList.map((item) => __spreadProps(__spreadValues({}, item), {
  pagePath: item.pagePath.startsWith("/") ? item.pagePath : `/${item.pagePath}`
})));
function isPageTabbar(path) {
  const _path = path.split("?")[0];
  return tabbarList.some((item) => item.pagePath === _path);
}
const tabbarStore = common_vendor.reactive({
  curIdx: common_vendor.index.getStorageSync("app-tabbar-index") || 0,
  prevIdx: common_vendor.index.getStorageSync("app-tabbar-index") || 0,
  setCurIdx(idx) {
    const tokenStore = store_token.useTokenStore();
    if (tokenStore.hasLogin || router_config.isNeedLoginMode || !router_interceptor.judgeIsExcludePath(tabbarList[idx].pagePath)) {
      this.curIdx = idx;
      common_vendor.index.setStorageSync("app-tabbar-index", idx);
    }
  },
  setTabbarItemBadge(idx, badge) {
    if (tabbarList[idx]) {
      tabbarList[idx].badge = badge;
    }
  },
  setAutoCurIdx(path) {
    if (path === "/") {
      this.setCurIdx(0);
      return;
    }
    const index = tabbarList.findIndex((item) => item.pagePath === path);
    if (index === -1) {
      const pagesPathList = getCurrentPages().map((item) => item.route.startsWith("/") ? item.route : `/${item.route}`);
      const flag = tabbarList.some((item) => pagesPathList.includes(item.pagePath));
      if (!flag) {
        this.setCurIdx(0);
        return;
      }
    } else {
      this.setCurIdx(index);
    }
  },
  restorePrevIdx() {
    if (this.prevIdx === this.curIdx)
      return;
    this.setCurIdx(this.prevIdx);
    this.prevIdx = common_vendor.index.getStorageSync("app-tabbar-index") || 0;
  }
});
exports.isPageTabbar = isPageTabbar;
exports.tabbarList = tabbarList;
exports.tabbarStore = tabbarStore;

"use strict";
var __defProp = Object.defineProperty;
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
const common_vendor = require("../common/vendor.js");
const api_login = require("../api/login.js");
const api_types_login = require("../api/types/login.js");
const utils_index = require("../utils/index.js");
const store_user = require("./user.js");
const tokenInfoState = {
  token: "",
  expiresIn: 0
};
const useTokenStore = common_vendor.defineStore(
  "token",
  () => {
    const tokenInfo = common_vendor.ref(__spreadValues({}, tokenInfoState));
    const setTokenInfo = (val) => {
      tokenInfo.value = val;
      const now = Date.now();
      if (api_types_login.isSingleTokenRes(val)) {
        const expireTime = now + val.expiresIn * 1e3;
        common_vendor.index.setStorageSync("accessTokenExpireTime", expireTime);
      } else if (api_types_login.isDoubleTokenRes(val)) {
        const accessExpireTime = now + val.accessExpiresIn * 1e3;
        const refreshExpireTime = now + val.refreshExpiresIn * 1e3;
        common_vendor.index.setStorageSync("accessTokenExpireTime", accessExpireTime);
        common_vendor.index.setStorageSync("refreshTokenExpireTime", refreshExpireTime);
      }
    };
    const isTokenExpired = common_vendor.computed(() => {
      if (!tokenInfo.value) {
        return true;
      }
      const now = Date.now();
      const expireTime = common_vendor.index.getStorageSync("accessTokenExpireTime");
      if (!expireTime)
        return true;
      return now >= expireTime;
    });
    common_vendor.computed(() => {
      return true;
    });
    function _postLogin(tokenInfo2) {
      return __async(this, null, function* () {
        setTokenInfo(tokenInfo2);
        const userStore = store_user.useUserStore();
        yield userStore.fetchUserInfo();
      });
    }
    const login = (loginForm) => __async(exports, null, function* () {
      try {
        const res = yield api_login.login(loginForm);
        console.log("普通登录-res: ", res);
        yield _postLogin(res);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        return res;
      } catch (error) {
        console.error("登录失败:", error);
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "error"
        });
        throw error;
      }
    });
    const wxLogin = () => __async(exports, null, function* () {
      try {
        const code = yield api_login.getWxCode();
        console.log("微信登录-code: ", code);
        const res = yield api_login.wxLogin(code);
        console.log("微信登录-res: ", res);
        yield _postLogin(res);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        return res;
      } catch (error) {
        console.error("微信登录失败:", error);
        common_vendor.index.showToast({
          title: "微信登录失败，请重试",
          icon: "error"
        });
        throw error;
      }
    });
    const logout = () => __async(exports, null, function* () {
      try {
        yield api_login.logout();
      } catch (error) {
        console.error("退出登录失败:", error);
      } finally {
        common_vendor.index.removeStorageSync("accessTokenExpireTime");
        common_vendor.index.removeStorageSync("refreshTokenExpireTime");
        console.log("退出登录-清除用户信息");
        tokenInfo.value = __spreadValues({}, tokenInfoState);
        common_vendor.index.removeStorageSync("token");
        const userStore = store_user.useUserStore();
        userStore.clearUserInfo();
      }
    });
    const refreshToken = () => __async(exports, null, function* () {
      {
        console.error("单token模式不支持刷新token");
        throw new Error("单token模式不支持刷新token");
      }
    });
    const getValidToken = common_vendor.computed(() => {
      if (isTokenExpired.value) {
        return "";
      }
      {
        return api_types_login.isSingleTokenRes(tokenInfo.value) ? tokenInfo.value.token : "";
      }
    });
    const hasLoginInfo = common_vendor.computed(() => {
      if (!tokenInfo.value) {
        return false;
      }
      {
        return api_types_login.isSingleTokenRes(tokenInfo.value) && !!tokenInfo.value.token;
      }
    });
    const hasValidLogin = common_vendor.computed(() => {
      console.log("hasValidLogin", hasLoginInfo.value, !isTokenExpired.value);
      return hasLoginInfo.value && !isTokenExpired.value;
    });
    const tryGetValidToken = () => __async(exports, null, function* () {
      if (!getValidToken.value && utils_index.isDoubleTokenMode)
        ;
      return getValidToken.value;
    });
    return {
      // 核心API方法
      login,
      wxLogin,
      logout,
      // 认证状态判断（最常用的）
      hasLogin: hasValidLogin,
      // 内部系统使用的方法
      refreshToken,
      tryGetValidToken,
      validToken: getValidToken,
      // 调试或特殊场景可能需要直接访问的信息
      tokenInfo,
      setTokenInfo
    };
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true
  }
);
exports.useTokenStore = useTokenStore;

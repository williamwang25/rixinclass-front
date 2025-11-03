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
const userInfoState = {
  userId: -1,
  username: "",
  nickname: "",
  avatar: "/static/images/default-avatar.png"
};
const useUserStore = common_vendor.defineStore(
  "user",
  () => {
    const userInfo = common_vendor.ref(__spreadValues({}, userInfoState));
    const setUserInfo = (val) => {
      console.log("设置用户信息", val);
      if (!val.avatar) {
        val.avatar = userInfoState.avatar;
      }
      userInfo.value = val;
    };
    const setUserAvatar = (avatar) => {
      userInfo.value.avatar = avatar;
      console.log("设置用户头像", avatar);
      console.log("userInfo", userInfo.value);
    };
    const clearUserInfo = () => {
      userInfo.value = __spreadValues({}, userInfoState);
      common_vendor.index.removeStorageSync("user");
    };
    const fetchUserInfo = () => __async(exports, null, function* () {
      const res = yield api_login.getUserInfo();
      setUserInfo(res);
      return res;
    });
    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar
    };
  },
  {
    persist: true
  }
);
exports.useUserStore = useUserStore;

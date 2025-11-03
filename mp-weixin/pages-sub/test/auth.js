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
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "auth",
  setup(__props) {
    const loginResult = common_vendor.ref(null);
    const userInfoResult = common_vendor.ref(null);
    const testUserId = common_vendor.ref("");
    const testLogin = () => __async(this, null, function* () {
      try {
        common_vendor.index.showLoading({ title: "登录中..." });
        const userInfo = yield common_vendor.index.getUserProfile({
          desc: "用于完善用户资料"
        });
        console.log("[TEST] 微信用户信息:", userInfo);
        const res = yield common_vendor.wx$1.cloud.callFunction({
          name: "login",
          data: {
            nickName: userInfo.userInfo.nickName,
            avatarUrl: userInfo.userInfo.avatarUrl
          }
        });
        common_vendor.index.hideLoading();
        console.log("[TEST] 登录结果:", res);
        loginResult.value = res.result;
        if (res.result.success) {
          common_vendor.index.setStorageSync("userInfo", res.result.data);
          testUserId.value = res.result.data.userId.toString();
          common_vendor.index.showToast({
            title: res.result.data.isNewUser ? "注册成功！" : "登录成功！",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.message,
            icon: "none",
            duration: 3e3
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        console.error("[TEST] 登录失败:", error);
        loginResult.value = {
          success: false,
          message: error.message || "登录失败"
        };
        common_vendor.index.showToast({
          title: "登录失败: " + (error.message || "未知错误"),
          icon: "none",
          duration: 3e3
        });
      }
    });
    const testGetUserInfo = () => __async(this, null, function* () {
      if (!testUserId.value) {
        common_vendor.index.showToast({
          title: "请先输入用户ID",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "查询中..." });
        const res = yield common_vendor.wx$1.cloud.callFunction({
          name: "getUserInfo",
          data: {
            userId: Number.parseInt(testUserId.value)
          }
        });
        common_vendor.index.hideLoading();
        console.log("[TEST] 用户信息结果:", res);
        userInfoResult.value = res.result;
        if (res.result.success) {
          common_vendor.index.showToast({
            title: "查询成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.message,
            icon: "none",
            duration: 3e3
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        console.error("[TEST] 查询失败:", error);
        userInfoResult.value = {
          success: false,
          message: error.message || "查询失败"
        };
        common_vendor.index.showToast({
          title: "查询失败: " + (error.message || "未知错误"),
          icon: "none",
          duration: 3e3
        });
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(testLogin),
        b: loginResult.value
      }, loginResult.value ? common_vendor.e({
        c: common_vendor.t(loginResult.value.success ? "✅" : "❌"),
        d: common_vendor.t(loginResult.value.success ? "测试通过" : "测试失败"),
        e: loginResult.value.data
      }, loginResult.value.data ? {
        f: common_vendor.t(loginResult.value.data.userId),
        g: common_vendor.t(loginResult.value.data.nickName),
        h: common_vendor.t(loginResult.value.data.userType === 0 ? "教师" : "管理员"),
        i: common_vendor.t(loginResult.value.data.isNewUser ? "是" : "否")
      } : {}, {
        j: common_vendor.t(JSON.stringify(loginResult.value, null, 2)),
        k: common_vendor.n(loginResult.value.success ? "success" : "error")
      }) : {}, {
        l: testUserId.value,
        m: common_vendor.o(($event) => testUserId.value = $event.detail.value),
        n: common_vendor.o(testGetUserInfo),
        o: userInfoResult.value
      }, userInfoResult.value ? common_vendor.e({
        p: common_vendor.t(userInfoResult.value.success ? "✅" : "❌"),
        q: common_vendor.t(userInfoResult.value.success ? "查询成功" : "查询失败"),
        r: userInfoResult.value.data
      }, userInfoResult.value.data ? {
        s: common_vendor.t(userInfoResult.value.data.userId),
        t: common_vendor.t(userInfoResult.value.data.nickName),
        v: common_vendor.t(userInfoResult.value.data.name || "未设置"),
        w: common_vendor.t(userInfoResult.value.data.phone || "未设置"),
        x: common_vendor.t(userInfoResult.value.data.email || "未设置"),
        y: common_vendor.t(userInfoResult.value.data.statusName)
      } : {}, {
        z: common_vendor.t(JSON.stringify(userInfoResult.value, null, 2)),
        A: common_vendor.n(userInfoResult.value.success ? "success" : "error")
      }) : {}, {
        B: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2adb87eb"]]);
wx.createPage(MiniProgramPage);

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
const common_assets = require("../../common/assets.js");
require("../../store/index.js");
const store_token = require("../../store/token.js");
const utils_uploadFile = require("../../utils/uploadFile.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _easycom_u_button2 + _easycom_u_popup2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../node-modules/uview-pro/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../node-modules/uview-pro/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_button + _easycom_u_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "me",
  setup(__props) {
    const navBarConfig = common_vendor.ref({
      title: "我的",
      frontColor: "#ffffff",
      backgroundColor: "#0096C2"
    });
    const userStore = store_user.useUserStore();
    const tokenStore = store_token.useTokenStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const menuList = common_vendor.ref([
      {
        title: "我的申请",
        items: [
          {
            icon: "edit-pen",
            name: "排课申请",
            desc: "提交新的排课申请",
            url: "/pages-sub/apply/index",
            color: "#0096C2"
          },
          {
            icon: "search",
            name: "申请查询",
            desc: "查看申请审核进度",
            url: "/pages-sub/query/index",
            color: "#0078A8"
          },
          {
            icon: "file-text",
            name: "历史记录",
            desc: "查看往年排课记录",
            url: "/pages-sub/record/index",
            color: "#006B8F"
          }
        ]
      },
      {
        title: "帮助与反馈",
        items: [
          {
            icon: "book",
            name: "使用指南",
            desc: "了解系统使用方法",
            url: "/pages-sub/guide/index",
            color: "#52c41a"
          },
          {
            icon: "question-circle",
            name: "常见问题",
            desc: "快速解答疑惑",
            url: "/pages-sub/faq/index",
            color: "#faad14"
          },
          {
            icon: "chat",
            name: "意见反馈",
            desc: "提出您的宝贵意见",
            url: "/pages-sub/feedback/index",
            color: "#ff6b6b"
          }
        ]
      },
      {
        title: "关于",
        items: [
          {
            icon: "info-circle",
            name: "关于我们",
            desc: "了解开发团队",
            url: "/pages-sub/about/index",
            color: "#722ed1"
          }
        ]
      }
    ]);
    function handleLogin() {
      return __async(this, null, function* () {
        yield tokenStore.wxLogin();
      });
    }
    function onChooseAvatar(e) {
      console.log("选择头像", e.detail);
      const { avatarUrl } = e.detail;
      const { run } = utils_uploadFile.useUpload(
        "/upload",
        {},
        {
          onSuccess: (res) => {
            console.log("wx头像上传成功", res);
            store_user.useUserStore().setUserAvatar(res.url);
          }
        },
        avatarUrl
      );
      run();
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "退出登录",
        content: "确定要退出登录吗？",
        confirmColor: "#0096C2",
        success: (res) => {
          if (res.confirm) {
            store_token.useTokenStore().logout();
            common_vendor.index.showToast({
              title: "退出登录成功",
              icon: "success"
            });
          }
        }
      });
    }
    function navigateTo(url) {
      if (url) {
        common_vendor.index.navigateTo({ url });
      }
    }
    const showEditDialog = common_vendor.ref(false);
    const editForm = common_vendor.ref({
      teacherName: "",
      teacherPhone: "",
      teacherEmail: ""
    });
    function openEditDialog() {
      editForm.value = {
        teacherName: userInfo.value.teacherName || "",
        teacherPhone: userInfo.value.teacherPhone || "",
        teacherEmail: userInfo.value.teacherEmail || ""
      };
      showEditDialog.value = true;
    }
    function saveUserInfo() {
      if (!editForm.value.teacherName) {
        common_vendor.index.showToast({ title: "请填写姓名", icon: "none" });
        return;
      }
      if (!editForm.value.teacherPhone) {
        common_vendor.index.showToast({ title: "请填写电话", icon: "none" });
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(editForm.value.teacherPhone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (editForm.value.teacherEmail) {
        const emailReg = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
        if (!emailReg.test(editForm.value.teacherEmail)) {
          common_vendor.index.showToast({ title: "请输入正确的邮箱", icon: "none" });
          return;
        }
      }
      userStore.setUserInfo(__spreadProps(__spreadValues({}, userInfo.value), {
        teacherName: editForm.value.teacherName,
        teacherPhone: editForm.value.teacherPhone,
        teacherEmail: editForm.value.teacherEmail
      }));
      showEditDialog.value = false;
      common_vendor.index.showToast({ title: "保存成功", icon: "success" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: navBarConfig.value.title,
        b: navBarConfig.value.frontColor,
        c: navBarConfig.value.backgroundColor,
        d: common_assets._imports_0$2,
        e: !common_vendor.unref(tokenStore).hasLogin
      }, !common_vendor.unref(tokenStore).hasLogin ? {
        f: common_vendor.p({
          name: "account",
          size: "48",
          color: "#cccccc"
        }),
        g: common_vendor.o(handleLogin),
        h: common_vendor.p({
          type: "primary",
          size: "medium",
          ["custom-style"]: {
            borderRadius: "50rpx",
            backgroundColor: "#0096C2",
            borderColor: "#0096C2",
            fontSize: "28rpx",
            fontWeight: "600",
            padding: "0 40rpx",
            height: "80rpx"
          }
        })
      } : {
        i: common_vendor.unref(userInfo).avatar,
        j: common_vendor.o(onChooseAvatar),
        k: common_vendor.unref(userInfo).username,
        l: common_vendor.o(($event) => common_vendor.unref(userInfo).username = $event.detail.value),
        m: common_vendor.t(common_vendor.unref(userInfo).userId),
        n: common_vendor.p({
          name: "edit-pen",
          size: "20",
          color: "#999999"
        }),
        o: common_vendor.o(openEditDialog)
      }, {
        p: common_vendor.unref(userInfo).teacherName || common_vendor.unref(userInfo).teacherPhone || common_vendor.unref(userInfo).teacherEmail
      }, common_vendor.unref(userInfo).teacherName || common_vendor.unref(userInfo).teacherPhone || common_vendor.unref(userInfo).teacherEmail ? common_vendor.e({
        q: common_vendor.unref(userInfo).teacherName
      }, common_vendor.unref(userInfo).teacherName ? {
        r: common_vendor.p({
          name: "account",
          size: "16",
          color: "#0096C2"
        }),
        s: common_vendor.t(common_vendor.unref(userInfo).teacherName)
      } : {}, {
        t: common_vendor.unref(userInfo).teacherPhone
      }, common_vendor.unref(userInfo).teacherPhone ? {
        v: common_vendor.p({
          name: "phone",
          size: "16",
          color: "#0096C2"
        }),
        w: common_vendor.t(common_vendor.unref(userInfo).teacherPhone)
      } : {}, {
        x: common_vendor.unref(userInfo).teacherEmail
      }, common_vendor.unref(userInfo).teacherEmail ? {
        y: common_vendor.p({
          name: "email",
          size: "16",
          color: "#0096C2"
        }),
        z: common_vendor.t(common_vendor.unref(userInfo).teacherEmail)
      } : {}) : {
        A: common_vendor.p({
          name: "plus-circle",
          size: "18",
          color: "#0096C2"
        }),
        B: common_vendor.o(openEditDialog)
      }, {
        C: common_vendor.unref(tokenStore).hasLogin
      }, common_vendor.unref(tokenStore).hasLogin ? {} : {}, {
        D: common_vendor.f(menuList.value, (menu, index, i0) => {
          return {
            a: common_vendor.t(menu.title),
            b: common_vendor.f(menu.items, (item, idx, i1) => {
              return {
                a: "371b06ea-9-" + i0 + "-" + i1 + ",371b06ea-1",
                b: common_vendor.p({
                  name: item.icon,
                  size: "24",
                  color: item.color
                }),
                c: `${item.color}20`,
                d: common_vendor.t(item.name),
                e: common_vendor.t(item.desc),
                f: "371b06ea-10-" + i0 + "-" + i1 + ",371b06ea-1",
                g: idx,
                h: common_vendor.o(($event) => navigateTo(item.url), idx)
              };
            }),
            c: index
          };
        }),
        E: common_vendor.p({
          name: "arrow-right",
          size: "16",
          color: "#c0c0c0"
        }),
        F: common_vendor.unref(tokenStore).hasLogin
      }, common_vendor.unref(tokenStore).hasLogin ? {
        G: common_vendor.o(handleLogout),
        H: common_vendor.p({
          type: "error",
          plain: true,
          ["custom-style"]: {
            width: "100%",
            borderRadius: "50rpx"
          }
        })
      } : {}, {
        I: editForm.value.teacherName,
        J: common_vendor.o(($event) => editForm.value.teacherName = $event.detail.value),
        K: editForm.value.teacherPhone,
        L: common_vendor.o(($event) => editForm.value.teacherPhone = $event.detail.value),
        M: editForm.value.teacherEmail,
        N: common_vendor.o(($event) => editForm.value.teacherEmail = $event.detail.value),
        O: common_vendor.o(($event) => showEditDialog.value = false),
        P: common_vendor.p({
          size: "medium"
        }),
        Q: common_vendor.o(saveUserInfo),
        R: common_vendor.p({
          type: "primary",
          size: "medium",
          ["custom-style"]: {
            backgroundColor: "#0096C2",
            borderColor: "#0096C2",
            marginLeft: "20rpx"
          }
        }),
        S: common_vendor.o(($event) => showEditDialog.value = $event),
        T: common_vendor.p({
          mode: "center",
          ["border-radius"]: "20",
          modelValue: showEditDialog.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-371b06ea"]]);
wx.createPage(MiniProgramPage);

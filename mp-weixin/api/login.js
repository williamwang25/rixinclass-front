"use strict";
const common_vendor = require("../common/vendor.js");
const http_http = require("../http/http.js");
function login(loginForm) {
  return http_http.http.post("/auth/login", loginForm);
}
function getUserInfo() {
  return http_http.http.get("/user/info");
}
function logout() {
  return http_http.http.get("/auth/logout");
}
function getWxCode() {
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      provider: "weixin",
      success: (res) => resolve(res),
      fail: (err) => reject(new Error(err))
    });
  });
}
function wxLogin(data) {
  return http_http.http.post("/auth/wxLogin", data);
}
exports.getUserInfo = getUserInfo;
exports.getWxCode = getWxCode;
exports.login = login;
exports.logout = logout;
exports.wxLogin = wxLogin;

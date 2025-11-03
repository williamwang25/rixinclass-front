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
const common_vendor = require("../common/vendor.js");
const router_config = require("../router/config.js");
const store_token = require("../store/token.js");
require("../utils/index.js");
const http_tools_enum = require("./tools/enum.js");
function http(options) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request(__spreadProps(__spreadValues({}, options), {
      dataType: "json",
      // 响应成功
      success: (res) => __async(this, null, function* () {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const { code, data, message, msg } = res.data;
          if (code !== http_tools_enum.ResultEnum.Success0 && code !== http_tools_enum.ResultEnum.Success200) {
            throw new Error(`请求错误[${code}]：${message || msg}`);
          }
          return resolve(data);
        }
        const resData = res.data;
        if (res.statusCode === 401 || resData.code === 401) {
          const tokenStore = store_token.useTokenStore();
          {
            tokenStore.logout();
            common_vendor.index.navigateTo({ url: router_config.LOGIN_PAGE });
            return reject(res);
          }
        } else {
          !options.hideErrorToast && common_vendor.index.showToast({
            icon: "none",
            title: res.data.msg || "请求错误"
          });
          reject(res);
        }
      }),
      // 响应失败
      fail(err) {
        common_vendor.index.showToast({
          icon: "none",
          title: "网络错误，换个网络试试"
        });
        reject(err);
      }
    }));
  });
}
function httpGet(url, query, header, options) {
  return http(__spreadValues({
    url,
    query,
    method: "GET",
    header
  }, options));
}
function httpPost(url, data, query, header, options) {
  return http(__spreadValues({
    url,
    query,
    data,
    method: "POST",
    header
  }, options));
}
function httpPut(url, data, query, header, options) {
  return http(__spreadValues({
    url,
    data,
    query,
    method: "PUT",
    header
  }, options));
}
function httpDelete(url, query, header, options) {
  return http(__spreadValues({
    url,
    query,
    method: "DELETE",
    header
  }, options));
}
http.get = httpGet;
http.post = httpPost;
http.put = httpPut;
http.delete = httpDelete;
http.Get = httpGet;
http.Post = httpPost;
http.Put = httpPut;
http.Delete = httpDelete;
exports.http = http;

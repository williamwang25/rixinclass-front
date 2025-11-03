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
var _a;
const common_vendor = require("../common/vendor.js");
const pages_json = require("../pages.json.js");
function getLastPage() {
  const pages2 = getCurrentPages();
  return pages2[pages2.length - 1];
}
function currRoute() {
  const lastPage = getLastPage();
  if (!lastPage) {
    return {
      path: "",
      query: {}
    };
  }
  const currRoute2 = lastPage.$page;
  const { fullPath } = currRoute2;
  return parseUrlToObj(fullPath);
}
function ensureDecodeURIComponent(url) {
  if (url.startsWith("%")) {
    return ensureDecodeURIComponent(decodeURIComponent(url));
  }
  return url;
}
function parseUrlToObj(url) {
  const [path, queryStr] = url.split("?");
  if (!queryStr) {
    return {
      path,
      query: {}
    };
  }
  const query = {};
  queryStr.split("&").forEach((item) => {
    const [key, value] = item.split("=");
    query[key] = ensureDecodeURIComponent(value);
  });
  return { path, query };
}
function getAllPages(key) {
  const mainPages = pages_json.pages.filter((page) => !key || page[key]).map((page) => __spreadProps(__spreadValues({}, page), {
    path: `/${page.path}`
  }));
  const subPages = [];
  pages_json.subPackages.forEach((subPageObj) => {
    const { root } = subPageObj;
    subPageObj.pages.filter((page) => !key || page[key]).forEach((page) => {
      subPages.push(__spreadProps(__spreadValues({}, page), {
        path: `/${root}/${page.path}`
      }));
    });
  });
  const result = [...mainPages, ...subPages];
  return result;
}
function getEnvBaseUrl() {
  let baseUrl = "https://ukw0y1.laf.run";
  const VITE_SERVER_BASEURL__WEIXIN_DEVELOP = "https://ukw0y1.laf.run";
  const VITE_SERVER_BASEURL__WEIXIN_TRIAL = "https://ukw0y1.laf.run";
  const VITE_SERVER_BASEURL__WEIXIN_RELEASE = "https://ukw0y1.laf.run";
  {
    const {
      miniProgram: { envVersion }
    } = common_vendor.index.getAccountInfoSync();
    switch (envVersion) {
      case "develop":
        baseUrl = VITE_SERVER_BASEURL__WEIXIN_DEVELOP;
        break;
      case "trial":
        baseUrl = VITE_SERVER_BASEURL__WEIXIN_TRIAL;
        break;
      case "release":
        baseUrl = VITE_SERVER_BASEURL__WEIXIN_RELEASE;
        break;
    }
  }
  return baseUrl;
}
const isDoubleTokenMode = false;
const HOME_PAGE = `/${((_a = pages_json.pages.find((page) => page.type === "home")) == null ? void 0 : _a.path) || pages_json.pages[0].path}`;
exports.HOME_PAGE = HOME_PAGE;
exports.currRoute = currRoute;
exports.ensureDecodeURIComponent = ensureDecodeURIComponent;
exports.getAllPages = getAllPages;
exports.getEnvBaseUrl = getEnvBaseUrl;
exports.getLastPage = getLastPage;
exports.isDoubleTokenMode = isDoubleTokenMode;
exports.parseUrlToObj = parseUrlToObj;

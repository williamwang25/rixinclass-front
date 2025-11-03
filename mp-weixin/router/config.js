"use strict";
const utils_index = require("../utils/index.js");
const LOGIN_STRATEGY_MAP = {
  DEFAULT_NO_NEED_LOGIN: 0,
  // 黑名单策略，默认可以进入APP
  DEFAULT_NEED_LOGIN: 1
  // 白名单策略，默认不可以进入APP，需要强制登录
};
const LOGIN_STRATEGY = LOGIN_STRATEGY_MAP.DEFAULT_NO_NEED_LOGIN;
const isNeedLoginMode = LOGIN_STRATEGY === LOGIN_STRATEGY_MAP.DEFAULT_NEED_LOGIN;
const LOGIN_PAGE = "/pages-fg/login/login";
const NOT_FOUND_PAGE = "/pages-fg/404/index";
const excludeLoginPathList = utils_index.getAllPages("excludeLoginPath").map((page) => page.path);
const EXCLUDE_LOGIN_PATH_LIST = [
  "/pages/xxx/index",
  ...excludeLoginPathList
  // 都是以 / 开头的 path
];
exports.EXCLUDE_LOGIN_PATH_LIST = EXCLUDE_LOGIN_PATH_LIST;
exports.LOGIN_PAGE = LOGIN_PAGE;
exports.NOT_FOUND_PAGE = NOT_FOUND_PAGE;
exports.isNeedLoginMode = isNeedLoginMode;

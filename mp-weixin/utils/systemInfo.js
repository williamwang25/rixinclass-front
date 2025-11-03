"use strict";
const common_vendor = require("../common/vendor.js");
let systemInfo;
exports.safeAreaInsets = void 0;
systemInfo = common_vendor.index.getWindowInfo();
exports.safeAreaInsets = systemInfo.safeArea ? {
  top: systemInfo.safeArea.top,
  right: systemInfo.windowWidth - systemInfo.safeArea.right,
  bottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
  left: systemInfo.safeArea.left
} : null;
console.log("systemInfo", systemInfo);

"use strict";
function isSingleTokenRes(tokenRes) {
  return "token" in tokenRes && !("refreshToken" in tokenRes);
}
function isDoubleTokenRes(tokenRes) {
  return "accessToken" in tokenRes && "refreshToken" in tokenRes;
}
exports.isDoubleTokenRes = isDoubleTokenRes;
exports.isSingleTokenRes = isSingleTokenRes;

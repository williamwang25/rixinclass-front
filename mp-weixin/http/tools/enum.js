"use strict";
var ResultEnum = /* @__PURE__ */ ((ResultEnum2) => {
  ResultEnum2[ResultEnum2["Success0"] = 0] = "Success0";
  ResultEnum2[ResultEnum2["Success200"] = 200] = "Success200";
  ResultEnum2[ResultEnum2["Error"] = 400] = "Error";
  ResultEnum2[ResultEnum2["Unauthorized"] = 401] = "Unauthorized";
  ResultEnum2[ResultEnum2["Forbidden"] = 403] = "Forbidden";
  ResultEnum2[ResultEnum2["NotFound"] = 404] = "NotFound";
  ResultEnum2[ResultEnum2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
  ResultEnum2[ResultEnum2["RequestTimeout"] = 408] = "RequestTimeout";
  ResultEnum2[ResultEnum2["InternalServerError"] = 500] = "InternalServerError";
  ResultEnum2[ResultEnum2["NotImplemented"] = 501] = "NotImplemented";
  ResultEnum2[ResultEnum2["BadGateway"] = 502] = "BadGateway";
  ResultEnum2[ResultEnum2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
  ResultEnum2[ResultEnum2["GatewayTimeout"] = 504] = "GatewayTimeout";
  ResultEnum2[ResultEnum2["HttpVersionNotSupported"] = 505] = "HttpVersionNotSupported";
  return ResultEnum2;
})(ResultEnum || {});
var ContentTypeEnum = /* @__PURE__ */ ((ContentTypeEnum2) => {
  ContentTypeEnum2["JSON"] = "application/json;charset=UTF-8";
  ContentTypeEnum2["FORM_URLENCODED"] = "application/x-www-form-urlencoded;charset=UTF-8";
  ContentTypeEnum2["FORM_DATA"] = "multipart/form-data;charset=UTF-8";
  return ContentTypeEnum2;
})(ContentTypeEnum || {});
function ShowMessage(status) {
  let message;
  switch (status) {
    case 400:
      message = "请求错误(400)";
      break;
    case 401:
      message = "未授权，请重新登录(401)";
      break;
    case 403:
      message = "拒绝访问(403)";
      break;
    case 404:
      message = "请求出错(404)";
      break;
    case 408:
      message = "请求超时(408)";
      break;
    case 500:
      message = "服务器错误(500)";
      break;
    case 501:
      message = "服务未实现(501)";
      break;
    case 502:
      message = "网络错误(502)";
      break;
    case 503:
      message = "服务不可用(503)";
      break;
    case 504:
      message = "网络超时(504)";
      break;
    case 505:
      message = "HTTP版本不受支持(505)";
      break;
    default:
      message = `连接出错(${status})!`;
  }
  return `${message}，请检查网络或联系管理员！`;
}
exports.ContentTypeEnum = ContentTypeEnum;
exports.ResultEnum = ResultEnum;
exports.ShowMessage = ShowMessage;

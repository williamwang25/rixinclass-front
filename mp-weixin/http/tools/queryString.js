"use strict";
function stringifyQuery(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj))
    return "";
  return Object.entries(obj).filter(([_, value]) => value !== void 0 && value !== null).map(([key, value]) => {
    const encodedKey = encodeURIComponent(key);
    if (Array.isArray(value)) {
      return value.filter((item) => item !== void 0 && item !== null).map((item) => `${encodedKey}=${encodeURIComponent(item)}`).join("&");
    }
    return `${encodedKey}=${encodeURIComponent(value)}`;
  }).join("&");
}
exports.stringifyQuery = stringifyQuery;

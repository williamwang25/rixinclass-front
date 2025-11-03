"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "VBindCss",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "757a17b9": common_vendor.unref(testBindCssVariable)
    }));
    const testBindCssVariable = common_vendor.ref("red");
    function changeTestBindCssVariable() {
      if (testBindCssVariable.value === "red") {
        testBindCssVariable.value = "green";
      } else {
        testBindCssVariable.value = "red";
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(changeTestBindCssVariable),
        b: common_vendor.s(_ctx.__cssVars()),
        c: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
});
exports._sfc_main = _sfc_main;

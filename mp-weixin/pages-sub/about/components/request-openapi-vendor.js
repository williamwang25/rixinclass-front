"use strict";
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
const common_vendor = require("../../../common/vendor.js");
const pagesSub_common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "request-openapi",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(null);
    const data = common_vendor.ref();
    function getUserInfo() {
      return __async(this, null, function* () {
        try {
          loading.value = true;
          const res = yield pagesSub_common_vendor.infoUsingGet({});
          console.log(res);
          data.value = res;
          error.value = null;
        } catch (err) {
          error.value = err;
          data.value = null;
        } finally {
          loading.value = false;
        }
      });
    }
    const { data: data2, run } = pagesSub_common_vendor.useRequest(() => pagesSub_common_vendor.listAllUsingGet({}), {
      immediate: false
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(getUserInfo),
        b: common_vendor.t(JSON.stringify(common_vendor.unref(data))),
        c: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(run) && common_vendor.unref(run)(...args)
        ),
        d: common_vendor.t(JSON.stringify(common_vendor.unref(data2))),
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
});
exports._sfc_main = _sfc_main;

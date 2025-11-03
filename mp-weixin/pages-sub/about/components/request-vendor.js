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
  __name: "request",
  setup(__props) {
    const initialData = void 0;
    function reqFooAPI() {
      return __async(this, null, function* () {
        try {
          const res = yield pagesSub_common_vendor.getFooAPI("菲鸽");
          console.log("直接请求示例res", res);
        } catch (err) {
          console.log(err);
        }
      });
    }
    reqFooAPI();
    const { loading, error, data, run } = pagesSub_common_vendor.useRequest(() => pagesSub_common_vendor.getFooAPI("菲鸽"), {
      immediate: true,
      initialData
    });
    function reset() {
      data.value = initialData;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(run) && common_vendor.unref(run)(...args)
        ),
        b: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : common_vendor.e({
        c: common_vendor.unref(error) instanceof Error
      }, common_vendor.unref(error) instanceof Error ? {
        d: common_vendor.t(common_vendor.unref(error).message)
      } : common_vendor.unref(error) ? {} : {
        f: common_vendor.t(JSON.stringify(common_vendor.unref(data)))
      }, {
        e: common_vendor.unref(error)
      }), {
        g: !common_vendor.unref(data),
        h: common_vendor.o(reset),
        i: common_vendor.gei(_ctx, "")
      });
    };
  }
});
exports._sfc_main = _sfc_main;

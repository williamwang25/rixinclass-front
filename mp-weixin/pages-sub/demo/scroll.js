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
const common_vendor = require("../../common/vendor.js");
const pagesSub_common_vendor = require("../common/vendor.js");
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "scroll",
  setup(__props) {
    function mockFetchData(page, pageSize) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (page > 5) {
            resolve([]);
            return;
          }
          const data = Array.from({ length: pageSize }, (_, i) => ({
            id: (page - 1) * pageSize + i + 1,
            name: `item ${(page - 1) * pageSize + i + 1}`
          }));
          resolve(data);
        }, 1e3);
      });
    }
    const { list, loading, finished, error, refresh, loadMore } = pagesSub_common_vendor.useScroll({
      fetchData: mockFetchData,
      pageSize: 10
    });
    common_vendor.onPullDownRefresh(() => __async(this, null, function* () {
      console.log("onPullDownRefresh");
      console.log("onPullDownRefresh");
      console.log("onPullDownRefresh");
      yield refresh();
      common_vendor.index.stopPullDownRefresh();
    }));
    common_vendor.onReachBottom(() => {
      loadMore();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(error)
      }, common_vendor.unref(error) ? {} : common_vendor.e({
        b: common_vendor.f(common_vendor.unref(list), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.id
          };
        }),
        c: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {}, {
        d: common_vendor.unref(finished)
      }, common_vendor.unref(finished) ? {} : {}), {
        e: common_vendor.gei(_ctx, "")
      });
    };
  }
});
wx.createPage(_sfc_main);

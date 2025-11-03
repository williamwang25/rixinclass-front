"use strict";
const common_vendor = require("../../common/vendor.js");
const pagesSub_common_vendor = require("../common/vendor.js");
if (!Array) {
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_component_layout_default_uni + _component_global_ku_root)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "alova",
  setup(__props) {
    const initialData = void 0;
    const { loading, data, send } = pagesSub_common_vendor.useRequest$1(pagesSub_common_vendor.foo, {
      initialData,
      immediate: true
    });
    console.log(data);
    function reset() {
      data.value = initialData;
    }
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(send) && common_vendor.unref(send)(...args)
        ),
        b: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {
        c: common_vendor.t(JSON.stringify(common_vendor.unref(data)))
      }, {
        d: common_vendor.t((_a = common_vendor.unref(data)) == null ? void 0 : _a.id),
        e: common_vendor.o(reset),
        f: common_vendor.gei(_ctx, "")
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d74fa4df"]]);
wx.createPage(MiniProgramPage);

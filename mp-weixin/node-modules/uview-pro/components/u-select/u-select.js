"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  _easycom_u_popup2();
}
const _easycom_u_popup = () => "../u-popup/u-popup.js";
if (!Math) {
  _easycom_u_popup();
}
const __default__ = {
  name: "u-select",
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: "shared"
  }
};
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, __default__), {
  props: common_vendor.SelectProps,
  emits: ["update:modelValue", "confirm", "cancel", "click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const defaultSelector = common_vendor.ref([0]);
    const columnData = common_vendor.ref([]);
    const selectValue = common_vendor.ref([]);
    const lastSelectIndex = common_vendor.ref([]);
    const columnNum = common_vendor.ref(0);
    const moving = common_vendor.ref(false);
    const uZIndex = common_vendor.computed(() => props.zIndex ? props.zIndex : 10075);
    const popupValue = common_vendor.computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val)
    });
    common_vendor.watch(
      () => props.modelValue,
      (val) => {
        if (val)
          setTimeout(() => init(), 10);
      },
      { immediate: true }
    );
    function pickstart() {
      moving.value = true;
    }
    function pickend() {
      moving.value = false;
    }
    function init() {
      setColumnNum();
      setDefaultSelector();
      setColumnData();
      setSelectValue();
    }
    function setDefaultSelector() {
      defaultSelector.value = props.defaultValue.length == columnNum.value ? props.defaultValue : Array(columnNum.value).fill(0);
      lastSelectIndex.value = [...defaultSelector.value];
    }
    function setColumnNum() {
      if (props.mode == "single-column")
        columnNum.value = 1;
      else if (props.mode == "mutil-column")
        columnNum.value = props.list.length;
      else if (props.mode == "mutil-column-auto") {
        let num = 1;
        let column = props.list;
        while (Array.isArray(column) && column[0] && typeof column[0] === "object" && props.childName in column[0]) {
          column = column[0][props.childName];
          num++;
        }
        columnNum.value = num;
      }
    }
    function setColumnData() {
      let data = [];
      selectValue.value = [];
      if (props.mode == "mutil-column-auto") {
        let column = props.list[defaultSelector.value.length ? defaultSelector.value[0] : 0];
        for (let i = 0; i < columnNum.value; i++) {
          if (i == 0) {
            data[i] = is2DList(props.list) ? props.list[i] || [] : props.list;
            column = column && typeof column === "object" ? column[props.childName] : [];
          } else {
            data[i] = Array.isArray(column) ? column : [];
            column = Array.isArray(column) && column[defaultSelector.value[i]] && typeof column[defaultSelector.value[i]] === "object" ? column[defaultSelector.value[i]][props.childName] : [];
          }
        }
      } else if (props.mode == "single-column") {
        data[0] = Array.isArray(props.list) && !is2DList(props.list) ? props.list : [];
      } else if (props.mode == "mutil-column") {
        data = is2DList(props.list) ? props.list : [props.list];
      }
      columnData.value = data;
    }
    function setSelectValue() {
      for (let i = 0; i < columnNum.value; i++) {
        const tmp = columnData.value[i][defaultSelector.value[i]];
        let data = {
          value: tmp ? tmp[props.valueName] : null,
          label: tmp ? tmp[props.labelName] : null
        };
        if (tmp && tmp.extra !== void 0)
          data.extra = tmp.extra;
        selectValue.value.push(data);
      }
    }
    function columnChange(e) {
      let index = -1;
      const columnIndex = e.detail.value;
      selectValue.value = [];
      defaultSelector.value = columnIndex;
      if (props.mode == "mutil-column-auto") {
        lastSelectIndex.value.map((val, idx) => {
          if (val != columnIndex[idx])
            index = idx;
        });
        for (let i = index + 1; i < columnNum.value; i++) {
          const prevCol = columnData.value[i - 1];
          const prevIdx = i - 1 == index ? columnIndex[index] : 0;
          columnData.value[i] = Array.isArray(prevCol) && prevCol[prevIdx] && typeof prevCol[prevIdx] === "object" ? prevCol[prevIdx][props.childName] : [];
          defaultSelector.value[i] = 0;
        }
        columnIndex.map((item, idx) => {
          let data = columnData.value[idx][columnIndex[idx]];
          let tmp = {
            value: data ? data[props.valueName] : null,
            label: data ? data[props.labelName] : null
          };
          if (data && data.extra !== void 0)
            tmp.extra = data.extra;
          selectValue.value.push(tmp);
        });
        lastSelectIndex.value = [...columnIndex];
      } else if (props.mode == "single-column") {
        let data = columnData.value[0][columnIndex[0]];
        let tmp = {
          value: data ? data[props.valueName] : null,
          label: data ? data[props.labelName] : null
        };
        if (data && data.extra !== void 0)
          tmp.extra = data.extra;
        selectValue.value.push(tmp);
      } else if (props.mode == "mutil-column") {
        columnIndex.map((item, idx) => {
          let data = columnData.value[idx][columnIndex[idx]];
          let tmp = {
            value: data ? data[props.valueName] : null,
            label: data ? data[props.labelName] : null
          };
          if (data && data.extra !== void 0)
            tmp.extra = data.extra;
          selectValue.value.push(tmp);
        });
      }
    }
    function close() {
      emit("update:modelValue", false);
      defaultSelector.value = [0];
    }
    function getResult(event = null) {
      if (moving.value)
        return;
      if (event)
        emit(event, selectValue.value);
      close();
    }
    function is2DList(list) {
      return Array.isArray(list) && list.length > 0 && Array.isArray(list[0]);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(_ctx.cancelText),
        b: _ctx.cancelColor,
        c: common_vendor.o(($event) => getResult("cancel")),
        d: common_vendor.t(_ctx.title),
        e: common_vendor.t(_ctx.confirmText),
        f: moving.value ? _ctx.cancelColor : _ctx.confirmColor,
        g: common_vendor.o(() => {
        }),
        h: common_vendor.o(($event) => getResult("confirm")),
        i: common_vendor.o(() => {
        }),
        j: _ctx.modelValue
      }, _ctx.modelValue ? {
        k: common_vendor.f(columnData.value, (item, index, i0) => {
          return {
            a: common_vendor.f(item, (item1, index1, i1) => {
              return {
                a: common_vendor.t(item1[_ctx.labelName]),
                b: index1
              };
            }),
            b: index
          };
        }),
        l: common_vendor.o(columnChange),
        m: defaultSelector.value,
        n: common_vendor.o(pickstart),
        o: common_vendor.o(pickend)
      } : {}, {
        p: common_vendor.o(close),
        q: common_vendor.o(($event) => popupValue.value = $event),
        r: common_vendor.p({
          maskCloseAble: _ctx.maskCloseAble,
          mode: "bottom",
          popup: false,
          length: "auto",
          safeAreaInsetBottom: _ctx.safeAreaInsetBottom,
          ["z-index"]: uZIndex.value,
          modelValue: popupValue.value
        }),
        s: common_vendor.n(_ctx.customClass),
        t: common_vendor.s(common_vendor.unref(common_vendor.$u).toStyle(_ctx.customStyle)),
        v: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2e60fab0"]]);
wx.createComponent(Component);

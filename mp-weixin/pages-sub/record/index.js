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
const common_vendor = require("../../common/vendor.js");
const utils_systemInfo = require("../../utils/systemInfo.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _easycom_u_button2 + _easycom_u_popup2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
const _easycom_u_button = () => "../../node-modules/uview-pro/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../node-modules/uview-pro/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_button + _easycom_u_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "BookingRecord"
}), {
  __name: "index",
  setup(__props) {
    const historyList = common_vendor.ref([
      {
        id: "BK202401001",
        courseCode: "CS101",
        courseName: "计算机图形学实验",
        courseType: "实验教学",
        academicYear: "2023-2024",
        semester: "第二学期",
        teacherName: "张教师",
        className: "计算机2101-2102",
        studentCount: 58,
        timeSlots: [
          {
            weekday: "星期一",
            weekStart: "1",
            weekEnd: "16",
            periodStart: "3",
            periodEnd: "4"
          }
        ],
        laboratory: "软件楼505实验室",
        applyTime: "2024-02-15 10:30:00",
        completedTime: "2024-06-20",
        softwareRequirements: "Adobe Photoshop 2020, AutoCAD 2021",
        teacherPhone: "13800138000",
        teacherEmail: "zhang@bjut.edu.cn"
      },
      {
        id: "BK202401002",
        courseCode: "CS202",
        courseName: "数据结构课程设计",
        courseType: "实验作业",
        academicYear: "2023-2024",
        semester: "第一学期",
        teacherName: "张教师",
        className: "计算机2103",
        studentCount: 30,
        timeSlots: [
          {
            weekday: "星期三",
            weekStart: "1",
            weekEnd: "8",
            periodStart: "5",
            periodEnd: "6"
          }
        ],
        laboratory: "软件楼518实验室",
        applyTime: "2023-09-10 09:15:00",
        completedTime: "2023-12-25",
        softwareRequirements: "Visual Studio Code, GCC编译器",
        teacherPhone: "13800138000",
        teacherEmail: "zhang@bjut.edu.cn"
      },
      {
        id: "BK202301003",
        courseCode: "CS303",
        courseName: "Web前端开发实训",
        courseType: "工作实习",
        academicYear: "2022-2023",
        semester: "第二学期",
        teacherName: "张教师",
        className: "软件工程2001",
        studentCount: 42,
        timeSlots: [
          {
            weekday: "星期五",
            weekStart: "1",
            weekEnd: "12",
            periodStart: "1",
            periodEnd: "4"
          }
        ],
        laboratory: "软件楼505实验室",
        applyTime: "2023-02-20 14:20:00",
        completedTime: "2023-06-15",
        softwareRequirements: "Visual Studio Code, Node.js, Chrome浏览器",
        otherRequirements: "需要外网访问权限",
        teacherPhone: "13800138000",
        teacherEmail: "zhang@bjut.edu.cn"
      }
    ]);
    const selectedRecord = common_vendor.ref(null);
    const showDetailModal = common_vendor.ref(false);
    const activeYear = common_vendor.ref("all");
    const yearList = common_vendor.computed(() => {
      const years = /* @__PURE__ */ new Set();
      historyList.value.forEach((item) => years.add(item.academicYear));
      return [
        { key: "all", label: "全部" },
        ...Array.from(years).map((year) => ({ key: year, label: year }))
      ];
    });
    const filteredList = common_vendor.computed(() => {
      if (activeYear.value === "all") {
        return historyList.value;
      }
      return historyList.value.filter((item) => item.academicYear === activeYear.value);
    });
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function viewDetail(item) {
      selectedRecord.value = item;
      showDetailModal.value = true;
    }
    function closeDetail() {
      showDetailModal.value = false;
      selectedRecord.value = null;
    }
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrow-left",
          size: "20",
          color: "#333333"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.f(yearList.value, (year, k0, i0) => {
          return {
            a: common_vendor.t(year.label),
            b: year.key,
            c: activeYear.value === year.key ? 1 : "",
            d: common_vendor.o(($event) => activeYear.value = year.key, year.key)
          };
        }),
        d: filteredList.value.length === 0
      }, filteredList.value.length === 0 ? {
        e: common_vendor.p({
          name: "file-text",
          size: "80",
          color: "#cccccc"
        })
      } : {}, {
        f: common_vendor.f(filteredList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.courseName),
            b: common_vendor.t(item.courseCode),
            c: common_vendor.t(item.courseType),
            d: "93559872-4-" + i0 + ",93559872-1",
            e: "93559872-5-" + i0 + ",93559872-1",
            f: common_vendor.t(item.academicYear),
            g: common_vendor.t(item.semester),
            h: "93559872-6-" + i0 + ",93559872-1",
            i: common_vendor.t(item.laboratory),
            j: "93559872-7-" + i0 + ",93559872-1",
            k: common_vendor.t(item.className),
            l: common_vendor.t(item.studentCount),
            m: common_vendor.t(item.completedTime),
            n: "93559872-8-" + i0 + ",93559872-1",
            o: item.id,
            p: common_vendor.o(($event) => viewDetail(item), item.id)
          };
        }),
        g: common_vendor.p({
          name: "checkmark-circle-fill",
          size: "16",
          color: "#52c41a"
        }),
        h: common_vendor.p({
          name: "calendar",
          size: "14",
          color: "#999999"
        }),
        i: common_vendor.p({
          name: "home",
          size: "14",
          color: "#999999"
        }),
        j: common_vendor.p({
          name: "account",
          size: "14",
          color: "#999999"
        }),
        k: common_vendor.p({
          name: "arrow-right",
          size: "16",
          color: "#999999"
        }),
        l: selectedRecord.value
      }, selectedRecord.value ? common_vendor.e({
        m: common_vendor.o(closeDetail),
        n: common_vendor.p({
          name: "close",
          size: "24",
          color: "#333333"
        }),
        o: common_vendor.p({
          name: "checkmark-circle-fill",
          size: "48",
          color: "#52c41a"
        }),
        p: common_vendor.t(selectedRecord.value.id),
        q: common_vendor.t(selectedRecord.value.courseName),
        r: common_vendor.t(selectedRecord.value.courseCode),
        s: common_vendor.t(selectedRecord.value.courseType),
        t: common_vendor.t(selectedRecord.value.academicYear),
        v: common_vendor.t(selectedRecord.value.semester),
        w: common_vendor.t(selectedRecord.value.className),
        x: common_vendor.t(selectedRecord.value.studentCount),
        y: common_vendor.t(selectedRecord.value.laboratory),
        z: common_vendor.f(selectedRecord.value.timeSlots, (slot, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(slot.weekday),
            c: common_vendor.t(slot.weekStart),
            d: common_vendor.t(slot.weekEnd),
            e: common_vendor.t(slot.periodStart),
            f: common_vendor.t(slot.periodEnd),
            g: index
          };
        }),
        A: selectedRecord.value.softwareRequirements || selectedRecord.value.otherRequirements
      }, selectedRecord.value.softwareRequirements || selectedRecord.value.otherRequirements ? common_vendor.e({
        B: selectedRecord.value.softwareRequirements
      }, selectedRecord.value.softwareRequirements ? {
        C: common_vendor.t(selectedRecord.value.softwareRequirements)
      } : {}, {
        D: selectedRecord.value.otherRequirements
      }, selectedRecord.value.otherRequirements ? {
        E: common_vendor.t(selectedRecord.value.otherRequirements)
      } : {}) : {}, {
        F: common_vendor.t(selectedRecord.value.teacherName),
        G: common_vendor.t(selectedRecord.value.teacherPhone),
        H: common_vendor.t(selectedRecord.value.teacherEmail),
        I: common_vendor.t(selectedRecord.value.applyTime),
        J: common_vendor.t(selectedRecord.value.completedTime),
        K: common_vendor.o(closeDetail),
        L: common_vendor.p({
          type: "info",
          plain: true,
          ["custom-style"]: {
            flex: 1
          }
        })
      }) : {}, {
        M: common_vendor.o(($event) => showDetailModal.value = $event),
        N: common_vendor.p({
          mode: "bottom",
          ["border-radius"]: 20,
          ["safe-area-inset-bottom"]: true,
          modelValue: showDetailModal.value
        }),
        O: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        P: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93559872"]]);
wx.createPage(MiniProgramPage);

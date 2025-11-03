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
  const _easycom_u_tag2 = common_vendor.resolveComponent("u-tag");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _easycom_u_tag2 + _easycom_u_button2 + _easycom_u_popup2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
const _easycom_u_tag = () => "../../node-modules/uview-pro/components/u-tag/u-tag.js";
const _easycom_u_button = () => "../../node-modules/uview-pro/components/u-button/u-button.js";
const _easycom_u_popup = () => "../../node-modules/uview-pro/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_tag + _easycom_u_button + _easycom_u_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "BookingQuery"
}), {
  __name: "index",
  setup(__props) {
    const bookingList = common_vendor.ref([
      {
        id: "BK202501001",
        courseCode: "CS101",
        courseName: "计算机图形学实验",
        courseType: "实验教学",
        academicYear: "2024-2025",
        semester: "第一学期",
        teacherName: "张教师",
        status: "rejected",
        statusText: "已拒绝",
        applyTime: "2025-01-15 10:30:00",
        auditTime: "2025-01-16 14:20:00",
        rejectReason: "申请时间段与其他课程冲突，请重新选择时间",
        requiredHours: 32,
        bookingHours: 32,
        className: "计算机2201-2202",
        studentCount: 60,
        timeSlots: [
          {
            weekday: "星期一",
            weekStart: "1",
            weekEnd: "16",
            periodStart: "3",
            periodEnd: "4"
          }
        ],
        softwareRequirements: "Adobe Photoshop 2020, AutoCAD 2021",
        otherRequirements: "需要高配置显卡的电脑",
        teacherPhone: "13800138000",
        teacherEmail: "zhang@bjut.edu.cn",
        teacherSignature: ""
      },
      {
        id: "BK202501002",
        courseCode: "CS202",
        courseName: "数据结构课程设计",
        courseType: "实验作业",
        academicYear: "2024-2025",
        semester: "第一学期",
        teacherName: "张教师",
        status: "approved",
        statusText: "已通过",
        applyTime: "2025-01-10 09:15:00",
        auditTime: "2025-01-11 11:30:00",
        requiredHours: 16,
        bookingHours: 16,
        className: "计算机2203",
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
        softwareRequirements: "Visual Studio Code, GCC编译器",
        teacherPhone: "13800138000",
        teacherEmail: "zhang@bjut.edu.cn"
      },
      {
        id: "BK202501003",
        courseCode: "CS303",
        courseName: "Web前端开发实训",
        courseType: "工作实习",
        academicYear: "2024-2025",
        semester: "第一学期",
        teacherName: "张教师",
        status: "pending",
        statusText: "待审核",
        applyTime: "2025-01-17 14:20:00",
        requiredHours: 24,
        bookingHours: 24,
        className: "软件工程2201",
        studentCount: 45,
        timeSlots: [
          {
            weekday: "星期五",
            weekStart: "1",
            weekEnd: "12",
            periodStart: "1",
            periodEnd: "2"
          },
          {
            weekday: "星期五",
            weekStart: "1",
            weekEnd: "12",
            periodStart: "3",
            periodEnd: "4"
          }
        ],
        softwareRequirements: "Visual Studio Code, Node.js, Chrome浏览器",
        otherRequirements: "需要外网访问权限",
        teacherPhone: "13800138000",
        teacherEmail: "zhang@bjut.edu.cn"
      }
    ]);
    const selectedBooking = common_vendor.ref(null);
    const showDetailModal = common_vendor.ref(false);
    const activeTab = common_vendor.ref("all");
    const tabList = [
      { key: "all", label: "全部", count: 0 },
      { key: "pending", label: "待审核", count: 0 },
      { key: "approved", label: "已通过", count: 0 },
      { key: "rejected", label: "已拒绝", count: 0 }
    ];
    function updateTabCounts() {
      tabList[0].count = bookingList.value.length;
      tabList[1].count = bookingList.value.filter(
        (item) => item.status === "pending"
        /* PENDING */
      ).length;
      tabList[2].count = bookingList.value.filter(
        (item) => item.status === "approved"
        /* APPROVED */
      ).length;
      tabList[3].count = bookingList.value.filter(
        (item) => item.status === "rejected"
        /* REJECTED */
      ).length;
    }
    updateTabCounts();
    const filteredList = common_vendor.computed(() => {
      if (activeTab.value === "all") {
        return bookingList.value;
      }
      return bookingList.value.filter((item) => item.status === activeTab.value);
    });
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function getStatusType(status) {
      const typeMap = {
        [
          "pending"
          /* PENDING */
        ]: "warning",
        [
          "approved"
          /* APPROVED */
        ]: "success",
        [
          "rejected"
          /* REJECTED */
        ]: "error",
        [
          "cancelled"
          /* CANCELLED */
        ]: "info"
      };
      return typeMap[status] || "info";
    }
    function viewDetail(item) {
      selectedBooking.value = item;
      showDetailModal.value = true;
    }
    function modifyBooking(item) {
      common_vendor.index.showModal({
        title: "提示",
        content: "将跳转到申请页面进行修改",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateTo({
              url: `/pages-sub/apply/index?mode=edit&id=${item.id}`
            });
          }
        }
      });
    }
    function cancelBooking(item) {
      common_vendor.index.showModal({
        title: "取消申请",
        content: "确定要取消该申请吗？取消后无法恢复",
        confirmColor: "#ff0000",
        success: (res) => {
          if (res.confirm) {
            const index = bookingList.value.findIndex((b) => b.id === item.id);
            if (index !== -1) {
              bookingList.value[index].status = "cancelled";
              bookingList.value[index].statusText = "已取消";
              updateTabCounts();
              common_vendor.index.showToast({
                title: "已取消申请",
                icon: "success"
              });
            }
          }
        }
      });
    }
    function formatTimeSlots(slots) {
      return slots.map(
        (slot) => `${slot.weekday} ${slot.weekStart}-${slot.weekEnd}周（${slot.periodStart}-${slot.periodEnd}节）`
      ).join("；");
    }
    function closeDetail() {
      showDetailModal.value = false;
      selectedBooking.value = null;
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
        c: common_vendor.f(tabList, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: tab.count > 0
          }, tab.count > 0 ? {
            c: common_vendor.t(tab.count)
          } : {}, {
            d: tab.key,
            e: activeTab.value === tab.key ? 1 : "",
            f: common_vendor.o(($event) => activeTab.value = tab.key, tab.key)
          });
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
          return common_vendor.e({
            a: common_vendor.t(item.courseName),
            b: common_vendor.t(item.courseCode),
            c: "e5ca4236-4-" + i0 + ",e5ca4236-1",
            d: common_vendor.p({
              text: item.statusText,
              type: getStatusType(item.status),
              plain: true,
              size: "mini"
            }),
            e: "e5ca4236-5-" + i0 + ",e5ca4236-1",
            f: common_vendor.t(item.academicYear),
            g: common_vendor.t(item.semester),
            h: "e5ca4236-6-" + i0 + ",e5ca4236-1",
            i: common_vendor.t(formatTimeSlots(item.timeSlots)),
            j: "e5ca4236-7-" + i0 + ",e5ca4236-1",
            k: common_vendor.t(item.className),
            l: common_vendor.t(item.studentCount),
            m: item.status === "rejected" && item.rejectReason
          }, item.status === "rejected" && item.rejectReason ? {
            n: "e5ca4236-8-" + i0 + ",e5ca4236-1",
            o: common_vendor.p({
              name: "info-circle",
              size: "14",
              color: "#ff6b6b"
            }),
            p: common_vendor.t(item.rejectReason)
          } : {}, {
            q: common_vendor.t(item.applyTime),
            r: common_vendor.o(($event) => viewDetail(item), item.id),
            s: "e5ca4236-9-" + i0 + ",e5ca4236-1",
            t: item.status === "rejected"
            /* REJECTED */
          }, item.status === "rejected" ? {
            v: common_vendor.o(($event) => modifyBooking(item), item.id),
            w: "e5ca4236-10-" + i0 + ",e5ca4236-1",
            x: common_vendor.p({
              type: "primary",
              size: "mini",
              plain: true,
              ["custom-style"]: {
                padding: "0 20rpx",
                marginLeft: "16rpx"
              }
            })
          } : {}, {
            y: item.status === "pending"
            /* PENDING */
          }, item.status === "pending" ? {
            z: common_vendor.o(($event) => cancelBooking(item), item.id),
            A: "e5ca4236-11-" + i0 + ",e5ca4236-1",
            B: common_vendor.p({
              type: "error",
              size: "mini",
              plain: true,
              ["custom-style"]: {
                padding: "0 20rpx",
                marginLeft: "16rpx"
              }
            })
          } : {}, {
            C: item.id,
            D: common_vendor.o(($event) => viewDetail(item), item.id)
          });
        }),
        g: common_vendor.p({
          name: "calendar",
          size: "14",
          color: "#999999"
        }),
        h: common_vendor.p({
          name: "clock",
          size: "14",
          color: "#999999"
        }),
        i: common_vendor.p({
          name: "account",
          size: "14",
          color: "#999999"
        }),
        j: common_vendor.p({
          type: "primary",
          size: "mini",
          plain: true,
          ["custom-style"]: {
            padding: "0 20rpx"
          }
        }),
        k: selectedBooking.value
      }, selectedBooking.value ? common_vendor.e({
        l: common_vendor.o(closeDetail),
        m: common_vendor.p({
          name: "close",
          size: "24",
          color: "#333333"
        }),
        n: common_vendor.p({
          text: selectedBooking.value.statusText,
          type: getStatusType(selectedBooking.value.status)
        }),
        o: common_vendor.t(selectedBooking.value.id),
        p: selectedBooking.value.status === "rejected" && selectedBooking.value.rejectReason
      }, selectedBooking.value.status === "rejected" && selectedBooking.value.rejectReason ? {
        q: common_vendor.p({
          name: "info-circle-fill",
          size: "18",
          color: "#ff6b6b"
        }),
        r: common_vendor.t(selectedBooking.value.rejectReason)
      } : {}, {
        s: common_vendor.t(selectedBooking.value.courseName),
        t: common_vendor.t(selectedBooking.value.courseCode),
        v: common_vendor.t(selectedBooking.value.courseType),
        w: common_vendor.t(selectedBooking.value.academicYear),
        x: common_vendor.t(selectedBooking.value.semester),
        y: common_vendor.t(selectedBooking.value.className),
        z: common_vendor.t(selectedBooking.value.studentCount),
        A: common_vendor.t(selectedBooking.value.requiredHours),
        B: common_vendor.t(selectedBooking.value.bookingHours),
        C: common_vendor.f(selectedBooking.value.timeSlots, (slot, index, i0) => {
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
        D: selectedBooking.value.softwareRequirements
      }, selectedBooking.value.softwareRequirements ? {
        E: common_vendor.t(selectedBooking.value.softwareRequirements)
      } : {}, {
        F: selectedBooking.value.otherRequirements
      }, selectedBooking.value.otherRequirements ? {
        G: common_vendor.t(selectedBooking.value.otherRequirements)
      } : {}, {
        H: common_vendor.t(selectedBooking.value.teacherName),
        I: common_vendor.t(selectedBooking.value.teacherPhone),
        J: common_vendor.t(selectedBooking.value.teacherEmail),
        K: common_vendor.t(selectedBooking.value.applyTime),
        L: selectedBooking.value.auditTime
      }, selectedBooking.value.auditTime ? {
        M: common_vendor.t(selectedBooking.value.auditTime)
      } : {}, {
        N: selectedBooking.value.status === "rejected"
        /* REJECTED */
      }, selectedBooking.value.status === "rejected" ? {
        O: common_vendor.o(($event) => modifyBooking(selectedBooking.value)),
        P: common_vendor.p({
          type: "primary",
          ["custom-style"]: {
            flex: 1
          }
        })
      } : {}, {
        Q: selectedBooking.value.status === "pending"
        /* PENDING */
      }, selectedBooking.value.status === "pending" ? {
        R: common_vendor.o(($event) => cancelBooking(selectedBooking.value)),
        S: common_vendor.p({
          type: "error",
          plain: true,
          ["custom-style"]: {
            flex: 1
          }
        })
      } : {}, {
        T: common_vendor.o(closeDetail),
        U: common_vendor.p({
          type: "info",
          plain: true,
          ["custom-style"]: {
            flex: 1
          }
        })
      }) : {}, {
        V: common_vendor.o(($event) => showDetailModal.value = $event),
        W: common_vendor.p({
          mode: "bottom",
          ["border-radius"]: 20,
          ["safe-area-inset-bottom"]: true,
          modelValue: showDetailModal.value
        }),
        X: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        Y: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e5ca4236"]]);
wx.createPage(MiniProgramPage);

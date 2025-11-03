"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const navBarConfig = common_vendor.ref({
      title: "通知中心",
      frontColor: "#ffffff",
      backgroundColor: "#0096C2"
    });
    const noticeTypes = common_vendor.ref([
      { key: "all", label: "全部", count: 3 },
      { key: "pending", label: "待审核", count: 1 },
      { key: "approved", label: "已通过", count: 1 },
      { key: "rejected", label: "已拒绝", count: 1 }
    ]);
    const activeType = common_vendor.ref("all");
    function switchType(type) {
      activeType.value = type;
      loadNotices();
    }
    const notices = common_vendor.ref([
      {
        id: 1,
        type: "approved",
        title: "排课申请已通过",
        content: "您的《数据结构与算法》课程排课申请已通过审核，已安排到软件楼505实验室。",
        courseName: "数据结构与算法",
        courseCode: "CS2001",
        time: "2024-12-20 14:30",
        isRead: false,
        adminRemark: ""
      },
      {
        id: 2,
        type: "rejected",
        title: "排课申请被拒绝",
        content: "您的《软件工程》课程排课申请被拒绝，请查看拒绝原因并重新提交。",
        courseName: "软件工程",
        courseCode: "CS2002",
        time: "2024-12-19 16:45",
        isRead: false,
        adminRemark: "申请时间段与现有课程冲突，建议选择其他时间段。"
      },
      {
        id: 3,
        type: "pending",
        title: "排课申请提交成功",
        content: "您的《计算机组成原理》课程排课申请已提交，正在审核中，请耐心等待。",
        courseName: "计算机组成原理",
        courseCode: "CS2003",
        time: "2024-12-18 10:20",
        isRead: true,
        adminRemark: ""
      }
    ]);
    const filteredNotices = common_vendor.ref([]);
    function loadNotices() {
      if (activeType.value === "all") {
        filteredNotices.value = notices.value;
      } else {
        filteredNotices.value = notices.value.filter((notice) => notice.type === activeType.value);
      }
    }
    function markAsRead(notice) {
      notice.isRead = true;
      const typeItem = noticeTypes.value.find((item) => item.key === notice.type);
      if (typeItem && typeItem.count > 0) {
        typeItem.count--;
      }
      const allItem = noticeTypes.value.find((item) => item.key === "all");
      if (allItem && allItem.count > 0) {
        allItem.count--;
      }
    }
    function viewDetail(notice) {
      markAsRead(notice);
      if (notice.type === "rejected") {
        common_vendor.index.navigateTo({
          url: "/pages-sub/query/index"
        });
      } else if (notice.type === "approved") {
        common_vendor.index.showToast({
          title: "排课结果查看功能开发中",
          icon: "none"
        });
      }
    }
    common_vendor.onMounted(() => {
      loadNotices();
    });
    function getTypeColor(type) {
      const colors = {
        approved: "#52c41a",
        rejected: "#ff4d4f",
        pending: "#1890ff"
      };
      return colors[type] || "#666666";
    }
    function getTypeIcon(type) {
      const icons = {
        approved: "checkmark-circle",
        rejected: "close-circle",
        pending: "time"
      };
      return icons[type] || "info-circle";
    }
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: navBarConfig.value.title,
        b: navBarConfig.value.frontColor,
        c: navBarConfig.value.backgroundColor,
        d: common_vendor.f(noticeTypes.value, (type, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(type.label),
            b: type.count > 0
          }, type.count > 0 ? {
            c: common_vendor.t(type.count > 99 ? "99+" : type.count)
          } : {}, {
            d: type.key,
            e: activeType.value === type.key ? 1 : "",
            f: common_vendor.o(($event) => switchType(type.key), type.key)
          });
        }),
        e: common_vendor.f(filteredNotices.value, (notice, k0, i0) => {
          return common_vendor.e({
            a: "8e21c599-2-" + i0 + ",8e21c599-1",
            b: common_vendor.p({
              name: getTypeIcon(notice.type),
              size: "20",
              color: getTypeColor(notice.type)
            }),
            c: `${getTypeColor(notice.type)}20`,
            d: common_vendor.t(notice.title),
            e: common_vendor.t(notice.time),
            f: common_vendor.t(notice.content),
            g: common_vendor.t(notice.courseName),
            h: common_vendor.t(notice.courseCode),
            i: notice.adminRemark
          }, notice.adminRemark ? {
            j: "8e21c599-3-" + i0 + ",8e21c599-1",
            k: common_vendor.p({
              name: "message",
              size: "14",
              color: "#ff6b6b"
            }),
            l: common_vendor.t(notice.adminRemark)
          } : {}, {
            m: !notice.isRead
          }, !notice.isRead ? {} : {}, {
            n: notice.id,
            o: !notice.isRead ? 1 : "",
            p: common_vendor.o(($event) => viewDetail(notice), notice.id)
          });
        }),
        f: filteredNotices.value.length === 0
      }, filteredNotices.value.length === 0 ? {
        g: common_vendor.p({
          name: "notification",
          size: "60",
          color: "#cccccc"
        }),
        h: common_vendor.t(activeType.value === "all" ? "" : (_a = noticeTypes.value.find((t) => t.key === activeType.value)) == null ? void 0 : _a.label)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8e21c599"]]);
wx.createPage(MiniProgramPage);

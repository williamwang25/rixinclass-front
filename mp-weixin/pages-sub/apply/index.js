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
require("../../store/index.js");
const utils_systemInfo = require("../../utils/systemInfo.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  const _easycom_u_select2 = common_vendor.resolveComponent("u-select");
  const _component_layout_default_uni = common_vendor.resolveComponent("layout-default-uni");
  const _component_global_ku_root = common_vendor.resolveComponent("global-ku-root");
  (_easycom_u_icon2 + _easycom_u_form_item2 + _easycom_u_button2 + _easycom_u_form2 + _easycom_u_select2 + _component_layout_default_uni + _component_global_ku_root)();
}
const _easycom_u_icon = () => "../../node-modules/uview-pro/components/u-icon/u-icon.js";
const _easycom_u_form_item = () => "../../node-modules/uview-pro/components/u-form-item/u-form-item.js";
const _easycom_u_button = () => "../../node-modules/uview-pro/components/u-button/u-button.js";
const _easycom_u_form = () => "../../node-modules/uview-pro/components/u-form/u-form.js";
const _easycom_u_select = () => "../../node-modules/uview-pro/components/u-select/u-select.js";
if (!Math) {
  (_easycom_u_icon + _easycom_u_form_item + _easycom_u_button + _easycom_u_form + _easycom_u_select)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(__spreadProps(__spreadValues({}, {
  name: "BookingApply"
}), {
  __name: "index",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const formRef = common_vendor.ref();
    const formData = common_vendor.reactive({
      // 课程信息
      academicYear: "",
      semester: "",
      courseCode: "",
      courseType: "",
      courseName: "",
      requiredHours: "",
      bookingHours: "",
      className: "",
      studentCount: "",
      softwareRequirements: "",
      otherRequirements: "",
      // 教师信息
      teacherName: "",
      teacherPhone: "",
      teacherEmail: "",
      teacherSignature: ""
    });
    const timeSlots = common_vendor.ref([]);
    const showYearPicker = common_vendor.ref(false);
    const showSemesterPicker = common_vendor.ref(false);
    const showCourseTypePicker = common_vendor.ref(false);
    const yearList = common_vendor.ref([]);
    const semesterList = common_vendor.ref([
      { value: "1", label: "第一学期" },
      { value: "2", label: "第二学期" }
    ]);
    const courseTypeList = common_vendor.ref([
      { value: "实验教学", label: "实验教学" },
      { value: "实验作业", label: "实验作业" },
      { value: "工作实习", label: "工作实习" },
      { value: "毕业设计", label: "毕业设计" }
    ]);
    const weekdayOptions = [
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日"
    ];
    const rules = {
      academicYear: [
        { required: true, message: "请选择学年", trigger: ["change", "blur"] }
      ],
      semester: [
        { required: true, message: "请选择学期", trigger: ["change", "blur"] }
      ],
      courseCode: [
        { required: true, message: "请输入课程代码", trigger: ["change", "blur"] }
      ],
      courseType: [
        { required: true, message: "请选择课程类型", trigger: ["change", "blur"] }
      ],
      courseName: [
        { required: true, message: "请输入课程名称", trigger: ["change", "blur"] }
      ],
      requiredHours: [
        { required: true, message: "请输入大纲要求实验学时", trigger: ["change", "blur"] },
        {
          validator: (rule, value) => {
            return /^\d+$/.test(value) && Number(value) > 0;
          },
          message: "请输入有效的学时数",
          trigger: ["change", "blur"]
        }
      ],
      bookingHours: [
        { required: true, message: "请输入预约实验学时", trigger: ["change", "blur"] },
        {
          validator: (rule, value) => {
            return /^\d+$/.test(value) && Number(value) > 0;
          },
          message: "请输入有效的学时数",
          trigger: ["change", "blur"]
        }
      ],
      className: [
        { required: true, message: "请输入授课班级", trigger: ["change", "blur"] }
      ],
      studentCount: [
        { required: true, message: "请输入选课人数", trigger: ["change", "blur"] },
        {
          validator: (rule, value) => {
            return /^\d+$/.test(value) && Number(value) > 0;
          },
          message: "请输入有效的人数",
          trigger: ["change", "blur"]
        }
      ],
      teacherName: [
        { required: true, message: "请输入教师姓名", trigger: ["change", "blur"] }
      ],
      teacherPhone: [
        { required: true, message: "请输入联系电话", trigger: ["change", "blur"] },
        {
          validator: (rule, value) => {
            return common_vendor.index.$u.test.mobile(value);
          },
          message: "请输入正确的手机号码",
          trigger: ["change", "blur"]
        }
      ],
      teacherEmail: [
        { required: true, message: "请输入邮箱", trigger: ["change", "blur"] },
        {
          validator: (rule, value) => {
            return common_vendor.index.$u.test.email(value);
          },
          message: "请输入正确的邮箱地址",
          trigger: ["change", "blur"]
        }
      ]
    };
    function initData() {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      yearList.value = [];
      for (let i = 0; i < 2; i++) {
        const startYear = currentYear + i;
        const endYear = startYear + 1;
        yearList.value.push({
          value: `${startYear}-${endYear}`,
          label: `${startYear}-${endYear}`
        });
      }
    }
    function onYearConfirm(value) {
      formData.academicYear = value[0].label;
      showYearPicker.value = false;
    }
    function onSemesterConfirm(value) {
      formData.semester = value[0].label;
      showSemesterPicker.value = false;
    }
    function onCourseTypeConfirm(value) {
      formData.courseType = value[0].value;
      showCourseTypePicker.value = false;
    }
    function addTimeSlot() {
      timeSlots.value.push({
        weekday: "",
        weekStart: "",
        weekEnd: "",
        periodStart: "",
        periodEnd: ""
      });
    }
    function removeTimeSlot(index) {
      timeSlots.value.splice(index, 1);
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function importTeacherInfo() {
      if (!userInfo.value.teacherName && !userInfo.value.teacherPhone && !userInfo.value.teacherEmail) {
        common_vendor.index.showModal({
          title: "提示",
          content: "您还没有填写个人信息，是否前往填写？",
          confirmColor: "#0096C2",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.switchTab({ url: "/pages/me/me" });
            }
          }
        });
        return;
      }
      formData.teacherName = userInfo.value.teacherName || "";
      formData.teacherPhone = userInfo.value.teacherPhone || "";
      formData.teacherEmail = userInfo.value.teacherEmail || "";
      common_vendor.index.showToast({ title: "导入成功", icon: "success" });
    }
    function goToSignature() {
      common_vendor.index.navigateTo({
        url: "/pages-sub/apply/signature"
      });
    }
    function submitForm() {
      var _a;
      if (timeSlots.value.length === 0) {
        common_vendor.index.showToast({
          title: "请至少添加一个实验时间段",
          icon: "none"
        });
        return;
      }
      const hasIncompleteSlot = timeSlots.value.some(
        (slot) => !slot.weekday || !slot.weekStart || !slot.weekEnd || !slot.periodStart || !slot.periodEnd
      );
      if (hasIncompleteSlot) {
        common_vendor.index.showToast({
          title: "请完善实验时间信息",
          icon: "none"
        });
        return;
      }
      (_a = formRef.value) == null ? void 0 : _a.validate((valid) => {
        if (valid) {
          const submitData = __spreadProps(__spreadValues({}, formData), {
            timeSlots: timeSlots.value
          });
          common_vendor.index.showModal({
            title: "提示",
            content: "确认提交排课申请吗？",
            success: (res) => {
              if (res.confirm) {
                console.log("提交数据：", submitData);
                common_vendor.index.showToast({
                  title: "提交成功",
                  icon: "success"
                });
                setTimeout(() => {
                  common_vendor.index.navigateBack();
                }, 1500);
              }
            }
          });
        } else {
          common_vendor.index.showToast({
            title: "请完善表单信息",
            icon: "none"
          });
        }
      });
    }
    common_vendor.onMounted(() => {
      var _a;
      initData();
      (_a = formRef.value) == null ? void 0 : _a.setRules(rules);
      addTimeSlot();
      common_vendor.index.$on("signatureConfirm", (signature) => {
        formData.teacherSignature = signature;
        console.log("收到签名:", signature);
      });
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("signatureConfirm");
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.p({
          name: "arrow-left",
          size: "20",
          color: "#333333"
        }),
        b: common_vendor.o(goBack),
        c: common_vendor.t(formData.academicYear ? `${formData.academicYear}学年` : "请选择学年"),
        d: common_vendor.n(formData.academicYear ? "value" : "placeholder"),
        e: common_vendor.p({
          name: "arrow-down",
          size: "16",
          color: "#999999"
        }),
        f: common_vendor.o(($event) => showYearPicker.value = true),
        g: common_vendor.p({
          label: "学年",
          prop: "academicYear",
          required: true,
          ["border-bottom"]: true
        }),
        h: common_vendor.t(formData.semester || "请选择学期"),
        i: common_vendor.n(formData.semester ? "value" : "placeholder"),
        j: common_vendor.p({
          name: "arrow-down",
          size: "16",
          color: "#999999"
        }),
        k: common_vendor.o(($event) => showSemesterPicker.value = true),
        l: common_vendor.p({
          label: "学期",
          prop: "semester",
          required: true,
          ["border-bottom"]: true
        }),
        m: formData.courseCode,
        n: common_vendor.o(($event) => formData.courseCode = $event.detail.value),
        o: common_vendor.p({
          label: "课程代码",
          prop: "courseCode",
          required: true,
          ["border-bottom"]: true
        }),
        p: common_vendor.t(formData.courseType || "请选择课程类型"),
        q: common_vendor.n(formData.courseType ? "value" : "placeholder"),
        r: common_vendor.p({
          name: "arrow-down",
          size: "16",
          color: "#999999"
        }),
        s: common_vendor.o(($event) => showCourseTypePicker.value = true),
        t: common_vendor.p({
          label: "课程类型",
          prop: "courseType",
          required: true,
          ["border-bottom"]: true
        }),
        v: formData.courseName,
        w: common_vendor.o(($event) => formData.courseName = $event.detail.value),
        x: common_vendor.p({
          label: "课程名称",
          prop: "courseName",
          required: true,
          ["border-bottom"]: true
        }),
        y: formData.requiredHours,
        z: common_vendor.o(($event) => formData.requiredHours = $event.detail.value),
        A: common_vendor.p({
          label: "大纲学时",
          prop: "requiredHours",
          required: true,
          ["border-bottom"]: true
        }),
        B: formData.bookingHours,
        C: common_vendor.o(($event) => formData.bookingHours = $event.detail.value),
        D: common_vendor.p({
          label: "预约学时",
          prop: "bookingHours",
          required: true,
          ["border-bottom"]: true
        }),
        E: formData.className,
        F: common_vendor.o(($event) => formData.className = $event.detail.value),
        G: common_vendor.p({
          label: "授课班级",
          prop: "className",
          required: true,
          ["border-bottom"]: true
        }),
        H: formData.studentCount,
        I: common_vendor.o(($event) => formData.studentCount = $event.detail.value),
        J: common_vendor.p({
          label: "选课人数",
          prop: "studentCount",
          required: true,
          ["border-bottom"]: true
        }),
        K: formData.softwareRequirements,
        L: common_vendor.o(($event) => formData.softwareRequirements = $event.detail.value),
        M: common_vendor.p({
          label: "软件环境要求",
          prop: "softwareRequirements",
          ["label-position"]: "top"
        }),
        N: formData.otherRequirements,
        O: common_vendor.o(($event) => formData.otherRequirements = $event.detail.value),
        P: common_vendor.p({
          label: "其他要求",
          prop: "otherRequirements",
          ["label-position"]: "top"
        }),
        Q: common_vendor.f(timeSlots.value, (slot, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1)
          }, timeSlots.value.length > 1 ? {
            b: common_vendor.o(($event) => removeTimeSlot(index), index),
            c: "3c9735fe-18-" + i0 + ",3c9735fe-3",
            d: common_vendor.p({
              name: "close-circle-fill",
              size: "20",
              color: "#ff0000"
            })
          } : {}, {
            e: slot.weekStart,
            f: common_vendor.o(($event) => slot.weekStart = $event.detail.value, index),
            g: slot.weekEnd,
            h: common_vendor.o(($event) => slot.weekEnd = $event.detail.value, index),
            i: common_vendor.t(slot.weekday || "选择"),
            j: common_vendor.n(slot.weekday ? "value" : "placeholder"),
            k: "3c9735fe-19-" + i0 + ",3c9735fe-3",
            l: slot.weekday,
            m: common_vendor.o((e) => slot.weekday = weekdayOptions[e.detail.value], index),
            n: slot.periodStart,
            o: common_vendor.o(($event) => slot.periodStart = $event.detail.value, index),
            p: slot.periodEnd,
            q: common_vendor.o(($event) => slot.periodEnd = $event.detail.value, index),
            r: slot.weekday && slot.weekStart && slot.weekEnd && slot.periodStart && slot.periodEnd
          }, slot.weekday && slot.weekStart && slot.weekEnd && slot.periodStart && slot.periodEnd ? {
            s: "3c9735fe-20-" + i0 + ",3c9735fe-3",
            t: common_vendor.p({
              name: "clock",
              size: "14",
              color: "#0096C2"
            }),
            v: common_vendor.t(slot.weekday),
            w: common_vendor.t(slot.weekStart),
            x: common_vendor.t(slot.weekEnd),
            y: common_vendor.t(slot.periodStart),
            z: common_vendor.t(slot.periodEnd)
          } : {}, {
            A: index
          });
        }),
        R: timeSlots.value.length > 1,
        S: common_vendor.p({
          name: "arrow-down",
          size: "12",
          color: "#999999"
        }),
        T: weekdayOptions,
        U: common_vendor.o(addTimeSlot),
        V: common_vendor.p({
          type: "primary",
          plain: true,
          icon: "plus",
          ["custom-style"]: {
            width: "100%",
            marginTop: "20rpx"
          }
        }),
        W: common_vendor.p({
          name: "download",
          size: "14",
          color: "#ffffff"
        }),
        X: common_vendor.o(importTeacherInfo),
        Y: common_vendor.p({
          type: "primary",
          size: "mini",
          ["custom-style"]: {
            backgroundColor: "#0096C2",
            borderColor: "#0096C2",
            marginLeft: "auto"
          }
        }),
        Z: formData.teacherName,
        aa: common_vendor.o(($event) => formData.teacherName = $event.detail.value),
        ab: common_vendor.p({
          label: "教师姓名",
          prop: "teacherName",
          required: true,
          ["border-bottom"]: true
        }),
        ac: formData.teacherPhone,
        ad: common_vendor.o(($event) => formData.teacherPhone = $event.detail.value),
        ae: common_vendor.p({
          label: "联系电话",
          prop: "teacherPhone",
          required: true,
          ["border-bottom"]: true
        }),
        af: formData.teacherEmail,
        ag: common_vendor.o(($event) => formData.teacherEmail = $event.detail.value),
        ah: common_vendor.p({
          label: "邮箱",
          prop: "teacherEmail",
          required: true,
          ["border-bottom"]: true
        }),
        ai: !formData.teacherSignature
      }, !formData.teacherSignature ? {
        aj: common_vendor.p({
          name: "edit-pen",
          size: "40",
          color: "#cccccc"
        })
      } : {
        ak: formData.teacherSignature
      }, {
        al: common_vendor.o(goToSignature),
        am: common_vendor.p({
          label: "电子签名",
          prop: "teacherSignature",
          ["label-position"]: "top"
        }),
        an: common_vendor.o(submitForm),
        ao: common_vendor.p({
          type: "primary",
          ["custom-style"]: {
            width: "100%"
          }
        }),
        ap: common_vendor.sr(formRef, "3c9735fe-3,3c9735fe-1", {
          "k": "formRef"
        }),
        aq: common_vendor.p({
          model: formData,
          ["label-width"]: "140"
        }),
        ar: common_vendor.o(onYearConfirm),
        as: common_vendor.o(($event) => showYearPicker.value = $event),
        at: common_vendor.p({
          list: yearList.value,
          mode: "single-column",
          modelValue: showYearPicker.value
        }),
        av: common_vendor.o(onSemesterConfirm),
        aw: common_vendor.o(($event) => showSemesterPicker.value = $event),
        ax: common_vendor.p({
          list: semesterList.value,
          mode: "single-column",
          modelValue: showSemesterPicker.value
        }),
        ay: common_vendor.o(onCourseTypeConfirm),
        az: common_vendor.o(($event) => showCourseTypePicker.value = $event),
        aA: common_vendor.p({
          list: courseTypeList.value,
          mode: "single-column",
          modelValue: showCourseTypePicker.value
        }),
        aB: `${(_a = common_vendor.unref(utils_systemInfo.safeAreaInsets)) == null ? void 0 : _a.top}px`,
        aC: common_vendor.gei(_ctx, "")
      });
    };
  }
}));
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3c9735fe"]]);
wx.createPage(MiniProgramPage);

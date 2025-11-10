<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'BookingApply',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '排课申请',
  },
})

// 用户信息
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 表单引用
const formRef = ref()

// 表单数据
const formData = reactive({
  // 课程信息
  academicYear: '',
  semester: '',
  courseCode: '',
  courseType: '',
  courseName: '',
  requiredHours: '',
  bookingHours: '',
  className: '',
  studentCount: '',
  softwareRequirements: '',
  otherRequirements: '',
  // 教师信息
  teacherName: '',
  teacherPhone: '',
  teacherEmail: '',
  teacherSignature: '',
})

// 实验时间段列表
const timeSlots = ref<Array<{
  weekday: string
  weekStart: string
  weekEnd: string
  periodStart: string
  periodEnd: string
}>>([])

// 显示选择器
const showYearPicker = ref(false)
const showSemesterPicker = ref(false)
const showCourseTypePicker = ref(false)

// 学年列表
const yearList = ref<Array<{ value: string, label: string }>>([])
const semesterList = ref([
  { value: '1', label: '第一学期' },
  { value: '2', label: '第二学期' },
])
const courseTypeList = ref([
  { value: '实验教学', label: '实验教学' },
  { value: '实验作业', label: '实验作业' },
  { value: '工作实习', label: '工作实习' },
  { value: '毕业设计', label: '毕业设计' },
])

// 星期列表
const weekdayOptions = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日',
]

// 表单验证规则
const rules = {
  academicYear: [
    { required: true, message: '请选择学年', trigger: ['change', 'blur'] },
  ],
  semester: [
    { required: true, message: '请选择学期', trigger: ['change', 'blur'] },
  ],
  courseCode: [
    { required: true, message: '请输入课程代码', trigger: ['change', 'blur'] },
  ],
  courseType: [
    { required: true, message: '请选择课程类型', trigger: ['change', 'blur'] },
  ],
  courseName: [
    { required: true, message: '请输入课程名称', trigger: ['change', 'blur'] },
  ],
  requiredHours: [
    { required: true, message: '请输入大纲要求实验学时', trigger: ['change', 'blur'] },
    {
      validator: (rule: any, value: string) => {
        return /^\d+$/.test(value) && Number(value) > 0
      },
      message: '请输入有效的学时数',
      trigger: ['change', 'blur'],
    },
  ],
  bookingHours: [
    { required: true, message: '请输入预约实验学时', trigger: ['change', 'blur'] },
    {
      validator: (rule: any, value: string) => {
        return /^\d+$/.test(value) && Number(value) > 0
      },
      message: '请输入有效的学时数',
      trigger: ['change', 'blur'],
    },
  ],
  className: [
    { required: true, message: '请输入授课班级', trigger: ['change', 'blur'] },
  ],
  studentCount: [
    { required: true, message: '请输入选课人数', trigger: ['change', 'blur'] },
    {
      validator: (rule: any, value: string) => {
        return /^\d+$/.test(value) && Number(value) > 0
      },
      message: '请输入有效的人数',
      trigger: ['change', 'blur'],
    },
  ],
  teacherName: [
    { required: true, message: '请输入教师姓名', trigger: ['change', 'blur'] },
  ],
  teacherPhone: [
    { required: true, message: '请输入联系电话', trigger: ['change', 'blur'] },
    {
      validator: (rule: any, value: string) => {
        return uni.$u.test.mobile(value)
      },
      message: '请输入正确的手机号码',
      trigger: ['change', 'blur'],
    },
  ],
  teacherEmail: [
    { required: true, message: '请输入邮箱', trigger: ['change', 'blur'] },
    {
      validator: (rule: any, value: string) => {
        return uni.$u.test.email(value)
      },
      message: '请输入正确的邮箱地址',
      trigger: ['change', 'blur'],
    },
  ],
}

// 初始化数据
function initData() {
  // 生成学年列表（当前年份往后2年）
  const currentYear = new Date().getFullYear()
  yearList.value = []
  for (let i = 0; i < 2; i++) {
    const startYear = currentYear + i
    const endYear = startYear + 1
    yearList.value.push({
      value: `${startYear}-${endYear}`,
      label: `${startYear}-${endYear}`,
    })
  }
}

// 学年选择确认
function onYearConfirm(value: any) {
  formData.academicYear = value[0].label
  showYearPicker.value = false
}

// 学期选择确认
function onSemesterConfirm(value: any) {
  formData.semester = value[0].label
  showSemesterPicker.value = false
}

// 课程类型选择确认
function onCourseTypeConfirm(value: any) {
  formData.courseType = value[0].value
  showCourseTypePicker.value = false
}

// 添加实验时间段
function addTimeSlot() {
  timeSlots.value.push({
    weekday: '',
    weekStart: '',
    weekEnd: '',
    periodStart: '',
    periodEnd: '',
  })
}

// 删除实验时间段
function removeTimeSlot(index: number) {
  timeSlots.value.splice(index, 1)
}

// 格式化实验时间
function formatExperimentTime(): string {
  return timeSlots.value
    .filter(
      slot =>
        slot.weekday && slot.weekStart && slot.weekEnd && slot.periodStart && slot.periodEnd,
    )
    .map(
      slot =>
        `${slot.weekday} ${slot.weekStart}-${slot.weekEnd}周（${slot.periodStart}-${slot.periodEnd}节）`,
    )
    .join('；')
}

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 导入个人信息
function importTeacherInfo() {
  if (!userInfo.value.teacherName && !userInfo.value.teacherPhone && !userInfo.value.teacherEmail) {
    uni.showModal({
      title: '提示',
      content: '您还没有填写个人信息，是否前往填写？',
      confirmColor: '#0096C2',
      success: (res) => {
        if (res.confirm) {
          uni.switchTab({ url: '/pages/me/me' })
        }
      },
    })
    return
  }

  formData.teacherName = userInfo.value.teacherName || ''
  formData.teacherPhone = userInfo.value.teacherPhone || ''
  formData.teacherEmail = userInfo.value.teacherEmail || ''

  uni.showToast({ title: '导入成功', icon: 'success' })
}

// 跳转到签名页面
function goToSignature() {
  uni.navigateTo({
    url: '/pages-sub/apply/signature',
  })
}

// 提交表单
async function submitForm() {
  // 检查实验时间
  if (timeSlots.value.length === 0) {
    uni.showToast({
      title: '请至少添加一个实验时间段',
      icon: 'none',
    })
    return
  }

  // 验证所有时间段是否填写完整
  const hasIncompleteSlot = timeSlots.value.some(
    slot => !slot.weekday || !slot.weekStart || !slot.weekEnd || !slot.periodStart || !slot.periodEnd,
  )

  if (hasIncompleteSlot) {
    uni.showToast({
      title: '请完善实验时间信息',
      icon: 'none',
    })
    return
  }

  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      uni.showModal({
        title: '提示',
        content: '确认提交排课申请吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({ title: '提交中...' })
              
              // 获取用户信息
              const userStore = useUserStore()
              const userId = userStore.userId
              
              if (!userId || userId <= 0) {
                throw new Error('请先登录')
              }
              
              // 转换时间段格式
              const formattedTimeSlots = timeSlots.value.map(slot => ({
                weekday: weekdayOptions.indexOf(slot.weekday) + 1, // 转为数字 1-7
                weekStart: Number(slot.weekStart),
                weekEnd: Number(slot.weekEnd),
                periodStart: Number(slot.periodStart),
                periodEnd: Number(slot.periodEnd)
              }))
              
              // 调用云函数提交申请
              const result = await wx.cloud.callFunction({
                name: 'createBooking',
                data: {
                  userId: userId,
                  academicYear: formData.academicYear,
                  semester: formData.semester,
                  courseCode: formData.courseCode,
                  courseType: formData.courseType,
                  courseName: formData.courseName,
                  requiredHours: Number(formData.requiredHours),
                  bookingHours: Number(formData.bookingHours),
                  className: formData.className,
                  studentCount: Number(formData.studentCount),
                  timeSlots: formattedTimeSlots,
                  softwareRequirements: formData.softwareRequirements,
                  otherRequirements: formData.otherRequirements,
                  teacherName: formData.teacherName,
                  teacherPhone: formData.teacherPhone,
                  teacherEmail: formData.teacherEmail,
                  teacherSignature: formData.teacherSignature
                }
              }) as any
              
              uni.hideLoading()
              
              if (result.result && result.result.success) {
                console.log('提交成功:', result.result)
                uni.showModal({
                  title: '提交成功',
                  content: `申请编号：${result.result.data.bookingNo}\n\n请等待管理员审核`,
                  showCancel: false,
                  success: () => {
                    setTimeout(() => {
                      uni.navigateBack()
                    }, 500)
                  }
                })
              } else {
                throw new Error(result.result?.message || '提交失败')
              }
              
            } catch (error: any) {
              uni.hideLoading()
              console.error('提交失败:', error)
              uni.showModal({
                title: '提交失败',
                content: error.message || '未知错误',
                showCancel: false
              })
            }
          }
        },
      })
    }
    else {
      uni.showToast({
        title: '请完善表单信息',
        icon: 'none',
      })
    }
  })
}

onMounted(() => {
  initData()
  formRef.value?.setRules(rules)
  // 默认添加一个时间段
  addTimeSlot()

  // 监听签名确认事件
  uni.$on('signatureConfirm', (signature: string) => {
    formData.teacherSignature = signature
    console.log('收到签名:', signature)
  })
})

onUnmounted(() => {
  // 移除事件监听
  uni.$off('signatureConfirm')
})
</script>

<template>
  <view class="page-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <view class="navbar-left" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#333333" />
          <text class="back-text">返回</text>
        </view>
        <view class="navbar-title">
          排课申请
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <!-- 表单内容 -->
    <scroll-view scroll-y class="scroll-container">
      <u-form ref="formRef" :model="formData" label-width="140" class="form-container">
        <!-- 课程信息 -->
        <view class="form-section">
          <view class="section-title">
            <view class="title-line" />
            <text class="title-text">课程信息</text>
          </view>

          <u-form-item label="学年" prop="academicYear" required border-bottom>
            <view class="select-input" @click="showYearPicker = true">
              <text :class="formData.academicYear ? 'value' : 'placeholder'">
                {{ formData.academicYear ? `${formData.academicYear}学年` : '请选择学年' }}
              </text>
              <u-icon name="arrow-down" size="16" color="#999999" />
            </view>
          </u-form-item>

          <u-form-item label="学期" prop="semester" required border-bottom>
            <view class="select-input" @click="showSemesterPicker = true">
              <text :class="formData.semester ? 'value' : 'placeholder'">
                {{ formData.semester || '请选择学期' }}
              </text>
              <u-icon name="arrow-down" size="16" color="#999999" />
            </view>
          </u-form-item>

          <u-form-item label="课程代码" prop="courseCode" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.courseCode"
                class="custom-input"
                placeholder="请输入课程代码"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="课程类型" prop="courseType" required border-bottom>
            <view class="select-input" @click="showCourseTypePicker = true">
              <text :class="formData.courseType ? 'value' : 'placeholder'">
                {{ formData.courseType || '请选择课程类型' }}
              </text>
              <u-icon name="arrow-down" size="16" color="#999999" />
            </view>
          </u-form-item>

          <u-form-item label="课程名称" prop="courseName" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.courseName"
                class="custom-input"
                placeholder="请输入课程名称"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="大纲学时" prop="requiredHours" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.requiredHours"
                type="number"
                class="custom-input"
                placeholder="请输入学时数"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="预约学时" prop="bookingHours" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.bookingHours"
                type="number"
                class="custom-input"
                placeholder="请输入学时数"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="授课班级" prop="className" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.className"
                class="custom-input"
                placeholder="请输入授课班级"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="选课人数" prop="studentCount" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.studentCount"
                type="number"
                class="custom-input"
                placeholder="请输入选课人数"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="软件环境要求" prop="softwareRequirements" label-position="top">
            <view class="textarea-wrapper">
              <textarea
                v-model="formData.softwareRequirements"
                class="custom-textarea"
                placeholder="请输入软件环境要求，如：Adobe Photoshop 2020"
                placeholder-class="input-placeholder"
                :auto-height="true"
              />
            </view>
          </u-form-item>

          <u-form-item label="其他要求" prop="otherRequirements" label-position="top">
            <view class="textarea-wrapper">
              <textarea
                v-model="formData.otherRequirements"
                class="custom-textarea"
                placeholder="请输入其他要求或备注"
                placeholder-class="input-placeholder"
                :auto-height="true"
              />
            </view>
          </u-form-item>
        </view>

        <!-- 实验时间 -->
        <view class="form-section">
          <view class="section-title">
            <view class="title-line" />
            <text class="title-text">实验时间</text>
            <view class="section-tips">
              （可添加多个时间段）
            </view>
          </view>

          <view v-for="(slot, index) in timeSlots" :key="index" class="time-slot-item">
            <view class="time-slot-header">
              <text class="time-slot-label">时间段 {{ index + 1 }}</text>
              <u-icon
                v-if="timeSlots.length > 1"
                class="delete-icon"
                name="close-circle-fill"
                size="20"
                color="#ff0000"
                @click="removeTimeSlot(index)"
              />
            </view>

            <view class="time-slot-row">
              <view class="time-input-group">
                <text class="input-label">起始周</text>
                <input v-model="slot.weekStart" type="number" class="time-input" placeholder="1">
              </view>

              <text class="separator">至</text>

              <view class="time-input-group">
                <text class="input-label">结束周</text>
                <input v-model="slot.weekEnd" type="number" class="time-input" placeholder="16">
              </view>
            </view>

            <view class="time-slot-row">
              <view class="time-input-group">
                <text class="input-label">星期</text>
                <picker :value="slot.weekday" :range="weekdayOptions" @change="e => slot.weekday = weekdayOptions[e.detail.value]">
                  <view class="time-picker">
                    <text :class="slot.weekday ? 'value' : 'placeholder'">
                      {{ slot.weekday || '选择' }}
                    </text>
                    <u-icon name="arrow-down" size="12" color="#999999" />
                  </view>
                </picker>
              </view>

              <view class="time-input-group">
                <text class="input-label">起始节</text>
                <input v-model="slot.periodStart" type="number" class="time-input" placeholder="1">
              </view>

              <text class="separator">至</text>

              <view class="time-input-group">
                <text class="input-label">结束节</text>
                <input v-model="slot.periodEnd" type="number" class="time-input" placeholder="2">
              </view>
            </view>

            <view v-if="slot.weekday && slot.weekStart && slot.weekEnd && slot.periodStart && slot.periodEnd" class="time-preview">
              <u-icon name="clock" size="14" color="#0096C2" />
              <text class="preview-text">
                {{ slot.weekday }} {{ slot.weekStart }}-{{ slot.weekEnd }}周（{{ slot.periodStart }}-{{ slot.periodEnd }}节）
              </text>
            </view>
          </view>

          <u-button
            type="primary"
            plain
            icon="plus"
            :custom-style="{ width: '100%', marginTop: '20rpx' }"
            @click="addTimeSlot"
          >
            添加时间段
          </u-button>
        </view>

        <!-- 教师信息 -->
        <view class="form-section">
          <view class="section-title">
            <view class="title-line" />
            <text class="title-text">教师信息</text>
            <u-button
              type="primary"
              size="mini"
              :custom-style="{
                backgroundColor: '#0096C2',
                borderColor: '#0096C2',
                marginLeft: 'auto',
              }"
              @click="importTeacherInfo"
            >
              <u-icon name="download" size="14" color="#ffffff" style="margin-right: 6rpx;" />
              导入信息
            </u-button>
          </view>

          <u-form-item label="教师姓名" prop="teacherName" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.teacherName"
                class="custom-input"
                placeholder="请输入教师姓名"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="联系电话" prop="teacherPhone" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.teacherPhone"
                type="number"
                class="custom-input"
                placeholder="请输入联系电话"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="邮箱" prop="teacherEmail" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.teacherEmail"
                class="custom-input"
                placeholder="请输入邮箱地址"
                placeholder-class="input-placeholder"
              >
            </view>
          </u-form-item>

          <u-form-item label="电子签名" prop="teacherSignature" label-position="top">
            <view class="signature-box" @click="goToSignature">
              <view v-if="!formData.teacherSignature" class="signature-placeholder">
                <u-icon name="edit-pen" size="40" color="#cccccc" />
                <text class="placeholder-text">点击此处添加电子签名</text>
              </view>
              <image v-else :src="formData.teacherSignature" class="signature-image" mode="aspectFit" />
            </view>
          </u-form-item>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-section">
          <u-button type="primary" :custom-style="{ width: '100%' }" @click="submitForm">
            提交申请
          </u-button>
        </view>
      </u-form>
    </scroll-view>

    <!-- 学年选择器 -->
    <u-select
      v-model="showYearPicker"
      :list="yearList"
      mode="single-column"
      @confirm="onYearConfirm"
    />

    <!-- 学期选择器 -->
    <u-select
      v-model="showSemesterPicker"
      :list="semesterList"
      mode="single-column"
      @confirm="onSemesterConfirm"
    />

    <!-- 课程类型选择器 -->
    <u-select
      v-model="showCourseTypePicker"
      :list="courseTypeList"
      mode="single-column"
      @confirm="onCourseTypeConfirm"
    />
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

// 自定义导航栏
.custom-navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid #e6e6e6;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.navbar-left {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.back-text {
  margin-left: 8rpx;
  font-size: 28rpx;
  color: #333333;
}

.navbar-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.navbar-right {
  width: 100rpx;
}

// 滚动容器
.scroll-container {
  flex: 1;
  padding-bottom: 40rpx;
}

// 表单容器
.form-container {
  padding: 0 30rpx;
}

// 表单分区
.form-section {
  margin-top: 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

// 分区标题
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-line {
  width: 6rpx;
  height: 32rpx;
  background-color: #0096c2;
  border-radius: 3rpx;
  margin-right: 16rpx;
}

.title-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.section-tips {
  margin-left: 12rpx;
  font-size: 24rpx;
  color: #999999;
}

// 输入框包装器
.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.custom-input {
  flex: 1;
  height: 60rpx;
  font-size: 28rpx;
  color: #333333;
  text-align: right;
}

.input-placeholder {
  color: #c0c4cc;
  font-size: 28rpx;
}

// textarea包装器
.textarea-wrapper {
  width: 100%;
  margin-top: 20rpx;
}

.custom-textarea {
  width: 100%;
  min-height: 120rpx;
  padding: 20rpx;
  font-size: 28rpx;
  color: #333333;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  box-sizing: border-box;
}

// 自定义选择器输入框
.select-input {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.select-input .placeholder {
  color: #c0c4cc;
  font-size: 28rpx;
}

.select-input .value {
  color: #333333;
  font-size: 28rpx;
  margin-right: 8rpx;
}

// 实验时间段
.time-slot-item {
  padding: 30rpx 20rpx;
  background-color: #f8fbff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  border: 1rpx solid #e6f4f9;
}

.time-slot-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24rpx;
  position: relative;
}

.time-slot-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #0096c2;
}

.delete-icon {
  position: absolute;
  right: 0;
  top: 0;
}

.time-slot-row {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  gap: 16rpx;
}

.time-input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.input-label {
  font-size: 22rpx;
  color: #666666;
  margin-bottom: 10rpx;
  white-space: nowrap;
}

.time-input {
  width: 110rpx;
  height: 56rpx;
  padding: 0 10rpx;
  background-color: #ffffff;
  border: 1rpx solid #e6e6e6;
  border-radius: 6rpx;
  font-size: 26rpx;
  text-align: center;
  line-height: 56rpx;
  box-sizing: border-box;
}

.time-picker {
  width: 140rpx;
  height: 56rpx;
  padding: 0 12rpx;
  background-color: #ffffff;
  border: 1rpx solid #e6e6e6;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-picker .placeholder {
  color: #c0c4cc;
  font-size: 24rpx;
}

.time-picker .value {
  color: #333333;
  font-size: 24rpx;
}

.separator {
  font-size: 28rpx;
  color: #666666;
  height: 56rpx;
  line-height: 56rpx;
  display: flex;
  align-items: center;
}

.time-preview {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  border: 1rpx solid #0096c2;
  margin-top: 10rpx;
}

.preview-text {
  margin-left: 12rpx;
  font-size: 26rpx;
  color: #0096c2;
}

// 签名框
.signature-box {
  width: 100%;
  height: 300rpx;
  border: 2rpx dashed #e6e6e6;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  margin-top: 20rpx;
}

.signature-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.placeholder-text {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999999;
}

.signature-image {
  width: 100%;
  height: 100%;
}

// 提交按钮区域
.submit-section {
  margin-top: 40rpx;
  padding: 0 0rpx 40rpx;
}
</style>

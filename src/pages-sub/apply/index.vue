<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import { safeAreaInsets } from '@/utils/systemInfo'
import { getSysConfig } from '@/utils/db'

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

// 历史排课搜索
const historySchedules = ref<Array<any>>([])
const showHistoryList = ref(false)
const searchLoading = ref(false)
const currentTeacherName = ref('')
let searchTimer: any = null  // 防抖定时器
const searchDelay = ref(500)  // 搜索延迟时间

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
async function initData() {
  // 加载系统配置
  await loadSystemConfig()
  
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

// 加载系统配置
async function loadSystemConfig() {
  try {
    uni.showLoading({ title: '加载配置中...' })
    
    // 获取所有系统配置
    const res = await getSysConfig()
    
    if (res.success && res.data) {
      // 查找当前学年和学期配置
      const configs = Array.isArray(res.data) ? res.data : [res.data]
      
      const academicYearConfig = configs.find((c: any) => c.config_key === 'current_academic_year')
      const semesterConfig = configs.find((c: any) => c.config_key === 'current_semester')
      
      // 自动填充学年和学期
      if (academicYearConfig) {
        formData.academicYear = academicYearConfig.config_value
      }
      
      if (semesterConfig) {
        formData.semester = semesterConfig.config_value
      }
      
      console.log('[loadSystemConfig] 系统配置加载成功:', {
        academicYear: formData.academicYear,
        semester: formData.semester
      })
    }
  }
  catch (error: any) {
    console.error('[loadSystemConfig] 加载系统配置失败:', error)
    uni.showToast({
      title: '加载配置失败',
      icon: 'none'
    })
  }
  finally {
    uni.hideLoading()
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

// 获取当前教师姓名
async function loadTeacherName() {
  try {
    const userStore = useUserStore()
    const userId = userStore.userId
    
    console.log('[loadTeacherName] 开始获取教师姓名, userId:', userId)
    
    if (!userId || userId <= 0) {
      console.warn('[loadTeacherName] 用户未登录，无法获取教师姓名')
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    
    const result = await wx.cloud.callFunction({
      name: 'getUserInfo',
      data: { userId }
    }) as any
    
    console.log('[loadTeacherName] 云函数返回结果:', result)
    
    if (result.result && result.result.success && result.result.data) {
      currentTeacherName.value = result.result.data.name || ''
      console.log('[loadTeacherName] 教师姓名获取成功:', currentTeacherName.value)
      
      if (!currentTeacherName.value) {
        console.warn('[loadTeacherName] 教师姓名为空，请在个人中心完善信息')
        uni.showToast({
          title: '请先完善个人信息',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      console.error('[loadTeacherName] 云函数返回失败:', result.result?.message)
      uni.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  } catch (error: any) {
    console.error('[loadTeacherName] 获取教师姓名异常:', error)
    uni.showToast({
      title: '获取用户信息异常',
      icon: 'none'
    })
  }
}

// 搜索历史排课记录（带防抖）
function searchHistorySchedule() {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  
  // 检查最小输入长度
  const codeLength = formData.courseCode?.trim().length || 0
  const nameLength = formData.courseName?.trim().length || 0
  
  // 课程代码至少4位，课程名称至少2位
  if (codeLength < 4 && nameLength < 2) {
    historySchedules.value = []
    showHistoryList.value = false
    return
  }
  
  // 设置新的定时器，延迟执行搜索
  searchTimer = setTimeout(() => {
    performSearch()
  }, 500)  // 500ms 防抖延迟
}

// 执行实际搜索
async function performSearch() {
  if (!currentTeacherName.value) {
    console.warn('[performSearch] 教师姓名未获取，无法搜索历史排课')
    historySchedules.value = []
    showHistoryList.value = false
    return
  }
  
  if (!formData.academicYear || !formData.semester) {
    console.warn('[performSearch] 学年或学期未设置')
    return
  }
  
  try {
    searchLoading.value = true
    showHistoryList.value = true  // 显示加载状态
    
    console.log('[performSearch] 开始搜索历史排课:', {
      teacherName: currentTeacherName.value,
      courseCode: formData.courseCode,
      courseName: formData.courseName,
      academicYear: formData.academicYear,
      semester: formData.semester
    })
    
    const result = await wx.cloud.callFunction({
      name: 'searchHistorySchedule',
      data: {
        teacherName: currentTeacherName.value,
        courseCode: formData.courseCode?.trim() || '',
        courseName: formData.courseName?.trim() || '',
        academicYear: formData.academicYear,
        semester: formData.semester
      }
    }) as any
    
    console.log('[performSearch] 搜索结果:', result)
    
    if (result.result && result.result.success) {
      historySchedules.value = result.result.data || []
      showHistoryList.value = historySchedules.value.length > 0
      console.log('[performSearch] 找到', historySchedules.value.length, '条历史记录')
    } else {
      console.warn('[performSearch] 搜索失败:', result.result?.message)
      historySchedules.value = []
      showHistoryList.value = false
    }
  } catch (error: any) {
    console.error('[performSearch] 搜索异常:', error)
    historySchedules.value = []
    showHistoryList.value = false
  } finally {
    searchLoading.value = false
  }
}

// 输入框聚焦时，如果有历史记录则显示
function onCourseInputFocus() {
  const codeLength = formData.courseCode?.trim().length || 0
  const nameLength = formData.courseName?.trim().length || 0
  
  // 如果已有足够长度的输入且有历史记录，则显示列表
  if ((codeLength >= 4 || nameLength >= 2) && historySchedules.value.length > 0) {
    showHistoryList.value = true
  }
}

// 选择历史排课记录
function selectHistorySchedule(item: any) {
  formData.courseCode = item.courseCode || ''
  formData.courseName = item.courseName || ''
  formData.courseType = item.courseType || ''
  
  // 关闭列表
  showHistoryList.value = false
  
  uni.showToast({
    title: '已填充课程信息',
    icon: 'success'
  })
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

onMounted(async () => {
  // 初始化数据（生成学年列表 + 加载系统配置）
  await initData()
  
  // 添加至少一个时间段
  if (timeSlots.value.length === 0) {
    addTimeSlot()
  }
  
  // 获取当前教师姓名
  await loadTeacherName()
  
  // 监听签名返回
  uni.$on('signatureComplete', (signature: string) => {
    formData.teacherSignature = signature
  })
})

onUnmounted(() => {
  // 移除事件监听
  uni.$off('signatureComplete')
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
            <view class="readonly-field-right">
              <text class="readonly-value-gray">
                {{ formData.academicYear ? `${formData.academicYear}学年` : '加载中...' }}
              </text>
            </view>
          </u-form-item>

          <u-form-item label="学期" prop="semester" required border-bottom>
            <view class="readonly-field-right">
              <text class="readonly-value-gray">
                {{ formData.semester || '加载中...' }}
              </text>
            </view>
          </u-form-item>

          <u-form-item label="课程代码" prop="courseCode" required border-bottom>
            <view class="input-wrapper">
              <input
                v-model="formData.courseCode"
                class="custom-input"
                placeholder="输入4位以上开始匹配"
                placeholder-class="input-placeholder"
                @input="searchHistorySchedule"
                @focus="onCourseInputFocus"
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
                placeholder="输入2位以上开始匹配"
                placeholder-class="input-placeholder"
                @input="searchHistorySchedule"
                @focus="onCourseInputFocus"
              >
            </view>
          </u-form-item>
          
          <!-- 历史排课记录下拉列表 -->
          <view v-if="showHistoryList" class="history-dropdown">
            <view v-if="searchLoading" class="dropdown-loading">
              <view class="loading-spinner"></view>
            </view>
            <view v-else-if="historySchedules.length === 0" class="dropdown-empty">
              <text class="empty-text">未找到匹配记录</text>
            </view>
            <view v-else class="dropdown-items">
              <view
                v-for="(item, index) in historySchedules"
                :key="index"
                class="dropdown-item"
                @click="selectHistorySchedule(item)"
              >
                <view class="item-main">
                  <text class="item-code">{{ item.courseCode }}</text>
                  <text class="item-name">{{ item.courseName }}</text>
                </view>
                <text class="item-type">{{ item.courseType }}</text>
              </view>
            </view>
          </view>

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

// 带搜索按钮的输入框
.input-wrapper-with-search {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
}

.search-btn {
  padding: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

// 历史排课下拉列表（简洁样式）
.history-dropdown {
  margin: 10rpx 0 20rpx 0;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  overflow: hidden;
  max-height: 400rpx;
}

.dropdown-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
}

.loading-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid #e0e0e0;
  border-top-color: #0096c2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dropdown-empty {
  padding: 30rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 24rpx;
  color: #999;
}

.dropdown-items {
  max-height: 400rpx;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background-color: #f5f5f5;
  border-bottom: 1rpx solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:active {
    background-color: #e8e8e8;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.item-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  overflow: hidden;
}

.item-code {
  font-size: 24rpx;
  font-weight: 500;
  color: #0096c2;
  flex-shrink: 0;
}

.item-name {
  font-size: 26rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-type {
  font-size: 22rpx;
  color: #666;
  padding: 4rpx 12rpx;
  background-color: #e0e0e0;
  border-radius: 4rpx;
  flex-shrink: 0;
  margin-left: 12rpx;
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

// 只读字段样式
.readonly-field {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}

.readonly-value {
  color: #333333;
  font-size: 28rpx;
  font-weight: 500;
}

.readonly-tip {
  color: #999999;
  font-size: 22rpx;
  margin-left: 12rpx;
}

// 靠右只读字段样式（学年学期）
.readonly-field-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10rpx 0;
}

.readonly-value-gray {
  color: #999999;
  font-size: 28rpx;
  font-weight: 400;
  text-align: right;
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

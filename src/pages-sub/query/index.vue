<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'BookingQuery',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '申请查询',
  },
})

// 申请状态枚举
enum BookingStatus {
  PENDING = 'pending', // 待审核
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected', // 已拒绝（打回）
  CANCELLED = 'cancelled', // 已取消
}

// 申请记录接口
interface BookingRecord {
  id: string
  courseCode: string
  courseName: string
  courseType: string
  academicYear: string
  semester: string
  teacherName: string
  status: BookingStatus
  statusText: string
  applyTime: string
  auditTime?: string
  rejectReason?: string
  requiredHours: number
  bookingHours: number
  className: string
  studentCount: number
  timeSlots: Array<{
    weekday: string
    weekStart: string
    weekEnd: string
    periodStart: string
    periodEnd: string
  }>
  softwareRequirements?: string
  otherRequirements?: string
  teacherPhone: string
  teacherEmail: string
  teacherSignature?: string
}

// 申请列表数据
const bookingList = ref<BookingRecord[]>([])
const loading = ref(false)

// 星期数字转文本
const weekdayMap = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

// 加载申请列表
async function loadBookings() {
  try {
    loading.value = true
    
    // 获取用户信息
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo || !userInfo.userId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    
    // 调用云函数获取申请列表
    const res = await wx.cloud.callFunction({
      name: 'getMyBookings',
      data: {
        userId: userInfo.userId,
        pageNum: 1,
        pageSize: 100
      }
    }) as any
    
    if (res.result && res.result.success) {
      // 转换数据格式
      bookingList.value = res.result.data.map((item: any) => ({
        id: item.booking_no,
        courseCode: item.course_code,
        courseName: item.course_name,
        courseType: item.course_type,
        academicYear: item.academic_year,
        semester: item.semester,
        teacherName: item.teacher_name,
        status: ['pending', 'approved', 'rejected', 'cancelled'][item.status] || 'pending',
        statusText: ['待审核', '已通过', '已拒绝', '已取消'][item.status] || '待审核',
        applyTime: formatTime(item.create_time),
        auditTime: item.review_time ? formatTime(item.review_time) : undefined,
        rejectReason: item.review_remark,
        requiredHours: item.required_hours,
        bookingHours: item.booking_hours,
        className: item.class_name,
        studentCount: item.student_count,
        timeSlots: (item.time_slots || []).map((slot: any) => ({
          weekday: weekdayMap[slot.weekday] || `星期${slot.weekday}`,
          weekStart: slot.weekStart?.toString() || slot.week_start?.toString(),
          weekEnd: slot.weekEnd?.toString() || slot.week_end?.toString(),
          periodStart: slot.periodStart?.toString() || slot.period_start?.toString(),
          periodEnd: slot.periodEnd?.toString() || slot.period_end?.toString()
        })),
        softwareRequirements: item.software_requirements,
        otherRequirements: item.other_requirements,
        teacherPhone: item.teacher_phone,
        teacherEmail: item.teacher_email,
        teacherSignature: item.teacher_signature
      }))
      
      updateTabCounts()
      console.log('[QUERY] 加载成功，共', bookingList.value.length, '条申请')
    } else {
      throw new Error(res.result?.message || '加载失败')
    }
  } catch (error: any) {
    console.error('[QUERY] 加载失败:', error)
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 格式化时间
function formatTime(time: any) {
  if (!time) return ''
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 当前选中的申请详情
const selectedBooking = ref<BookingRecord | null>(null)
const showDetailModal = ref(false)

// 筛选状态
const activeTab = ref('all')
const tabList = [
  { key: 'all', label: '全部', count: 0 },
  { key: BookingStatus.PENDING, label: '待审核', count: 0 },
  { key: BookingStatus.APPROVED, label: '已通过', count: 0 },
  { key: BookingStatus.REJECTED, label: '已拒绝', count: 0 },
]

// 计算每个状态的数量
function updateTabCounts() {
  tabList[0].count = bookingList.value.length
  tabList[1].count = bookingList.value.filter(item => item.status === BookingStatus.PENDING).length
  tabList[2].count = bookingList.value.filter(item => item.status === BookingStatus.APPROVED).length
  tabList[3].count = bookingList.value.filter(item => item.status === BookingStatus.REJECTED).length
}
updateTabCounts()

// 过滤后的列表
const filteredList = computed(() => {
  if (activeTab.value === 'all') {
    return bookingList.value
  }
  return bookingList.value.filter(item => item.status === activeTab.value)
})

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 获取状态标签类型
function getStatusType(status: BookingStatus) {
  const typeMap = {
    [BookingStatus.PENDING]: 'warning',
    [BookingStatus.APPROVED]: 'success',
    [BookingStatus.REJECTED]: 'error',
    [BookingStatus.CANCELLED]: 'info',
  }
  return typeMap[status] || 'info'
}

// 查看详情
function viewDetail(item: BookingRecord) {
  selectedBooking.value = item
  showDetailModal.value = true
}

// 修改申请（仅限已拒绝状态）
function modifyBooking(item: BookingRecord) {
  uni.showModal({
    title: '提示',
    content: '将跳转到申请页面进行修改',
    success: (res) => {
      if (res.confirm) {
        // 跳转到申请页面，携带数据
        uni.navigateTo({
          url: `/pages-sub/apply/index?mode=edit&id=${item.id}`,
        })
      }
    },
  })
}

// 取消申请
function cancelBooking(item: BookingRecord) {
  uni.showModal({
    title: '取消申请',
    content: '确定要取消该申请吗？取消后无法恢复',
    confirmColor: '#ff0000',
    success: (res) => {
      if (res.confirm) {
        const index = bookingList.value.findIndex(b => b.id === item.id)
        if (index !== -1) {
          bookingList.value[index].status = BookingStatus.CANCELLED
          bookingList.value[index].statusText = '已取消'
          updateTabCounts()
          uni.showToast({
            title: '已取消申请',
            icon: 'success',
          })
        }
      }
    },
  })
}

// 格式化实验时间
function formatTimeSlots(slots: BookingRecord['timeSlots']) {
  return slots
    .map(
      slot =>
        `${slot.weekday} ${slot.weekStart}-${slot.weekEnd}周（${slot.periodStart}-${slot.periodEnd}节）`,
    )
    .join('；')
}

// 关闭详情弹窗
function closeDetail() {
  showDetailModal.value = false
  selectedBooking.value = null
}

// 页面加载时获取数据
onMounted(() => {
  loadBookings()
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
          申请查询
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <!-- Tab切换 -->
    <view class="tab-container">
      <view
        v-for="tab in tabList"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <text class="tab-label">{{ tab.label }}</text>
        <text v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</text>
      </view>
    </view>

    <!-- 申请列表 -->
    <scroll-view scroll-y class="scroll-container">
      <view class="list-container">
        <view v-if="filteredList.length === 0" class="empty-container">
          <u-icon name="file-text" size="80" color="#cccccc" />
          <text class="empty-text">暂无申请记录</text>
        </view>

        <view v-for="item in filteredList" :key="item.id" class="booking-card" @click="viewDetail(item)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="header-left">
              <text class="course-name">{{ item.courseName }}</text>
              <text class="course-code">{{ item.courseCode }}</text>
            </view>
            <view class="header-right">
              <u-tag :text="item.statusText" :type="getStatusType(item.status) as any" plain size="mini" />
            </view>
          </view>

          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="info-row">
              <u-icon name="calendar" size="14" color="#999999" />
              <text class="info-text">{{ item.academicYear }}学年 {{ item.semester }}</text>
            </view>
            <view class="info-row">
              <u-icon name="clock" size="14" color="#999999" />
              <text class="info-text">{{ formatTimeSlots(item.timeSlots) }}</text>
            </view>
            <view class="info-row">
              <u-icon name="account" size="14" color="#999999" />
              <text class="info-text">{{ item.className }} · {{ item.studentCount }}人</text>
            </view>
          </view>

          <!-- 拒绝原因 -->
          <view v-if="item.status === BookingStatus.REJECTED && item.rejectReason" class="reject-reason">
            <u-icon name="info-circle" size="14" color="#ff6b6b" />
            <text class="reason-text">{{ item.rejectReason }}</text>
          </view>

          <!-- 卡片底部 -->
          <view class="card-footer">
            <text class="apply-time">申请时间：{{ item.applyTime }}</text>
            <view class="action-buttons">
              <!-- 查看详情 -->
              <u-button
                type="primary"
                size="mini"
                plain
                :custom-style="{ padding: '0 20rpx' }"
                @click.stop="viewDetail(item)"
              >
                查看
              </u-button>

              <!-- 修改（仅已拒绝状态） -->
              <u-button
                v-if="item.status === BookingStatus.REJECTED"
                type="primary"
                size="mini"
                plain
                :custom-style="{ padding: '0 20rpx', marginLeft: '16rpx' }"
                @click.stop="modifyBooking(item)"
              >
                修改
              </u-button>

              <!-- 取消（仅待审核状态） -->
              <u-button
                v-if="item.status === BookingStatus.PENDING"
                type="error"
                size="mini"
                plain
                :custom-style="{ padding: '0 20rpx', marginLeft: '16rpx' }"
                @click.stop="cancelBooking(item)"
              >
                取消
              </u-button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <u-popup v-model="showDetailModal" mode="bottom" :border-radius="20" :safe-area-inset-bottom="true">
      <view v-if="selectedBooking" class="detail-container">
        <!-- 弹窗标题 -->
        <view class="detail-header">
          <text class="detail-title">申请详情</text>
          <u-icon name="close" size="24" color="#333333" @click="closeDetail" />
        </view>

        <scroll-view scroll-y class="detail-scroll">
          <!-- 状态卡片 -->
          <view class="detail-status">
            <u-tag
              :text="selectedBooking.statusText"
              :type="getStatusType(selectedBooking.status) as any"
            />
            <text class="status-id">申请编号：{{ selectedBooking.id }}</text>
          </view>

          <!-- 拒绝原因 -->
          <view
            v-if="selectedBooking.status === BookingStatus.REJECTED && selectedBooking.rejectReason"
            class="detail-reject"
          >
            <view class="reject-header">
              <u-icon name="info-circle-fill" size="18" color="#ff6b6b" />
              <text class="reject-title">拒绝原因</text>
            </view>
            <text class="reject-content">{{ selectedBooking.rejectReason }}</text>
          </view>

          <!-- 课程信息 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">课程信息</text>
            </view>
            <view class="detail-item">
              <text class="item-label">课程名称</text>
              <text class="item-value">{{ selectedBooking.courseName }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">课程代码</text>
              <text class="item-value">{{ selectedBooking.courseCode }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">课程类型</text>
              <text class="item-value">{{ selectedBooking.courseType }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">学年学期</text>
              <text class="item-value">{{ selectedBooking.academicYear }}学年 {{ selectedBooking.semester }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">授课班级</text>
              <text class="item-value">{{ selectedBooking.className }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">选课人数</text>
              <text class="item-value">{{ selectedBooking.studentCount }}人</text>
            </view>
            <view class="detail-item">
              <text class="item-label">大纲学时</text>
              <text class="item-value">{{ selectedBooking.requiredHours }}学时</text>
            </view>
            <view class="detail-item">
              <text class="item-label">预约学时</text>
              <text class="item-value">{{ selectedBooking.bookingHours }}学时</text>
            </view>
          </view>

          <!-- 实验时间 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">实验时间</text>
            </view>
            <view v-for="(slot, index) in selectedBooking.timeSlots" :key="index" class="time-slot-detail">
              <text class="slot-label">时间段 {{ index + 1 }}</text>
              <text class="slot-value">
                {{ slot.weekday }} {{ slot.weekStart }}-{{ slot.weekEnd }}周（{{ slot.periodStart }}-{{ slot.periodEnd }}节）
              </text>
            </view>
          </view>

          <!-- 其他要求 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">其他信息</text>
            </view>
            <view v-if="selectedBooking.softwareRequirements" class="detail-item">
              <text class="item-label">软件环境</text>
              <text class="item-value multi-line">{{ selectedBooking.softwareRequirements }}</text>
            </view>
            <view v-if="selectedBooking.otherRequirements" class="detail-item">
              <text class="item-label">其他要求</text>
              <text class="item-value multi-line">{{ selectedBooking.otherRequirements }}</text>
            </view>
          </view>

          <!-- 教师信息 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">教师信息</text>
            </view>
            <view class="detail-item">
              <text class="item-label">教师姓名</text>
              <text class="item-value">{{ selectedBooking.teacherName }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">联系电话</text>
              <text class="item-value">{{ selectedBooking.teacherPhone }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">邮箱</text>
              <text class="item-value">{{ selectedBooking.teacherEmail }}</text>
            </view>
          </view>

          <!-- 审核信息 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">审核信息</text>
            </view>
            <view class="detail-item">
              <text class="item-label">申请时间</text>
              <text class="item-value">{{ selectedBooking.applyTime }}</text>
            </view>
            <view v-if="selectedBooking.auditTime" class="detail-item">
              <text class="item-label">审核时间</text>
              <text class="item-value">{{ selectedBooking.auditTime }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 底部操作按钮 -->
        <view class="detail-footer">
          <u-button
            v-if="selectedBooking.status === BookingStatus.REJECTED"
            type="primary"
            :custom-style="{ flex: 1 }"
            @click="modifyBooking(selectedBooking)"
          >
            修改申请
          </u-button>
          <u-button
            v-if="selectedBooking.status === BookingStatus.PENDING"
            type="error"
            plain
            :custom-style="{ flex: 1 }"
            @click="cancelBooking(selectedBooking)"
          >
            取消申请
          </u-button>
          <u-button type="info" plain :custom-style="{ flex: 1 }" @click="closeDetail">
            关闭
          </u-button>
        </view>
      </view>
    </u-popup>
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

// Tab切换
.tab-container {
  background-color: #ffffff;
  display: flex;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #e6e6e6;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 0;
  position: relative;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 4rpx;
    background-color: #0096c2;
    border-radius: 2rpx;
    transition: width 0.3s;
  }

  &.active {
    .tab-label {
      color: #0096c2;
      font-weight: 600;
      font-size: 30rpx;
    }

    .tab-badge {
      background-color: #0096c2;
      transform: scale(1.05);
    }

    &::after {
      width: 60rpx;
    }
  }
}

.tab-label {
  font-size: 28rpx;
  color: #999999;
  transition: all 0.3s;
}

.tab-badge {
  margin-left: 6rpx;
  padding: 2rpx 8rpx;
  min-width: 28rpx;
  height: 28rpx;
  line-height: 24rpx;
  font-size: 20rpx;
  color: #ffffff;
  background-color: #ff6b6b;
  border-radius: 14rpx;
  text-align: center;
  transition: all 0.3s;
  display: inline-block;
}

// 滚动容器
.scroll-container {
  flex: 1;
  padding: 20rpx 0;
}

.list-container {
  padding: 0 30rpx;
}

// 空状态
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-text {
  margin-top: 24rpx;
  font-size: 28rpx;
  color: #999999;
}

// 申请卡片
.booking-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.header-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.course-code {
  font-size: 24rpx;
  color: #999999;
}

.header-right {
  margin-left: 20rpx;
}

.card-content {
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-text {
  margin-left: 12rpx;
  font-size: 26rpx;
  color: #666666;
}

.reject-reason {
  display: flex;
  align-items: flex-start;
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff5f5;
  border-radius: 8rpx;
  border-left: 4rpx solid #ff6b6b;
}

.reason-text {
  flex: 1;
  margin-left: 12rpx;
  font-size: 24rpx;
  color: #ff6b6b;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
}

.apply-time {
  font-size: 24rpx;
  color: #999999;
}

.action-buttons {
  display: flex;
  align-items: center;
}

// 详情弹窗
.detail-container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #e6e6e6;
  box-sizing: border-box;
  width: 100%;
}

.detail-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.detail-scroll {
  flex: 1;
  padding: 30rpx 30rpx 30rpx 30rpx;
  box-sizing: border-box;
}

.detail-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f4f8 100%);
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.status-id {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #666666;
}

.detail-reject {
  padding: 24rpx;
  background-color: #fff5f5;
  border-radius: 12rpx;
  border-left: 6rpx solid #ff6b6b;
  margin-bottom: 30rpx;
}

.reject-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.reject-title {
  margin-left: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.reject-content {
  font-size: 26rpx;
  color: #ff6b6b;
  line-height: 1.6;
}

.detail-section {
  margin-bottom: 40rpx;
  width: 100%;
  box-sizing: border-box;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.header-line {
  width: 6rpx;
  height: 32rpx;
  background-color: #0096c2;
  border-radius: 3rpx;
  margin-right: 16rpx;
}

.header-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  width: 100%;
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
}

.item-label {
  width: 160rpx;
  font-size: 26rpx;
  color: #666666;
  flex-shrink: 0;
}

.item-value {
  flex: 1;
  font-size: 26rpx;
  color: #333333;
  text-align: right;
  word-break: break-all;
  overflow-wrap: break-word;
  max-width: calc(100% - 160rpx);
  padding-left: 20rpx;
  box-sizing: border-box;

  &.multi-line {
    text-align: left;
    line-height: 1.6;
  }
}

.time-slot-detail {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f8fbff;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #e6f4f9;

  &:last-child {
    margin-bottom: 0;
  }
}

.slot-label {
  font-size: 24rpx;
  font-weight: bold;
  color: #0096c2;
  margin-right: 20rpx;
}

.slot-value {
  flex: 1;
  font-size: 26rpx;
  color: #333333;
}

.detail-footer {
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #e6e6e6;
  background-color: #ffffff;
  box-sizing: border-box;
  width: 100%;
}
</style>

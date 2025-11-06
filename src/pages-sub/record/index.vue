<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'
import { getMySchedules } from '@/utils/db'
import { useUserStore } from '@/store/user'
import { formatTime } from '@/utils/format'

defineOptions({
  name: 'BookingRecord',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '历史记录',
  },
})

const userStore = useUserStore()

// 历史记录数据
const historyList = ref<any[]>([])
const loading = ref(true)

// 加载历史记录
async function loadHistoryRecords() {
  loading.value = true
  
  try {
    const userId = userStore.userId
    if (!userId) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    
    const res = await getMySchedules(userId)
    
    if (res.success) {
      // 按照学年学期分组，将schedule数据转换为记录格式
      const scheduleMap = new Map<number, any[]>()
      
      res.data.forEach((schedule: any) => {
        const bookingId = schedule.booking_id
        if (!scheduleMap.has(bookingId)) {
          scheduleMap.set(bookingId, [])
        }
        scheduleMap.get(bookingId)!.push(schedule)
      })
      
      // 转换为历史记录格式
      historyList.value = Array.from(scheduleMap.entries()).map(([bookingId, schedules]) => {
        const first = schedules[0]
        return {
          id: bookingId,
          courseCode: first.course_code || '-',
          courseName: first.course_name,
          courseType: first.course_type || '实验教学',
          academicYear: first.academic_year,
          semester: first.semester,
          teacherName: first.teacher_name,
          className: first.class_name || '-',
          studentCount: first.student_count,
          timeSlots: schedules.map((s: any) => ({
            weekday: formatWeekday(s.weekday),
            weekStart: s.week_start,
            weekEnd: s.week_end,
            periodStart: s.period_start,
            periodEnd: s.period_end
          })),
          laboratory: `${first.building} ${first.lab_room}`,
          applyTime: formatTime(first.create_time, 'YYYY-MM-DD HH:mm'),
          completedTime: formatTime(first.create_time, 'YYYY-MM-DD'),
          softwareRequirements: first.software_requirements || '',
          otherRequirements: first.other_requirements || '',
          teacherPhone: first.teacher_phone || '',
          teacherEmail: first.teacher_email || ''
        }
      }).sort((a, b) => new Date(b.completedTime).getTime() - new Date(a.completedTime).getTime())
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化星期
function formatWeekday(weekday: number) {
  const weekMap: any = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日'
  }
  return weekMap[weekday] || '-'
}

// 保持原有的模拟数据作为备份（删除）
const _historyListBackup = ref<any[]>([
  {
    id: 'BK202401001',
    courseCode: 'CS101',
    courseName: '计算机图形学实验',
    courseType: '实验教学',
    academicYear: '2023-2024',
    semester: '第二学期',
    teacherName: '张教师',
    className: '计算机2101-2102',
    studentCount: 58,
    timeSlots: [
      {
        weekday: '星期一',
        weekStart: '1',
        weekEnd: '16',
        periodStart: '3',
        periodEnd: '4',
      },
    ],
    laboratory: '软件楼505实验室',
    applyTime: '2024-02-15 10:30:00',
    completedTime: '2024-06-20',
    softwareRequirements: 'Adobe Photoshop 2020, AutoCAD 2021',
    teacherPhone: '13800138000',
    teacherEmail: 'zhang@bjut.edu.cn',
  },
  {
    id: 'BK202401002',
    courseCode: 'CS202',
    courseName: '数据结构课程设计',
    courseType: '实验作业',
    academicYear: '2023-2024',
    semester: '第一学期',
    teacherName: '张教师',
    className: '计算机2103',
    studentCount: 30,
    timeSlots: [
      {
        weekday: '星期三',
        weekStart: '1',
        weekEnd: '8',
        periodStart: '5',
        periodEnd: '6',
      },
    ],
    laboratory: '软件楼518实验室',
    applyTime: '2023-09-10 09:15:00',
    completedTime: '2023-12-25',
    softwareRequirements: 'Visual Studio Code, GCC编译器',
    teacherPhone: '13800138000',
    teacherEmail: 'zhang@bjut.edu.cn',
  },
  {
    id: 'BK202301003',
    courseCode: 'CS303',
    courseName: 'Web前端开发实训',
    courseType: '工作实习',
    academicYear: '2022-2023',
    semester: '第二学期',
    teacherName: '张教师',
    className: '软件工程2001',
    studentCount: 42,
    timeSlots: [
      {
        weekday: '星期五',
        weekStart: '1',
        weekEnd: '12',
        periodStart: '1',
        periodEnd: '4',
      },
    ],
    laboratory: '软件楼505实验室',
    applyTime: '2023-02-20 14:20:00',
    completedTime: '2023-06-15',
    softwareRequirements: 'Visual Studio Code, Node.js, Chrome浏览器',
    otherRequirements: '需要外网访问权限',
    teacherPhone: '13800138000',
    teacherEmail: 'zhang@bjut.edu.cn',
  },
])

// 当前选中的历史记录
const selectedRecord = ref<HistoryRecord | null>(null)
const showDetailModal = ref(false)

// 学年筛选
const activeYear = ref('all')
const yearList = computed(() => {
  const years = new Set<string>()
  historyList.value.forEach(item => years.add(item.academicYear))
  return [
    { key: 'all', label: '全部' },
    ...Array.from(years).map(year => ({ key: year, label: year })),
  ]
})

// 过滤后的列表
const filteredList = computed(() => {
  if (activeYear.value === 'all') {
    return historyList.value
  }
  return historyList.value.filter(item => item.academicYear === activeYear.value)
})

// 返回上一页
function goBack() {
  uni.navigateBack()
}

// 查看详情
function viewDetail(item: HistoryRecord) {
  selectedRecord.value = item
  showDetailModal.value = true
}

// 格式化实验时间
function formatTimeSlots(slots: HistoryRecord['timeSlots']) {
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
  selectedRecord.value = null
}

onMounted(() => {
  loadHistoryRecords()
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
          历史记录
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <!-- 学年筛选 -->
    <view class="filter-container">
      <view
        v-for="year in yearList"
        :key="year.key"
        class="filter-item"
        :class="{ active: activeYear === year.key }"
        @click="activeYear = year.key"
      >
        <text class="filter-label">{{ year.label }}</text>
      </view>
    </view>

    <!-- 历史记录列表 -->
    <scroll-view scroll-y class="scroll-container">
      <view class="list-container">
        <view v-if="filteredList.length === 0" class="empty-container">
          <u-icon name="file-text" size="80" color="#cccccc" />
          <text class="empty-text">暂无历史记录</text>
        </view>

        <view v-for="item in filteredList" :key="item.id" class="record-card" @click="viewDetail(item)">
          <!-- 卡片头部 -->
          <view class="card-header">
            <view class="header-left">
              <text class="course-name">{{ item.courseName }}</text>
              <text class="course-meta">{{ item.courseCode }} · {{ item.courseType }}</text>
            </view>
            <view class="archive-tag">
              <u-icon name="checkmark-circle-fill" size="16" color="#52c41a" />
              <text class="archive-text">已归档</text>
            </view>
          </view>

          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="info-row">
              <u-icon name="calendar" size="14" color="#999999" />
              <text class="info-text">{{ item.academicYear }}学年 {{ item.semester }}</text>
            </view>
            <view class="info-row">
              <u-icon name="home" size="14" color="#999999" />
              <text class="info-text">{{ item.laboratory }}</text>
            </view>
            <view class="info-row">
              <u-icon name="account" size="14" color="#999999" />
              <text class="info-text">{{ item.className }} · {{ item.studentCount }}人</text>
            </view>
          </view>

          <!-- 卡片底部 -->
          <view class="card-footer">
            <text class="complete-time">完成时间：{{ item.completedTime }}</text>
            <u-icon name="arrow-right" size="16" color="#999999" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <u-popup v-model="showDetailModal" mode="bottom" :border-radius="20" :safe-area-inset-bottom="true">
      <view v-if="selectedRecord" class="detail-container">
        <!-- 弹窗标题 -->
        <view class="detail-header">
          <text class="detail-title">记录详情</text>
          <u-icon name="close" size="24" color="#333333" @click="closeDetail" />
        </view>

        <scroll-view scroll-y class="detail-scroll">
          <!-- 归档状态 -->
          <view class="detail-status">
            <u-icon name="checkmark-circle-fill" size="48" color="#52c41a" />
            <text class="status-text">已归档</text>
            <text class="status-id">{{ selectedRecord.id }}</text>
          </view>

          <!-- 课程信息 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">课程信息</text>
            </view>
            <view class="detail-item">
              <text class="item-label">课程名称</text>
              <text class="item-value">{{ selectedRecord.courseName }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">课程代码</text>
              <text class="item-value">{{ selectedRecord.courseCode }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">课程类型</text>
              <text class="item-value">{{ selectedRecord.courseType }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">学年学期</text>
              <text class="item-value">{{ selectedRecord.academicYear }}学年 {{ selectedRecord.semester }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">授课班级</text>
              <text class="item-value">{{ selectedRecord.className }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">选课人数</text>
              <text class="item-value">{{ selectedRecord.studentCount }}人</text>
            </view>
          </view>

          <!-- 实验安排 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">实验安排</text>
            </view>
            <view class="detail-item">
              <text class="item-label">实验室</text>
              <text class="item-value">{{ selectedRecord.laboratory }}</text>
            </view>
            <view v-for="(slot, index) in selectedRecord.timeSlots" :key="index" class="time-slot-detail">
              <text class="slot-label">时间段 {{ index + 1 }}</text>
              <text class="slot-value">
                {{ slot.weekday }} {{ slot.weekStart }}-{{ slot.weekEnd }}周（{{ slot.periodStart }}-{{ slot.periodEnd }}节）
              </text>
            </view>
          </view>

          <!-- 其他信息 -->
          <view v-if="selectedRecord.softwareRequirements || selectedRecord.otherRequirements" class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">其他信息</text>
            </view>
            <view v-if="selectedRecord.softwareRequirements" class="detail-item">
              <text class="item-label">软件环境</text>
              <text class="item-value multi-line">{{ selectedRecord.softwareRequirements }}</text>
            </view>
            <view v-if="selectedRecord.otherRequirements" class="detail-item">
              <text class="item-label">其他要求</text>
              <text class="item-value multi-line">{{ selectedRecord.otherRequirements }}</text>
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
              <text class="item-value">{{ selectedRecord.teacherName }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">联系电话</text>
              <text class="item-value">{{ selectedRecord.teacherPhone }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">邮箱</text>
              <text class="item-value">{{ selectedRecord.teacherEmail }}</text>
            </view>
          </view>

          <!-- 时间信息 -->
          <view class="detail-section">
            <view class="section-header">
              <view class="header-line" />
              <text class="header-title">时间节点</text>
            </view>
            <view class="detail-item">
              <text class="item-label">申请时间</text>
              <text class="item-value">{{ selectedRecord.applyTime }}</text>
            </view>
            <view class="detail-item">
              <text class="item-label">完成时间</text>
              <text class="item-value">{{ selectedRecord.completedTime }}</text>
            </view>
          </view>
        </scroll-view>

        <!-- 底部关闭按钮 -->
        <view class="detail-footer">
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

// 学年筛选
.filter-container {
  background-color: #ffffff;
  display: flex;
  padding: 16rpx 30rpx;
  gap: 12rpx;
  overflow-x: auto;
  border-bottom: 1rpx solid #e6e6e6;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-item {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  background-color: #f5f7fa;
  border-radius: 20rpx;
  transition: all 0.3s;

  &.active {
    background-color: #0096c2;

    .filter-label {
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.filter-label {
  font-size: 26rpx;
  color: #666666;
  white-space: nowrap;
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

// 历史记录卡片
.record-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }
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

.course-meta {
  font-size: 24rpx;
  color: #999999;
}

.archive-tag {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 12rpx;
  background-color: #f6ffed;
  border-radius: 12rpx;
}

.archive-text {
  font-size: 22rpx;
  color: #52c41a;
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

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
}

.complete-time {
  font-size: 24rpx;
  color: #999999;
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
  background: linear-gradient(135deg, #f6ffed 0%, #e6f7e6 100%);
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.status-text {
  margin-top: 12rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #52c41a;
}

.status-id {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #666666;
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

<script lang="ts" setup>
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '通知中心',
    navigationBarBackgroundColor: '#0096C2',
    navigationBarTextStyle: 'white',
  },
})

// 导航栏配置
const navBarConfig = ref({
  title: '通知中心',
  frontColor: '#ffffff' as '#ffffff' | '#000000',
  backgroundColor: '#0096C2',
})

// 通知类型
const noticeTypes = ref([
  { key: 'all', label: '全部', count: 3 },
  { key: 'pending', label: '待审核', count: 1 },
  { key: 'approved', label: '已通过', count: 1 },
  { key: 'rejected', label: '已拒绝', count: 1 },
])

// 当前选中的类型
const activeType = ref('all')

// 切换类型
function switchType(type: string) {
  activeType.value = type
  loadNotices()
}

// 通知列表 - 简化测试数据
const notices = ref([
  {
    id: 1,
    type: 'approved',
    title: '排课申请已通过',
    content: '您的《数据结构与算法》课程排课申请已通过审核，已安排到软件楼505实验室。',
    courseName: '数据结构与算法',
    courseCode: 'CS2001',
    time: '2024-12-20 14:30',
    isRead: false,
    adminRemark: '',
  },
  {
    id: 2,
    type: 'rejected',
    title: '排课申请被拒绝',
    content: '您的《软件工程》课程排课申请被拒绝，请查看拒绝原因并重新提交。',
    courseName: '软件工程',
    courseCode: 'CS2002',
    time: '2024-12-19 16:45',
    isRead: false,
    adminRemark: '申请时间段与现有课程冲突，建议选择其他时间段。',
  },
  {
    id: 3,
    type: 'pending',
    title: '排课申请提交成功',
    content: '您的《计算机组成原理》课程排课申请已提交，正在审核中，请耐心等待。',
    courseName: '计算机组成原理',
    courseCode: 'CS2003',
    time: '2024-12-18 10:20',
    isRead: true,
    adminRemark: '',
  },
])

// 过滤后的通知列表
const filteredNotices = ref([])

// 加载通知
function loadNotices() {
  if (activeType.value === 'all') {
    filteredNotices.value = notices.value
  }
  else {
    filteredNotices.value = notices.value.filter(notice => notice.type === activeType.value)
  }
}

// 标记为已读
function markAsRead(notice: any) {
  notice.isRead = true
  // 更新未读数量
  const typeItem = noticeTypes.value.find(item => item.key === notice.type)
  if (typeItem && typeItem.count > 0) {
    typeItem.count--
  }
  // 更新全部未读数量
  const allItem = noticeTypes.value.find(item => item.key === 'all')
  if (allItem && allItem.count > 0) {
    allItem.count--
  }
}

// 查看详情
function viewDetail(notice: any) {
  markAsRead(notice)

  // 根据通知类型跳转到不同页面
  if (notice.type === 'rejected') {
    // 被拒绝的申请，跳转到申请查询页面
    uni.navigateTo({
      url: '/pages-sub/query/index',
    })
  }
  else if (notice.type === 'approved') {
    // 已通过的申请，可以查看排课结果
    uni.showToast({
      title: '排课结果查看功能开发中',
      icon: 'none',
    })
  }
}

// 初始化
onMounted(() => {
  loadNotices()
})

// 获取类型颜色
function getTypeColor(type: string) {
  const colors = {
    approved: '#52c41a',
    rejected: '#ff4d4f',
    pending: '#1890ff',
  }
  return colors[type] || '#666666'
}

// 获取类型图标
function getTypeIcon(type: string) {
  const icons = {
    approved: 'checkmark-circle',
    rejected: 'close-circle',
    pending: 'time',
  }
  return icons[type] || 'info-circle'
}
</script>

<template>
  <page-meta>
    <navigation-bar
      :title="navBarConfig.title"
      :front-color="navBarConfig.frontColor"
      :background-color="navBarConfig.backgroundColor"
    />
  </page-meta>

  <view class="page-container">
    <scroll-view scroll-y class="scroll-container">
      <!-- 类型切换 -->
      <view class="type-tabs">
        <view
          v-for="type in noticeTypes"
          :key="type.key"
          class="tab-item"
          :class="{ active: activeType === type.key }"
          @click="switchType(type.key)"
        >
          <text class="tab-label">{{ type.label }}</text>
          <view v-if="type.count > 0" class="tab-badge">
            {{ type.count > 99 ? '99+' : type.count }}
          </view>
        </view>
      </view>

      <!-- 通知列表 -->
      <view class="notice-list">
        <view
          v-for="notice in filteredNotices"
          :key="notice.id"
          class="notice-item"
          :class="{ unread: !notice.isRead }"
          @click="viewDetail(notice)"
        >
          <view class="notice-icon" :style="{ backgroundColor: `${getTypeColor(notice.type)}20` }">
            <u-icon :name="getTypeIcon(notice.type)" size="20" :color="getTypeColor(notice.type)" />
          </view>

          <view class="notice-content">
            <view class="notice-header">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-time">{{ notice.time }}</text>
            </view>

            <text class="notice-desc">{{ notice.content }}</text>

            <view class="notice-course">
              <text class="course-name">{{ notice.courseName }}</text>
              <text class="course-code">{{ notice.courseCode }}</text>
            </view>

            <view v-if="notice.adminRemark" class="admin-remark">
              <view class="remark-header">
                <u-icon name="message" size="14" color="#ff6b6b" />
                <text class="remark-title">管理员备注</text>
              </view>
              <text class="remark-content">{{ notice.adminRemark }}</text>
            </view>
          </view>

          <view v-if="!notice.isRead" class="unread-dot" />
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredNotices.length === 0" class="empty-state">
        <u-icon name="notification" size="60" color="#cccccc" />
        <text class="empty-text">暂无{{ activeType === 'all' ? '' : noticeTypes.find(t => t.key === activeType)?.label }}通知</text>
      </view>

      <!-- 底部安全距离 -->
      <view class="safe-area-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.scroll-container {
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

// 类型切换
.type-tabs {
  display: flex;
  background-color: #ffffff;
  margin: 30rpx 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 8rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 150, 194, 0.1);
  width: calc(100% - 40rpx);
  box-sizing: border-box;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  border-radius: 12rpx;
  position: relative;
  transition: all 0.3s ease;

  &.active {
    background-color: #0096c2;

    .tab-label {
      color: #ffffff;
      font-weight: 600;
    }

    .tab-badge {
      background-color: #ffffff;
      color: #0096c2;
    }
  }
}

.tab-label {
  font-size: 26rpx;
  color: #666666;
  transition: all 0.3s ease;
}

.tab-badge {
  margin-left: 8rpx;
  min-width: 32rpx;
  height: 32rpx;
  background-color: #ff4d4f;
  color: #ffffff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}

// 通知列表
.notice-list {
  padding: 0 20rpx;
  width: calc(100% - 40rpx);
  box-sizing: border-box;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 30rpx 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.1);
  }

  &.unread {
    border-left: 6rpx solid #0096c2;
  }
}

.notice-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  width: calc(100% - 96rpx);
  box-sizing: border-box;
}

.notice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notice-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  flex: 1;
}

.notice-time {
  font-size: 22rpx;
  color: #999999;
  flex-shrink: 0;
}

.notice-desc {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.5;
  word-break: break-all;
  overflow-wrap: break-word;
}

.notice-course {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.course-name {
  font-size: 24rpx;
  color: #0096c2;
  font-weight: 600;
}

.course-code {
  font-size: 22rpx;
  color: #999999;
  background-color: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.admin-remark {
  background-color: #fff2f0;
  border: 1rpx solid #ffccc7;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 8rpx;
}

.remark-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.remark-title {
  font-size: 22rpx;
  color: #ff4d4f;
  font-weight: 600;
}

.remark-content {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.4;
  word-break: break-all;
  overflow-wrap: break-word;
}

.unread-dot {
  position: absolute;
  top: 30rpx;
  right: 24rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff4d4f;
  border-radius: 50%;
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
  text-align: center;
}

.empty-text {
  margin-top: 24rpx;
  font-size: 26rpx;
  color: #999999;
}

.safe-area-bottom {
  height: 40rpx;
}
</style>

<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'HomeStyle3',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '日新智课',
  },
})

// 主要服务
const services = [
  {
    icon: 'calendar',
    title: '排课申请',
    desc: '快速提交实验室预约',
    color: '#0096C2',
    url: '/pages-sub/apply/index',
  },
  {
    icon: 'search',
    title: '申请查询',
    desc: '查看审核进度',
    color: '#0078A8',
    url: '/pages-sub/query/index',
  },
  {
    icon: 'file-text',
    title: '历史记录',
    desc: '查看往年记录',
    color: '#006B8F',
    url: '/pages-sub/record/index',
  },
]

// 通知公告
const notices = [
  { title: '关于2024-2025学年第二学期实验室排课的通知', time: '2024-10-08' },
  { title: '实验室设备维护通知', time: '2024-10-05' },
]

// 常用功能
const quickActions = [
  { name: '使用指南', icon: 'info-circle', url: '/pages-sub/guide/index' },
  { name: '常见问题', icon: 'question-circle', url: '/pages-sub/faq/index' },
  { name: '意见反馈', icon: 'chat', url: '/pages-sub/feedback/index' },
  { name: '关于我们', icon: 'more-circle', url: '/pages-sub/about/index' },
]

// 跳转页面
function navigateTo(url: string) {
  if (url) {
    uni.navigateTo({ url })
  }
  else {
    uni.showToast({ title: '功能开发中', icon: 'none' })
  }
}
</script>

<template>
  <view class="page-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 顶部Banner -->
    <view class="top-banner">
      <view class="banner-overlay">
        <view class="banner-content">
          <image src="/static/school/school-logo-377x378.png" mode="aspectFit" class="banner-logo" />
          <view class="banner-text">
            <text class="banner-title">日新智课</text>
            <text class="banner-subtitle">BJUT 智慧排课系统</text>
          </view>
        </view>
        <view class="motto-wrapper">
          <image src="/static/school/school-motto-810x134.png" mode="widthFix" class="banner-motto" />
        </view>
      </view>
    </view>

    <view class="content-section">
      <!-- 通知公告 -->
      <view class="notice-section">
        <view class="section-header-notice">
          <text class="section-title-notice">通知公告</text>
          <text class="more-link" @click="navigateTo('')">更多 ></text>
        </view>
        <view class="notice-list">
          <view
            v-for="(item, index) in notices"
            :key="index"
            class="notice-item"
            @click="navigateTo('')"
          >
            <view class="notice-dot" />
            <view class="notice-content">
              <text class="notice-title">{{ item.title }}</text>
              <text class="notice-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 主要服务 -->
      <view class="services-section">
        <view class="section-header">
          <view class="header-line" />
          <text class="section-title">主要服务</text>
          <view class="header-line" />
        </view>
        <view class="services-list">
          <view
            v-for="(item, index) in services"
            :key="index"
            class="service-card"
            @click="navigateTo(item.url)"
          >
            <view class="service-icon" :style="{ backgroundColor: item.color }">
              <u-icon :name="item.icon" size="36" color="#ffffff" />
            </view>
            <view class="service-info">
              <text class="service-title">{{ item.title }}</text>
              <text class="service-desc">{{ item.desc }}</text>
            </view>
            <u-icon name="arrow-right" size="20" color="#cccccc" />
          </view>
        </view>
      </view>

      <!-- 常用功能 -->
      <view class="quick-section">
        <view class="section-header">
          <view class="header-line" />
          <text class="section-title">常用功能</text>
          <view class="header-line" />
        </view>
        <view class="quick-grid">
          <view
            v-for="(item, index) in quickActions"
            :key="index"
            class="quick-item"
            @click="navigateTo(item.url)"
          >
            <view class="quick-icon-wrapper">
              <u-icon :name="item.icon" size="32" color="#0096C2" />
            </view>
            <text class="quick-name">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <!-- 学校信息卡片 -->
      <view class="school-card">
        <image src="/static/school/school-library-579x299.png" mode="widthFix" class="library-image" />
        <view class="school-info">
          <text class="school-name">北京工业大学</text>
          <text class="school-separator" />
          <text class="school-dept">实验中心</text>
        </view>
      </view>

      <!-- 底部空白 -->
      <view class="bottom-space" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

// 顶部Banner
.top-banner {
  height: 300rpx;
  background: linear-gradient(to right, #0096c2 0%, #0096c2 50%, #ffffff 100%);
  position: relative;
  overflow: hidden;
}

.banner-overlay {
  height: 100%;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.banner-content {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.banner-logo {
  width: 100rpx;
  height: 100rpx;
  margin-right: 24rpx;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 200rpx;
  padding: 5rpx;
}

.banner-text {
  display: flex;
  flex-direction: column;
}

.banner-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.banner-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.motto-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-left: 20rpx;
}

.banner-motto {
  width: 280rpx;
  max-width: 100%;
}

// 内容区域
.content-section {
  margin-top: 10rpx;
  padding: 0 30rpx;
}

// 通知公告
.notice-section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 150, 194, 0.12);
  margin-bottom: 20rpx;
}

.section-header-notice {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-title-notice {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.more-link {
  font-size: 24rpx;
  color: #0096c2;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx;
  background-color: #f8fbff;
  border-radius: 8rpx;
}

.notice-item:active {
  background-color: #e6f4f9;
}

.notice-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #0096c2;
  border-radius: 50%;
  margin-top: 12rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.notice-title {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 8rpx;
  line-height: 1.5;
}

.notice-time {
  font-size: 22rpx;
  color: #999999;
}

// 主要服务
.services-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.header-line {
  width: 60rpx;
  height: 4rpx;
  background-color: #0096c2;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin: 0 20rpx;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.service-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.service-card:active {
  transform: scale(0.98);
  transition: all 0.2s;
}

.service-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.service-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.service-desc {
  font-size: 26rpx;
  color: #666666;
}

// 常用功能
.quick-section {
  margin-bottom: 30rpx;
}

.quick-grid {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx 20rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx 0;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick-item:active {
  opacity: 0.7;
}

.quick-icon-wrapper {
  width: 88rpx;
  height: 88rpx;
  background-color: #e6f7fb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.quick-name {
  font-size: 24rpx;
  color: #333333;
  text-align: center;
}

// 学校信息卡片
.school-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.library-image {
  width: 280rpx;
  margin-bottom: 24rpx;
  opacity: 0.8;
}

.school-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.school-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #0096c2;
}

.school-separator {
  font-size: 28rpx;
  color: #999999;
  margin: 0 12rpx;
}

.school-dept {
  font-size: 26rpx;
  color: #666666;
}

.bottom-space {
  height: 40rpx;
}
</style>

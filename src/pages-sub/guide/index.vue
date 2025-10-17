<script lang="ts" setup>
import { ref } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'UserGuide',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '使用指南',
  },
})

// 指南步骤
const steps = ref([
  {
    id: 1,
    title: '登录系统',
    desc: '使用教师账号登录日新智课系统',
    icon: 'account',
    color: '#0096C2',
  },
  {
    id: 2,
    title: '提交申请',
    desc: '填写排课申请表单，包含课程信息、实验时间等',
    icon: 'edit-pen',
    color: '#0078A8',
  },
  {
    id: 3,
    title: '等待审核',
    desc: '管理员将审核您的申请，并安排实验室',
    icon: 'clock',
    color: '#006B8F',
  },
  {
    id: 4,
    title: '查看结果',
    desc: '在申请查询页面查看审核进度和排课结果',
    icon: 'checkmark-circle',
    color: '#52c41a',
  },
])

// 功能说明
const features = ref([
  {
    title: '排课申请',
    items: [
      '填写完整的课程信息和教师信息',
      '选择实验时间段，支持多个时段',
      '说明软件环境和其他要求',
      '提供电子签名确认申请',
    ],
  },
  {
    title: '申请查询',
    items: [
      '查看所有申请的审核状态',
      '已拒绝申请可以修改后重新提交',
      '待审核申请可以取消',
      '查看详细的申请信息',
    ],
  },
  {
    title: '历史记录',
    items: [
      '查看往年已完成的排课记录',
      '按学年筛选历史数据',
      '查看已分配的实验室信息',
      '导出或打印排课记录',
    ],
  },
])

// 返回上一页
function goBack() {
  uni.navigateBack()
}
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
          使用指南
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-container">
      <!-- 欢迎卡片 -->
      <view class="welcome-card">
        <u-icon name="info-circle-fill" size="48" color="#f7f7f7" />
        <text class="welcome-title">欢迎使用日新智课</text>
        <text class="welcome-desc">北京工业大学智慧排课系统</text>
      </view>

      <!-- 使用步骤 -->
      <view class="section">
        <view class="section-header">
          <view class="header-line" />
          <text class="header-title">使用步骤</text>
        </view>

        <view class="steps-container">
          <view v-for="(step, index) in steps" :key="step.id" class="step-item">
            <view class="step-left">
              <view class="step-icon" :style="{ backgroundColor: step.color }">
                <u-icon :name="step.icon" size="24" color="#ffffff" />
              </view>
              <view v-if="index < steps.length - 1" class="step-line" />
            </view>
            <view class="step-right">
              <text class="step-title">{{ step.title }}</text>
              <text class="step-desc">{{ step.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能说明 -->
      <view class="section">
        <view class="section-header">
          <view class="header-line" />
          <text class="header-title">功能说明</text>
        </view>

        <view v-for="(feature, index) in features" :key="index" class="feature-card">
          <text class="feature-title">{{ feature.title }}</text>
          <view v-for="(item, idx) in feature.items" :key="idx" class="feature-item">
            <view class="item-dot" />
            <text class="item-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 温馨提示 -->
      <view class="section">
        <view class="section-header">
          <view class="header-line" />
          <text class="header-title">温馨提示</text>
        </view>

        <view class="tips-card">
          <view class="tip-item">
            <u-icon name="info-circle" size="18" color="#0096C2" />
            <text class="tip-text">请提前规划实验时间，避免与其他课程冲突</text>
          </view>
          <view class="tip-item">
            <u-icon name="info-circle" size="18" color="#0096C2" />
            <text class="tip-text">填写准确的软件环境要求，便于实验室准备</text>
          </view>
          <view class="tip-item">
            <u-icon name="info-circle" size="18" color="#0096C2" />
            <text class="tip-text">申请被拒绝后可修改信息重新提交</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

// 自定义导航栏
.custom-navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid #e6e6e6;
  width: 100%;
  box-sizing: border-box;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.navbar-left {
  display: flex;
  align-items: center;
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

.scroll-container {
  flex: 1;
  padding: 30rpx;
  width: 100%;
  box-sizing: border-box;
}

// 欢迎卡片
.welcome-card {
  background: linear-gradient(135deg, #0096c2 0%, #0078a8 100%);
  border-radius: 16rpx;
  padding: 50rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.welcome-title {
  margin-top: 20rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.welcome-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

// 分区
.section {
  margin-bottom: 30rpx;
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

// 步骤
.steps-container {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.step-item {
  display: flex;
  gap: 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-line {
  flex: 1;
  width: 2rpx;
  background-color: #e6e6e6;
  margin: 12rpx 0;
}

.step-right {
  flex: 1;
  padding-bottom: 40rpx;
}

.step-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.step-desc {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
}

// 功能卡片
.feature-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.feature-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #0096c2;
  display: block;
  margin-bottom: 20rpx;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-dot {
  width: 8rpx;
  height: 8rpx;
  background-color: #0096c2;
  border-radius: 50%;
  margin-top: 14rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  font-size: 26rpx;
  color: #666666;
  line-height: 1.8;
}

// 提示卡片
.tips-card {
  background-color: #e6f4f9;
  border-radius: 16rpx;
  padding: 30rpx;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.tip-text {
  flex: 1;
  margin-left: 12rpx;
  font-size: 26rpx;
  color: #333333;
  line-height: 1.6;
}
</style>

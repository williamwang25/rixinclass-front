<script lang="ts" setup>
import { ref } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'About',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '关于我们',
  },
})

// 团队成员
const teamMembers = ref([
  {
    role: '组长',
    name: '张三',
    duties: '项目管理、需求分析',
    icon: 'star',
    color: '#0096C2',
  },
  {
    role: '组员',
    name: '李四',
    duties: '前端开发、UI设计',
    icon: 'account',
    color: '#0078A8',
  },
  {
    role: '组员',
    name: '王五',
    duties: '后端开发、数据库设计',
    icon: 'account',
    color: '#0078A8',
  },
  {
    role: '组员',
    name: '赵六',
    duties: '系统测试、文档编写',
    icon: 'account',
    color: '#0078A8',
  },
])

// 指导老师
const teachers = ref([
  {
    name: '陈教授',
    title: '指导老师',
    dept: '软件工程系',
  },
])

// 系统信息
const systemInfo = ref({
  name: '日新智课',
  version: 'v1.0.0',
  description: '北京工业大学智慧排课系统',
  features: [
    '智能排课算法',
    '实验室资源管理',
    '移动端便捷申请',
    '审核流程可视化',
  ],
})

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
          关于我们
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-container">
      <!-- 系统简介 -->
      <view class="intro-card">
        <view class="logo-container">
          <u-icon name="home" size="64" color="#0096C2" />
        </view>
        <text class="system-name">{{ systemInfo.name }}</text>
        <text class="system-version">{{ systemInfo.version }}</text>
        <text class="system-desc">{{ systemInfo.description }}</text>

        <view class="feature-tags">
          <view v-for="(feature, index) in systemInfo.features" :key="index" class="feature-tag">
            <text class="feature-text">{{ feature }}</text>
          </view>
        </view>
      </view>

      <!-- 开发团队 -->
      <view class="section">
        <view class="section-header">
          <view class="header-line" />
          <text class="header-title">开发团队</text>
        </view>

        <view class="team-card">
          <view class="team-info">
            <u-icon name="star-fill" size="20" color="#0096C2" />
            <text class="team-text">北京工业大学 2023级 软件工程1班</text>
          </view>

          <view class="members-list">
            <view v-for="(member, index) in teamMembers" :key="index" class="member-item">
              <view class="member-icon" :style="{ backgroundColor: member.color }">
                <u-icon :name="member.icon" size="24" color="#ffffff" />
              </view>
              <view class="member-info">
                <view class="member-header">
                  <text class="member-name">{{ member.name }}</text>
                  <view class="role-tag">
                    <text class="role-text">{{ member.role }}</text>
                  </view>
                </view>
                <text class="member-duties">{{ member.duties }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 指导老师 -->
      <view class="section">
        <view class="section-header">
          <view class="header-line" />
          <text class="header-title">指导老师</text>
        </view>

        <view class="teacher-card">
          <view v-for="(teacher, index) in teachers" :key="index" class="teacher-item">
            <view class="teacher-icon">
              <u-icon name="account-fill" size="32" color="#0096C2" />
            </view>
            <view class="teacher-info">
              <text class="teacher-name">{{ teacher.name }}</text>
              <text class="teacher-title">{{ teacher.title }}</text>
              <text class="teacher-dept">{{ teacher.dept }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 联系我们 -->
      <view class="section">
        <view class="section-header">
          <view class="header-line" />
          <text class="header-title">联系我们</text>
        </view>

        <view class="contact-card">
          <view class="contact-item">
            <u-icon name="email" size="20" color="#0096C2" />
            <text class="contact-text">support@bjut.edu.cn</text>
          </view>
          <view class="contact-item">
            <u-icon name="map" size="20" color="#0096C2" />
            <text class="contact-text">北京市朝阳区平乐园100号</text>
          </view>
        </view>
      </view>

      <!-- 版权信息 -->
      <view class="copyright">
        <text class="copyright-text">© 2025 北京工业大学</text>
        <text class="copyright-text">软件工程1班开发小组</text>
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

// 系统简介
.intro-card {
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

.logo-container {
  width: 120rpx;
  height: 120rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.system-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.system-version {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16rpx;
}

.system-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 30rpx;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16rpx;
}

.feature-tag {
  padding: 12rpx 24rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}

.feature-text {
  font-size: 24rpx;
  color: #ffffff;
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

// 团队卡片
.team-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  background-color: #e6f4f9;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}

.team-text {
  font-size: 26rpx;
  color: #0096c2;
  font-weight: 600;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.member-item {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.member-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.member-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.role-tag {
  padding: 4rpx 12rpx;
  background-color: #e6f4f9;
  border-radius: 8rpx;
}

.role-text {
  font-size: 20rpx;
  color: #0096c2;
}

.member-duties {
  font-size: 24rpx;
  color: #666666;
}

// 老师卡片
.teacher-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.teacher-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.teacher-icon {
  width: 80rpx;
  height: 80rpx;
  background-color: #e6f4f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.teacher-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.teacher-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
}

.teacher-title {
  font-size: 24rpx;
  color: #0096c2;
}

.teacher-dept {
  font-size: 22rpx;
  color: #999999;
}

// 联系卡片
.contact-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.contact-text {
  font-size: 26rpx;
  color: #666666;
}

// 版权信息
.copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 40rpx 0;
}

.copyright-text {
  font-size: 22rpx;
  color: #999999;
}
</style>

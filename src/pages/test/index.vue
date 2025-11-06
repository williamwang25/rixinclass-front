<template>
  <view class="test-center">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="header-bg" />
      <view class="header-content">
        <text class="title">🧪 测试中心</text>
        <text class="subtitle">Development Test Center</text>
      </view>
    </view>

    <!-- 测试模块列表 -->
    <view class="content">
      <!-- 阶段1: 用户认证 -->
      <view class="test-section">
        <view class="section-header">
          <view class="stage-badge stage-1">阶段 1</view>
          <text class="section-title">用户认证模块</text>
        </view>
        <view class="test-cards">
          <view class="test-card" @click="navigateTo('/pages-sub/test/auth')">
            <view class="card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <text class="icon-text">🔐</text>
            </view>
            <view class="card-info">
              <text class="card-title">登录认证测试</text>
              <text class="card-desc">测试微信登录、用户信息查询</text>
            </view>
            <view class="card-arrow">
              <u-icon name="arrow-right" size="20" color="#999" />
            </view>
          </view>
        </view>
      </view>

      <!-- 阶段2: 实验室模块 -->
      <view class="test-section">
        <view class="section-header">
          <view class="stage-badge stage-2">阶段 2</view>
          <text class="section-title">实验室模块</text>
        </view>
        <view class="test-cards">
          <view class="test-card" @click="navigateTo('/pages-sub/test/lab')">
            <view class="card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <text class="icon-text">🏫</text>
            </view>
            <view class="card-info">
              <text class="card-title">实验室管理测试</text>
              <text class="card-desc">测试实验室列表、详情查询</text>
            </view>
            <view class="card-arrow">
              <u-icon name="arrow-right" size="20" color="#999" />
            </view>
          </view>
        </view>
      </view>

      <!-- 阶段3: 排课申请 -->
      <view class="test-section">
        <view class="section-header">
          <view class="stage-badge stage-3">阶段 3</view>
          <text class="section-title">排课申请模块</text>
        </view>
        <view class="test-cards">
          <view class="test-card" @click="navigateTo('/pages-sub/test/booking')">
            <view class="card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <text class="icon-text">📝</text>
            </view>
            <view class="card-info">
              <text class="card-title">申请提交测试</text>
              <text class="card-desc">测试创建申请、查询申请</text>
            </view>
            <view class="card-arrow">
              <u-icon name="arrow-right" size="20" color="#999" />
            </view>
          </view>
        </view>
      </view>

      <!-- 阶段4: 管理员审核 -->
      <view class="test-section">
        <view class="section-header">
          <view class="stage-badge stage-4">阶段 4</view>
          <text class="section-title">管理员模块</text>
        </view>
        <view class="test-cards">
          <view class="test-card disabled">
            <view class="card-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
              <text class="icon-text">👨‍💼</text>
            </view>
            <view class="card-info">
              <text class="card-title">审核管理测试</text>
              <text class="card-desc">测试申请审核、冲突处理</text>
            </view>
            <view class="disabled-tag">
              <text class="disabled-text">待开发</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 阶段5: 自动排课 -->
      <view class="test-section">
        <view class="section-header">
          <view class="stage-badge stage-5">阶段 5</view>
          <text class="section-title">自动排课模块</text>
        </view>
        <view class="test-cards">
          <view class="test-card disabled">
            <view class="card-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
              <text class="icon-text">🤖</text>
            </view>
            <view class="card-info">
              <text class="card-title">智能排课测试</text>
              <text class="card-desc">测试自动排课算法</text>
            </view>
            <view class="disabled-tag">
              <text class="disabled-text">待开发</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 测试说明 -->
      <view class="info-section">
        <view class="info-header">
          <text class="info-icon">📋</text>
          <text class="info-title">测试说明</text>
        </view>
        <view class="info-content">
          <view class="info-item">
            <text class="bullet">•</text>
            <text class="info-text">点击卡片进入对应测试页面</text>
          </view>
          <view class="info-item">
            <text class="bullet">•</text>
            <text class="info-text">每个模块独立测试，按阶段开发</text>
          </view>
          <view class="info-item">
            <text class="bullet">•</text>
            <text class="info-text">灰色卡片为未开发功能</text>
          </view>
          <view class="info-item">
            <text class="bullet">•</text>
            <text class="info-text">测试时请查看云函数日志</text>
          </view>
        </view>
      </view>

      <!-- 开发进度 -->
      <view class="progress-section">
        <text class="progress-title">📊 开发进度</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: '60%' }">
            <text class="progress-text">60%</text>
          </view>
        </view>
        <text class="progress-desc">已完成 3/5 个阶段</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 跳转到测试页面
function navigateTo(url: string) {
  uni.navigateTo({ url })
}
</script>

<style scoped lang="scss">
.test-center {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f5f7fa 100%);
  padding-bottom: 40rpx;
}

// 顶部标题
.header {
  position: relative;
  padding: 100rpx 40rpx 60rpx;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.9;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.title {
  display: block;
  font-size: 56rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16rpx;
  text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2rpx;
}

// 内容区域
.content {
  padding: 0 30rpx;
  margin-top: -30rpx;
}

// 测试模块
.test-section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.stage-badge {
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  font-size: 22rpx;
  font-weight: bold;
  color: #ffffff;
  margin-right: 16rpx;
  
  &.stage-1 { background: linear-gradient(135deg, #667eea, #764ba2); }
  &.stage-2 { background: linear-gradient(135deg, #f093fb, #f5576c); }
  &.stage-3 { background: linear-gradient(135deg, #4facfe, #00f2fe); }
  &.stage-4 { background: linear-gradient(135deg, #fa709a, #fee140); }
  &.stage-5 { background: linear-gradient(135deg, #30cfd0, #330867); }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

// 测试卡片
.test-cards {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.test-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  
  &:active:not(.disabled) {
    transform: translateY(-4rpx);
    box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.12);
  }
  
  &.disabled {
    opacity: 0.6;
  }
}

.card-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.icon-text {
  font-size: 48rpx;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.card-desc {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
}

.card-arrow {
  margin-left: 16rpx;
}

.disabled-tag {
  padding: 8rpx 20rpx;
  background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
  border-radius: 20rpx;
}

.disabled-text {
  font-size: 22rpx;
  font-weight: bold;
  color: #d63031;
}

// 测试说明
.info-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.info-icon {
  font-size: 36rpx;
  margin-right: 12rpx;
}

.info-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
}

.bullet {
  font-size: 28rpx;
  color: #667eea;
  margin-right: 12rpx;
  font-weight: bold;
}

.info-text {
  flex: 1;
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
}

// 开发进度
.progress-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
}

.progress-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
}

.progress-bar {
  height: 40rpx;
  background: #e0e0e0;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 22rpx;
  font-weight: bold;
  color: #ffffff;
}

.progress-desc {
  display: block;
  font-size: 24rpx;
  color: #999999;
  text-align: center;
}
</style>


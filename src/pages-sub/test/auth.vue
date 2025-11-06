<template>
  <view class="test-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">🔐 认证模块测试</text>
      <text class="page-subtitle">测试微信登录和用户信息查询功能</text>
    </view>

    <!-- 测试项列表 -->
    <view class="test-list">
      <!-- 测试1: 微信登录 -->
      <view class="test-item">
        <view class="test-header">
          <view class="test-number">01</view>
          <view class="test-info">
            <text class="test-title">微信登录测试</text>
            <text class="test-desc">测试用户登录、注册、openid获取</text>
          </view>
        </view>
        
        <button class="test-button primary" @click="testLogin">
          <text>🚀 执行测试</text>
        </button>
        
        <view v-if="loginResult" class="result-box" :class="loginResult.success ? 'success' : 'error'">
          <view class="result-header">
            <text class="result-icon">{{ loginResult.success ? '✅' : '❌' }}</text>
            <text class="result-status">{{ loginResult.success ? '测试通过' : '测试失败' }}</text>
          </view>
          
          <view v-if="loginResult.data" class="result-details">
            <view class="detail-row">
              <text class="detail-label">用户ID:</text>
              <text class="detail-value">{{ loginResult.data.userId }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">昵称:</text>
              <text class="detail-value">{{ loginResult.data.nickName }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">用户类型:</text>
              <text class="detail-value">{{ loginResult.data.userType === 0 ? '教师' : '管理员' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">新用户:</text>
              <text class="detail-value">{{ loginResult.data.isNewUser ? '是' : '否' }}</text>
            </view>
          </view>
          
          <view class="json-box">
            <text class="json-label">完整响应:</text>
            <text class="json-content">{{ JSON.stringify(loginResult, null, 2) }}</text>
          </view>
        </view>
      </view>

      <!-- 测试2: 获取用户信息 -->
      <view class="test-item">
        <view class="test-header">
          <view class="test-number">02</view>
          <view class="test-info">
            <text class="test-title">用户信息查询</text>
            <text class="test-desc">根据用户ID查询详细信息</text>
          </view>
        </view>
        
        <view class="input-group">
          <text class="input-label">用户ID:</text>
          <input
            v-model="testUserId"
            placeholder="登录后自动填充"
            type="number"
            class="input-field"
          />
        </view>
        
        <button class="test-button" @click="testGetUserInfo">
          <text>🔍 查询信息</text>
        </button>
        
        <view v-if="userInfoResult" class="result-box" :class="userInfoResult.success ? 'success' : 'error'">
          <view class="result-header">
            <text class="result-icon">{{ userInfoResult.success ? '✅' : '❌' }}</text>
            <text class="result-status">{{ userInfoResult.success ? '查询成功' : '查询失败' }}</text>
          </view>
          
          <view v-if="userInfoResult.data" class="result-details">
            <view class="detail-row">
              <text class="detail-label">用户ID:</text>
              <text class="detail-value">{{ userInfoResult.data.userId }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">昵称:</text>
              <text class="detail-value">{{ userInfoResult.data.nickName }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">姓名:</text>
              <text class="detail-value">{{ userInfoResult.data.name || '未设置' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">手机:</text>
              <text class="detail-value">{{ userInfoResult.data.phone || '未设置' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">邮箱:</text>
              <text class="detail-value">{{ userInfoResult.data.email || '未设置' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">状态:</text>
              <text class="detail-value">{{ userInfoResult.data.statusName }}</text>
            </view>
          </view>
          
          <view class="json-box">
            <text class="json-label">完整响应:</text>
            <text class="json-content">{{ JSON.stringify(userInfoResult, null, 2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 测试提示 -->
    <view class="tips-box">
      <text class="tips-title">💡 测试提示</text>
      <view class="tips-content">
        <text class="tip-item">• 首次登录会创建新用户记录</text>
        <text class="tip-item">• 再次登录会更新最后访问时间</text>
        <text class="tip-item">• 登录成功后自动填充用户ID</text>
        <text class="tip-item">• 可在云开发控制台查看日志</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login, getUserInfo as getUserInfoFromDB } from '@/utils/db'

// 响应式数据
const loginResult = ref<any>(null)
const userInfoResult = ref<any>(null)
const testUserId = ref<string>('')

/**
 * 测试登录功能 - 使用云数据库
 */
const testLogin = async () => {
  try {
    uni.showLoading({ title: '登录中...' })
    
    // 获取用户信息
    const userInfo = await uni.getUserProfile({
      desc: '用于完善用户资料'
    })
    
    console.log('[TEST] 微信用户信息:', userInfo)
    
    // 调用登录函数
    const res = await login(
      userInfo.userInfo.nickName,
      userInfo.userInfo.avatarUrl
    )
    
    uni.hideLoading()
    
    console.log('[TEST] 登录结果:', res)
    loginResult.value = res
    
    if (res.success) {
      // 保存用户信息
      uni.setStorageSync('userInfo', res.data)
      
      // 自动填充用户ID
      testUserId.value = res.data.userId.toString()
      
      uni.showToast({
        title: res.data.isNewUser ? '注册成功！' : '登录成功！',
        icon: 'success'
      })
    }
    else {
      uni.showToast({
        title: res.message,
        icon: 'none',
        duration: 3000
      })
    }
  }
  catch (error: any) {
    uni.hideLoading()
    console.error('[TEST] 登录失败:', error)
    
    loginResult.value = {
      success: false,
      message: error.message || '登录失败'
    }
    
    uni.showToast({
      title: '登录失败: ' + (error.message || '未知错误'),
      icon: 'none',
      duration: 3000
    })
  }
}

/**
 * 测试获取用户信息 - 使用云数据库
 */
const testGetUserInfo = async () => {
  if (!testUserId.value) {
    uni.showToast({
      title: '请先输入用户ID',
      icon: 'none'
    })
    return
  }
  
  try {
    uni.showLoading({ title: '查询中...' })
    
    // 直接调用 MySQL 查询
    const res = await getUserInfoFromDB(Number.parseInt(testUserId.value))
    
    uni.hideLoading()
    
    console.log('[TEST] 用户信息结果:', res)
    userInfoResult.value = res
    
    if (res.success) {
      uni.showToast({
        title: '查询成功',
        icon: 'success'
      })
    }
    else {
      uni.showToast({
        title: res.message,
        icon: 'none',
        duration: 3000
      })
    }
  }
  catch (error: any) {
    uni.hideLoading()
    console.error('[TEST] 查询失败:', error)
    
    userInfoResult.value = {
      success: false,
      message: error.message || '查询失败'
    }
    
    uni.showToast({
      title: '查询失败: ' + (error.message || '未知错误'),
      icon: 'none',
      duration: 3000
    })
  }
}
</script>

<style scoped lang="scss">
.test-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding: 30rpx;
}

// 页面标题
.page-header {
  text-align: center;
  padding: 40rpx 0;
}

.page-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
}

.page-subtitle {
  display: block;
  font-size: 26rpx;
  color: #999999;
}

// 测试项列表
.test-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.test-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.test-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.test-number {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #ffffff;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.test-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.test-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.test-desc {
  font-size: 24rpx;
  color: #999999;
}

// 输入框
.input-group {
  margin-bottom: 24rpx;
}

.input-label {
  display: block;
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 12rpx;
}

.input-field {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: #f9f9f9;
}

// 测试按钮
.test-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  border: none;
  margin-bottom: 30rpx;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &::after {
    border: none;
  }
}

// 结果框
.result-box {
  border-radius: 16rpx;
  padding: 30rpx;
  
  &.success {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  }
  
  &.error {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  }
}

.result-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.result-icon {
  font-size: 40rpx;
  margin-right: 12rpx;
}

.result-status {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

// 详情展示
.result-details {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-size: 26rpx;
  color: #666666;
}

.detail-value {
  font-size: 26rpx;
  font-weight: bold;
  color: #333333;
}

// JSON展示
.json-box {
  background: #2d2d2d;
  border-radius: 12rpx;
  padding: 20rpx;
}

.json-label {
  display: block;
  font-size: 22rpx;
  color: #aaaaaa;
  margin-bottom: 12rpx;
}

.json-content {
  display: block;
  font-size: 20rpx;
  font-family: 'Courier New', monospace;
  color: #4caf50;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.6;
}

// 测试提示
.tips-box {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-top: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.tips-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 24rpx;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.tip-item {
  display: block;
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
}
</style>

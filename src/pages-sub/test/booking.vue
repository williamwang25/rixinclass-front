<template>
  <view class="test-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">📝 排课申请模块测试</text>
      <text class="page-subtitle">测试创建申请和查询申请功能</text>
    </view>

    <!-- 测试项列表 -->
    <view class="test-list">
      <!-- 测试1: 创建排课申请 -->
      <view class="test-item">
        <view class="test-header">
          <view class="test-number">01</view>
          <view class="test-info">
            <text class="test-title">创建排课申请</text>
            <text class="test-desc">提交一个测试申请</text>
          </view>
        </view>
        
        <button class="test-button primary" @click="testCreateBooking">
          <text>📝 创建测试申请</text>
        </button>
        
        <view v-if="createResult" class="result-box" :class="createResult.success ? 'success' : 'error'">
          <view class="result-header">
            <text class="result-icon">{{ createResult.success ? '✅' : '❌' }}</text>
            <text class="result-status">{{ createResult.success ? '创建成功' : '创建失败' }}</text>
          </view>
          
          <view v-if="createResult.data" class="result-details">
            <view class="detail-row">
              <text class="detail-label">申请编号:</text>
              <text class="detail-value">{{ createResult.data.bookingNo }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">申请ID:</text>
              <text class="detail-value">{{ createResult.data.bookingId }}</text>
            </view>
          </view>
          
          <view class="json-box">
            <text class="json-label">完整响应:</text>
            <text class="json-content">{{ JSON.stringify(createResult, null, 2) }}</text>
          </view>
        </view>
      </view>

      <!-- 测试2: 获取我的申请 -->
      <view class="test-item">
        <view class="test-header">
          <view class="test-number">02</view>
          <view class="test-info">
            <text class="test-title">我的申请列表</text>
            <text class="test-desc">查询当前用户的所有申请</text>
          </view>
        </view>
        
        <view class="input-group">
          <text class="input-label">用户ID:</text>
          <input
            v-model="testUserId"
            placeholder="请输入用户ID（登录后自动填充）"
            type="number"
            class="input-field"
          />
        </view>
        
        <button class="test-button" @click="testGetMyBookings">
          <text>📋 查询我的申请</text>
        </button>
        
        <view v-if="myBookingsResult" class="result-box" :class="myBookingsResult.success ? 'success' : 'error'">
          <view class="result-header">
            <text class="result-icon">{{ myBookingsResult.success ? '✅' : '❌' }}</text>
            <text class="result-status">{{ myBookingsResult.success ? '查询成功' : '查询失败' }}</text>
          </view>
          
          <view v-if="myBookingsResult.data" class="result-details">
            <view class="detail-row">
              <text class="detail-label">申请数量:</text>
              <text class="detail-value">{{ myBookingsResult.total || myBookingsResult.data.length }}</text>
            </view>
            
            <view class="bookings-list">
              <view v-for="(booking, index) in myBookingsResult.data.slice(0, 2)" :key="index" class="booking-card">
                <view class="booking-header">
                  <text class="booking-no">{{ booking.booking_no }}</text>
                  <text class="booking-status" :class="'status-' + booking.status">
                    {{ ['待审', '通过', '拒绝', '取消'][booking.status] }}
                  </text>
                </view>
                <text class="booking-course">{{ booking.course_name }}</text>
                <text class="booking-info">{{ booking.class_name }} · {{ booking.student_count }}人</text>
              </view>
              <text v-if="myBookingsResult.data.length > 2" class="more-text">... 还有 {{ myBookingsResult.data.length - 2 }} 个申请</text>
            </view>
          </view>
          
          <view class="json-box">
            <text class="json-label">完整响应:</text>
            <text class="json-content">{{ JSON.stringify(myBookingsResult, null, 2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 测试提示 -->
    <view class="tips-box">
      <text class="tips-title">💡 测试提示</text>
      <view class="tips-content">
        <text class="tip-item">• 创建申请会提交测试数据</text>
        <text class="tip-item">• 用户ID从本地存储自动获取</text>
        <text class="tip-item">• 查看云开发控制台验证数据</text>
        <text class="tip-item">• 申请状态：0待审 1通过 2拒绝 3取消</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 响应式数据
const createResult = ref<any>(null)
const myBookingsResult = ref<any>(null)
const testUserId = ref<string>('')
const statusIndex = ref<number>(0)
const statusOptions = [
  { label: '全部', value: null },
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 },
  { label: '已取消', value: 3 }
]

// 从本地存储获取用户ID
onMounted(() => {
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo && userInfo.userId) {
    testUserId.value = userInfo.userId.toString()
  }
})

/**
 * 测试创建排课申请
 */
const testCreateBooking = async () => {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo || !userInfo.userId) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    
    uni.showLoading({ title: '提交中...' })
    
    // 调用云函数创建申请
    const res = await wx.cloud.callFunction({
      name: 'createBooking',
      data: {
        userId: userInfo.userId,
        academicYear: '2025-2026',
        semester: '第一学期',
        courseCode: 'TEST001',
        courseType: '实验教学',
        courseName: '测试课程',
        requiredHours: 32,
        bookingHours: 32,
        className: '测试班级',
        studentCount: 45,
        timeSlots: [
          {
            weekday: 1,
            weekStart: 1,
            weekEnd: 16,
            periodStart: 3,
            periodEnd: 4
          }
        ],
        softwareRequirements: 'Adobe Photoshop 2020',
        otherRequirements: '这是一个测试申请',
        teacherName: userInfo.name || userInfo.nickName,
        teacherPhone: userInfo.phone || '13800138000',
        teacherEmail: userInfo.email || 'test@bjut.edu.cn',
        teacherSignature: ''
      }
    }) as any
    
    uni.hideLoading()
    
    console.log('[TEST] 创建结果:', res)
    createResult.value = res.result
    
    if (res.result.success) {
      uni.showToast({
        title: '提交成功！',
        icon: 'success'
      })
    }
    else {
      uni.showToast({
        title: res.result.message,
        icon: 'none',
        duration: 3000
      })
    }
  }
  catch (error: any) {
    uni.hideLoading()
    console.error('[TEST] 创建失败:', error)
    
    createResult.value = {
      success: false,
      message: error.message || '创建失败'
    }
    
    uni.showToast({
      title: '创建失败: ' + (error.message || '未知错误'),
      icon: 'none',
      duration: 3000
    })
  }
}

/**
 * 测试获取我的申请
 */
const testGetMyBookings = async () => {
  if (!testUserId.value) {
    uni.showToast({
      title: '请先输入用户ID',
      icon: 'none'
    })
    return
  }
  
  try {
    uni.showLoading({ title: '查询中...' })
    
    const res = await wx.cloud.callFunction({
      name: 'getMyBookings',
      data: {
        userId: Number.parseInt(testUserId.value),
        pageNum: 1,
        pageSize: 10
      }
    }) as any
    
    uni.hideLoading()
    
    console.log('[TEST] 我的申请结果:', res)
    myBookingsResult.value = res.result
    
    if (res.result.success) {
      uni.showToast({
        title: `查询成功，共${res.result.total}条申请`,
        icon: 'success'
      })
    }
    else {
      uni.showToast({
        title: res.result.message,
        icon: 'none',
        duration: 3000
      })
    }
  }
  catch (error: any) {
    uni.hideLoading()
    console.error('[TEST] 查询失败:', error)
    
    myBookingsResult.value = {
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
// 页面样式
.test-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
  padding: 30rpx;
}

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
  background: linear-gradient(135deg, #4facfe, #00f2fe);
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

.test-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
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
    background: linear-gradient(135deg, #4facfe, #00f2fe);
  }
  
  &::after {
    border: none;
  }
}

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

// 额外样式
.picker {
  height: 80rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  background: #f9f9f9;
}

.bookings-list {
  margin-top: 20rpx;
}

.booking-card {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.booking-no {
  font-size: 24rpx;
  color: #666666;
}

.booking-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-weight: bold;
  
  &.status-0 {
    background: #fff3cd;
    color: #856404;
  }
  
  &.status-1 {
    background: #d4edda;
    color: #155724;
  }
  
  &.status-2 {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.status-3 {
    background: #e2e3e5;
    color: #383d41;
  }
}

.booking-course {
  display: block;
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.booking-info {
  display: block;
  font-size: 24rpx;
  color: #666666;
}

.more-text {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999999;
  margin-top: 16rpx;
}
</style>


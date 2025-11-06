<template>
  <view class="test-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">🏫 实验室模块测试</text>
      <text class="page-subtitle">测试实验室列表和详情查询功能</text>
    </view>

    <!-- 测试项列表 -->
    <view class="test-list">
      <!-- 测试1: 获取实验室列表 -->
      <view class="test-item">
        <view class="test-header">
          <view class="test-number">01</view>
          <view class="test-info">
            <text class="test-title">实验室列表查询</text>
            <text class="test-desc">查询所有可用的实验室</text>
          </view>
        </view>
        
        <view class="input-group">
          <text class="input-label">状态筛选（可选）:</text>
          <picker @change="onStatusChange" :value="statusIndex" :range="statusOptions" range-key="label">
            <view class="picker">
              <text>{{ statusOptions[statusIndex].label }}</text>
            </view>
          </picker>
        </view>
        
        <button class="test-button primary" @click="testGetLabList">
          <text>🔍 查询列表</text>
        </button>
        
        <view v-if="labListResult" class="result-box" :class="labListResult.success ? 'success' : 'error'">
          <view class="result-header">
            <text class="result-icon">{{ labListResult.success ? '✅' : '❌' }}</text>
            <text class="result-status">{{ labListResult.success ? '查询成功' : '查询失败' }}</text>
          </view>
          
          <view v-if="labListResult.data" class="result-details">
            <view class="detail-row">
              <text class="detail-label">实验室数量:</text>
              <text class="detail-value">{{ labListResult.total || labListResult.data.length }}</text>
            </view>
            
            <view class="labs-list">
              <view v-for="(lab, index) in labListResult.data.slice(0, 3)" :key="index" class="lab-card">
                <view class="lab-header">
                  <text class="lab-room">{{ lab.lab_room }}</text>
                  <text class="lab-name">{{ lab.lab_name }}</text>
                </view>
                <view class="lab-info">
                  <text class="lab-text">📍 {{ lab.building }} {{ lab.floor }}楼</text>
                  <text class="lab-text">👥 容量: {{ lab.capacity }}人</text>
                  <text class="lab-text">📊 状态: {{ lab.status === 1 ? '正常' : '维护' }}</text>
                </view>
              </view>
              <text v-if="labListResult.data.length > 3" class="more-text">... 还有 {{ labListResult.data.length - 3 }} 个实验室</text>
            </view>
          </view>
          
          <view class="json-box">
            <text class="json-label">完整响应:</text>
            <text class="json-content">{{ JSON.stringify(labListResult, null, 2) }}</text>
          </view>
        </view>
      </view>

      <!-- 测试2: 获取实验室详情 -->
      <view class="test-item">
        <view class="test-header">
          <view class="test-number">02</view>
          <view class="test-info">
            <text class="test-title">实验室详情查询</text>
            <text class="test-desc">查询指定实验室的详细信息</text>
          </view>
        </view>
        
        <view class="input-group">
          <text class="input-label">实验室ID:</text>
          <input
            v-model="testLabId"
            placeholder="输入实验室ID（列表查询后自动填充）"
            type="number"
            class="input-field"
          />
        </view>
        
        <button class="test-button" @click="testGetLabDetail">
          <text>🔍 查询详情</text>
        </button>
        
        <view v-if="labDetailResult" class="result-box" :class="labDetailResult.success ? 'success' : 'error'">
          <view class="result-header">
            <text class="result-icon">{{ labDetailResult.success ? '✅' : '❌' }}</text>
            <text class="result-status">{{ labDetailResult.success ? '查询成功' : '查询失败' }}</text>
          </view>
          
          <view v-if="labDetailResult.data" class="result-details">
            <view class="detail-row">
              <text class="detail-label">实验室:</text>
              <text class="detail-value">{{ labDetailResult.data.lab_room }} {{ labDetailResult.data.lab_name }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">位置:</text>
              <text class="detail-value">{{ labDetailResult.data.building }} {{ labDetailResult.data.floor }}楼</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">容量:</text>
              <text class="detail-value">{{ labDetailResult.data.capacity }}人</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">负责人:</text>
              <text class="detail-value">{{ labDetailResult.data.lab_admin || '未设置' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">状态:</text>
              <text class="detail-value">{{ labDetailResult.data.status === 1 ? '正常' : '维护' }}</text>
            </view>
          </view>
          
          <view class="json-box">
            <text class="json-label">完整响应:</text>
            <text class="json-content">{{ JSON.stringify(labDetailResult, null, 2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 测试提示 -->
    <view class="tips-box">
      <text class="tips-title">💡 测试提示</text>
      <view class="tips-content">
        <text class="tip-item">• 先查询列表，获取实验室ID</text>
        <text class="tip-item">• 再查询详情，查看完整信息</text>
        <text class="tip-item">• 可通过状态筛选实验室</text>
        <text class="tip-item">• 查看云函数日志了解执行情况</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getLabList, getLabDetail } from '@/utils/db'

// 响应式数据
const labListResult = ref<any>(null)
const labDetailResult = ref<any>(null)
const testLabId = ref<string>('')
const statusIndex = ref<number>(0)
const statusOptions = [
  { label: '全部', value: null },
  { label: '正常', value: 1 },
  { label: '维护', value: 0 },
  { label: '停用', value: 2 }
]

/**
 * 状态选择变更
 */
const onStatusChange = (e: any) => {
  statusIndex.value = e.detail.value
}

/**
 * 测试获取实验室列表
 */
const testGetLabList = async () => {
  try {
    uni.showLoading({ title: '查询中...' })
    
    const status = statusOptions[statusIndex.value].value
    const res = await getLabList(status)
    
    uni.hideLoading()
    
    console.log('[TEST] 实验室列表结果:', res)
    labListResult.value = res
    
    if (res.success && res.data && res.data.length > 0) {
      // 自动填充第一个实验室ID
      testLabId.value = res.data[0].lab_id.toString()
      
      uni.showToast({
        title: `查询成功，共${res.data.length}个实验室`,
        icon: 'success'
      })
    }
    else {
      uni.showToast({
        title: res.message || '查询失败',
        icon: 'none',
        duration: 3000
      })
    }
  }
  catch (error: any) {
    uni.hideLoading()
    console.error('[TEST] 查询失败:', error)
    
    labListResult.value = {
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

/**
 * 测试获取实验室详情
 */
const testGetLabDetail = async () => {
  if (!testLabId.value) {
    uni.showToast({
      title: '请先输入实验室ID',
      icon: 'none'
    })
    return
  }
  
  try {
    uni.showLoading({ title: '查询中...' })
    
    const res = await getLabDetail(Number.parseInt(testLabId.value))
    
    uni.hideLoading()
    
    console.log('[TEST] 实验室详情结果:', res)
    labDetailResult.value = res
    
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
    
    labDetailResult.value = {
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
  background: linear-gradient(135deg, #f093fb, #f5576c);
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
  background: linear-gradient(135deg, #f093fb, #f5576c);
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
    background: linear-gradient(135deg, #f093fb, #f5576c);
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

.labs-list {
  margin-top: 20rpx;
}

.lab-card {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.lab-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.lab-room {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 24rpx;
  font-weight: bold;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 12rpx;
}

.lab-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333333;
}

.lab-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.lab-text {
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


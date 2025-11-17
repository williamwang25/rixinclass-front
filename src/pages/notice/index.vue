<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getMyMessages, markMessageRead } from '@/utils/db'
import { useUserStore } from '@/store/user'
import { formatTime } from '@/utils/format'

definePage({
  style: {
    navigationBarTitleText: '通知中心',
    navigationBarBackgroundColor: '#0096C2',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f5f7fa',
    onReachBottomDistance: 50,
  },
})

const userStore = useUserStore()

// 导航栏配置
const navBarConfig = ref({
  title: '通知中心',
  frontColor: '#ffffff' as '#ffffff' | '#000000',
  backgroundColor: '#0096C2',
})

// 消息列表
const messages = ref<any[]>([])
const loading = ref(true)
const unreadCount = ref(0)

// scroll-view 刷新状态
const refreshing = ref(false)

// 当前筛选（0=未读，1=已读，null=全部）
const filterRead = ref<number | null>(null)

// 切换筛选
function switchFilter(isRead: number | null) {
  filterRead.value = isRead
  loadMessages()
}

// 加载消息列表
async function loadMessages(isRefresh = false) {
  loading.value = true
  try {
    console.log('[通知页] 开始加载消息', { isRefresh })
    const userId = userStore.userId
    if (!userId) {
      console.log('[通知页] 用户未登录')
      if (isRefresh) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
      }
      return
    }
    
    const res = await getMyMessages(userId)
    console.log('[通知页] 消息加载结果:', res)
    
    if (res.success) {
      messages.value = res.data
      // 统计未读数量
      unreadCount.value = messages.value.filter((m: any) => m.is_read === 0).length
      
      // 刷新成功（不显示提示）
      if (isRefresh) {
        console.log('[通知页] 刷新成功')
      }
    } else {
      throw new Error(res.message || '加载失败')
    }
  } catch (error: any) {
    console.error('[通知页] 加载消息失败:', error)
    
    // 刷新时显示错误提示
    if (isRefresh) {
      uni.showToast({
        title: error.message || '刷新失败',
        icon: 'none',
        duration: 2000
      })
    }
  } finally {
    loading.value = false
    console.log('[通知页] 消息加载完成')
  }
}

// 查看详情并标记已读
async function viewDetail(message: any) {
  // 标记为已读
  if (message.is_read === 0) {
    const res = await markMessageRead(message.message_id)
    if (res.success) {
      message.is_read = 1
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }
  
  // 显示消息详情
  uni.showModal({
    title: message.message_type,
    content: message.content,
    showCancel: false,
    confirmText: '知道了'
  })
}

// 标记全部已读
async function markAllRead() {
  try {
    const userId = userStore.userId
    if (!userId) return
    
    const res = await markMessageRead(undefined, userId)
    if (res.success) {
      uni.showToast({ title: '已全部标记为已读', icon: 'success' })
      loadMessages()
    }
  } catch (error: any) {
    console.error('标记失败:', error)
  }
}

// 格式化消息类型图标
function getMessageIcon(type: string) {
  const iconMap: any = {
    '审核结果': 'checkmark-circle',
    '排课通知': 'calendar',
    '管理员消息': 'chatbubble',
    '系统通知': 'notifications'
  }
  return iconMap[type] || 'mail'
}

// scroll-view 滚动事件
function onScroll(e: any) {
  console.log('[通知页] scroll-view 滚动:', e.detail)
}

// scroll-view 下拉刷新
function onRefresh() {
  console.log('[通知页] scroll-view 触发下拉刷新')
  refreshing.value = true
  
  loadMessages(true)
    .then(() => {
      console.log('[通知页] 刷新数据成功')
    })
    .catch((error) => {
      console.error('[通知页] 刷新数据失败:', error)
    })
    .finally(() => {
      // 延迟停止刷新，确保动画流畅
      setTimeout(() => {
        refreshing.value = false
        console.log('[通知页] 停止刷新动画')
      }, 300)
    })
}

// scroll-view 刷新恢复
function onRestore() {
  console.log('[通知页] 刷新恢复')
  refreshing.value = false
}

// 格式化消息类型颜色
function getMessageColor(type: string) {
  const colorMap: any = {
    '审核结果': '#f56c6c',
    '排课通知': '#67c23a',
    '管理员消息': '#0096C2',
    '系统通知': '#e6a23c'
  }
  return colorMap[type] || '#909399'
}

onMounted(() => {
  loadMessages(false)
})
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
    <scroll-view 
      scroll-y
      class="scroll-container"
      :refresher-enabled="true"
      :refresher-triggered="refreshing"
      :refresher-threshold="45"
      refresher-background="#f5f7fa"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @scroll="onScroll"
    >
      <!-- 筛选栏 -->
      <view class="filter-bar">
        <view class="filter-tabs">
          <view 
            class="tab-item" 
            :class="{ active: filterRead === null }"
            @click="switchFilter(null)"
          >
            <text>全部</text>
            <text v-if="messages.length > 0" class="tab-count">{{ messages.length }}</text>
          </view>
          <view 
            class="tab-item" 
            :class="{ active: filterRead === 0 }"
            @click="switchFilter(0)"
          >
            <text>未读</text>
            <text v-if="unreadCount > 0" class="tab-badge">{{ unreadCount }}</text>
          </view>
          <view 
            class="tab-item" 
            :class="{ active: filterRead === 1 }"
            @click="switchFilter(1)"
          >
            <text>已读</text>
          </view>
        </view>
        
        <view v-if="unreadCount > 0" class="mark-all-btn" @click="markAllRead">
          <u-icon name="checkmark-done" size="18" color="#0096C2" />
          <text>全部已读</text>
        </view>
      </view>

      <!-- 消息列表 -->
      <view v-if="loading" class="loading-wrapper">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="messages.length > 0" class="message-list">
        <view
          v-for="message in messages"
          :key="message.message_id"
          class="message-item"
          :class="{ unread: message.is_read === 0 }"
          @click="viewDetail(message)"
        >
          <view class="message-icon" :style="{ backgroundColor: `${getMessageColor(message.message_type)}20` }">
            <u-icon name="bell" size="18" :color="getMessageColor(message.message_type)" />
          </view>

          <view class="message-content">
            <view class="message-header">
              <text class="message-type">{{ message.message_type }}</text>
              <text class="message-time">{{ formatTime(message.create_time) }}</text>
            </view>

            <text class="message-text">{{ message.content }}</text>
          </view>

          <view v-if="message.is_read === 0" class="unread-dot" />
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state">
        <u-icon name="email" size="40" color="#cccccc" />
        <text class="empty-text">暂无消息</text>
      </view>

      <!-- 底部安全距离 -->
      <view class="safe-area-bottom" />
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  height: 100vh;
  background-color: #f5f7fa;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.scroll-container {
  height: 100%;
  width: 100%;
}

// 筛选栏
.filter-bar {
  background: #fff;
  padding: 24rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f0f0f0;
}

.filter-tabs {
  display: flex;
  gap: 24rpx;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
  transition: all 0.3s;
  
  &.active {
    background: #0096C2;
    color: #fff;
    
    .tab-badge, .tab-count {
      background: #fff;
      color: #0096C2;
    }
  }
}

.tab-count {
  font-size: 22rpx;
  color: #999;
}

.tab-badge {
  min-width: 32rpx;
  height: 32rpx;
  background: #ff4d4f;
  color: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  padding: 0 8rpx;
}

.mark-all-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #0096C2;
  padding: 8rpx 16rpx;
}

// 消息列表
.loading-wrapper {
  padding: 80rpx;
  text-align: center;
  color: #999;
}

.message-list {
  padding: 20rpx;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 30rpx 24rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  position: relative;

  &:active {
    transform: scale(0.98);
  }

  &.unread {
    border-left: 6rpx solid #0096C2;
  }
}

.message-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
  font-size: 36rpx;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.message-type {
  font-size: 26rpx;
  font-weight: 600;
  color: #0096C2;
}

.message-time {
  font-size: 22rpx;
  color: #999;
}

.message-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
}

.unread-dot {
  position: absolute;
  top: 30rpx;
  right: 24rpx;
  width: 16rpx;
  height: 16rpx;
  background: #ff4d4f;
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
  height: 200rpx;  // 增加高度确保可以滚动
}
</style>

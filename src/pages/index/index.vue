<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'
import { getNoticeList } from '@/utils/db'

defineOptions({
  name: 'HomeStyle3',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '日新智课',
    backgroundColor: '#f5f7fa',
    onReachBottomDistance: 50,
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
const notices = ref<any[]>([])
const loadingNotices = ref(true)

// scroll-view 刷新状态
const refreshing = ref(false)

// 加载公告
async function loadNotices(isRefresh = false) {
  loadingNotices.value = true
  try {
    console.log('[首页] 开始加载公告', { isRefresh })
    const res = await getNoticeList()
    
    if (res.success) {
      notices.value = res.data.slice(0, 5)  // 只显示前5条
      
      // 只在非刷新时检查新公告（避免重复弹窗）
      if (!isRefresh) {
        checkNewNotices(res.data)
      }
      
      // 刷新成功（不显示提示）
      if (isRefresh) {
        console.log('[首页] 刷新成功')
      }
    } else {
      throw new Error(res.message || '加载失败')
    }
  } catch (error: any) {
    console.error('[首页] 加载公告失败:', error)
    
    // 刷新时显示错误提示
    if (isRefresh) {
      uni.showToast({
        title: error.message || '刷新失败',
        icon: 'none',
        duration: 2000
      })
    }
    
    // 如果是首次加载且失败，使用默认数据
    if (notices.value.length === 0) {
      notices.value = [
        { title: '关于2024-2025学年第二学期实验室排课的通知', create_time: '2024-10-08' },
        { title: '实验室设备维护通知', create_time: '2024-10-05' },
      ]
    }
  } finally {
    loadingNotices.value = false
    console.log('[首页] 公告加载完成')
  }
}

// 检查新公告并弹窗提醒
function checkNewNotices(allNotices: any[]) {
  if (!allNotices || allNotices.length === 0) return
  
  // 获取本地存储的最后查看时间
  const lastViewTime = uni.getStorageSync('last_notice_view_time') || 0
  
  // 找出最新发布的公告（按publish_time排序）
  const latestNotice = allNotices
    .filter(n => n.publish_time && new Date(n.publish_time).getTime() > lastViewTime)
    .sort((a, b) => new Date(b.publish_time).getTime() - new Date(a.publish_time).getTime())[0]
  
  if (latestNotice) {
    // 显示弹窗
    showNoticeDialog(latestNotice)
    
    // 更新最后查看时间
    uni.setStorageSync('last_notice_view_time', new Date(latestNotice.publish_time).getTime())
  }
}

// 显示公告弹窗
function showNoticeDialog(notice: any) {
  // 检查内容中是否包含"申请"关键词
  const hasApplyKeyword = notice.content && notice.content.includes('申请')
  
  if (hasApplyKeyword) {
    // 包含"申请"关键词，显示带跳转按钮的弹窗
    uni.showModal({
      title: notice.title,
      content: notice.content || '暂无详细内容',
      showCancel: true,
      cancelText: '知道了',
      confirmText: '去申请',
      success: (res) => {
        if (res.confirm) {
          // 跳转到申请页面
          uni.navigateTo({ url: '/pages-sub/apply/index' })
        }
      }
    })
  } else {
    // 不包含关键词，显示普通弹窗
    uni.showModal({
      title: notice.title,
      content: notice.content || '暂无详细内容',
      showCancel: false,
      confirmText: '知道了'
    })
  }
}

// 查看公告详情
function viewNotice(notice: any) {
  showNoticeDialog(notice)
}

// 格式化公告日期为中文格式
function formatNoticeDate(dateString: string): string {
  if (!dateString) return ''
  
  try {
    // 处理各种可能的日期格式
    let dateStr = String(dateString).trim()
    
    // 如果是时间戳（纯数字）
    if (/^\d+$/.test(dateStr)) {
      dateStr = parseInt(dateStr) < 10000000000 
        ? String(parseInt(dateStr) * 1000)  // 秒级时间戳转毫秒
        : dateStr
    }
    
    // 创建 Date 对象
    const date = new Date(dateStr)
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return ''
    }
    
    // 手动提取年月日，确保在所有设备上一致
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    // 验证提取的值是否有效
    if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
      console.warn('[首页] 日期值超出合理范围:', { year, month, day })
      return ''
    }
    
    return `${year}年${month}月${day}日`
  } catch (error) {
    console.error('[首页] 日期格式化失败:', error, dateString)
    return ''
  }
}

// 常用功能
const quickActions = [
  { name: '使用指南', icon: 'info-circle', url: '/pages-sub/guide/index' },
  { name: '常见问题', icon: 'question-circle', url: '/pages-sub/faq/index' },
  { name: '意见反馈', icon: 'chat', url: '/pages-sub/feedback/index' },
  { name: '教师信息', icon: 'account', url: '/pages/me/me?action=edit' },
]

// 跳转页面
function navigateTo(url: string) {
  
  if (!url) {
    uni.showToast({ title: '功能开发中', icon: 'none' })
    return
  }
  
  // Tabbar 页面列表
  const tabbarPages = [
    '/pages/index/index',
    '/pages/notice/index',
    '/pages/me/me'
  ]
  
  // 提取 URL 路径（去除参数）
  const path = url.split('?')[0]
  
  // 判断是否为 tabbar 页面
  if (tabbarPages.includes(path)) {
    // Tabbar 页面使用 switchTab（不支持参数）
    if (url.includes('?')) {
      // 如果有参数，先切换到 tabbar 页面
      uni.switchTab({ 
        url: path,
        success: () => {
          // 切换成功后，通过事件传递参数
          if (path === '/pages/me/me' && url.includes('action=edit')) {
            // 使用全局事件触发编辑窗口
            uni.$emit('openEditDialog')
          }
        },
        fail: (err) => {
        }
      })
    } else {
      uni.switchTab({ 
        url: path,
        success: () => {
        },
        fail: (err) => {
        }
      })
    }
  } else {
    // 普通页面使用 navigateTo
    uni.navigateTo({ 
      url,
      success: () => {
      },
      fail: (err) => {
      }
    })
  }
}

// scroll-view 滚动事件
function onScroll(e: any) {
}

// scroll-view 下拉刷新
function onRefresh() {
  refreshing.value = true
  
  loadNotices(true)
    .then(() => {
      console.log('[首页] 刷新数据成功')
    })
    .catch((error) => {
      console.error('[首页] 刷新数据失败:', error)
    })
    .finally(() => {
      // 延迟停止刷新，确保动画流畅
      setTimeout(() => {
        refreshing.value = false
      }, 300)
    })
}

// scroll-view 刷新恢复
function onRestore() {
  refreshing.value = false
}

onMounted(() => {
  loadNotices(false)
})
</script>

<template>
  <view class="page-container" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
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
            <text class="more-link" @click="navigateTo('/pages/notice/index')">更多</text>
          </view>
          <view v-if="loadingNotices" class="loading-wrapper">
            <text>加载中...</text>
          </view>
          <view v-else-if="notices.length > 0" class="notice-list">
            <view
              v-for="notice in notices"
              :key="notice.notice_id"
              class="notice-item"
              @click="viewNotice(notice)"
            >
              <view class="notice-dot" :class="{ important: notice.priority === 1 }" />
              <view class="notice-content">
                <text class="notice-title">{{ notice.title }}</text>
                <text class="notice-time">{{ formatNoticeDate(notice.create_time) }}</text>
              </view>
            </view>
          </view>
          <view v-else class="empty-notice">
            <text>暂无公告</text>
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
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.scroll-container {
  height: 100%;
  width: 100%;
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
  min-height: calc(100vh - 250rpx);  // 确保内容高度大于 scroll-view
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
  
  &.important {
    background-color: #f56c6c;
  }
}

.loading-wrapper, .empty-notice {
  padding: 40rpx;
  text-align: center;
  color: #999;
  font-size: 26rpx;
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

// 底部空白
.bottom-space {
  height: 200rpx;  // 增加高度确保可以滚动
}
</style>

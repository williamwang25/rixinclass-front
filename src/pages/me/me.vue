<script lang="ts" setup>
import type { IUploadSuccessInfo } from '@/api/types/login'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'
import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import { useUpload } from '@/utils/uploadFile'
import { getMyBookings } from '@/utils/db'

definePage({
  style: {
    navigationStyle: 'custom',
    backgroundColor: '#f5f7fa',
    onReachBottomDistance: 50,
  },
})

// 导航栏配置
const navBarConfig = ref({
  title: '我的',
  frontColor: '#ffffff' as '#ffffff' | '#000000',
  backgroundColor: '#0096C2',
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
// 使用storeToRefs解构userInfo
const { userInfo } = storeToRefs(userStore)

// 统计数据
const stats = ref({
  pending: 0,    // 待审核
  approved: 0,   // 已通过
  rejected: 0,   // 已拒绝
  scheduled: 0   // 已排课
})

// scroll-view 刷新状态
const refreshing = ref(false)

// 加载统计数据
async function loadStats(isRefresh = false) {
  try {
    console.log('[我的页面] 开始加载统计数据', { isRefresh })
    const userId = userStore.userId
    if (!userId) {
      console.log('[我的页面] 用户未登录')
      if (isRefresh) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
      }
      return
    }
    
    const res = await getMyBookings({ userId })
    console.log('[我的页面] 统计数据加载结果:', res)
    
    if (res.success && res.data) {
      const bookings = res.data
      stats.value.pending = bookings.filter((b: any) => b.status === 0).length
      stats.value.approved = bookings.filter((b: any) => b.status === 1).length
      stats.value.rejected = bookings.filter((b: any) => b.status === 2).length
      stats.value.scheduled = bookings.filter((b: any) => b.is_scheduled === 1).length
      
      // 刷新成功（不显示提示）
      if (isRefresh) {
        console.log('[我的页面] 刷新成功')
      }
    } else {
      throw new Error(res.message || '加载失败')
    }
  } catch (error: any) {
    console.error('[我的页面] 加载统计数据失败:', error)
    
    // 刷新时显示错误提示
    if (isRefresh) {
      uni.showToast({
        title: error.message || '刷新失败',
        icon: 'none',
        duration: 2000
      })
    }
  } finally {
    console.log('[我的页面] 统计数据加载完成')
  }
}

// 功能菜单
const menuList = ref([
  {
    title: '我的申请',
    items: [
      {
        icon: 'edit-pen',
        name: '排课申请',
        desc: '提交新的排课申请',
        url: '/pages-sub/apply/index',
        color: '#0096C2',
      },
      {
        icon: 'search',
        name: '申请查询',
        desc: '查看申请审核进度',
        url: '/pages-sub/query/index',
        color: '#0078A8',
      },
      {
        icon: 'file-text',
        name: '历史记录',
        desc: '查看往年排课记录',
        url: '/pages-sub/record/index',
        color: '#006B8F',
      },
    ],
  },
  {
    title: '帮助与反馈',
    items: [
      {
        icon: 'book',
        name: '使用指南',
        desc: '了解系统使用方法',
        url: '/pages-sub/guide/index',
        color: '#52c41a',
      },
      {
        icon: 'question-circle',
        name: '常见问题',
        desc: '快速解答疑惑',
        url: '/pages-sub/faq/index',
        color: '#faad14',
      },
      {
        icon: 'chat',
        name: '意见反馈',
        desc: '提出您的宝贵意见',
        url: '/pages-sub/feedback/index',
        color: '#ff6b6b',
      },
    ],
  },
  {
    title: '关于',
    items: [
      {
        icon: 'info-circle',
        name: '关于我们',
        desc: '了解开发团队',
        url: '/pages-sub/about/index',
        color: '#722ed1',
      },
    ],
  },
])

// #ifndef MP-WEIXIN
// 上传头像
const { run: uploadAvatar } = useUpload<IUploadSuccessInfo>(
  '/upload',
  {},
  {
    onSuccess: (res) => {
      console.log('h5头像上传成功', res)
      useUserStore().setUserAvatar(res.url)
    },
  },
)
// #endif

// scroll-view 下拉刷新
function onRefresh() {
  console.log('[我的页面] scroll-view 触发下拉刷新')
  refreshing.value = true
  
  loadStats(true)
    .then(() => {
      console.log('[我的页面] 刷新数据成功')
    })
    .catch((error) => {
      console.error('[我的页面] 刷新数据失败:', error)
    })
    .finally(() => {
      // 延迟停止刷新，确保动画流畅
      setTimeout(() => {
        refreshing.value = false
        console.log('[我的页面] 停止刷新动画')
      }, 300)
    })
}

// scroll-view 刷新恢复
function onRestore() {
  console.log('[我的页面] 刷新恢复')
  refreshing.value = false
}

// 微信小程序下登录
async function handleLogin() {
  // #ifdef MP-WEIXIN
  // 微信登录
  await tokenStore.wxLogin()
  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent('/pages/me/me')}`,
  })
  // #endif
}

// #ifdef MP-WEIXIN
// 微信小程序下选择头像事件
function onChooseAvatar(e: any) {
  console.log('选择头像', e.detail)
  const { avatarUrl } = e.detail
  const { run } = useUpload<IUploadSuccessInfo>(
    '/upload',
    {},
    {
      onSuccess: (res) => {
        console.log('wx头像上传成功', res)
        useUserStore().setUserAvatar(res.url)
      },
    },
    avatarUrl,
  )
  run()
}
// #endif

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    confirmColor: '#0096C2',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useTokenStore().logout()
        // 执行退出登录逻辑
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
      }
    },
  })
}

// 跳转页面
function navigateTo(url: string) {
  if (url) {
    uni.navigateTo({ url })
  }
}

// 编辑个人信息
const showEditDialog = ref(false)
const editForm = ref({
  nickName: '',
  teacherName: '',
  teacherPhone: '',
  teacherEmail: '',
})

// 页面加载
function onLoad(options: any) {
  console.log('[我的页面] 页面加载参数:', options)
  
  // 如果有 action=edit 参数，自动打开编辑窗口
  if (options?.action === 'edit') {
    // 延迟打开，确保页面渲染完成
    setTimeout(() => {
      openEditDialog()
    }, 500)
  }
}

onMounted(() => {
  loadStats()
  
  // 监听全局事件，用于从其他页面触发编辑窗口
  uni.$on('openEditDialog', () => {
    console.log('[我的页面] 收到打开编辑窗口事件')
    setTimeout(() => {
      openEditDialog()
    }, 300)
  })
})

// 页面卸载时移除事件监听
onUnmounted(() => {
  uni.$off('openEditDialog')
})

// 暴露给页面生命周期
defineExpose({
  onLoad
})

function openEditDialog() {
  editForm.value = {
    nickName: userInfo.value.username || '',
    teacherName: userInfo.value.teacherName || '',
    teacherPhone: userInfo.value.teacherPhone || '',
    teacherEmail: userInfo.value.teacherEmail || '',
  }
  showEditDialog.value = true
}

async function saveUserInfo() {
  // 验证
  if (!editForm.value.nickName || !editForm.value.nickName.trim()) {
    uni.showToast({ title: '请填写昵称', icon: 'none' })
    return
  }
  if (!editForm.value.teacherName) {
    uni.showToast({ title: '请填写姓名', icon: 'none' })
    return
  }
  if (!editForm.value.teacherPhone) {
    uni.showToast({ title: '请填写电话', icon: 'none' })
    return
  }
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(editForm.value.teacherPhone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (editForm.value.teacherEmail) {
    const emailReg = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    if (!emailReg.test(editForm.value.teacherEmail)) {
      uni.showToast({ title: '请输入正确的邮箱', icon: 'none' })
      return
    }
  }

  try {
    uni.showLoading({ title: '保存中...' })
    
    // 调用云函数更新数据库
    const res = await wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        userId: userStore.userId,
        nickName: editForm.value.nickName,
        name: editForm.value.teacherName,
        phone: editForm.value.teacherPhone,
        email: editForm.value.teacherEmail || null
      }
    })
    
    console.log('[saveUserInfo] 云函数返回:', res)
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '保存失败')
    }
    
    // 保存到本地 store
    userStore.setUserInfo({
      ...userInfo.value,
      username: editForm.value.nickName,
      teacherName: editForm.value.teacherName,
      teacherPhone: editForm.value.teacherPhone,
      teacherEmail: editForm.value.teacherEmail,
    })

    showEditDialog.value = false
    uni.hideLoading()
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (error) {
    console.error('[saveUserInfo] 保存失败:', error)
    uni.hideLoading()
    uni.showToast({ title: '保存失败: ' + error.message, icon: 'none' })
  }
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
    <!-- 顶部背景 -->
    <view class="header-bg">
      <image
        src="/static/school/schoolbg-1920x1084.jpg"
        mode="aspectFill"
        class="bg-image"
      />
    </view>

    <scroll-view 
      scroll-y 
      class="scroll-container"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
    >
      <!-- 顶部安全距离，避免与下拉刷新冲突 -->
      <view class="top-safe-area" />
      
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view v-if="!tokenStore.hasLogin" class="login-placeholder">
          <view class="avatar-placeholder">
            <u-icon name="account" size="48" color="#cccccc" />
          </view>
          <view class="login-info">
            <text class="login-title">您还未登录</text>
            <text class="login-desc">登录后可使用完整功能</text>
          </view>
          <u-button
            type="primary"
            size="medium"
            :custom-style="{
              borderRadius: '50rpx',
              backgroundColor: '#0096C2',
              borderColor: '#0096C2',
              fontSize: '28rpx',
              fontWeight: '600',
              padding: '0 40rpx',
              height: '80rpx',
            }"
            @click="handleLogin"
          >
            <!-- #ifdef MP-WEIXIN -->
            微信登录
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            立即登录
            <!-- #endif -->
          </u-button>
        </view>

        <view v-else class="user-info">
          <!-- 头像 -->
          <!-- #ifdef MP-WEIXIN -->
          <button class="avatar-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <image :src="userInfo.avatar" mode="aspectFill" class="avatar-image" />
          </button>
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <view class="avatar-wrapper" @click="uploadAvatar">
            <image :src="userInfo.avatar" mode="aspectFill" class="avatar-image" />
          </view>
          <!-- #endif -->

          <!-- 用户信息 -->
          <view class="user-details">
            <!-- #ifdef MP-WEIXIN -->
            <input
              v-model="userInfo.username"
              type="nickname"
              class="username-input"
              placeholder="请输入昵称"
            >
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <text class="username">{{ userInfo.username }}</text>
            <!-- #endif -->
            <text class="user-id">ID: {{ userInfo.userId }}</text>
          </view>

          <!-- 编辑按钮 -->
          <view class="edit-btn" @click="openEditDialog">
            <u-icon name="edit-pen" size="20" color="#999999" />
          </view>
        </view>

        <!-- 教师信息 -->
        <view v-if="userInfo.teacherName || userInfo.teacherPhone || userInfo.teacherEmail" class="teacher-info">
          <view v-if="userInfo.teacherName" class="info-item">
            <u-icon name="account" size="16" color="#0096C2" />
            <text class="info-text">{{ userInfo.teacherName }}</text>
          </view>
          <view v-if="userInfo.teacherPhone" class="info-item">
            <u-icon name="phone" size="16" color="#0096C2" />
            <text class="info-text">{{ userInfo.teacherPhone }}</text>
          </view>
          <view v-if="userInfo.teacherEmail" class="info-item">
            <u-icon name="email" size="16" color="#0096C2" />
            <text class="info-text">{{ userInfo.teacherEmail }}</text>
          </view>
        </view>
        <view v-else class="teacher-info-tip" @click="openEditDialog">
          <u-icon name="plus-circle" size="18" color="#0096C2" />
          <text class="tip-text">点击添加教师信息</text>
        </view>
      </view>

      <!-- 快捷统计 -->
      <view v-if="tokenStore.hasLogin" class="stats-card">
        <view class="stat-item">
          <text class="stat-value">{{ stats.pending }}</text>
          <text class="stat-label">待审核</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">{{ stats.approved }}</text>
          <text class="stat-label">已通过</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value">{{ stats.scheduled }}</text>
          <text class="stat-label">已排课</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view v-for="(menu, index) in menuList" :key="index" class="menu-section">
        <view class="section-title">
          {{ menu.title }}
        </view>
        <view class="menu-card">
          <view
            v-for="(item, idx) in menu.items"
            :key="idx"
            class="menu-item"
            @click="navigateTo(item.url)"
          >
            <view class="menu-icon" :style="{ backgroundColor: `${item.color}20` }">
              <u-icon :name="item.icon" size="24" :color="item.color" />
            </view>
            <view class="menu-content">
              <text class="menu-name">{{ item.name }}</text>
              <text class="menu-desc">{{ item.desc }}</text>
            </view>
            <u-icon name="arrow-right" size="16" color="#c0c0c0" />
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view v-if="tokenStore.hasLogin" class="logout-section">
        <u-button
          type="error"
          plain
          :custom-style="{ width: '100%', borderRadius: '50rpx' }"
          @click="handleLogout"
        >
          退出登录
        </u-button>
      </view>

      <!-- 版权信息 -->
      <view class="copyright">
        <text class="copyright-text">日新智课 v1.0.0</text>
        <text class="copyright-text">© 2025 北京工业大学</text>
      </view>

      <!-- 底部安全距离 -->
      <view class="safe-area-bottom" />
    </scroll-view>

    <!-- 编辑个人信息对话框 -->
    <u-popup v-model="showEditDialog" mode="center" border-radius="20">
      <view class="edit-dialog">
        <view class="dialog-title">
          编辑个人信息
        </view>
        <view class="dialog-content">
          <view class="form-item">
            <view class="form-label">
              <text class="required">*</text>昵称
            </view>
            <input v-model="editForm.nickName" class="form-input" placeholder="请输入昵称">
          </view>
          <view class="form-item">
            <view class="form-label">
              <text class="required">*</text>姓名
            </view>
            <input v-model="editForm.teacherName" class="form-input" placeholder="请输入真实姓名">
          </view>
          <view class="form-item">
            <view class="form-label">
              <text class="required">*</text>电话
            </view>
            <input v-model="editForm.teacherPhone" class="form-input" type="text" :maxlength="11" placeholder="请输入手机号">
          </view>
          <view class="form-item">
            <view class="form-label">
              邮箱
            </view>
            <input v-model="editForm.teacherEmail" class="form-input" placeholder="请输入邮箱（选填）">
          </view>
        </view>
        <view class="dialog-footer">
          <u-button size="medium" @click="showEditDialog = false">
            取消
          </u-button>
          <u-button type="primary" size="medium" :custom-style="{ backgroundColor: '#0096C2', borderColor: '#0096C2', marginLeft: '20rpx' }" @click="saveUserInfo">
            保存
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style scoped lang="scss">
.page-container {
  height: calc(100vh - 80px);  // 减去 tabbar 高度（约50px），确保内容不被遮挡
  background-color: #f5f7fa;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

// 顶部背景
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  overflow: hidden;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.scroll-container {
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
}

// 顶部安全距离
.top-safe-area {
  height: 80rpx;  // 增加顶部距离，避免太靠近屏幕顶部
  flex-shrink: 0;
}

// 用户信息卡片
.user-card {
  margin: 0 30rpx 20rpx;
  padding: 40rpx 30rpx;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 150, 194, 0.15);
  width: calc(100% - 60rpx);
  box-sizing: border-box;
  backdrop-filter: blur(10rpx);
}

.login-placeholder {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar-placeholder {
  width: 100rpx;
  height: 100rpx;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.login-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.login-desc {
  font-size: 24rpx;
  color: #999999;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar-wrapper,
.avatar-button {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #f0f0f0;
  padding: 0;
  background-color: transparent;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.username,
.username-input {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
}

.username-input {
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
}

.user-id {
  font-size: 24rpx;
  color: #999999;
}

.edit-btn {
  width: 56rpx;
  height: 56rpx;
  background-color: #f5f7fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 快捷统计
.stats-card {
  margin: 0 30rpx 20rpx;
  padding: 30rpx 0;
  background-color: #ffffff;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  width: calc(100% - 60rpx);
  box-sizing: border-box;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #0096c2;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background-color: #e6e6e6;
}

// 菜单分区
.menu-section {
  margin-bottom: 20rpx;
}

.section-title {
  padding: 20rpx 30rpx 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #666666;
}

.menu-card {
  margin: 0 30rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  width: calc(100% - 60rpx);
  box-sizing: border-box;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
  transition: background-color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #f8f8f8;
  }
}

.menu-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.menu-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.menu-desc {
  font-size: 22rpx;
  color: #999999;
}

// 退出登录
.logout-section {
  margin: 40rpx 30rpx;
  width: calc(100% - 60rpx);
  box-sizing: border-box;
}

// 版权信息
.copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 40rpx 0 20rpx;
}

.copyright-text {
  font-size: 22rpx;
  color: #999999;
}

.safe-area-bottom {
  height: calc(env(safe-area-inset-bottom) + 40rpx);  // 底部安全距离，适配刘海屏
  flex-shrink: 0;
}

// 教师信息
.teacher-info {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16rpx;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.info-text {
  font-size: 24rpx;
  color: #666666;
}

.teacher-info-tip {
  margin-top: 24rpx;
  padding: 20rpx;
  border: 2rpx dashed #0096c2;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #0096c2;
}

// 编辑对话框
.edit-dialog {
  width: 600rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
}

.dialog-title {
  padding: 40rpx 30rpx 30rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  border-bottom: 1rpx solid #f0f0f0;
}

.dialog-content {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  margin-bottom: 12rpx;
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
  margin-right: 4rpx;
}

.form-input {
  width: 100%;
  height: 72rpx;
  padding: 0 20rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333333;
  box-sizing: border-box;
}

.dialog-footer {
  padding: 20rpx 30rpx 30rpx;
  display: flex;
}
</style>

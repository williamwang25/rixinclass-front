<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'Feedback',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '意见反馈',
  },
})

// 反馈类型
const feedbackTypes = ref([
  { label: '功能建议', value: 'suggestion' },
  { label: '问题反馈', value: 'problem' },
  { label: '使用咨询', value: 'question' },
  { label: '其他', value: 'other' },
])

// 表单数据
const formData = reactive({
  type: '',
  content: '',
  contact: '',
})

const showTypePicker = ref(false)

// 选择反馈类型
function onTypeConfirm(value: any) {
  formData.type = value[0].label
  showTypePicker.value = false
}

// 提交反馈
function submitFeedback() {
  if (!formData.type) {
    uni.showToast({
      title: '请选择反馈类型',
      icon: 'none',
    })
    return
  }

  if (!formData.content || formData.content.trim().length < 5) {
    uni.showToast({
      title: '请输入至少5个字的反馈内容',
      icon: 'none',
    })
    return
  }

  uni.showModal({
    title: '提交反馈',
    content: '确认提交反馈意见吗？',
    success: (res) => {
      if (res.confirm) {
        console.log('提交反馈：', formData)
        uni.showToast({
          title: '提交成功',
          icon: 'success',
        })
        setTimeout(() => {
          // 重置表单
          formData.type = ''
          formData.content = ''
          formData.contact = ''
          uni.navigateBack()
        }, 1500)
      }
    },
  })
}

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
          意见反馈
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-container">
      <!-- 顶部提示 -->
      <view class="tip-card">
        <u-icon name="chat" size="32" color="#0096C2" />
        <text class="tip-title">您的反馈很重要</text>
        <text class="tip-desc">我们会认真对待每一条反馈，持续改进系统</text>
      </view>

      <!-- 反馈表单 -->
      <view class="form-card">
        <view class="form-item">
          <view class="item-label">
            <text class="label-text">反馈类型</text>
            <text class="required">*</text>
          </view>
          <view class="select-input" @click="showTypePicker = true">
            <text :class="formData.type ? 'value' : 'placeholder'">
              {{ formData.type || '请选择反馈类型' }}
            </text>
            <u-icon name="arrow-down" size="16" color="#999999" />
          </view>
        </view>

        <view class="form-item">
          <view class="item-label">
            <text class="label-text">反馈内容</text>
            <text class="required">*</text>
          </view>
          <view class="textarea-wrapper">
            <textarea
              v-model="formData.content"
              class="custom-textarea"
              placeholder="请详细描述您的反馈内容，至少5个字"
              placeholder-class="textarea-placeholder"
              :maxlength="500"
            />
            <text class="char-count">{{ formData.content.length }}/500</text>
          </view>
        </view>

        <view class="form-item">
          <view class="item-label">
            <text class="label-text">联系方式</text>
            <text class="optional">（选填）</text>
          </view>
          <input
            v-model="formData.contact"
            class="custom-input"
            placeholder="请输入您的联系方式，便于我们回复"
            placeholder-class="input-placeholder"
          >
        </view>

        <u-button
          type="primary"
          :custom-style="{ width: '100%', marginTop: '40rpx' }"
          @click="submitFeedback"
        >
          提交反馈
        </u-button>
      </view>

      <!-- 温馨提示 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <view class="tips-list">
          <text class="tips-item">• 请如实填写反馈内容，便于我们快速定位问题</text>
          <text class="tips-item">• 留下联系方式可以让我们及时回复您</text>
          <text class="tips-item">• 我们会在3个工作日内处理您的反馈</text>
        </view>
      </view>
    </scroll-view>

    <!-- 类型选择器 -->
    <u-select
      v-model="showTypePicker"
      :list="feedbackTypes"
      mode="single-column"
      @confirm="onTypeConfirm"
    />
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
}

// 提示卡片
.tip-card {
  background: linear-gradient(135deg, #0096c2 0%, #0078a8 100%);
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.tip-title {
  margin-top: 16rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.tip-desc {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

// 表单卡片
.form-card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-label {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.label-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.required {
  margin-left: 4rpx;
  font-size: 28rpx;
  color: #ff6b6b;
}

.optional {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #999999;
}

.select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
}

.select-input .placeholder {
  color: #c0c4cc;
  font-size: 28rpx;
}

.select-input .value {
  color: #333333;
  font-size: 28rpx;
}

.custom-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
  box-sizing: border-box;
}

.input-placeholder {
  color: #c0c4cc;
  font-size: 28rpx;
}

.textarea-wrapper {
  position: relative;
}

.custom-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 24rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  box-sizing: border-box;
}

.textarea-placeholder {
  color: #c0c4cc;
  font-size: 28rpx;
}

.char-count {
  position: absolute;
  right: 24rpx;
  bottom: 16rpx;
  font-size: 22rpx;
  color: #999999;
}

// 温馨提示
.tips-section {
  background-color: #e6f4f9;
  border-radius: 16rpx;
  padding: 30rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 20rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tips-item {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.6;
}
</style>

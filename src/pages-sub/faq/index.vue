<script lang="ts" setup>
import { ref } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'FAQ',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '常见问题',
  },
})

// 常见问题列表
const faqList = ref([
  {
    id: 1,
    question: '如何提交排课申请？',
    answer: '在首页点击"排课申请"，填写完整的课程信息、实验时间和教师信息后，添加电子签名即可提交。',
    expanded: false,
  },
  {
    id: 2,
    question: '申请被拒绝了怎么办？',
    answer: '申请被拒绝后，您可以在"申请查询"页面查看拒绝原因，然后点击"修改"按钮重新编辑申请信息并提交。',
    expanded: false,
  },
  {
    id: 3,
    question: '可以选择多个实验时间段吗？',
    answer: '可以。在填写申请表时，点击"添加时间段"按钮可以添加多个实验时间，系统会自动安排合适的实验室。',
    expanded: false,
  },
  {
    id: 4,
    question: '如何查看申请审核进度？',
    answer: '在首页点击"申请查询"，可以查看所有申请的状态。待审核、已通过、已拒绝的申请会用不同颜色标识。',
    expanded: false,
  },
  {
    id: 5,
    question: '实验室是如何分配的？',
    answer: '系统会根据您的软件环境要求、学生人数和时间安排自动匹配合适的实验室。如有冲突，管理员会手动调整。',
    expanded: false,
  },
  {
    id: 6,
    question: '可以取消已提交的申请吗？',
    answer: '待审核状态的申请可以取消。在"申请查询"页面找到对应申请，点击"取消"按钮即可。',
    expanded: false,
  },
  {
    id: 7,
    question: '电子签名有什么作用？',
    answer: '电子签名用于确认您对申请内容的真实性负责，是申请的必要组成部分。',
    expanded: false,
  },
  {
    id: 8,
    question: '如何查看历史排课记录？',
    answer: '在首页点击"历史记录"，可以查看往年已完成的排课记录，并支持按学年筛选。',
    expanded: false,
  },
])

// 切换展开/折叠
function toggleItem(index: number) {
  faqList.value[index].expanded = !faqList.value[index].expanded
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
          常见问题
        </view>
        <view class="navbar-right" />
      </view>
    </view>

    <scroll-view scroll-y class="scroll-container">
      <!-- 顶部提示 -->
      <view class="tip-banner">
        <u-icon name="question-circle" size="24" color="#0096C2" />
        <text class="tip-text">常见问题解答，帮助您快速了解系统</text>
      </view>

      <!-- 问题列表 -->
      <view class="faq-list">
        <view
          v-for="(item, index) in faqList"
          :key="item.id"
          class="faq-item"
          @click="toggleItem(index)"
        >
          <view class="question-row">
            <view class="question-left">
              <view class="question-icon">
                <text class="q-text">Q</text>
              </view>
              <text class="question-text">{{ item.question }}</text>
            </view>
            <u-icon
              :name="item.expanded ? 'arrow-up' : 'arrow-down'"
              size="20"
              color="#999999"
            />
          </view>

          <view v-if="item.expanded" class="answer-row">
            <view class="answer-icon">
              <text class="a-text">A</text>
            </view>
            <text class="answer-text">{{ item.answer }}</text>
          </view>
        </view>
      </view>

      <!-- 联系我们 -->
      <view class="contact-card">
        <text class="contact-title">没有找到答案？</text>
        <text class="contact-desc">请通过意见反馈功能联系我们</text>
        <u-button
          type="primary"
          :custom-style="{ marginTop: '24rpx' }"
          @click="uni.navigateTo({ url: '/pages-sub/feedback/index' })"
        >
          意见反馈
        </u-button>
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

// 提示横幅
.tip-banner {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #e6f4f9;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  width: 100%;
  box-sizing: border-box;
}

.tip-text {
  flex: 1;
  margin-left: 16rpx;
  font-size: 26rpx;
  color: #333333;
}

// 问题列表
.faq-list {
  margin-bottom: 30rpx;
}

.faq-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 16rpx;
  transition: all 0.3s;
}

.question-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.question-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #0096c2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.q-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #ffffff;
}

.question-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1.5;
}

.answer-row {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.answer-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.a-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #ffffff;
}

.answer-text {
  flex: 1;
  font-size: 26rpx;
  color: #666666;
  line-height: 1.8;
}

// 联系卡片
.contact-card {
  background: linear-gradient(135deg, #0096c2 0%, #0078a8 100%);
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}

.contact-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>

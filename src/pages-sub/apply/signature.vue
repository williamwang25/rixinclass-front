<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Signature',
})

definePage({
  style: {
    navigationStyle: 'default',
    navigationBarTitleText: '电子签名',
  },
})

const canvasId = 'signatureCanvas'
let ctx: any = null
let canvas: any = null
let canvasWidth = 0
let canvasHeight = 0

// 是否有签名内容
const hasSignature = ref(false)
// 当前绘制路径
const isDrawing = ref(false)

// 初始化画布
function initCanvas() {
  const query = uni.createSelectorQuery()
  query
    .select('#signatureCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      if (res && res[0]) {
        canvas = res[0].node
        ctx = canvas.getContext('2d')

        const dpr = uni.getSystemInfoSync().pixelRatio
        canvasWidth = res[0].width
        canvasHeight = res[0].height

        // 设置canvas实际大小
        canvas.width = canvasWidth * dpr
        canvas.height = canvasHeight * dpr

        // 缩放绘图上下文以匹配设备像素比
        ctx.scale(dpr, dpr)

        // 设置画笔样式
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = 3
        ctx.strokeStyle = '#000000'

        // 绘制白色背景
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        console.log('Canvas初始化成功:', { canvasWidth, canvasHeight, dpr })
      }
    })
}

// 开始绘制
function touchStart(e: any) {
  if (!ctx)
    return

  isDrawing.value = true
  const touch = e.touches[0]
  const x = touch.x
  const y = touch.y

  console.log('Touch Start:', { x, y })

  ctx.beginPath()
  ctx.moveTo(x, y)
}

// 绘制中
function touchMove(e: any) {
  if (!ctx || !isDrawing.value)
    return

  hasSignature.value = true
  const touch = e.touches[0]
  const x = touch.x
  const y = touch.y

  ctx.lineTo(x, y)
  ctx.stroke()
}

// 结束绘制
function touchEnd() {
  isDrawing.value = false
}

// 清空画布
function clearCanvas() {
  if (!ctx) {
    uni.showToast({
      title: '画布未初始化',
      icon: 'none',
    })
    return
  }

  if (!hasSignature.value) {
    uni.showToast({
      title: '画布已是空白',
      icon: 'none',
    })
    return
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  hasSignature.value = false

  uni.showToast({
    title: '已清空',
    icon: 'success',
  })
}

// 保存签名
function saveSignature() {
  if (!hasSignature.value) {
    uni.showToast({
      title: '请先签名',
      icon: 'none',
    })
    return
  }

  uni.showLoading({
    title: '保存中...',
  })

  // 使用新版API导出图片
  uni.canvasToTempFilePath(
    {
      canvas,
      fileType: 'png',
      quality: 1,
      success: (res: any) => {
        uni.hideLoading()

        console.log('签名保存成功:', res.tempFilePath)

        // 使用事件总线传递签名图片
        uni.$emit('signatureConfirm', res.tempFilePath)

        uni.showToast({
          title: '保存成功',
          icon: 'success',
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 500)
      },
      fail: (err: any) => {
        uni.hideLoading()
        console.error('保存签名失败：', err)

        uni.showModal({
          title: '保存失败',
          content: `签名保存失败: ${err.errMsg || '未知错误'}`,
          showCancel: false,
        })
      },
    },
  )
}

onMounted(() => {
  // 延迟初始化，确保DOM已渲染
  setTimeout(() => {
    initCanvas()
  }, 500)
})

onUnmounted(() => {
  // 清理
  ctx = null
  canvas = null
})
</script>

<template>
  <view class="signature-container">
    <view class="canvas-wrapper">
      <canvas
        id="signatureCanvas"
        type="2d"
        class="signature-canvas"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        @touchcancel="touchEnd"
      />
      <view v-if="!hasSignature" class="hint-text">
        请在此区域手写签名
      </view>
    </view>

    <view class="tips-box">
      <u-icon name="info-circle" size="16" color="#0096C2" />
      <text class="tips-text">请使用手指或触控笔在白色区域内签名，全屏幕区域均可书写</text>
    </view>

    <view class="action-buttons">
      <u-button
        type="default"
        :custom-style="{ marginRight: '20rpx', flex: 1 }"
        @click="clearCanvas"
      >
        <u-icon name="reload" size="18" color="#666666" />
        <text style="margin-left: 8rpx;">清空重写</text>
      </u-button>
      <u-button
        type="primary"
        :custom-style="{ flex: 1 }"
        @click="saveSignature"
      >
        <u-icon name="checkmark" size="18" color="#ffffff" />
        <text style="margin-left: 8rpx;">确认签名</text>
      </u-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.signature-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  padding: 30rpx;
}

.canvas-wrapper {
  flex: 1;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid #e6e6e6;
  min-height: 600rpx;
}

.signature-canvas {
  width: 100%;
  height: 100%;
  min-height: 600rpx;
}

.hint-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28rpx;
  color: #cccccc;
  pointer-events: none;
  text-align: center;
}

.tips-box {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  background-color: #e6f7fb;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.tips-text {
  margin-left: 12rpx;
  font-size: 24rpx;
  color: #0096c2;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
}
</style>

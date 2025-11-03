<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'

onLaunch((options) => {
  console.log('App Launch', options)
  // 初始化云开发
  // 方式1：使用默认环境（推荐）
  wx.cloud.init({
    traceUser: true
  })
  
  console.log('云开发初始化完成')
  
  // 方式2：如果需要指定环境，请替换为你的环境ID
  // wx.cloud.init({
  //   env: 'your-env-id', // 在云开发控制台 → 设置中查看
  //   traceUser: true
  // })
})
onShow((options) => {
  console.log('App Show', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@import 'uview-pro/index.scss';
swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
</style>

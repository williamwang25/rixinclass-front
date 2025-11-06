<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'

onLaunch((options) => {
  console.log('App Launch', options)
  
  // 初始化云开发
  wx.cloud.init({
    env: 'cloud1-1gt445eta224436c', // 你的云开发环境ID
      traceUser: true
  })
    
  console.log('云开发初始化完成')
  
  // 初始化云数据库
  // #ifdef MP-WEIXIN
  try {
    const db = wx.cloud.database()
    globalThis.$db = db
    globalThis.$_ = db.command // 查询操作符
    
    console.log('云数据库初始化完成')
  } catch (error) {
    console.error('云数据库初始化失败:', error)
  }
  // #endif
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

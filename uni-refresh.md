在 UniApp 中，enablePullDownRefresh 是实现下拉刷新功能的核心配置，需结合「页面配置」「下拉刷新事件」「数据处理」三步完成。以下是从基础配置到进阶优化的完整实现方案，覆盖多端适配和常见问题解决。

一、基础实现：3 步开启下拉刷新
1. 第一步：开启下拉刷新配置（二选一）
需先开启页面的下拉刷新功能，有两种配置方式：

方式 1：页面 pages.json 全局配置（推荐）
在 pages.json 中对应页面的 style 里添加 enablePullDownRefresh: true，配置后页面初始化就支持下拉刷新：

{
  "pages": [
    {
      "path": "pages/index/index", // 你的页面路径
      "style": {
        "navigationBarTitleText": "下拉刷新示例",
        "enablePullDownRefresh": true, // 开启下拉刷新
        "backgroundColor": "#f5f7fa", // 下拉刷新区域背景色（建议与页面背景一致）
        "backgroundTextStyle": "dark" // 下拉刷新文字颜色（dark/light，仅支持这两种）
      }
    }
  ]
}
一键获取完整项目代码

方式 2：页面内动态开启（按需开启）
若不需要默认开启，可在页面逻辑中通过 uni.startPullDownRefresh() 动态触发下拉刷新（需先确保 pages.json 中未禁用）：

// 例如：点击按钮触发下拉刷新
handleManualRefresh() {
  uni.startPullDownRefresh({
    success: () => {
      console.log("手动触发下拉刷新");
    }
  });
}
一键获取完整项目代码
2. 第二步：监听下拉刷新事件
在页面的 script 中，通过 UniApp 生命周期函数 onPullDownRefresh 监听下拉动作，执行数据刷新逻辑：

<script>
export default {
  data() {
    return {
      list: [], // 页面数据列表（如列表数据）
      pageNum: 1, // 分页页码（若有分页）
      pageSize: 10 // 每页条数
    };
  },
  // 监听下拉刷新动作（UniApp 原生生命周期）
  onPullDownRefresh() {
    console.log("用户触发了下拉刷新");
    // 执行数据刷新逻辑（重置页码 + 重新请求数据）
    this.refreshData();
  },
  methods: {
    // 核心：数据刷新逻辑
    async refreshData() {
      try {
        // 1. 重置分页（下拉刷新时从第1页重新加载）
        this.pageNum = 1;
        
        // 2. 调用接口获取最新数据（替换为你的实际接口）
        const res = await this.getListData(); // 假设 getListData 是请求列表的方法
        
        // 3. 更新页面数据（覆盖原有数据，而非追加）
        this.list = res.data.rows; // 假设接口返回的列表数据在 res.data.rows 中
        
        // 4. 关键：关闭下拉刷新动画（必须调用，否则刷新图标会一直转）
        uni.stopPullDownRefresh();
        
        // 5. 提示用户刷新成功（可选，提升体验）
        uni.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 1000
        });
      } catch (error) {
        // 6. 接口失败时也要关闭刷新动画，避免卡住
        uni.stopPullDownRefresh();
        
        // 7. 错误提示
        uni.showToast({
          title: "刷新失败，请重试",
          icon: "none",
          duration: 2000
        });
        console.error("下拉刷新接口错误:", error);
      }
    },
    // 实际接口请求方法（示例）
    async getListData() {
      const res = await uni.request({
        url: "https://your-api.com/list", // 你的接口地址
        method: "GET",
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      });
      return res.data; // 假设接口返回格式为 { code: 200, data: { rows: [...] } }
    }
  }
};
</script>
一键获取完整项目代码

3. 第三步：优化下拉刷新样式（可选）
UniApp 原生下拉刷新样式较简单，可通过以下方式优化视觉体验：

（1）修改下拉刷新文字和背景
在 pages.json 中配置：

"style": {
  "enablePullDownRefresh": true,
  "backgroundColor": "#ffffff", // 下拉刷新区域背景色（与页面背景一致）
  "backgroundTextStyle": "dark", // 文字颜色：dark（黑色）/ light（白色）
  "navigationBarBackgroundColor": "#ffffff" // 导航栏背景色，保持整体风格统一
}
一键获取完整项目代码
（2）自定义下拉刷新图标（进阶）
若原生样式满足不了需求，可关闭原生刷新，使用自定义组件（如 uni-load-more）实现自定义下拉刷新：

先在 pages.json 中关闭原生刷新："enablePullDownRefresh": false；
在页面中添加自定义刷新组件，监听 onPullDownRefresh 事件触发自定义动画：
<template>
  <view>
    <!-- 自定义下拉刷新提示 -->
    <view class="custom-refresh" v-if="isRefreshing">
      <uni-icons type="spinner" size="24" color="#007aff" animation="spin"></uni-icons>
      <text class="refresh-text">正在刷新...</text>
    </view>
    
    <!-- 页面数据列表 -->
    <view class="list-item" v-for="(item, idx) in list" :key="idx">
      {{ item.title }}
    </view>
  </view>
</template>
 
<script>
export default {
  data() {
    return {
      isRefreshing: false, // 控制自定义刷新组件显示
      list: []
    };
  },
  onPullDownRefresh() {
    this.isRefreshing = true; // 显示自定义刷新组件
    this.refreshData(); // 执行刷新逻辑
  },
  methods: {
    async refreshData() {
      try {
        // 接口请求逻辑...
        await this.getListData();
        this.isRefreshing = false; // 隐藏自定义组件
        uni.stopPullDownRefresh(); // 关闭原生刷新（若开启了）
      } catch (error) {
        this.isRefreshing = false;
        uni.stopPullDownRefresh();
      }
    }
  }
};
</script>
 
<style scoped>
.custom-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  background-color: #ffffff;
}
.refresh-text {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: #007aff;
}
</style>
一键获取完整项目代码

二、常见问题与解决方案
1. 下拉刷新触发不了？
原因 1：pages.json 中未开启 enablePullDownRefresh: true；
原因 2：页面内容高度不足一屏（下拉刷新需要页面有滚动空间）；
解决方案：给页面容器添加最小高度 min-height: 100vh，确保内容超出一屏或占满屏幕；
原因 3：页面中有 scroll-view 且开启了 scroll-y，会覆盖页面的下拉刷新；
解决方案：在 scroll-view 上添加 @scrolltoupper="onPullDownRefresh"，监听滚动到顶部的动作，手动触发刷新。
2. 刷新图标一直转，不停止？
原因：未调用 uni.stopPullDownRefresh() 关闭刷新动画；
解决方案：无论接口请求成功或失败，都必须在 refreshData() 的 try 和 catch 中调用 uni.stopPullDownRefresh()，确保动画关闭。
3. 下拉刷新时页面抖动？
原因：页面背景色与下拉刷新区域背景色不一致；
解决方案：在 pages.json 中设置 backgroundColor 与页面的 background-color 一致（如都设为 #ffffff）。
4. 多页面共享下拉刷新逻辑？
需求：多个页面都需要下拉刷新，避免重复写代码；
解决方案：封装下拉刷新 mixin，在需要的页面引入：
// mixins/refreshMixin.js
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      list: [],
      isRefreshing: false
    };
  },
  onPullDownRefresh() {
    this.isRefreshing = true;
    this.refreshData();
  },
  methods: {
    async refreshData() {
      try {
        this.pageNum = 1;
        const res = await this.getListData(); // 每个页面需实现 getListData 方法
        this.list = res.data.rows;
        uni.stopPullDownRefresh();
        this.isRefreshing = false;
      } catch (error) {
        uni.stopPullDownRefresh();
        this.isRefreshing = false;
        uni.showToast({ title: "刷新失败", icon: "none" });
      }
    }
  }
};
一键获取完整项目代码

在页面中引入：

import refreshMixin from "@/mixins/refreshMixin.js";
export default {
  mixins: [refreshMixin], // 引入 mixin
  methods: {
    // 实现 mixin 中要求的 getListData 方法（每个页面的接口不同）
    async getListData() {
      const res = await uni.request({
        url: "https://your-api.com/xxx", // 当前页面的接口
        data: { pageNum: this.pageNum, pageSize: this.pageSize }
      });
      return res.data;
    }
  }
};
一键获取完整项目代码

三、多端适配注意事项
微信小程序：
下拉刷新的文字颜色仅支持 dark 或 light，不支持自定义颜色；
页面若有 tabBar，下拉刷新区域不会覆盖 tabBar，无需特殊处理。
App 端（iOS/Android）：
支持自定义下拉刷新的背景图（在 pages.json 中配置 pullRefreshBackgroundImage）；
需确保 App 权限中开启了 “下拉刷新” 功能（默认开启）。
H5 端：
下拉刷新依赖浏览器的滚动事件，部分浏览器（如 Safari）对下拉刷新的触发阈值不同，需测试适配；
若页面有固定定位（position: fixed）的元素，需避免遮挡下拉刷新区域。
四、总结
实现 UniApp 下拉刷新的核心流程是：

开启配置：通过 pages.json 或 uni.startPullDownRefresh() 开启下拉刷新；
监听事件：通过 onPullDownRefresh 生命周期函数触发刷新逻辑；
处理数据：重置分页 → 调用接口 → 更新数据 → 关闭刷新动画；
优化体验：添加错误提示、自定义刷新样式、解决多端适配问题。
按照以上步骤，即可快速实现稳定、易用的下拉刷新功能。
————————————————
版权声明：本文为CSDN博主「睡美人的小仙女127」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_44130891/article/details/150847487
---
applyTo: '**'

---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

---
alwaysApply: true
---

# unibest 项目概览

这是一个基于 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 的跨平台开发框架。

## 项目特点
- 支持 H5、小程序、APP 多平台开发
- 使用最新的前端技术栈
- 内置约定式路由、layout布局、请求封装等功能
- 无需依赖 HBuilderX，支持命令行开发

## 核心配置文件
- [package.json](mdc:package.json) - 项目依赖和脚本配置
- [vite.config.ts](mdc:vite.config.ts) - Vite 构建配置
- [pages.config.ts](mdc:pages.config.ts) - 页面路由配置
- [manifest.config.ts](mdc:manifest.config.ts) - 应用清单配置
- [uno.config.ts](mdc:uno.config.ts) - UnoCSS 配置

## 主要目录结构
- `src/pages/` - 页面文件
- `src/components/` - 组件文件
- `src/layouts/` - 布局文件
- `src/api/` - API 接口
- `src/http/` - HTTP 请求封装
- `src/store/` - 状态管理
- `src/tabbar/` - 底部导航栏

# uni-app 开发规范

## 页面开发
- 页面文件放在 [src/pages/](mdc:src/pages/) 目录下
- 使用约定式路由，文件名即路由路径
- 页面配置在仅需要在 `route-block` 中配置标题等内容即可，会自动生成到 `pages.json` 中

## 组件开发
- 组件文件放在 [src/components/](mdc:src/components/) 目录下
- 使用 uni-app 内置组件和第三方组件库
- 支持 wot-design-uni\uv-ui\uview-plus 等多种第三方组件库 和 z-paging 组件
- 自定义组件遵循 uni-app 组件规范

## 平台适配
- 使用条件编译处理平台差异
- 支持 H5、小程序、APP 多平台
- 注意各平台的 API 差异
- 使用 uni.xxx API 替代原生 API

## 示例代码结构
```vue
<script setup lang="ts">
// #ifdef H5
import { h5Api } from '@/utils/h5'
// #endif

// #ifdef MP-WEIXIN
import { mpApi } from '@/utils/mp'
// #endif

const handleClick = () => {
  // #ifdef H5
  h5Api.showToast('H5 平台')
  // #endif
  
  // #ifdef MP-WEIXIN
  mpApi.showToast('微信小程序')
  // #endif
}
</script>

<template>
  <view class="page">
    <!-- uni-app 组件 -->
    <button @click="handleClick">点击</button>
    
    <!-- 条件渲染 -->
    <!-- #ifdef H5 -->
    <view>H5 特有内容</view>
    <!-- #endif -->
  </view>
</template>
```

## 生命周期
- 使用 uni-app 页面生命周期
- onLoad、onShow、onReady、onHide、onUnload
- 组件生命周期遵循 Vue3 规范
- 注意页面栈和导航管理
---
globs: src/pages/*.vue,src/components/*.vue
---


# API 和 HTTP 请求规范

## HTTP 请求封装
- 可以使用 `简单http` 或者 `alova` 或者 `@tanstack/vue-query` 进行请求管理
- HTTP 配置在 [src/http/](mdc:src/http/) 目录下
- `简单http` - [src/http/http.ts](mdc:src/http/http.ts)
- `alova` - [src/http/alova.ts](mdc:src/http/alova.ts)
- `vue-query` - [src/http/vue-query.ts](mdc:src/http/vue-query.ts)
- 请求拦截器在 [src/http/interceptor.ts](mdc:src/http/interceptor.ts)
- 支持请求重试、缓存、错误处理

## API 接口规范
- API 接口定义在 [src/api/](mdc:src/api/) 目录下
- 按功能模块组织 API 文件
- 使用 TypeScript 定义请求和响应类型
- 支持 `简单http`、`alova` 和 `vue-query` 三种请求方式


## 示例代码结构
```typescript
// API 接口定义
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// alova 方式
export const login = (params: LoginParams) => 
  http.Post<LoginResponse>('/api/login', params)

// vue-query 方式
export const useLogin = () => {
  return useMutation({
    mutationFn: (params: LoginParams) => 
      http.post<LoginResponse>('/api/login', params)
  })
}
```

## 错误处理
- 统一错误处理在拦截器中配置
- 支持网络错误、业务错误、认证错误等
- 自动处理 token 过期和刷新

---
globs: src/api/*.ts,src/http/*.ts
---

# 样式和 CSS 开发规范

## UnoCSS 原子化 CSS
- 项目使用 UnoCSS 作为原子化 CSS 框架
- 配置在 [uno.config.ts](mdc:uno.config.ts)
- 支持预设和自定义规则
- 优先使用原子化类名，减少自定义 CSS

## SCSS 规范
- 使用 SCSS 预处理器
- 样式文件使用 `lang="scss"` 和 `scoped` 属性
- 遵循 BEM 命名规范
- 使用变量和混入提高复用性

## 样式组织
- 全局样式在 [src/style/](mdc:src/style/) 目录下
- 组件样式使用 scoped 作用域
- 图标字体在 [src/style/iconfont.css](mdc:src/style/iconfont.css)
- 主题变量在 [src/uni_modules/uni-scss/](mdc:src/uni_modules/uni-scss/) 目录下

## 示例代码结构
```vue
<template>
  <view class="container flex flex-col items-center p-4">
    <text class="title text-lg font-bold mb-2">标题</text>
    <view class="content bg-gray-100 rounded-lg p-3">
      <!-- 内容 -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  
  .title {
    color: var(--primary-color);
  }
  
  .content {
    width: 100%;
    max-width: 600rpx;
  }
}
</style>


## 响应式设计
- 使用 rpx 单位适配不同屏幕
- 支持横屏和竖屏布局
- 使用 flexbox 和 grid 布局
- 考虑不同平台的样式差异
---
globs: *.vue,*.scss,*.css
---

# Vue3 + TypeScript 开发规范

## Vue 组件规范
- 使用 Composition API 和 `<script setup> ` 语法
`
- 组件文件使用 PascalCase 命名
- 页面文件放在 `src/pages/` 目录下
- 组件文件放在 `src/components/` 目录下

## Vue SFC 组件规范
- `<script setup>` 标签必须是第一个子元素
- `<template>` 标签必须是第二个子元素
- `<style scoped>` 标签必须是最后一个子元素（因为推荐使用原子化类名，所以很可能没有）

## TypeScript 规范
- 严格使用 TypeScript，避免使用 `any` 类型
- 为 API 响应数据定义接口类型
- 使用 `interface` 定义对象类型，`type` 定义联合类型
- 导入类型时使用 `import type` 语法

## 状态管理
- 使用 Pinia 进行状态管理
- Store 文件放在 `src/store/` 目录下
- 使用 `defineStore` 定义 store
- 支持持久化存储

## 示例代码结构
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserInfo } from '@/types/user'

const userInfo = ref<UserInfo | null>(null)

onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <view class="container">
    <!-- 模板内容 -->
  </view>
</template>

<style lang="scss" scoped>
.container {
  // 样式
}
</style>

---
globs: *.vue,*.ts,*.tsx
---


## 代码规范
- 使用 ESLint 进行代码检查：`pnpm lint`
- 自动修复代码格式：`pnpm lint:fix`
- 使用 eslint 格式化代码
- 遵循 TypeScript 严格模式

## 调试技巧
- 使用 console.log 和 uni.showToast 调试
- 利用 Vue DevTools 调试组件状态
- 使用网络面板调试 API 请求
- 平台差异测试和兼容性检查

## 性能优化
- 使用懒加载和代码分割
- 优化图片和静态资源
- 减少不必要的重渲染
- 合理使用缓存策略
# uViewPro 起步指南

## 目录
- [快速上手](#快速上手)
- [安装](#安装)
- [配置](#配置)
- [基本使用](#基本使用)

## 快速上手

uView Pro 是一个全面的uni-app生态框架，它为开发者提供了丰富的组件库和工具库。

### 如何使用

通过 npm 和下载方式的配置之后，在某个页面可以直接使用组件，无需通过`import`引入组件。

```html
<template>
  <u-action-sheet :list="list" v-model="show"></u-action-sheet>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  interface ListItem {
    text: string;
    color?: string;
    fontSize?: number;
  }

  const list = ref<ListItem[]>([
    { text: "点赞", color: "blue", fontSize: 28 },
    { text: "分享" },
    { text: "评论" },
  ]);

  const show = ref(true);
</script>
```

### 关于 $u

uView Pro 将`$u`对象同时挂载到了`uni`对象上，这意味着您可以在外部的`ts`文件中，通过`uni.$u.xxx`的形式去调用 uView 提供的一些工具方法。

或者您在使用 `$u` 时，先导入再使用：

```html
<script setup lang="ts">
  import { $u } from "uview-pro";

  function func() {
    $u.toast("hello world");
  }
</script>
```

### 如何不使用 easycom 而单独引用某一个组件

某些情况下，您可能不想通过 easycom 引用组件(虽然我们极力推荐您使用 easycom)，那么您可以使用`import`这个常规的引入方式，如下：

```html
<template>
  <my-action-sheet :list="list" v-model="show"></my-action-sheet>
</template>

<script setup lang="ts">
  // 你如果自定义引入的名称，template 中使用组件名称也需要对应
  import myActionSheet from "@/uni_modules/uview-pro/components/u-action-sheet/u-action-sheet.vue";
  import { ref } from "vue";

  interface ListItem {
    text: string;
    color?: string;
    fontSize?: number;
  }

  const list = ref<ListItem[]>([
    { text: "点赞", color: "blue", fontSize: 28 },
    { text: "分享" },
    { text: "评论" },
  ]);

  const show = ref(true);
</script>
```

## 安装

### 说明

由于 uView Pro 使用easycom模式，让您无需引入组件即可直接使用，但是此功能需要 Hbuilder X 2.5.5 及以上版本才支持。easycom打包的时候是按需引入的，您可以放心引入 uView Pro 的整个组件库，发布打包时会自动剔除您没有使用的组件(注意：调试时仍然是全部引入的)。

请确保您下载的Hbuilder X为APP开发版，而非标准版，并且在"工具-插件安装"中安装了"scss/sass 编译"插件。

**注意：** sass、sass-loader 版本过高或过低，导致编译异常，因此推荐统一并锁定依赖版本：

```json
"sass": "1.63.2",
"sass-loader": "10.4.1"
```

### 方式一：npm 安装

使用 npm 的方式安装，能更方便进行升级。

**注意：** 项目名称不能有中文字符。

如果您的项目是HX创建的，根目录又没有package.json文件的话，请先执行如下命令：

```bash
npm init -y
```

执行安装命令：

```bash
npm i uview-pro
# 或
yarn add uview-pro
# 或
pnpm add uview-pro
```

### 方式二：下载安装

通过 HBuilderX 插件市场或手动下载，将 uView Pro 放入 uni_modules 目录。

**插件市场：** https://ext.dcloud.net.cn/plugin?id=24633

使用下载的方式安装，能更方便阅读源码，但是每次升级都需要重新下载并覆盖 uview-pro 文件夹。

- 在 uni-app 插件市场右上角选择 下载并导入HBuilder X，会直接导入到项目 src 目录的 uni_modules 目录中。
- 如果您的项目是由 HBuilder X 创建的标准 uni-app 项目，将下载后的uview-pro文件夹，复制到项目uni_modules目录。
- 如果您的项目是由vue-cli模式创建的，请将下载后的uview-pro文件夹放到项目的src的 uni_modules文件夹中即可。

### 版本查询

通过源码查看的形式，可以查阅 uView Pro 的配置文件得知当前版本号，具体位置为 "/uview-pro/package.json" 中的 "version" 字段。

### 示例项目

此方式为整个 uView Pro 演示项目，里面有 uView Pro 核心，组件演示，模板等，建议用户可以下载此项目运行用于查看 UI 演示效果，复制模板案例，通过里面的示例，可以快速掌握某一个组件的用法。

**途径一：** 在 uni-app 插件市场右上角选择使用 HBuilderX 导入示例项目或者下载示例项目ZIP，然后在 HBuilder X 中运行即可。

**插件市场：** https://ext.dcloud.net.cn/plugin?id=24633

**途径二：** 通过 Github 或 Gitee 下载 uView Pro 示例项目，在 VSCode 中运行即可。

- **Github：** https://github.com/anyup/uview-pro
- **Gitee：** https://gitee.com/anyup/uview-pro

```bash
pnpm install
pnpm run dev:h5
```

**注意：**
- 演示项目不适用于直接开发中，它只是演示用的，可以直接运行并查看效果。
- 如果在微信开发工具真机预览时，提示分包太大运行的问题，请在HBuilder X进行设置：菜单栏 运行 -> 运行到小程序模拟器，在下拉菜单中勾选"运行时是否压缩代码"

## 配置

配置文档将在下一步获取...

## 基本使用

基本使用文档将在下一步获取...

"use strict";
const TABBAR_STRATEGY_MAP = {
  NATIVE_TABBAR: 1,
  CUSTOM_TABBAR_WITH_CACHE: 2,
  CUSTOM_TABBAR_WITHOUT_CACHE: 3
};
const selectedTabbarStrategy = TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE;
const nativeTabbarList = [
  {
    iconPath: "static/tabbar/home.png",
    selectedIconPath: "static/tabbar/homeHL.png",
    pagePath: "pages/index/index",
    text: "首页"
  },
  {
    iconPath: "static/tabbar/bell.png",
    selectedIconPath: "static/tabbar/bellHL.png",
    pagePath: "pages/notice/index",
    text: "通知"
  },
  {
    iconPath: "static/tabbar/personal.png",
    selectedIconPath: "static/tabbar/personalHL.png",
    pagePath: "pages/me/me",
    text: "我的"
  },
  {
    iconPath: "static/tabbar/example.png",
    selectedIconPath: "static/tabbar/exampleHL.png",
    pagePath: "pages/test/index",
    text: "测试"
  }
];
const customTabbarList = [
  {
    text: "首页",
    pagePath: "pages/index/index",
    iconType: "image",
    icon: "/static/tabbar/home.png",
    iconActive: "/static/tabbar/homeHL.png"
  },
  {
    text: "通知",
    pagePath: "pages/notice/index",
    iconType: "image",
    icon: "/static/tabbar/bell.png",
    iconActive: "/static/tabbar/bellHL.png"
  },
  {
    text: "我的",
    pagePath: "pages/me/me",
    iconType: "image",
    icon: "/static/tabbar/personal.png",
    iconActive: "/static/tabbar/personalHL.png"
  },
  {
    text: "测试",
    pagePath: "pages/test/index",
    iconType: "uiLib",
    icon: "setting"
  }
  // 其他类型演示
  // 1、uiLib
  // {
  //   pagePath: 'pages/index/index',
  //   text: '首页',
  //   iconType: 'uiLib',
  //   icon: 'home',
  // },
  // 2、iconfont
  // {
  //   pagePath: 'pages/index/index',
  //   text: '首页',
  //   // 注意 iconfont 图标需要额外加上 'iconfont'，如下
  //   iconType: 'iconfont',
  //   icon: 'iconfont icon-my',
  // },
  // 3、image
  // {
  //   pagePath: 'pages/index/index',
  //   text: '首页',
  //   // 使用 ‘image’时，需要配置 icon + iconActive 2张图片
  //   iconType: 'image',
  //   icon: '/static/tabbar/home.png',
  //   iconActive: '/static/tabbar/homeHL.png',
  // },
];
const tabbarCacheEnable = [TABBAR_STRATEGY_MAP.NATIVE_TABBAR, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE].includes(selectedTabbarStrategy);
const customTabbarEnable = [TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITH_CACHE, TABBAR_STRATEGY_MAP.CUSTOM_TABBAR_WITHOUT_CACHE].includes(selectedTabbarStrategy);
customTabbarEnable ? customTabbarList.map((item) => ({ text: item.text, pagePath: item.pagePath })) : nativeTabbarList;
const tabbarList = customTabbarEnable ? customTabbarList : nativeTabbarList;
exports.customTabbarEnable = customTabbarEnable;
exports.tabbarCacheEnable = tabbarCacheEnable;
exports.tabbarList = tabbarList;

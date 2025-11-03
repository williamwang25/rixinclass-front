"use strict";
const pages = [
  {
    path: "pages/index/index",
    type: "home",
    style: {
      navigationStyle: "custom",
      navigationBarTitleText: "日新智课"
    }
  },
  {
    path: "pages/me/me",
    type: "page",
    style: {
      navigationBarTitleText: "我的",
      navigationBarBackgroundColor: "#0096C2",
      navigationBarTextStyle: "white"
    }
  },
  {
    path: "pages/notice/index",
    type: "page",
    style: {
      navigationBarTitleText: "通知中心",
      navigationBarBackgroundColor: "#0096C2",
      navigationBarTextStyle: "white"
    }
  },
  {
    path: "pages/test/index",
    type: "page"
  }
];
const subPackages = [
  {
    root: "pages-fg",
    pages: [
      {
        path: "404/index",
        type: "page",
        style: {
          navigationStyle: "custom"
        }
      },
      {
        path: "login/login",
        type: "page",
        style: {
          navigationBarTitleText: "登录"
        }
      },
      {
        path: "login/register",
        type: "page",
        style: {
          navigationBarTitleText: "注册"
        }
      }
    ]
  },
  {
    root: "pages-sub",
    pages: [
      {
        path: "about/about",
        type: "page",
        style: {
          navigationBarTitleText: "关于"
        },
        excludeLoginPath: false
      },
      {
        path: "about/alova",
        type: "page",
        style: {
          navigationBarTitleText: "Alova 演示"
        }
      },
      {
        path: "about/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "关于我们"
        }
      },
      {
        path: "apply/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "排课申请"
        }
      },
      {
        path: "apply/signature",
        type: "page",
        style: {
          navigationStyle: "default",
          navigationBarTitleText: "电子签名"
        }
      },
      {
        path: "demo/index",
        type: "page",
        style: {
          navigationBarTitleText: "分包页面"
        }
      },
      {
        path: "demo/scroll",
        type: "page",
        style: {
          navigationBarTitleText: "下拉刷新和下拉加载更多",
          enablePullDownRefresh: true,
          onReachBottomDistance: 100
        }
      },
      {
        path: "faq/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "常见问题"
        }
      },
      {
        path: "feedback/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "意见反馈"
        }
      },
      {
        path: "guide/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "使用指南"
        }
      },
      {
        path: "query/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "申请查询"
        }
      },
      {
        path: "record/index",
        type: "page",
        style: {
          navigationStyle: "custom",
          navigationBarTitleText: "历史记录"
        }
      },
      {
        path: "test/auth",
        type: "page"
      },
      {
        path: "test/index",
        type: "page"
      }
    ]
  }
];
exports.pages = pages;
exports.subPackages = subPackages;

"cloudfunctionRoot": "cloudfunctions/"

1985192077091397633

云开发 MySQL 数据库

1. 从小程序中查询数据表
初始化 SDK
// app.js
const { init } = require("@cloudbase/wx-cloud-client-sdk");

App({
  onLaunch() {
    let db = null;
    this.globalData.getDB = async () => {
      if (!db) {
        wx.cloud.init({
          env: "<云开发环境 ID>",
        });
        db = init(wx.cloud).mysql();
      }
      return db;
    };
  },

  globalData: {},
});

在页面 js 文件中添加以下查询代码
// pages/index/index.js

Page({
  data: {
    todos: [],
  },
  onLoad() {
    this.fetchTodos();
  },
  async fetchTodos() {
    try {
      const db = await getApp().globalData.getDB();
      const { data } = await db.from("todos").select("*").range(0, 9);
      this.setData({
        todos: data,
      });
    } catch (error) {
      console.error("获取待办事项失败:", error);
    }
  },
});

在页面对应的 wxml 文件中展示数据
<!--pages/index/index.wxml-->

<view>
  <block wx:for="{{todos}}" wx:key="id">
    <text>{{item.title}}</text>
  </block>
</view>


2. 在 Vue 应用中访问云开发 MySQL 数据库
从应用查询数据
在 App.vue 中添加以下代码查询数据：

<script setup>
import { ref, onMounted } from "vue";
import cloudbase from "@cloudbase/js-sdk";

let db = null;

const getDB = async () => {
  if (!db) {
    const app = cloudbase.init({
      env: import.meta.env.VITE_CLOUDBASE_ENV_ID,
    });
    const auth = app.auth({
      persistence: "local",
    });
    await auth.signInAnonymously();
    db = app.mysql();
  }
  return db;
};

const todos = ref([]);

const fetchTodos = async () => {
  try {
    const { data } = await getDB().from("todos").select("*").range(0, 9);
    todos.value = data;
  } catch (error) {
    console.error("获取待办事项失败:", error);
  }
};

onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
    </ul>
  </div>
</template>

# 3 云函数

快速开始
云函数本质也是一份代码，这里以 Node.js 作为示例，介绍如何创建云函数。

Node.js 服务一般都需要一个入口文件 index.js，如果您用到了 npm 包，还需要一个 package.json 文件，用于描述依赖关系。

因此最基本的 Node.js 服务目录结构如下：

└── helloWorld
    ├── index.js
    └── package.json

创建云函数
您可以通过以下三种方式创建云函数，请根据您的开发环境选择合适的方式：

云开发控制台
小程序 IDE
本地创建
进入 云开发平台/云函数，点击「新建云函数」按钮。

选择合适的模版，没有合适的可以选择从空白创建
选择运行环境为 Nodejs 18.15（也可以选择其他版本）
填入函数名称
点击「开始创建」按钮
创建完成后，进入到云函数中，可以看到默认有个 index.js 文件。

点击下方「保存并安装依赖」，即可完成云函数的部署
调用云函数
调用云函数主要有以下几种方法：

使用云开发 SDK
使用 HTTP 访问服务
使用 HTTP API
使用触发器
使用 SDK 调用云函数
小程序
Web
Node.js
const cloudbase = require('@cloudbase/node-sdk');
const app = cloudbase.init({
    env: 'xxxx-yyy',
});

app.callFunction({
    // 云函数名称
    name: 'hello_world',
    // 传给云函数的参数
    data: {
        a: 1,
    },
})
    .then((res) => {
        console.log(res); // Hello World!
    })
    .catch(console.error);

使用 HTTP 访问服务调用云函数
您可以选择创建 HTTP 服务 用来访问云函数，然后通过 HTTP 调用云函数。

有如下两种操作方式：

云开发控制台
进入 云开发平台/HTTP 访问服务

新建一个「域名关联资源」：

关联资源选择云函数，hello_world
域名选择默认域名，也可以选择您自定义域名
填写触发路径，这里填写 /hello


点击确定，等待 3-5 分钟后，即可完成 HTTP 服务 创建


HTTP 服务地址为 默认域名+触发路径，您也可以选择用自定义域名进行绑定资源
CLI 工具
具体请参考 HTTP 访问服务

执行以下命令创建一条 HTTP 服务路由，路径为 /hello，指向的云函数为 hello_world：

tcb service create -p hello -f hello_world -e <env-id>

随后便可以通过进入 云开发平台/HTTP 访问服务 查看创建的 HTTP 服务。

使用 HTTP API 调用云函数
创建好云函数后，可以通过 HTTP API 在任意客户端调用云函数，无需 SDK。

具体请参考 HTTP API 调用云函数，访问 HTTP API 需要一个 ACCESS_TOKEN。

curl -L 'https://your-envId.api.tcloudbasegateway.com/v1/functions/:name' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -d '{}'


如何编写云函数
函数入参详解
每个云函数调用都会收到两个重要对象：event 和 context。

event 对象
event 对象包含触发云函数的事件数据，其内容根据触发方式不同而变化：

小程序调用：包含小程序端传入的参数
HTTP 请求调用：包含 HTTP 请求信息（如请求头、请求体等）
定时触发：包含定时触发的相关信息
context 对象
context 对象提供调用上下文信息，帮助您了解函数的运行环境和调用方式：

请求 ID：当前调用的唯一标识符
调用来源：触发函数的服务或客户端信息
执行环境：函数的运行时信息
用户身份：调用方的身份信息（如有）
基础代码示例
以下是一个简单的 Node.js 云函数示例，展示如何处理入参并返回结果：

// index.js - 云函数入口文件
exports.main = async (event, context) => {
    // 1. 解析云函数入参
    const { a, b } = event;

    // 2. 执行业务逻辑
    const sum = a + b;

    // 3. 返回结果
    return {
        sum,
        timestamp: Date.now(),
        requestId: context.requestId,
    };
};

异步处理实践
由于实例的管理由平台自动处理，推荐云函数采用 async/await 模式，避免使用 Promise 链式调用：

exports.main = async (event, context) => {
    // ❌ 不推荐：Promise 链式调用
    getList().then((res) => {
        // do something...
    });

    // ✅ 推荐：使用 async/await
    const res = await getList();
    // do something...
};

环境变量使用
云函数可以通过 process.env 获取环境变量，这是管理配置信息的实践：

获取环境变量
exports.main = async (event, context) => {
    // 获取环境变量
    const dbUrl = process.env.DATABASE_URL;
    const apiKey = process.env.API_KEY;
    const nodeEnv = process.env.NODE_ENV || 'development';

    // 使用环境变量进行配置
    const config = {
        database: dbUrl,
        apiKey: apiKey,
        debug: nodeEnv === 'development',
    };

    return {
        message: '环境变量获取成功',
        environment: nodeEnv,
    };
};

环境变量实践
exports.main = async (event, context) => {
    // 检查必需的环境变量
    const requiredEnvVars = ['DATABASE_URL', 'API_KEY'];
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`缺少必需的环境变量: ${missingVars.join(', ')}`);
    }

    // 安全地使用环境变量
    const config = {
        dbUrl: process.env.DATABASE_URL,
        apiKey: process.env.API_KEY,
        timeout: parseInt(process.env.TIMEOUT) || 5000,
    };

    return { success: true, config };
};

注意
敏感信息（如 API 密钥、数据库连接字符串）应通过环境变量传递，不要硬编码在代码中
环境变量值始终是字符串类型，需要时请进行类型转换
建议为环境变量设置默认值，提高代码的健壮性
时区设置
云函数的运行环境内保持的是 UTC 时间，即 0 时区时间，和北京时间有 8 小时的时间差。

可以通过语言的时间处理相关库或代码包（如 moment-timezone），识别 UTC 时间并转换为+8 区北京时间。

时区处理示例
const moment = require('moment-timezone'); // 需在 package.json 中指定并安装依赖

exports.main = async (event, context) => {
    // javascript date
    console.log(new Date()); // 2021-03-16T08:04:07.441Z (UTC+0)
    console.log(moment().tz('Asia/Shanghai').format()); // 2021-03-16T16:04:07+08:00 (UTC+8)

    // 获取当前北京时间
    const beijingTime = moment().tz('Asia/Shanghai');

    return {
        utcTime: new Date().toISOString(),
        beijingTime: beijingTime.format(),
        timestamp: beijingTime.valueOf(),
    };
};

时区处理实践
const moment = require('moment-timezone');

exports.main = async (event, context) => {
    // 统一时区处理函数
    const getBeijingTime = (date = new Date()) => {
        return moment(date).tz('Asia/Shanghai');
    };

    // 格式化时间输出
    const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
        return getBeijingTime(date).format(format);
    };

    // 业务逻辑中使用
    const currentTime = getBeijingTime();
    const formattedTime = formatTime();

    console.log('当前北京时间:', formattedTime);

    return {
        success: true,
        currentTime: formattedTime,
        timestamp: currentTime.valueOf(),
    };
};

使用 ES Module 规范
在云函数 Node.js 环境中无法直接采用 ES Module 规范编写代码，主要原因在于，云函数默认支持的入口文件（index.js）必须遵循 CommonJS 规范，并且文件名必须为 「index.js」。然而，Node.js 对于符合 ES Module 规范的模块文件要求其扩展名为 .mjs。

在云函数中使用 ES Module 需要创建三个核心文件，形成完整的调用链路：index.js → entry.mjs → util.mjs

项目结构
cloud-function/
├── index.js        # 云函数入口文件（CommonJS）
├── entry.mjs       # ES Module 入口文件
└── src
    └── util.mjs       # 业务逻辑模块，命名可自定义

1. 创建云函数入口文件 index.js
// index.js - 云函数入口文件
exports.main = async (event, context) => {
    try {
        // 动态导入 ES Module 入口文件
        const { entry } = await import('./entry.mjs');
        return await entry(event, context);
    } catch (error) {
        console.error('云函数执行失败:', error);
        return {
            success: false,
            error: error.message,
            requestId: context.request_id
        };
    }
};

2. 创建 ES Module 入口文件 entry.mjs
// entry.mjs - ES Module 入口文件
import { getUserList } from './src/util.mjs';

/**
 * ES Module 入口函数
 * @param {Object} event - 事件对象
 * @param {Object} context - 上下文对象
 * @returns {Promise<Object>} 处理结果
 */
export const entry = async (event, context) => {
    return getUserList(event, context);
};

3. 创建业务逻辑模块 util.mjs
// src/util.mjs - 业务逻辑模块
import cloudbase from '@cloudbase/node-sdk';

const app = cloudbase.init({
    env: 'your-envid', // 替换为您的环境 ID
});

const models = app.models;

export const getUserList = async (event) => {
    const res = await models.user.list({});

    return {
        success: true,
        data: res,
    };
};

💡 注意: ES Module 文件必须使用 .mjs 扩展名，这样 Node.js 才能正确识别并处理 ES Module 语法。

错误处理与日志记录
错误处理实践
exports.main = async (event, context) => {
    try {
        // 参数验证
        if (!event.userId) {
            throw new Error('缺少必需参数: userId');
        }

        // 业务逻辑处理
        const result = await processUserData(event.userId);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        // 记录错误日志
        console.error('函数执行失败:', {
            error: error.message,
            stack: error.stack,
            event,
            requestId: context.requestId,
        });

        // 返回友好的错误信息
        return {
            success: false,
            error: error.message,
            requestId: context.requestId,
        };
    }
};

性能优化建议
执行时间优化
exports.main = async (event, context) => {
    const startTime = Date.now();

    try {
        // 使用并行处理提升性能
        const promises = event.items.map((item) => processItem(item));
        const results = await Promise.all(promises);

        const duration = Date.now() - startTime;
        console.log(`函数执行耗时: ${duration}ms`);

        return {
            success: true,
            data: results,
            duration,
        };
    } catch (error) {
        console.error('执行错误:', error);
        throw error;
    }
};

内存使用优化
exports.main = async (event, context) => {
    // 分批处理大数据，避免内存溢出
    const batchSize = parseInt(process.env.BATCH_SIZE) || 100;
    const results = [];

    for (let i = 0; i < event.data.length; i += batchSize) {
        const batch = event.data.slice(i, i + batchSize);
        const batchResult = await processBatch(batch);
        results.push(...batchResult);

        // 及时清理不需要的变量
        batch.length = 0;

        // 记录处理进度
        console.log(`已处理 ${Math.min(i + batchSize, event.data.length)}/${event.data.length} 条数据`);
    }

    return results;
};

如何调用云函数
云开发提供了多种 SDK 供开发者进行调用云函数，包括小程序 SDK、Web SDK、Node.js SDK、HTTP API 等。

调用示例
小程序
Web SDK
Node.js SDK
HTTP API
详情请参考：Node.js SDK

import cloudbase from "@cloudbase/node-sdk";

//初始化SDK实例
const app = cloudbase.init({
  env: "your-env-id",
});

const res = await app.callFunction({
  name: 'functionName', // 云函数名称
  data: {
    // 传递给云函数的参数
    param1: 'value1',
    param2: 'value2'
  }
});
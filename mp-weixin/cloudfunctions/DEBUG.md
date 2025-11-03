# 🐛 云函数调试指南

## 错误分析

### 当前错误
```
errCode: -504002 functions execute fail
errMsg: 145 code exit unexpected
```

**含义：** 云函数代码执行时崩溃退出

---

## 🔍 可能的原因

1. **依赖包问题**
   - `@cloudbase/node-sdk` 与 `wx-server-sdk` 冲突
   - 依赖未正确安装

2. **MySQL 连接问题**
   - MySQL 数据库未正确配置
   - `app.mysql()` 调用失败

3. **代码错误**
   - 语法错误或运行时异常

---

## ✅ 解决方案：分步测试

### 第1步：测试基础云函数（不访问数据库）

我已经创建了简化版的 `login` 云函数，只测试 openid 获取。

**部署测试云函数：**
1. 右键 `mp-weixin/cloudfunctions/test` 文件夹
2. 选择 **「上传并部署：云端安装依赖」**
3. 等待部署完成

**测试：**

在测试页面临时添加测试按钮，或在控制台执行：

```javascript
wx.cloud.callFunction({
  name: 'test',
  data: {}
}).then(res => {
  console.log('测试成功:', res)
}).catch(err => {
  console.error('测试失败:', err)
})
```

**预期结果：**
```json
{
  "success": true,
  "data": {
    "openid": "oXXXX...",
    "appid": "wxXXXX...",
    ...
  }
}
```

---

### 第2步：重新部署简化版 login 云函数

我已经简化了 `login` 云函数，移除了 MySQL 连接，只使用 `wx-server-sdk`。

**部署：**
1. 右键 `mp-weixin/cloudfunctions/login` 文件夹
2. 选择 **「上传并部署：云端安装依赖」**
3. 等待完成

**测试：**

点击测试页面的"执行测试"按钮

**预期结果：**
- ✅ 能成功获取 openid
- ✅ 返回用户信息（临时数据，未存数据库）

---

### 第3步：添加 MySQL 支持

如果基础测试通过，再添加 MySQL 数据库操作。

---

## 🎯 当前状态

### ✅ 已创建文件

1. **`mp-weixin/cloudfunctions/test/`** - 测试云函数
   - 只测试 openid 获取
   - 无数据库操作

2. **`mp-weixin/cloudfunctions/login/`** - 简化版登录
   - 只使用 `wx-server-sdk`
   - 暂时不访问 MySQL
   - 返回临时数据

---

## 📋 部署步骤

### 1. 部署 test 云函数

```
右键 mp-weixin/cloudfunctions/test
→ 上传并部署：云端安装依赖
→ 等待完成
```

### 2. 部署 login 云函数

```
右键 mp-weixin/cloudfunctions/login
→ 上传并部署：云端安装依赖
→ 等待完成
```

### 3. 测试

在测试页面点击"执行测试"

---

## 🔍 查看云函数日志

**重要：** 部署后立即查看日志！

### 在微信开发者工具中：

1. 点击顶部 **「云开发」** 按钮
2. 点击 **「云函数」**
3. 点击 **`login`** 云函数
4. 点击 **「日志」** 标签
5. 查看最新的日志输出

### 日志中应该看到：

```
[LOGIN] 云函数开始执行
[LOGIN] 成功获取 openid: oXXXX...
[LOGIN] 登录成功
```

### 如果看到错误：

复制完整的错误堆栈告诉我！

---

## ⚠️ 关于 MySQL

### 问题

微信云开发的 MySQL 数据库需要使用 `@cloudbase/node-sdk`，但可能与 `wx-server-sdk` 有兼容性问题。

### 解决方案选项

**选项1：使用云数据库（推荐）**
- 使用微信云开发的 NoSQL 数据库
- 完美兼容 `wx-server-sdk`
- 性能好，易于使用

**选项2：继续使用 MySQL**
- 需要正确配置 `@cloudbase/node-sdk`
- 可能需要单独的云函数处理数据库操作
- 需要确保 MySQL 实例已创建并配置

### 建议

先用简化版测试通过，确认云函数基础功能正常，然后再考虑数据库方案。

---

## 🚀 下一步

### 立即执行：

1. **部署 test 云函数** - 测试基础功能
2. **部署 login 云函数** - 测试登录（不含数据库）
3. **查看日志** - 确认是否有错误
4. **测试** - 点击"执行测试"
5. **反馈结果** - 告诉我是否成功

---

## 📞 反馈信息

测试后请告诉我：

✅ **如果成功：**
- "test 云函数测试通过"
- "login 云函数测试通过"
- 我会帮你添加 MySQL 数据库支持

❌ **如果失败：**
- 复制云函数日志的错误信息
- 告诉我具体错误内容

---

准备好后开始测试！🚀


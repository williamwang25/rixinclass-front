# Uniapp 页面布局检查清单

## 问题诊断

### 现象
- 页面内容超出屏幕右侧边缘
- 出现横向滚动条
- 文本或容器溢出

### 根本原因
CSS盒模型问题：元素设置了 `padding` 但没有 `box-sizing: border-box`，导致实际宽度 = 100% + padding

## 强制性规则

### 1. 页面容器 (必须)
```scss
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  width: 100%;                    // ✅ 必须
  box-sizing: border-box;         // ✅ 必须
  overflow-x: hidden;             // ✅ 必须
}
```

### 2. 导航栏容器 (必须)
```scss
.custom-navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid #e6e6e6;
  width: 100%;                    // ✅ 必须
  box-sizing: border-box;         // ✅ 必须
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  width: 100%;                    // ✅ 必须
  box-sizing: border-box;         // ✅ 必须
}
```

### 3. 滚动容器 (必须)
```scss
.scroll-container {
  flex: 1;
  padding: 30rpx;                 // 有padding时
  width: 100%;                    // ✅ 必须
  box-sizing: border-box;         // ✅ 必须
}
```

### 4. 卡片/内容容器 (有 padding 时必须)
```scss
.card,
.welcome-card,
.intro-card,
.form-card,
// ... 所有带 padding 的容器
{
  padding: 30rpx;                 // 只要有padding
  width: 100%;                    // ✅ 必须
  box-sizing: border-box;         // ✅ 必须
}
```

### 5. 文本内容 (长文本必须)
```scss
.text-content,
.description,
.answer-text,
// ... 所有可能包含长文本的元素
{
  word-break: break-all;          // ✅ 必须
  overflow-wrap: break-word;      // ✅ 必须
  max-width: 100%;                // ✅ 推荐
}
```

### 6. 输入框/表单元素 (必须)
```scss
.custom-input,
.custom-textarea,
.select-input {
  width: 100%;                    // ✅ 必须
  box-sizing: border-box;         // ✅ 必须
}
```

## 检查清单

### 创建新页面时
- [ ] .page-container 添加 width: 100% + box-sizing + overflow-x: hidden
- [ ] .custom-navbar 和 .navbar-content 添加 width: 100% + box-sizing
- [ ] .scroll-container 添加 width: 100% + box-sizing
- [ ] 所有带 padding 的容器添加 width: 100% + box-sizing
- [ ] 所有可能包含长文本的元素添加 word-break + overflow-wrap
- [ ] 所有输入框添加 width: 100% + box-sizing

### 修复现有页面时
1. 检查是否有横向滚动或内容溢出
2. 使用浏览器开发者工具查看哪个元素超出
3. 为该元素及其父容器添加上述规则

## 快速修复模板

```scss
// 通用修复：为所有主要容器添加
.page-container,
.custom-navbar,
.navbar-content,
.scroll-container {
  width: 100%;
  box-sizing: border-box;
}

// 为所有卡片容器添加
[class*="-card"],
[class*="-container"],
[class*="-wrapper"] {
  width: 100%;
  box-sizing: border-box;
}

// 为所有文本内容添加
[class*="-text"],
[class*="-desc"],
[class*="-content"] {
  word-break: break-all;
  overflow-wrap: break-word;
}
```

## 注意事项

1. **永远不要忘记 box-sizing**
   - 只要元素有 padding 或 border，就必须设置 box-sizing: border-box

2. **优先使用 box-sizing，而不是调整宽度**
   - ❌ 错误：width: calc(100% - 60rpx);
   - ✅ 正确：width: 100%; padding: 0 30rpx; box-sizing: border-box;

3. **父容器也要设置**
   - 不仅子元素要设置，所有父容器也要设置 width: 100% + box-sizing

4. **使用 overflow-x: hidden 作为最后防线**
   - 在 .page-container 上设置，防止任何意外的横向滚动

## 自动检测命令

在开发时可以在浏览器控制台运行：
```javascript
// 检测没有设置 box-sizing 的带 padding 元素
document.querySelectorAll('*').forEach(el => {
  const style = window.getComputedStyle(el);
  const padding = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
  const boxSizing = style.boxSizing;
  if (padding > 0 && boxSizing !== 'border-box') {
    console.warn('Missing box-sizing:', el, 'padding:', padding);
  }
});
```


// cloudfunctions/test/index.js
// 简单测试云函数 - 验证云开发环境是否正常

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    // 获取微信用户上下文
    const wxContext = cloud.getWXContext();
    
    return {
      success: true,
      message: '云函数运行正常',
      data: {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
        env: wxContext.ENV,
        event: event,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[TEST] 错误:', error);
    return {
      success: false,
      message: error.message,
      error: error.stack
    };
  }
};


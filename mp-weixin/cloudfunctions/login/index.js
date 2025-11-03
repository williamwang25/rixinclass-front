// cloudfunctions/login/index.js
// 用户登录云函数 - 测试版本

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

exports.main = async (event, context) => {
  try {
    const { nickName, avatarUrl } = event;
    
    // 1. 获取微信用户信息
    const wxContext = cloud.getWXContext();
    
    console.log('[LOGIN] 云函数开始执行');
    console.log('[LOGIN] wxContext:', wxContext);
    
    const OPENID = wxContext.OPENID;
    
    if (!OPENID) {
      return {
        success: false,
        message: '无法获取用户身份信息'
      };
    }
    
    console.log('[LOGIN] 成功获取 openid:', OPENID);
    
    // 2. 暂时返回用户信息（不访问数据库）
    const userData = {
      userId: Date.now(), // 临时使用时间戳作为ID
      openId: OPENID,
      nickName: nickName || '微信用户',
      avatar: avatarUrl || '',
      userType: 0,
      status: 1,
      isNewUser: true,
      note: '这是临时数据，未存入数据库'
    };
    
    console.log('[LOGIN] 登录成功，返回数据:', userData);
    
    return {
      success: true,
      message: '登录成功（测试版本）',
      data: userData,
      wxContext: {
        OPENID: wxContext.OPENID,
        APPID: wxContext.APPID,
        UNIONID: wxContext.UNIONID,
        ENV: wxContext.ENV
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('[LOGIN] 登录失败:', error);
    return {
      success: false,
      message: '登录失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    };
  }
};

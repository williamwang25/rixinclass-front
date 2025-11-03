// cloudfunctions/login/index.js
// 用户登录云函数 - 处理微信小程序用户登录逻辑

const cloud = require('wx-server-sdk');
const cloudbase = require('@cloudbase/node-sdk');

// 初始化 wx-server-sdk（用于获取用户信息）
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 初始化 cloudbase（用于访问 MySQL）
const app = cloudbase.init({
  env: process.env.ENV_ID || cloud.DYNAMIC_CURRENT_ENV
});

const db = app.mysql();

/**
 * 云函数入口
 * @param {Object} event - 客户端传入的参数
 * @param {string} event.nickName - 用户昵称
 * @param {string} event.avatarUrl - 用户头像URL
 * @param {Object} context - 云函数上下文
 * @returns {Object} 登录结果
 */
exports.main = async (event, context) => {
  try {
    const { nickName, avatarUrl } = event;
    
    // 1. 使用 wx-server-sdk 获取微信用户信息
    const wxContext = cloud.getWXContext();
    const OPENID = wxContext.OPENID;
    
    if (!OPENID) {
      return {
        success: false,
        message: '无法获取用户身份信息，请确保在微信小程序环境中运行'
      };
    }
    
    console.log('[LOGIN] 用户登录请求 - openid:', OPENID);
    
    // 2. 查询用户是否已存在
    const { data: existingUsers } = await db
      .from('rx_user')
      .select('*')
      .where({
        open_id: OPENID,
        is_deleted: 0
      })
      .get();
    
    let userData;
    
    if (existingUsers && existingUsers.length > 0) {
      // 3. 用户已存在，更新最后访问时间
      const user = existingUsers[0];
      
      console.log('[LOGIN] 老用户登录 - user_id:', user.user_id);
      
      await db
        .from('rx_user')
        .where({ user_id: user.user_id })
        .update({
          latest_visit_at: new Date(),
          updated_at: new Date()
        });
      
      userData = {
        userId: user.user_id,
        openId: user.open_id,
        nickName: user.nick_name,
        avatar: user.avatar,
        name: user.name,
        phone: user.phone,
        email: user.email,
        userType: user.user_type,
        status: user.status,
        isNewUser: false
      };
      
      // 检查用户状态
      if (user.status === 0) {
        return {
          success: false,
          message: '您的账户已被禁用，请联系管理员'
        };
      }
      
    } else {
      // 4. 新用户，创建用户记录
      console.log('[LOGIN] 新用户注册 - openid:', OPENID);
      
      const insertResult = await db.from('rx_user').insert({
        open_id: OPENID,
        nick_name: nickName || '微信用户',
        avatar: avatarUrl || '',
        user_type: 0, // 默认为教师
        status: 1,
        latest_visit_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: 0
      });
      
      const newUserId = insertResult.insertId;
      console.log('[LOGIN] 新用户创建成功 - user_id:', newUserId);
      
      userData = {
        userId: newUserId,
        openId: OPENID,
        nickName: nickName || '微信用户',
        avatar: avatarUrl || '',
        name: null,
        phone: null,
        email: null,
        userType: 0,
        status: 1,
        isNewUser: true
      };
    }
    
    console.log('[LOGIN] 登录成功 - userData:', userData);
    
    return {
      success: true,
      message: '登录成功',
      data: userData,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('[LOGIN] 登录失败:', error);
    return {
      success: false,
      message: '登录失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack
      }
    };
  }
};


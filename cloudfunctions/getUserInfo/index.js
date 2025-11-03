// cloudfunctions/getUserInfo/index.js
// 获取用户信息云函数 - 根据用户ID查询用户详细信息

const cloud = require('wx-server-sdk');
const cloudbase = require('@cloudbase/node-sdk');

// 初始化 wx-server-sdk
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
 * @param {number} event.userId - 用户ID
 * @param {Object} context - 云函数上下文
 * @returns {Object} 用户信息
 */
exports.main = async (event, context) => {
  try {
    const { userId } = event;
    
    // 1. 验证参数
    if (!userId) {
      return {
        success: false,
        message: '缺少必填参数: userId'
      };
    }
    
    console.log('[GET_USER_INFO] 查询用户信息 - userId:', userId);
    
    // 2. 查询用户信息（排除敏感字段）
    const { data: users } = await db
      .from('rx_user')
      .select(
        'user_id, open_id, nick_name, avatar, name, phone, email, ' +
        'user_type, status, latest_visit_at, created_at'
      )
      .where({
        user_id: userId,
        is_deleted: 0
      })
      .get();
    
    // 3. 检查用户是否存在
    if (!users || users.length === 0) {
      console.log('[GET_USER_INFO] 用户不存在 - userId:', userId);
      return {
        success: false,
        message: '用户不存在'
      };
    }
    
    const user = users[0];
    
    // 4. 检查用户状态
    if (user.status === 0) {
      console.log('[GET_USER_INFO] 用户已被禁用 - userId:', userId);
      return {
        success: false,
        message: '账户已被禁用，请联系管理员'
      };
    }
    
    // 5. 返回用户信息
    const userData = {
      userId: user.user_id,
      openId: user.open_id,
      nickName: user.nick_name,
      avatar: user.avatar,
      name: user.name,
      phone: user.phone,
      email: user.email,
      userType: user.user_type,
      userTypeName: user.user_type === 0 ? '教师' : '管理员',
      status: user.status,
      statusName: user.status === 1 ? '正常' : '禁用',
      latestVisitAt: user.latest_visit_at,
      createdAt: user.created_at
    };
    
    console.log('[GET_USER_INFO] 查询成功');
    
    return {
      success: true,
      message: '查询成功',
      data: userData,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('[GET_USER_INFO] 查询失败:', error);
    return {
      success: false,
      message: '查询失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack
      }
    };
  }
};


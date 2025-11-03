// cloudfunctions/getUserInfo/index.js
// 获取用户信息云函数 - 简化版本

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const { userId } = event;
    
    console.log('[GET_USER_INFO] 开始查询 - userId:', userId);
    
    // 验证参数
    if (!userId) {
      return {
        success: false,
        message: '缺少必填参数: userId'
      };
    }
    
    // 查询用户信息
    const { data: users } = await db.collection('rx_user')
      .where({
        user_id: userId,
        is_deleted: 0
      })
      .get();
    
    if (!users || users.length === 0) {
      console.log('[GET_USER_INFO] 用户不存在');
      return {
        success: false,
        message: '用户不存在'
      };
    }
    
    const user = users[0];
    
    if (user.status === 0) {
      return {
        success: false,
        message: '账户已被禁用，请联系管理员'
      };
    }
    
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

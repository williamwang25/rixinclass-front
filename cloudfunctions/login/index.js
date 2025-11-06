// cloudfunctions/login/index.js
// 用户登录云函数 - 使用云开发 MySQL

const cloud = require('wx-server-sdk')
const cloudbase = require('@cloudbase/node-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 初始化 cloudbase MySQL
const app = cloudbase.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = app.database()

exports.main = async (event, context) => {
  try {
    const { nickName, avatarUrl } = event
    
    // 1. 获取微信用户信息
    const wxContext = cloud.getWXContext()
    const OPENID = wxContext.OPENID
    
    console.log('[LOGIN] 开始登录 - openid:', OPENID)
    
    if (!OPENID) {
      return {
        success: false,
        message: '无法获取用户身份信息'
      }
    }
    
    // 2. 查询用户是否存在（使用云数据库）
    const { data: existingUsers } = await db.collection('rx_user')
      .where({
        open_id: OPENID,
        is_deleted: 0
      })
      .get()
    
    let userData
    
    if (existingUsers && existingUsers.length > 0) {
      // 3. 老用户 - 更新访问时间
      const user = existingUsers[0]
      console.log('[LOGIN] 老用户登录 - user_id:', user.user_id)
      
      await db.collection('rx_user').doc(user._id).update({
        data: {
          latest_visit_at: new Date(),
          updated_at: new Date()
        }
      })
      
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
      }
      
      if (user.status === 0) {
        return {
          success: false,
          message: '您的账户已被禁用，请联系管理员'
        }
      }
    }
    else {
      // 4. 新用户 - 创建记录
      console.log('[LOGIN] 新用户注册 - openid:', OPENID)
      
      // 生成用户ID（使用时间戳）
      const newUserId = Date.now()
      
      await db.collection('rx_user').add({
        data: {
          user_id: newUserId,
          open_id: OPENID,
          nick_name: nickName || '微信用户',
          avatar: avatarUrl || '',
          user_type: 0,
          status: 1,
          latest_visit_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: 0
        }
      })
      
      console.log('[LOGIN] 新用户创建成功 - user_id:', newUserId)
      
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
      }
    }
    
    console.log('[LOGIN] 登录成功')
    
    return {
      success: true,
      message: '登录成功',
      data: userData,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('[LOGIN] 登录失败:', error)
    return {
      success: false,
      message: '登录失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack
      }
    }
  }
}

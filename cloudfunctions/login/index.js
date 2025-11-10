// cloudfunctions/login/index.js
// 用户登录云函数

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { nickName, avatarUrl } = event
    
    // 1. 获取微信用户信息
    const wxContext = cloud.getWXContext()
    const OPENID = wxContext.OPENID
    
    console.log('[LOGIN] 开始登录 - openid:', OPENID)
    console.log('[LOGIN] 用户信息 - nickName:', nickName, 'avatarUrl:', avatarUrl)
    
    if (!OPENID) {
      return {
        success: false,
        message: '无法获取用户身份信息'
      }
    }
    
    // 2. 查询用户是否存在
    const { data: existingUsers } = await db.collection('rx_user')
      .where({
        open_id: OPENID,
        is_deleted: 0
      })
      .get()
    
    console.log('[LOGIN] 查询结果 - 用户数量:', existingUsers.length)
    
    let userData
    
    if (existingUsers && existingUsers.length > 0) {
      // 3. 老用户 - 更新访问时间
      const user = existingUsers[0]
      console.log('[LOGIN] 老用户登录 - user_id:', user.user_id)
      
      // 更新访问时间（使用 doc().update()）
      await db.collection('rx_user')
        .doc(user._id)
        .update({
          data: {
            latest_visit_at: new Date(),
            updated_at: new Date()
          }
        })
      
      console.log('[LOGIN] 访问时间已更新')
      
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
      
      console.log('[LOGIN] 准备创建用户 - userId:', newUserId)
      
      // 创建新用户记录（使用微信真实昵称）
      const addResult = await db.collection('rx_user').add({
        data: {
          user_id: newUserId,
          open_id: OPENID,
          nick_name: nickName || '新用户',  // 使用传入的微信昵称
          avatar: avatarUrl || '',
          name: null,
          phone: null,
          email: null,
          user_type: 0,  // 0=教师
          status: 1,     // 1=正常
          latest_visit_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: 0
        }
      })
      
      console.log('[LOGIN] 新用户创建结果:', addResult)
      console.log('[LOGIN] 新用户创建成功 - user_id:', newUserId, '_id:', addResult._id)
      
      userData = {
        userId: newUserId,
        openId: OPENID,
        nickName: nickName || '新用户',  // 使用传入的微信昵称
        avatar: avatarUrl || '',
        name: null,
        phone: null,
        email: null,
        userType: 0,
        status: 1,
        isNewUser: true
      }
    }
    
    console.log('[LOGIN] 登录成功，返回数据:', userData)
    
    return {
      success: true,
      message: '登录成功',
      data: userData,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('[LOGIN] 登录失败:', error)
    console.error('[LOGIN] 错误详情:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return {
      success: false,
      message: '登录失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code
      }
    }
  }
}

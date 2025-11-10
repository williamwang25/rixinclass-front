// cloudfunctions/updateUserInfo/index.js
// 更新用户信息云函数

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { userId, nickName, name, phone, email } = event
    
    console.log('[UPDATE_USER_INFO] 更新用户信息 - userId:', userId)
    console.log('[UPDATE_USER_INFO] 数据:', { nickName, name, phone, email })
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID参数'
      }
    }
    
    // 构建更新数据
    const updateData = {
      updated_at: new Date()
    }
    
    if (nickName !== undefined && nickName !== null) {
      updateData.nick_name = nickName
    }
    if (name !== undefined && name !== null) {
      updateData.name = name
    }
    if (phone !== undefined && phone !== null) {
      updateData.phone = phone
    }
    if (email !== undefined && email !== null) {
      updateData.email = email
    }
    
    console.log('[UPDATE_USER_INFO] 更新字段:', updateData)
    
    // 更新用户信息
    const result = await db.collection('rx_user')
      .where({ user_id: userId })
      .update({
        data: updateData
      })
    
    console.log('[UPDATE_USER_INFO] 更新结果:', result)
    
    if (result.stats.updated === 0) {
      return {
        success: false,
        message: '用户不存在或更新失败'
      }
    }
    
    console.log('[UPDATE_USER_INFO] 更新成功')
    
    return {
      success: true,
      message: '信息更新成功',
      data: {
        updated: result.stats.updated
      }
    }
    
  } catch (error) {
    console.error('[UPDATE_USER_INFO] 更新失败:', error)
    return {
      success: false,
      message: '更新失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack
      }
    }
  }
}



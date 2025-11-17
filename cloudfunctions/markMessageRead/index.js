// 云函数：标记消息已读
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { messageId, userId } = event
    
    console.log('[markMessageRead] 标记已读:', { messageId, userId })
    
    if (!messageId && !userId) {
      return {
        success: false,
        message: '请提供消息ID或用户ID'
      }
    }
    
    const where = { is_deleted: 0 }
    
    if (messageId) {
      // 标记单条消息已读
      where.message_id = messageId
    } else {
      // 标记用户所有消息已读
      where.receiver_id = userId
    }
    
    const result = await db.collection('message')
      .where(where)
      .update({
        data: {
          is_read: 1,
          update_time: new Date()
        }
      })
    
    console.log('[markMessageRead] 标记完成:', result.stats.updated)
    
    return {
      success: true,
      message: '标记成功',
      count: result.stats.updated
    }
  } catch (error) {
    console.error('[markMessageRead] 失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}


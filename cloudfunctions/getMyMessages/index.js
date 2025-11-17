// 云函数：获取个人消息列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { userId, isRead, pageSize = 100 } = event
    
    console.log('[getMyMessages] 查询参数:', { userId, isRead, pageSize })
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID参数'
      }
    }
    
    // 构建查询条件
    const where = {
      receiver_id: userId,
      is_deleted: 0
    }
    
    if (isRead !== undefined && isRead !== null && isRead !== '') {
      where.is_read = isRead
    }
    
    // 查询消息列表
    const { data } = await db.collection('message')
      .where(where)
      .orderBy('create_time', 'desc')
      .limit(pageSize)
      .get()
    
    // 查询未读数量
    const { total: unreadCount } = await db.collection('message')
      .where({
        receiver_id: userId,
        is_read: 0,
        is_deleted: 0
      })
      .count()
    
    console.log('[getMyMessages] 查询完成:', { count: data.length, unreadCount })
    
    return {
      success: true,
      data,
      unreadCount
    }
  } catch (error) {
    console.error('[getMyMessages] 失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}


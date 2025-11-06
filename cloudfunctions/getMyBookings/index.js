// cloudfunctions/getMyBookings/index.js
// 获取我的申请列表云函数

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const { userId, status, pageNum = 1, pageSize = 10 } = event
    
    console.log('[GET_MY_BOOKINGS] 查询我的申请 - userId:', userId)
    
    if (!userId) {
      return {
        success: false,
        message: '缺少必填参数: userId'
      }
    }
    
    // 构建查询条件
    const where = {
      user_id: userId,
      is_deleted: 0
    }
    
    // 如果指定了状态，添加状态筛选
    if (status !== undefined && status !== null) {
      where.status = status
    }
    
    // 查询申请列表
    const { data: bookings } = await db.collection('booking')
      .where(where)
      .orderBy('create_time', 'desc')
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    // 查询总数
    const countResult = await db.collection('booking')
      .where(where)
      .count()
    
    console.log('[GET_MY_BOOKINGS] 查询成功，共 ' + countResult.total + ' 条申请')
    
    return {
      success: true,
      message: '查询成功',
      data: bookings,
      total: countResult.total,
      pageNum,
      pageSize
    }
    
  } catch (error) {
    console.error('[GET_MY_BOOKINGS] 查询失败:', error)
    return {
      success: false,
      message: '查询失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack
      }
    }
  }
}


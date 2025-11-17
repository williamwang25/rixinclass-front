// 云函数：获取个人排课记录（小程序用）
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { userId, academicYear, semester } = event
    
    console.log('[getMySchedules] 查询参数:', { userId, academicYear, semester })
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID参数'
      }
    }
    
    // 1. 查询用户的已排课申请
    const bookingWhere = {
      user_id: userId,
      status: 1,
      is_scheduled: 1,
      is_deleted: 0
    }
    
    if (academicYear) bookingWhere.academic_year = academicYear
    if (semester) bookingWhere.semester = semester
    
    const { data: bookings } = await db.collection('booking')
      .where(bookingWhere)
      .get()
    
    if (bookings.length === 0) {
      return {
        success: true,
        data: []
      }
    }
    
    const bookingIds = bookings.map(b => b.booking_id)
    
    // 2. 查询这些申请的排课记录
    const _ = db.command
    const { data: schedules } = await db.collection('schedule')
      .where({
        booking_id: _.in(bookingIds),
        is_deleted: 0
      })
      .orderBy('weekday', 'asc')
      .orderBy('period_start', 'asc')
      .get()
    
    console.log('[getMySchedules] 查询完成:', { count: schedules.length })
    
    return {
      success: true,
      data: schedules
    }
  } catch (error) {
    console.error('[getMySchedules] 失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}


// cloudfunctions/createBooking/index.js
// 创建排课申请云函数

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 生成申请编号（改为序号）
async function generateBookingNo(db) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  
  // 查询今天已有的申请数量
  const prefix = `BK${dateStr}`
  const { total } = await db.collection('booking')
    .where({
      booking_no: db.RegExp({
        regexp: `^${prefix}`,
        options: 'i'
      })
    })
    .count()
  
  // 序号 = 今天的数量 + 1
  const sequence = String(total + 1).padStart(4, '0')
  return `BK${dateStr}-${sequence}`
}

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const userId = event.userId
    
    console.log('[CREATE_BOOKING] 开始创建申请 - userId:', userId)
    
    // 验证必填参数
    const requiredFields = ['userId', 'academicYear', 'semester', 'courseName', 'studentCount', 'timeSlots']
    for (const field of requiredFields) {
      if (!event[field]) {
        return {
          success: false,
          message: `缺少必填参数: ${field}`
        }
      }
    }
    
    // 验证时间段
    if (!Array.isArray(event.timeSlots) || event.timeSlots.length === 0) {
      return {
        success: false,
        message: '请至少选择一个时间段'
      }
    }
    
    // 生成申请编号（改为序号）
    const bookingNo = await generateBookingNo(db)
    const bookingId = Date.now()
    
    // 准备申请数据
    const bookingData = {
      booking_id: bookingId,
      booking_no: bookingNo,
      user_id: userId,
      academic_year: event.academicYear,
      semester: event.semester,
      course_code: event.courseCode || '',
      course_type: event.courseType || '实验教学',
      course_name: event.courseName,
      required_hours: event.requiredHours || 0,
      booking_hours: event.bookingHours || 0,
      class_name: event.className || '',
      student_count: event.studentCount,
      time_slots: event.timeSlots,
      software_requirements: event.softwareRequirements || '',
      other_requirements: event.otherRequirements || '',
      teacher_name: event.teacherName || '',
      teacher_phone: event.teacherPhone || '',
      teacher_email: event.teacherEmail || '',
      teacher_signature: event.teacherSignature || '',
      status: 0, // 待审核
      review_user_id: null,
      review_time: null,
      review_remark: null,
      create_time: new Date(),
      create_user: userId,
      update_time: new Date(),
      update_user: null,
      is_deleted: 0
    }
    
    // 插入申请记录
    await db.collection('booking').add({
      data: bookingData
    })
    
    console.log('[CREATE_BOOKING] 申请创建成功 - bookingNo:', bookingNo)
    
    // 插入时间段记录
    for (const slot of event.timeSlots) {
      const slotId = Date.now() + Math.floor(Math.random() * 1000)
      await db.collection('booking_time_slots').add({
        data: {
          slot_id: slotId,
          booking_id: bookingId,
          weekday: slot.weekday,
          week_start: slot.weekStart,
          week_end: slot.weekEnd,
          period_start: slot.periodStart,
          period_end: slot.periodEnd,
          create_time: new Date(),
          create_user: userId,
          update_time: new Date(),
          update_user: null,
          is_deleted: 0
        }
      })
    }
    
    console.log('[CREATE_BOOKING] 时间段创建成功')
    
    // 注意：提交申请时不发送通知，只有拒绝和排课成功时才发送消息
    
    return {
      success: true,
      message: '申请提交成功',
      data: {
        bookingId,
        bookingNo
      }
    }
    
  } catch (error) {
    console.error('[CREATE_BOOKING] 创建失败:', error)
    return {
      success: false,
      message: '创建失败: ' + error.message,
      error: {
        message: error.message,
        stack: error.stack
      }
    }
  }
}


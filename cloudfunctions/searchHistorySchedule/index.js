// 云函数：搜索历史排课记录
const cloud = require('wx-server-sdk')
const cloudbase = require('@cloudbase/node-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const app = cloudbase.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = app.database()

// 获取上一学年
function getPreviousAcademicYear(currentYear) {
  // 例如: "2025-2026" -> "2024-2025"
  if (!currentYear || !currentYear.includes('-')) {
    return null
  }
  
  const [startYear, endYear] = currentYear.split('-')
  const prevStartYear = parseInt(startYear) - 1
  const prevEndYear = parseInt(endYear) - 1
  
  return `${prevStartYear}-${prevEndYear}`
}

exports.main = async (event, context) => {
  try {
    const { 
      teacherName,      // 教师姓名（用于匹配）
      courseCode,       // 课程代码（搜索关键词）
      courseName,       // 课程名称（搜索关键词）
      academicYear,     // 当前学年
      semester          // 当前学期
    } = event
    
    console.log('[searchHistorySchedule] 搜索参数:', {
      teacherName,
      courseCode,
      courseName,
      academicYear,
      semester
    })
    
    // 参数验证
    if (!teacherName) {
      return {
        success: false,
        message: '缺少教师姓名参数'
      }
    }
    
    if (!courseCode && !courseName) {
      return {
        success: false,
        message: '请输入课程代码或课程名称'
      }
    }
    
    if (!academicYear || !semester) {
      return {
        success: false,
        message: '缺少学年学期参数'
      }
    }
    
    // 计算上一学年
    const previousYear = getPreviousAcademicYear(academicYear)
    if (!previousYear) {
      return {
        success: false,
        message: '学年格式错误'
      }
    }
    
    console.log('[searchHistorySchedule] 查询上一学年:', previousYear)
    
    // 构建查询条件
    const whereCondition = {
      teacher_name: teacherName,
      academic_year: previousYear,
      semester: semester,
      is_deleted: 0
    }
    
    // 添加课程代码或课程名称的模糊查询
    if (courseCode && courseName) {
      // 如果两者都有，使用 OR 查询
      whereCondition.$or = [
        { course_code: db.RegExp({ regexp: courseCode, options: 'i' }) },
        { course_name: db.RegExp({ regexp: courseName, options: 'i' }) }
      ]
    } else if (courseCode) {
      whereCondition.course_code = db.RegExp({ regexp: courseCode, options: 'i' })
    } else if (courseName) {
      whereCondition.course_name = db.RegExp({ regexp: courseName, options: 'i' })
    }
    
    // 查询历史排课记录（从 schedule 表）
    const { data: schedules } = await db.collection('schedule')
      .where(whereCondition)
      .orderBy('create_time', 'desc')
      .limit(20)  // 最多返回20条
      .get()
    
    if (!schedules || schedules.length === 0) {
      console.log('[searchHistorySchedule] 未找到匹配的历史记录')
      return {
        success: true,
        data: [],
        message: '未找到匹配的历史排课记录'
      }
    }
    
    // 按课程分组去重（同一课程可能有多条记录）
    const courseMap = new Map()
    schedules.forEach(schedule => {
      const key = `${schedule.course_code}_${schedule.course_name}`
      if (!courseMap.has(key)) {
        courseMap.set(key, {
          courseCode: schedule.course_code,
          courseName: schedule.course_name,
          courseType: schedule.course_type,
          className: schedule.class_name,
          studentCount: schedule.student_count,
          requiredHours: schedule.required_hours,
          bookingHours: schedule.booking_hours,
          softwareRequirements: schedule.software_requirements,
          otherRequirements: schedule.other_requirements,
          academicYear: schedule.academic_year,
          semester: schedule.semester,
          labName: schedule.lab_name,
          building: schedule.building,
          labRoom: schedule.lab_room
        })
      }
    })
    
    const results = Array.from(courseMap.values())
    
    console.log('[searchHistorySchedule] 找到', results.length, '条历史记录')
    
    return {
      success: true,
      data: results,
      message: `找到 ${results.length} 条历史排课记录`
    }
    
  } catch (error) {
    console.error('[searchHistorySchedule] 查询失败:', error)
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

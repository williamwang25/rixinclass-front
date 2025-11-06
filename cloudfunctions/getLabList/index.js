// cloudfunctions/getLabList/index.js
// 获取实验室列表云函数

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    const { status } = event
    
    console.log('[GET_LAB_LIST] 开始查询实验室列表')
    
    // 构建查询条件
    const where = {
      is_deleted: 0
    }
    
    // 如果指定了状态，添加状态筛选
    if (status !== undefined && status !== null) {
      where.status = status
    }
    
    // 查询实验室列表
    const { data: labs } = await db.collection('labs')
      .where(where)
      .orderBy('building', 'asc')
      .orderBy('floor', 'asc')
      .orderBy('lab_room', 'asc')
      .get()
    
    console.log('[GET_LAB_LIST] 查询成功，共 ' + labs.length + ' 个实验室')
    
    return {
      success: true,
      message: '查询成功',
      data: labs,
      total: labs.length
    }
    
  } catch (error) {
    console.error('[GET_LAB_LIST] 查询失败:', error)
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


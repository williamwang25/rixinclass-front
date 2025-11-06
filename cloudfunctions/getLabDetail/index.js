// cloudfunctions/getLabDetail/index.js
// 获取实验室详情云函数

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { labId } = event
    
    console.log('[GET_LAB_DETAIL] 查询实验室详情 - labId:', labId)
    
    if (!labId) {
      return {
        success: false,
        message: '缺少必填参数: labId'
      }
    }
    
    // 查询实验室详情
    const { data: labs } = await db.collection('labs')
      .where({
        lab_id: labId,
        is_deleted: 0
      })
      .get()
    
    if (!labs || labs.length === 0) {
      console.log('[GET_LAB_DETAIL] 实验室不存在')
      return {
        success: false,
        message: '实验室不存在'
      }
    }
    
    const lab = labs[0]
    
    console.log('[GET_LAB_DETAIL] 查询成功')
    
    return {
      success: true,
      message: '查询成功',
      data: lab
    }
    
  } catch (error) {
    console.error('[GET_LAB_DETAIL] 查询失败:', error)
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


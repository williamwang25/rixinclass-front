// 云函数：获取公告列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { noticeType, pageSize = 100, includeStatus } = event
    
    console.log('[getNoticeList] 查询参数:', { noticeType, pageSize, includeStatus })
    
    // 构建查询条件 - 只查询全局公告（target_user_id 为 null）
    const where = { 
      is_deleted: 0,
      target_user_id: null  // 只查全局公告
    }
    
    // 如果指定了公告类型
    if (noticeType) {
      where.notice_type = noticeType
    }
    
    // 如果指定了状态（用于管理端查询所有状态，小程序端只查已发布）
    if (includeStatus) {
      // 管理端：查询所有状态（草稿+已发布）
      // 不添加status条件
    } else {
      // 小程序端：只查询已发布的公告
      where.status = 'published'
    }
    
    // 查询公告列表
    const { data } = await db.collection('notice')
      .where(where)
      .orderBy('priority', 'desc')
      .orderBy('create_time', 'desc')
      .limit(pageSize)
      .get()
    
    console.log('[getNoticeList] 查询完成:', { count: data.length })
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('[getNoticeList] 失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}


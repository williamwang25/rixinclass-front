// 云函数：获取轮播图列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { status } = event
    
    console.log('[getCarouselList] 查询参数:', { status })
    
    // 构建查询条件
    const where = { is_deleted: 0 }
    if (status !== undefined && status !== null && status !== '') {
      where.status = status
    }
    
    // 查询轮播图
    const { data } = await db.collection('carousel')
      .where(where)
      .orderBy('sort_order', 'asc')
      .orderBy('create_time', 'desc')
      .limit(100)
      .get()
    
    console.log('[getCarouselList] 查询完成:', { count: data.length })
    
    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('[getCarouselList] 失败:', error)
    return {
      success: false,
      message: error.message
    }
  }
}


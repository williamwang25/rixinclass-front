// 云函数：获取系统配置
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { configKey } = event
    
    console.log('[getSysConfig] 开始查询')
    console.log('[getSysConfig] 参数:', { configKey })
    
    // 构建查询条件
    const where = {}
    
    // 如果指定了配置键
    if (configKey) {
      where.config_key = configKey
    }
    
    console.log('[getSysConfig] 查询条件:', where)
    
    // 查询配置列表
    const result = await db.collection('rx_sysconfig')
      .where(where)
      .orderBy('config_id', 'asc')
      .get()
    
    console.log('[getSysConfig] 查询结果:', {
      count: result.data.length,
      data: result.data
    })
    
    // 如果查询单个配置，直接返回值
    if (configKey && result.data.length > 0) {
      console.log('[getSysConfig] 返回单个配置值:', result.data[0].config_value)
      return {
        success: true,
        data: result.data[0].config_value
      }
    }
    
    console.log('[getSysConfig] 返回所有配置')
    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('[getSysConfig] 错误:', error)
    return {
      success: false,
      message: error.message,
      error: error.toString()
    }
  }
}

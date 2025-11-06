/**
 * MySQL 数据库工具函数
 * 基于 @cloudbase/wx-cloud-client-sdk
 */

// 声明全局类型
declare global {
  var $db: any
}

/**
 * 获取 MySQL 数据库实例
 * @returns MySQL 数据库实例
 */
export function getDB() {
  // #ifdef MP-WEIXIN
  if (!globalThis.$db) {
    throw new Error('MySQL 数据库未初始化，请检查 App.vue')
  }
  return globalThis.$db
  // #endif

  // #ifndef MP-WEIXIN
  throw new Error('MySQL 仅在微信小程序中可用')
  // #endif
}

/**
 * 用户登录 - 直接访问 MySQL
 * @param nickName 用户昵称
 * @param avatarUrl 用户头像
 */
export async function loginWithMySQL(nickName: string, avatarUrl: string) {
  try {
    console.log('[LOGIN] 开始登录...')
    
    // 调用登录云函数
    const res = await wx.cloud.callFunction({
      name: 'login',
      data: {
        nickName,
        avatarUrl
      }
    }) as any
    
    console.log('[LOGIN] 云函数返回:', res)
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '登录失败')
    }
    
    return {
      success: true,
      message: '登录成功',
      data: res.result.data
    }
  }
  catch (error: any) {
    console.error('[MYSQL LOGIN] 登录失败:', error)
    return {
      success: false,
      message: error.message || '登录失败',
      error: error
    }
  }
}

/**
 * 获取用户信息
 * @param userId 用户ID
 */
export async function getUserInfo(userId: number) {
  try {
    console.log('[GET_USER_INFO] 开始查询 - userId:', userId)
    
    // 调用云函数查询
    const res = await wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        userId
      }
    }) as any
    
    console.log('[GET_USER_INFO] 云函数返回:', res)
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      message: '查询成功',
      data: res.result.data
    }
  }
  catch (error: any) {
    console.error('[GET_USER_INFO] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败',
      error: error
    }
  }
}



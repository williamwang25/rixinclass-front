/**
 * 云数据库工具函数
 * 基于微信云开发的文档型数据库（NoSQL）
 */

// 声明全局类型
declare global {
  var $db: any
  var $_: any
}

/**
 * 获取云数据库实例
 * @returns 数据库实例
 */
export function getDB() {
  // #ifdef MP-WEIXIN
  if (!globalThis.$db) {
    throw new Error('云数据库未初始化，请检查 App.vue')
  }
  return globalThis.$db
  // #endif

  // #ifndef MP-WEIXIN
  throw new Error('云数据库仅在微信小程序中可用')
  // #endif
}

/**
 * 获取查询操作符
 * @returns 查询操作符
 */
export function getCommand() {
  // #ifdef MP-WEIXIN
  if (!globalThis.$_) {
    throw new Error('查询操作符未初始化，请检查 App.vue')
  }
  return globalThis.$_
  // #endif

  // #ifndef MP-WEIXIN
  throw new Error('查询操作符仅在微信小程序中可用')
  // #endif
}

/**
 * 用户登录 - 通过云函数
 * @param nickName 用户昵称
 * @param avatarUrl 用户头像
 */
export async function login(nickName: string, avatarUrl: string) {
  try {
    console.log('[LOGIN] 开始登录...')
    
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
    console.error('[LOGIN] 登录失败:', error)
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

/**
 * 获取实验室列表
 * @param status 状态筛选（可选）
 */
export async function getLabList(status?: number) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getLabList',
      data: { status }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data
    }
  }
  catch (error: any) {
    console.error('[GET_LAB_LIST] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败'
    }
  }
}

/**
 * 获取实验室详情
 * @param labId 实验室ID
 */
export async function getLabDetail(labId: number) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getLabDetail',
      data: { labId }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: error.message || '查询失败'
    }
  }
}

/**
 * 获取我的申请列表
 * @param params 查询参数
 */
export async function getMyBookings(params: { userId: number; status?: number; pageNum?: number; pageSize?: number }) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getMyBookings',
      data: params
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data,
      total: res.result.total
    }
  }
  catch (error: any) {
    console.error('[GET_MY_BOOKINGS] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败',
      data: [],
      total: 0
    }
  }
}

/**
 * 获取轮播图列表
 * @param status 状态筛选（可选）
 */
export async function getCarouselList(status?: number) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getCarouselList',
      data: { status }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data
    }
  }
  catch (error: any) {
    console.error('[GET_CAROUSEL_LIST] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败'
    }
  }
}

/**
 * 获取公告列表
 * @param userId 用户ID（可选）
 * @param noticeType 公告类型（可选）
 */
export async function getNoticeList(userId?: number, noticeType?: string) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getNoticeList',
      data: { userId, noticeType }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data
    }
  }
  catch (error: any) {
    console.error('[GET_NOTICE_LIST] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败'
    }
  }
}

/**
 * 获取个人消息列表
 * @param userId 用户ID
 * @param isRead 是否已读筛选（可选）
 */
export async function getMyMessages(userId: number, isRead?: number) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getMyMessages',
      data: { userId, isRead }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data,
      unreadCount: res.result.unreadCount
    }
  }
  catch (error: any) {
    console.error('[GET_MY_MESSAGES] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败',
      data: [],
      unreadCount: 0
    }
  }
}

/**
 * 标记消息已读
 * @param messageId 消息ID（可选，不传则标记所有为已读）
 * @param userId 用户ID（标记所有时必填）
 */
export async function markMessageRead(messageId?: number, userId?: number) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'markMessageRead',
      data: { messageId, userId }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '操作失败')
    }
    
    return {
      success: true,
      message: '标记成功'
    }
  }
  catch (error: any) {
    console.error('[MARK_MESSAGE_READ] 操作失败:', error)
    return {
      success: false,
      message: error.message || '操作失败'
    }
  }
}

/**
 * 获取个人排课记录
 * @param userId 用户ID
 * @param academicYear 学年（可选）
 * @param semester 学期（可选）
 */
export async function getMySchedules(userId: number, academicYear?: string, semester?: string) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getMySchedules',
      data: { userId, academicYear, semester }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '查询失败')
    }
    
    return {
      success: true,
      data: res.result.data
    }
  }
  catch (error: any) {
    console.error('[GET_MY_SCHEDULES] 查询失败:', error)
    return {
      success: false,
      message: error.message || '查询失败',
      data: []
    }
  }
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param nickName 昵称
 * @param name 姓名
 * @param phone 手机号
 * @param email 邮箱
 */
export async function updateUserInfo(userId: number, nickName: string, name: string, phone: string, email?: string) {
  try {
    const res = await wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: { userId, nickName, name, phone, email }
    }) as any
    
    if (!res.result || !res.result.success) {
      throw new Error(res.result?.message || '更新失败')
    }
    
    return {
      success: true,
      message: '更新成功'
    }
  }
  catch (error: any) {
    console.error('[UPDATE_USER_INFO] 更新失败:', error)
    return {
      success: false,
      message: error.message || '更新失败'
    }
  }
}


文档型数据库是 CloudBase 提供的数据库服务，支持灵活的 JSON 文档存储，包含集合管理和数据模型两个核心功能。

集合管理
集合管理是 CloudBase 提供的基础数据存储服务，基于文档型数据库，为开发者提供灵活的 JSON 文档存储能力。

云开发数据库提供以下几种数据类型：

String：字符串
Number：数字
Object：对象
Array：数组
Bool：布尔值
GeoPoint：地理位置点
Date：时间
Null
下面对几个需要额外说明的字段做下补充说明。

Date
Date 类型用于创建客户端时间，精确到毫秒，可以用 JavaScript 内置 Date 对象创建。如果需要使用服务端时间，应该用 API 中提供的 serverDate 对象来创建一个服务端当前时间的标记。

我们的数据库有针对日期类型的优化，建议大家使用时都用 Date 或 serverDate 构造时间对象。

智能系统字段管理
操作数据模型时，系统会自动添加以下系统字段，并在数据操作时自动维护：

系统字段	描述	自动更新时机
_id	数据唯一标识符	创建时自动生成
createdAt	创建时间戳	创建时自动生成
updatedAt	更新时间戳	每次更新时自动更新
_openid	用户标识（小程序）	用户端操作时自动生成
owner	数据所有者	创建时自动设置
createBy	创建者标识	创建时自动设置
updateBy	最后修改者	每次更新时自动更新
💡 注意：开发者无需手动管理这些字段，系统自动处理数据的生命周期管理，让您专注于业务逻辑实现。

实际应用示例
假设创建了一个名为 users 的文档型数据模型，user123 用户通过数据模型新增如下结构数据：

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25
}

系统自动添加的完整数据：

{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "_openid": "user123",
  "owner": "user123",
  "createBy": "user123",
  "updateBy": "user123"
}

通过集合创建数据模型
由于数据模型是基于集合的上层建模，创建文档型数据模型时，会自动创建对应的集合。

但创建集合时，不会自动创建对应的数据模型。

因此可以在 云开发平台/数据模型 页面，选择「基于集合创建模型」。


查询操作符
数据库 API 提供了大于、小于等多种动态查询指令，这些指令都暴露在 db.command 对象上。

详细文档：wxCloud 数据库操作符

操作符	说明	示例
eq	等于	{age: _.eq(18)}
neq	不等于	{status: _.neq('deleted')}
gt	大于	{score: _.gt(80)}
gte	大于等于	{age: _.gte(18)}
lt	小于	{price: _.lt(100)}
lte	小于等于	{discount: _.lte(0.5)}
in	在数组中	{category: _.in(['tech', 'news'])}
nin	不在数组中	{status: _.nin(['deleted', 'banned'])}
查询数据
单条查询
通过文档 ID 查询指定记录。

参数说明
参数	类型	必填	说明
docId	string	是	文档的唯一标识符
代码示例
// 根据文档 ID 查询单条记录
const result = await db.collection('todos')
    .doc('docId')
    .get()

console.log('查询结果:', result.data)

返回结果
{
    data: [{
        _id: "todo-id-123",
        title: "学习 CloudBase",
        completed: false,
        // ... 其他字段
    }],
}

多条查询
查询集合中的多条记录，支持条件筛选、排序、分页等。

参数说明
方法	参数类型	必填	说明
where()	object	否	查询条件，支持操作符
orderBy()	string, string	否	排序字段和方向（'asc' 或 'desc'）
limit()	number	否	限制返回记录数，默认 100 条，最多返回 1000 条
skip()	number	否	跳过记录数，用于分页
field()	object	否	指定返回字段，true 表示返回，false 表示不返回
// 查询所有记录
const result = await db.collection('todos').get()
console.log('查询结果:', result.data)

// 条件查询
const result = await db.collection('todos')
    .where({
        completed: false,
        priority: 'high'
    })
    .get()

高级查询
const _ = db.command

// 复杂条件查询
const result = await db.collection('todos')
    .where({
        // 年龄大于 18
        age: _.gt(18),
        // 标签包含 '技术'
        tags: _.in(['技术', '学习']),
        // 创建时间在最近一周内
        createdAt: _.gte(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    })
    .orderBy('createdAt', 'desc') // 按创建时间倒序
    .limit(10) // 限制 10 条
    .skip(0) // 跳过 0 条（分页）
    .field({ // 只返回指定字段
        title: true,
        completed: true,
        createdAt: true
    })
    .get()

分页查询
// 分页查询示例
const pageSize = 10
const pageNum = 1

const result = await db.collection('todos')
    .orderBy('createdAt', 'desc')
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .get()

console.log(`第 ${pageNum} 页数据:`, result.data)

聚合查询
// 统计查询
const result = await db.collection('todos')
    .aggregate()
    .group({
        _id: '$priority',
        count: {
            $sum: 1
        }
    })
    .end()

console.log('按优先级统计:', result.list)

新增数据
单条新增
向集合中添加一条新记录。

参数说明
参数	类型	必填	说明
data	object	是	要新增的数据对象
代码示例
// 添加单条记录
const result = await db.collection('todos').add({
    title: '学习 CloudBase',
    content: '完成数据库操作教程',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
    tags: ['学习', '技术']
})

console.log('新增成功，文档 ID:', result._id)

更新数据
单条更新
通过文档 ID 更新指定记录。

参数说明
参数	类型	必填	说明
docId	string	是	要更新的文档 ID
data	object	是	要更新的数据对象
代码示例
// 更新指定文档
const result = await db.collection('todos')
    .doc('todo-id')
    .update({
        title: '学习 CloudBase 数据库',
        completed: true,
        updatedAt: new Date(),
        completedBy: 'user123'
    })

console.log('更新成功，影响记录数:', result.stats.updated)

批量更新
根据查询条件批量更新多条记录。

参数说明
参数	类型	必填	说明
where	object	是	查询条件，确定要更新的记录
data	object	是	要更新的数据对象
代码示例
// 批量更新多条记录
const batchResult = await db.collection('todos')
    .where({
        completed: false,
        priority: 'low'
    })
    .update({
        priority: 'normal',
        updatedAt: new Date()
    })

console.log('批量更新结果:', batchResult)

更新或创建
更新文档，如果不存在则创建：

const setResult = await db.collection('todos')
    .doc("doc-id")
    .set({
        completed: false,
        priority: 'low'
    })

删除数据
单条删除
通过文档 ID 删除指定记录。

参数说明
参数	类型	必填	说明
docId	string	是	要删除的文档 ID
代码示例
// 删除指定文档
const result = await db.collection('todos')
    .doc('todo-id')
    .remove()

console.log('删除成功，影响记录数:', result.stats.removed)

批量删除
根据查询条件批量删除多条记录。

参数说明
参数	类型	必填	说明
where	object	是	查询条件，确定要删除的记录
代码示例
// 批量删除多条记录
const _ = db.command
const batchResult = await db.collection('todos')
    .where({
        completed: true,
        createdAt: _.lt(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // 30天前
    })
    .remove()

console.log('批量删除结果:', batchResult)

注意事项
错误处理
所有数据库操作都应该使用 try-catch 进行错误处理：

try {
    const result = await db.collection('todos').get()
    console.log('查询成功:', result.data)
} catch (error) {
    console.error('查询失败:', error)
}

重要提醒
注意事项	说明	建议
权限控制	确保已正确配置数据库安全规则	使用最小权限原则
数据校验	在客户端和服务端都要进行数据校验	防止无效数据入库
性能优化	合理使用索引和查询条件	避免全表扫描
最佳实践
数据结构设计
合理设计集合结构：避免过度嵌套，保持数据结构清晰
建立索引：为常用查询字段建立索引提升性能
数据类型：使用合适的数据类型，如日期使用时间戳
查询优化
限制返回数据量：使用 limit() 控制返回记录数
字段投影：使用 field() 只返回需要的字段
安全考虑
安全规则：配置合适的数据库安全规则
输入验证：验证用户输入数据的合法性
敏感信息：避免在客户端存储敏感信息
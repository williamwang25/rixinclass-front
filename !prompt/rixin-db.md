# 日新智课 - 数据库设计文档

## 📋 文档信息

- **项目名称**：日新智课 - 北京工业大学智慧排课系统
- **数据库名称**：rixinclass
- **字符集**：utf8mb4 / utf8mb4_unicode_ci
- **版本**：v1.0
- **最后更新**：2025-11-03

---

## 🎯 系统概述

本系统是一个面向高校实验室的智能排课管理平台，支持：
- 教师通过微信小程序提交排课申请
- 系统自动匹配实验室和时间段
- 智能检测排课冲突
- 管理员审核和手动调整
- 数据统计和可视化看板

---

## 📊 数据库架构

### 总表数量：10张主表

| 序号 | 表名 | 说明 | 类型 |
|------|------|------|------|
| 1 | rx_user | 用户表（教师/管理员） | 核心表 |
| 2 | labs | 实验室信息表 | 核心表 |
| 3 | booking | 排课申请表 | 核心表 |
| 3-1 | booking_time_slots | 申请时间段表 | 关联表 |
| 4 | schedule | 排课结果表 | 核心表 |
| 4-1 | schedule_conflict | 排课冲突详情表 | 关联表 |
| 5 | notice | 公告/通知表 | 功能表 |
| 6 | message | 消息对话表 | 功能表 |
| 7 | authlog | 审核日志表 | 日志表 |
| 8 | statistics | 统计数据表 | 统计表 |
| 9 | rx_sysconfig | 系统配置表 | 配置表 |

---

## 📖 表结构详解

### 1. rx_user - 用户表（教师/管理员）

**用途**：存储系统用户信息，支持微信小程序登录

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| user_id | BIGINT | ✓ | AUTO_INCREMENT | 用户ID（主键） |
| open_id | VARCHAR(100) | - | NULL | 微信OpenID（登录凭证） |
| wechat_user_id | VARCHAR(100) | - | NULL | 微信用户ID |
| nick_name | VARCHAR(50) | - | NULL | 昵称 |
| avatar | VARCHAR(255) | - | NULL | 头像URL |
| name | VARCHAR(50) | - | NULL | 真实姓名 |
| phone | VARCHAR(20) | - | NULL | 联系电话 |
| email | VARCHAR(100) | - | NULL | 邮箱 |
| user_type | TINYINT | ✓ | 0 | 用户类型：0教师 1管理员 |
| status | TINYINT | ✓ | 1 | 状态：0禁用 1正常 |
| latest_visit_at | DATETIME | - | NULL | 最后访问时间 |
| created_at | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_by | BIGINT | - | NULL | 创建人 |
| updated_at | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_by | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`user_id`
- **唯一索引**：`uk_open_id` (open_id) - 保证微信用户唯一性
- **普通索引**：
  - `idx_wechat_user_id` (wechat_user_id)
  - `idx_user_type_status` (user_type, status) - 按类型和状态查询

#### 业务说明

- 采用微信小程序登录，`open_id` 作为主要登录凭证
- `user_type` 区分教师和管理员权限
- `latest_visit_at` 用于统计用户活跃度

---

### 2. labs - 实验室信息表

**用途**：存储实验室基础信息、软硬件环境配置

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| lab_id | BIGINT | ✓ | AUTO_INCREMENT | 实验室ID（主键） |
| lab_room | VARCHAR(50) | ✓ | - | 实验室编号（如：505） |
| lab_name | VARCHAR(100) | ✓ | - | 实验室名称 |
| building | VARCHAR(50) | ✓ | - | 所在楼栋（如：软件楼） |
| floor | INT | - | NULL | 楼层 |
| capacity | INT | ✓ | - | 容量（可容纳人数） |
| software_env | TEXT | - | NULL | 软件环境（JSON格式） |
| hardware_env | TEXT | - | NULL | 硬件环境/设备说明 |
| support_notes | TEXT | - | NULL | 支持课程/使用说明 |
| lab_admin | VARCHAR(50) | - | NULL | 实验室负责人 |
| status | TINYINT | ✓ | 1 | 状态：0维护 1正常 2停用 |
| remark | TEXT | - | NULL | 备注 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`lab_id`
- **唯一索引**：`uk_lab_room` (lab_room) - 实验室编号唯一
- **普通索引**：
  - `idx_status` (status)
  - `idx_building_floor` (building, floor)

#### 业务说明

- `software_env` 存储JSON格式的软件环境清单，便于自动排课算法匹配
- `capacity` 用于判断实验室是否能容纳申请的学生人数
- `status` 支持实验室维护状态，维护期间不参与排课

---

### 3. booking - 排课申请表

**用途**：存储教师提交的排课申请信息

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| booking_id | BIGINT | ✓ | AUTO_INCREMENT | 申请ID（主键） |
| booking_no | VARCHAR(50) | ✓ | - | 申请编号（唯一） |
| user_id | BIGINT | ✓ | - | 申请教师ID |
| academic_year | VARCHAR(20) | ✓ | - | 学年（如：2025-2026） |
| semester | VARCHAR(20) | ✓ | - | 学期（如：第一学期） |
| course_code | VARCHAR(50) | ✓ | - | 课程代码 |
| course_type | VARCHAR(30) | ✓ | - | 课程类型 |
| course_name | VARCHAR(100) | ✓ | - | 课程名称 |
| required_hours | INT | ✓ | - | 大纲要求实验学时 |
| booking_hours | INT | ✓ | - | 预约实验学时 |
| class_name | VARCHAR(100) | ✓ | - | 授课班级 |
| student_count | INT | ✓ | - | 学生人数 |
| time_slots | JSON | - | NULL | 时间段（JSON，备用字段） |
| software_requirements | TEXT | - | NULL | 软件环境要求 |
| other_requirements | TEXT | - | NULL | 其他要求/备注 |
| teacher_name | VARCHAR(50) | ✓ | - | 教师姓名 |
| teacher_phone | VARCHAR(20) | ✓ | - | 教师电话 |
| teacher_email | VARCHAR(100) | ✓ | - | 教师邮箱 |
| teacher_signature | VARCHAR(255) | - | NULL | 教师签名图片URL |
| status | TINYINT | ✓ | 0 | 状态：0待审 1通过 2拒绝 3取消 |
| review_user_id | BIGINT | - | NULL | 审核人ID（管理员） |
| review_time | DATETIME | - | NULL | 审核时间 |
| review_remark | VARCHAR(255) | - | NULL | 审核备注/拒绝原因 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`booking_id`
- **唯一索引**：`uk_booking_no` (booking_no)
- **普通索引**：
  - `idx_user` (user_id)
  - `idx_status` (status)
  - `idx_academic_year` (academic_year, semester)

#### 课程类型枚举

- 实验教学
- 实验作业
- 工作实习
- 毕业设计

#### 业务说明

- `booking_no` 自动生成，格式建议：`BK{年}{月}{日}{序号}`
- `status` 状态流转：待审 → 通过/拒绝
- `time_slots` 作为备用字段，主要时间信息存储在 `booking_time_slots` 表

---

### 3-1. booking_time_slots - 申请时间段表

**用途**：结构化存储排课申请的时间段，便于冲突检测

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| slot_id | BIGINT | ✓ | AUTO_INCREMENT | 时间段ID（主键） |
| booking_id | BIGINT | ✓ | - | 关联申请ID |
| weekday | TINYINT | ✓ | - | 星期（1-7：周一到周日） |
| week_start | INT | ✓ | - | 开始周（如：1） |
| week_end | INT | ✓ | - | 结束周（如：16） |
| period_start | INT | ✓ | - | 开始节次（如：1） |
| period_end | INT | ✓ | - | 结束节次（如：4） |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`slot_id`
- **普通索引**：
  - `idx_booking` (booking_id)
  - `idx_time` (weekday, week_start, week_end, period_start, period_end)

#### 时间规则

- **星期**：1=周一, 2=周二, ..., 7=周日
- **周次**：1-20（根据学期调整）
- **节次**：1-12（根据学校作息时间调整）

#### 业务说明

- 一个申请可以有多个时间段（一对多关系）
- 时间段索引优化了排课算法的冲突检测性能
- 示例：星期一 1-16周 3-4节 → `weekday=1, week_start=1, week_end=16, period_start=3, period_end=4`

---

### 4. schedule - 排课结果表

**用途**：存储最终的排课结果（自动排课或管理员手动排课）

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| schedule_id | BIGINT | ✓ | AUTO_INCREMENT | 排课ID（主键） |
| booking_id | BIGINT | ✓ | - | 关联申请ID |
| lab_id | BIGINT | ✓ | - | 实验室ID |
| academic_year | VARCHAR(20) | ✓ | - | 学年（快照） |
| semester | VARCHAR(20) | ✓ | - | 学期（快照） |
| weekday | TINYINT | ✓ | - | 星期（1-7） |
| week_start | INT | ✓ | - | 开始周 |
| week_end | INT | ✓ | - | 结束周 |
| period_start | INT | ✓ | - | 开始节次 |
| period_end | INT | ✓ | - | 结束节次 |
| course_name | VARCHAR(100) | ✓ | - | 课程名称（快照） |
| teacher_name | VARCHAR(50) | ✓ | - | 教师姓名（快照） |
| class_name | VARCHAR(100) | ✓ | - | 班级名称（快照） |
| student_count | INT | ✓ | - | 学生数（快照） |
| lab_assistant | VARCHAR(50) | - | NULL | 实验员（可选） |
| is_conflict | TINYINT | ✓ | 0 | 是否冲突：0否 1是 |
| conflict_reason | VARCHAR(255) | - | NULL | 冲突原因 |
| schedule_type | TINYINT | ✓ | 1 | 排课类型：0自动 1手动 |
| status | TINYINT | ✓ | 1 | 状态：0取消 1正常 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`schedule_id`
- **普通索引**：
  - `idx_booking` (booking_id)
  - `idx_lab_time` (lab_id, weekday, week_start, week_end, period_start, period_end)
  - `idx_conflict` (is_conflict)
  - `idx_academic_year` (academic_year, semester)

#### 业务说明

- 采用**快照设计**，存储课程名、教师名等关键信息，避免关联查询
- `academic_year` 和 `semester` 快照字段提高按学期查询的性能
- `is_conflict` 标记冲突，冲突详情存储在 `schedule_conflict` 表
- `schedule_type` 区分自动排课和人工调整

---

### 4-1. schedule_conflict - 排课冲突详情表

**用途**：记录排课冲突的详细信息，供管理员处理

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| conflict_id | BIGINT | ✓ | AUTO_INCREMENT | 冲突ID（主键） |
| schedule_id_1 | BIGINT | ✓ | - | 冲突排课ID-1 |
| schedule_id_2 | BIGINT | ✓ | - | 冲突排课ID-2 |
| booking_id_1 | BIGINT | - | NULL | 冲突申请ID-1（便于追溯） |
| booking_id_2 | BIGINT | - | NULL | 冲突申请ID-2（便于追溯） |
| conflict_type | VARCHAR(50) | ✓ | - | 冲突类型 |
| conflict_detail | TEXT | - | NULL | 冲突详情描述 |
| conflict_level | TINYINT | ✓ | 1 | 冲突等级：0轻微 1一般 2严重 |
| resolve_status | TINYINT | ✓ | 0 | 解决状态：0未处理 1处理中 2已解决 3已忽略 |
| resolve_user_id | BIGINT | - | NULL | 处理人ID（管理员） |
| resolve_time | DATETIME | - | NULL | 解决时间 |
| resolve_remark | TEXT | - | NULL | 解决方案/备注 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`conflict_id`
- **普通索引**：
  - `idx_schedule_1` (schedule_id_1)
  - `idx_schedule_2` (schedule_id_2)
  - `idx_booking_1` (booking_id_1)
  - `idx_booking_2` (booking_id_2)
  - `idx_resolve_status` (resolve_status)
  - `idx_conflict_type` (conflict_type)
  - `idx_resolve_user` (resolve_user_id, resolve_time)

#### 冲突类型枚举

- `time_overlap` - 时间重叠
- `lab_occupied` - 实验室被占用
- `resource_shortage` - 资源不足（如容量不够）

#### 业务说明

- 自动排课算法检测到冲突时自动创建记录
- 管理员可以查看冲突详情，选择调整方案
- `conflict_level` 用于冲突优先级排序
- 完整记录冲突的发现和解决全流程

---

### 5. notice - 公告/通知表

**用途**：系统公告和个人通知

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| notice_id | BIGINT | ✓ | AUTO_INCREMENT | 通知ID（主键） |
| title | VARCHAR(200) | ✓ | - | 标题 |
| content | TEXT | ✓ | - | 正文 |
| notice_type | VARCHAR(255) | ✓ | - | 类型 |
| target_user_id | BIGINT | - | NULL | 目标用户ID（NULL=全体） |
| booking_id | BIGINT | - | NULL | 关联申请ID（可空） |
| priority | TINYINT | ✓ | 0 | 优先级：0普通 1重要 2紧急 |
| is_read | TINYINT | ✓ | 0 | 已读：0否 1是 |
| sender_id | BIGINT | - | NULL | 发送人（管理员） |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`notice_id`
- **普通索引**：
  - `idx_target_read` (target_user_id, is_read)
  - `idx_booking` (booking_id)
  - `idx_priority_time` (priority, create_time)

#### 通知类型

- 系统公告
- 审核通过
- 审核拒绝
- 排课完成
- 冲突提醒

#### 业务说明

- `target_user_id` 为 NULL 时表示全体通知
- `booking_id` 用于关联排课申请，便于追溯
- 支持按优先级和时间排序

---

### 6. message - 消息对话表

**用途**：管理员与教师的一对一对话消息

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| message_id | BIGINT | ✓ | AUTO_INCREMENT | 消息ID（主键） |
| conversation_id | VARCHAR(100) | ✓ | - | 会话ID |
| sender_id | BIGINT | ✓ | - | 发送者ID |
| receiver_id | BIGINT | ✓ | - | 接收者ID |
| message_type | VARCHAR(20) | ✓ | text | 消息类型：text/image/file |
| content | TEXT | ✓ | - | 消息内容 |
| booking_id | BIGINT | - | NULL | 关联的申请ID（可选） |
| file_url | VARCHAR(255) | - | NULL | 附件URL（图片/文件） |
| is_read | TINYINT | ✓ | 0 | 是否已读：0否 1是 |
| read_time | DATETIME | - | NULL | 阅读时间 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |
| is_deleted | TINYINT | ✓ | 0 | 是否删除：0否 1是 |

#### 索引设计

- **主键**：`message_id`
- **普通索引**：
  - `idx_conversation` (conversation_id)
  - `idx_sender` (sender_id)
  - `idx_receiver_read` (receiver_id, is_read)
  - `idx_booking` (booking_id)
  - `idx_create_time` (create_time)

#### 消息类型

- `text` - 文本消息
- `image` - 图片消息
- `file` - 文件消息

#### 业务说明

- `conversation_id` 格式建议：`{min_user_id}_{max_user_id}`（确保同一对话ID唯一）
- 支持关联 `booking_id`，方便讨论具体申请
- `is_read` 和 `read_time` 记录消息阅读状态

---

### 7. authlog - 审核日志表

**用途**：记录管理员的审核操作

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| audit_id | BIGINT | ✓ | AUTO_INCREMENT | 审核日志ID（主键） |
| booking_id | BIGINT | - | NULL | 关联申请ID |
| schedule_id | BIGINT | - | NULL | 关联排课ID |
| admin_user_id | BIGINT | ✓ | - | 管理员ID |
| action | VARCHAR(50) | ✓ | - | 动作 |
| remark | VARCHAR(255) | - | NULL | 备注/理由 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 操作时间 |
| create_user | BIGINT | - | NULL | 操作人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |

#### 索引设计

- **主键**：`audit_id`
- **普通索引**：
  - `idx_booking` (booking_id)
  - `idx_schedule` (schedule_id)
  - `idx_admin_time` (admin_user_id, create_time)

#### 动作类型

- `approve` - 审批通过
- `reject` - 审批拒绝
- `resolve_conflict` - 解决冲突
- `update_schedule` - 更新排课
- `other` - 其他操作

#### 业务说明

- 记录所有管理员操作，便于追溯和审计
- 支持按管理员和时间统计工作量

---

### 8. statistics - 统计数据表

**用途**：存储预计算的统计数据，支持数据看板

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| stat_id | BIGINT | ✓ | AUTO_INCREMENT | 统计ID（主键） |
| stat_date | DATE | ✓ | - | 统计日期 |
| stat_type | VARCHAR(50) | ✓ | - | 统计类型 |
| academic_year | VARCHAR(20) | - | NULL | 学年 |
| semester | VARCHAR(20) | - | NULL | 学期 |
| total_bookings | INT | ✓ | 0 | 总申请数 |
| pending_bookings | INT | ✓ | 0 | 待审核数 |
| approved_bookings | INT | ✓ | 0 | 已通过数 |
| rejected_bookings | INT | ✓ | 0 | 已拒绝数 |
| total_schedules | INT | ✓ | 0 | 总排课数 |
| conflict_schedules | INT | ✓ | 0 | 冲突排课数 |
| total_students | INT | ✓ | 0 | 总学生数 |
| lab_usage_rate | DECIMAL(5,2) | ✓ | 0.00 | 实验室使用率(%) |
| stat_data | JSON | - | NULL | 扩展统计JSON |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |

#### 索引设计

- **主键**：`stat_id`
- **唯一索引**：`uk_date_type` (stat_date, stat_type)
- **普通索引**：
  - `idx_year_sem` (academic_year, semester)

#### 统计类型

- `daily` - 日统计
- `weekly` - 周统计
- `monthly` - 月统计
- `semester` - 学期统计

#### 业务说明

- 通过定时任务预计算统计数据，提高看板性能
- `stat_data` 支持扩展统计维度（JSON格式）
- 建议每日凌晨自动生成统计数据

---

### 9. rx_sysconfig - 系统配置表

**用途**：存储系统级别的配置参数（键值对）

#### 字段说明

| 字段名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| config_id | BIGINT | ✓ | AUTO_INCREMENT | 配置ID（主键） |
| config_key | VARCHAR(100) | ✓ | - | 配置键（唯一） |
| config_value | TEXT | - | NULL | 配置值 |
| config_type | VARCHAR(50) | ✓ | system | 配置类型 |
| description | VARCHAR(255) | - | NULL | 说明 |
| create_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 创建时间 |
| create_user | BIGINT | - | NULL | 创建人 |
| update_time | DATETIME | ✓ | CURRENT_TIMESTAMP | 更新时间 |
| update_user | BIGINT | - | NULL | 更新人 |

#### 索引设计

- **主键**：`config_id`
- **唯一索引**：`uk_config_key` (config_key)

#### 配置示例

| config_key | config_value | description |
|------------|--------------|-------------|
| current_academic_year | 2025-2026 | 当前学年 |
| current_semester | 第一学期 | 当前学期 |
| booking_start_date | 2025-09-01 | 申请开始日期 |
| booking_end_date | 2025-09-30 | 申请截止日期 |
| max_weeks | 20 | 最大教学周数 |
| max_periods_per_day | 12 | 每天最大节次数 |

#### 业务说明

- 灵活的键值对存储，支持动态配置
- 可通过管理后台实时修改配置
- 无需重启服务即可生效

---

## 🔗 表关系说明

### 核心关系图（文字描述）

```
rx_user (用户)
  ├─ 1:N → booking (创建排课申请)
  ├─ 1:N → schedule (创建排课结果，管理员)
  ├─ 1:N → message (发送/接收消息)
  └─ 1:N → notice (接收通知)

booking (排课申请)
  ├─ 1:N → booking_time_slots (包含多个时间段)
  ├─ 1:1 → schedule (生成排课结果)
  └─ 1:N → message (关联的消息)

schedule (排课结果)
  ├─ N:1 → booking (对应申请)
  ├─ N:1 → labs (使用实验室)
  └─ 1:N → schedule_conflict (涉及的冲突)

labs (实验室)
  └─ 1:N → schedule (被排课使用)

schedule_conflict (冲突)
  ├─ N:1 → schedule (冲突方1)
  └─ N:1 → schedule (冲突方2)
```

### 软关联说明

本系统采用**软关联**设计（无外键约束），原因：
1. 提高数据库性能和灵活性
2. 便于分库分表扩展
3. 避免外键约束带来的锁开销
4. 通过应用层保证数据一致性

---

## 💡 业务场景示例

### 场景1：教师提交排课申请

```sql
-- 1. 创建申请记录
INSERT INTO booking (...) VALUES (...);

-- 2. 创建时间段记录
INSERT INTO booking_time_slots (booking_id, weekday, week_start, week_end, period_start, period_end)
VALUES 
  (1, 1, 1, 16, 3, 4),  -- 星期一 1-16周 3-4节
  (1, 3, 1, 16, 5, 6);  -- 星期三 1-16周 5-6节

-- 3. 发送通知给管理员
INSERT INTO notice (title, content, target_user_id, ...) VALUES (...);
```

### 场景2：自动排课算法

```sql
-- 1. 查询待排课的申请
SELECT b.*, GROUP_CONCAT(bts.slot_id) as slots
FROM booking b
LEFT JOIN booking_time_slots bts ON b.booking_id = bts.booking_id
WHERE b.status = 1 AND b.is_deleted = 0
GROUP BY b.booking_id;

-- 2. 匹配实验室（容量、软件环境）
SELECT * FROM labs
WHERE capacity >= ? 
  AND status = 1 
  AND software_env LIKE '%Adobe Photoshop%'
  AND is_deleted = 0;

-- 3. 检测时间冲突
SELECT * FROM schedule
WHERE lab_id = ?
  AND weekday = ?
  AND week_start <= ? AND week_end >= ?
  AND period_start <= ? AND period_end >= ?
  AND status = 1
  AND is_deleted = 0;

-- 4. 无冲突则创建排课
INSERT INTO schedule (...) VALUES (...);

-- 5. 有冲突则记录冲突详情
INSERT INTO schedule_conflict (schedule_id_1, schedule_id_2, conflict_type, ...)
VALUES (?, ?, 'time_overlap', ...);
```

### 场景3：管理员查看冲突列表

```sql
SELECT 
  sc.conflict_id,
  sc.conflict_type,
  sc.conflict_level,
  sc.resolve_status,
  s1.course_name as course_1,
  s1.teacher_name as teacher_1,
  s2.course_name as course_2,
  s2.teacher_name as teacher_2,
  l.lab_name
FROM schedule_conflict sc
JOIN schedule s1 ON sc.schedule_id_1 = s1.schedule_id
JOIN schedule s2 ON sc.schedule_id_2 = s2.schedule_id
JOIN labs l ON s1.lab_id = l.lab_id
WHERE sc.resolve_status = 0  -- 未处理
  AND sc.is_deleted = 0
ORDER BY sc.conflict_level DESC, sc.create_time ASC;
```

### 场景4：按学期统计数据

```sql
SELECT 
  academic_year,
  semester,
  COUNT(DISTINCT schedule_id) as total_schedules,
  COUNT(DISTINCT lab_id) as used_labs,
  SUM(student_count) as total_students,
  SUM(CASE WHEN is_conflict = 1 THEN 1 ELSE 0 END) as conflict_count
FROM schedule
WHERE status = 1 AND is_deleted = 0
GROUP BY academic_year, semester
ORDER BY academic_year DESC, semester DESC;
```

---

## 🚀 性能优化建议

### 索引优化

1. **时间维度索引** - 已优化排课时间查询
2. **学年学期索引** - 快照字段避免关联查询
3. **冲突状态索引** - 快速筛选待处理冲突
4. **复合索引** - 联合查询条件使用复合索引

### 查询优化

1. **避免 N+1 查询** - 使用 JOIN 或批量查询
2. **使用快照字段** - 减少表关联
3. **分页查询** - 大数据量使用 LIMIT + OFFSET
4. **缓存热点数据** - 实验室信息、系统配置等

### 数据归档

1. **历史数据归档** - 定期归档往期学期数据
2. **日志清理** - 定期清理过期日志
3. **软删除** - 保留数据可追溯性

---

## 🔐 数据安全

### 权限控制

- 教师只能查看/修改自己的申请
- 管理员拥有全部数据的读写权限
- 敏感操作需要二次确认

### 数据备份

- 建议每日自动备份数据库
- 重要操作前手动备份
- 保留至少 30 天的备份数据

### 审计日志

- 所有表包含 `create_user` 和 `update_user` 字段
- `authlog` 表记录管理员操作
- 软删除机制保留数据历史

---

## 📝 开发规范

### 命名规范

- **表名**：小写字母 + 下划线，如 `booking_time_slots`
- **字段名**：小写字母 + 下划线，如 `academic_year`
- **索引名**：`idx_` 前缀（普通索引），`uk_` 前缀（唯一索引）

### 字段类型规范

- **ID字段**：BIGINT（支持大数据量）
- **状态字段**：TINYINT（节省空间）
- **时间字段**：DATETIME（精确到秒）
- **JSON字段**：JSON 或 TEXT

### 通用字段

所有业务表都应包含：
- `create_time` - 创建时间
- `create_user` - 创建人
- `update_time` - 更新时间
- `update_user` - 更新人
- `is_deleted` - 软删除标记

---

## 📌 注意事项

1. **软关联设计**：无外键约束，由应用层保证数据一致性
2. **快照字段**：避免关联查询，提高性能
3. **软删除**：所有表使用 `is_deleted` 标记删除
4. **字符集**：统一使用 utf8mb4，支持 Emoji 等特殊字符
5. **时区**：建议统一使用 UTC 或 Asia/Shanghai 时区

---

## 🔄 版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1.0 | 2025-11-03 | 初始版本，完成核心表设计 |

---

## 📮 联系方式

如有问题或建议，请联系项目开发团队。


# 日新智课数据库设计文档

## 数据库概述

**数据库名称：** rixinclass

**设计原则：**
- 简单实用，易于维护
- 不使用外键约束
- 字段设计遵循业务需求
- 支持数据分析和看板展示

**字符集：** UTF8MB4

**存储引擎：** InnoDB

---

## 数据表设计

### 1. tb_user - 用户表

**功能说明：** 存储系统用户信息（教师和管理员）

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| user_id | BIGINT | - | 用户ID | 主键，自增 |
| username | VARCHAR | 50 | 用户名 | 登录用，唯一 |
| password | VARCHAR | 100 | 密码 | 加密存储 |
| real_name | VARCHAR | 50 | 真实姓名 | - |
| phone | VARCHAR | 20 | 联系电话 | - |
| email | VARCHAR | 100 | 邮箱 | - |
| user_type | VARCHAR | 20 | 用户类型 | teacher-教师, admin-管理员 |
| openid | VARCHAR | 100 | 微信OpenID | 用于微信登录 |
| status | TINYINT | - | 账号状态 | 0-禁用，1-正常 |
| create_time | DATETIME | - | 创建时间 | - |
| update_time | DATETIME | - | 更新时间 | - |

---

### 2. tb_booking - 排课申请表

**功能说明：** 存储教师提交的排课申请数据

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| booking_id | BIGINT | - | 预约表编号 | 主键，自增 |
| user_id | BIGINT | - | 申请教师ID | 关联用户表 |
| semester | VARCHAR | 50 | 学期 | 如：2025-2026学年 第一学期 |
| course_code | VARCHAR | 50 | 课程代码 | - |
| course_type | VARCHAR | 20 | 课程类型 | 实验教学/实验作业/工作实习/毕业设计 |
| course_name | VARCHAR | 100 | 课程名称 | - |
| required_hours | INT | - | 大纲要求实验学时 | - |
| booking_hours | INT | - | 预约实验学时 | - |
| class_name | VARCHAR | 100 | 授课班级 | - |
| student_count | INT | - | 选课人数 | - |
| experiment_time | VARCHAR | 200 | 实验时间 | 如：星期一 1-16周（3-4节） |
| weekday | TINYINT | - | 星期几 | 1-7，便于查询 |
| week_range | VARCHAR | 50 | 教学周范围 | 如：1-16 |
| class_period | VARCHAR | 50 | 第几节课 | 如：3-4 |
| software_requirements | TEXT | - | 软件环境要求 | - |
| other_requirements | TEXT | - | 其他要求 | 备注 |
| teacher_name | VARCHAR | 50 | 教师姓名 | - |
| teacher_phone | VARCHAR | 20 | 教师联系电话 | - |
| teacher_email | VARCHAR | 100 | 教师邮箱 | - |
| teacher_signature | VARCHAR | 255 | 教师签名 | 图片URL或base64 |
| status | VARCHAR | 20 | 申请状态 | pending-待审核, approved-已通过, rejected-已拒绝, scheduled-已排课 |
| reject_reason | TEXT | - | 拒绝原因 | 审核失败时填写 |
| create_time | DATETIME | - | 创建时间 | - |
| update_time | DATETIME | - | 更新时间 | - |

---

### 3. tb_laboratory - 实验室表

**功能说明：** 存储实验室基础信息

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| lab_id | BIGINT | - | 实验室ID | 主键，自增 |
| room_number | VARCHAR | 50 | 实验室房间号 | 如：505-506 |
| lab_name | VARCHAR | 100 | 实验室名称 | - |
| capacity | INT | - | 容纳人数 | - |
| software_environment | TEXT | - | 软件环境 | 多行文本 |
| hardware_environment | VARCHAR | 255 | 硬件环境 | PC品牌型号等 |
| supported_courses | TEXT | - | 支持的课程 | 多个课程用换行或分号分隔 |
| status | TINYINT | - | 实验室状态 | 0-维护中，1-可用 |
| remark | TEXT | - | 备注 | - |
| create_time | DATETIME | - | 创建时间 | - |
| update_time | DATETIME | - | 更新时间 | - |

---

### 4. tb_schedule - 排课结果表

**功能说明：** 存储最终的排课结果（自动排课或管理员手动排课）

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| schedule_id | BIGINT | - | 排课记录ID | 主键，自增 |
| booking_id | BIGINT | - | 申请表编号 | 关联申请表 |
| lab_id | BIGINT | - | 实验室ID | 关联实验室表 |
| room_number | VARCHAR | 50 | 上课地点 | 冗余字段，便于查询 |
| semester | VARCHAR | 50 | 学期 | 冗余字段 |
| course_name | VARCHAR | 100 | 课程名称 | 冗余字段 |
| teacher_name | VARCHAR | 50 | 教师姓名 | 冗余字段 |
| weekday | TINYINT | - | 星期几 | 1-7 |
| week_range | VARCHAR | 50 | 教学周范围 | 如：1-16 |
| class_period | VARCHAR | 50 | 第几节课 | 如：3-4 |
| student_count | INT | - | 选课人数 | - |
| lab_assistant | VARCHAR | 50 | 实验员姓名 | - |
| lab_assistant_phone | VARCHAR | 20 | 实验员电话 | - |
| schedule_type | VARCHAR | 20 | 排课方式 | auto-自动排课, manual-手动排课 |
| is_conflict | TINYINT | - | 是否冲突 | 0-无冲突，1-有冲突 |
| conflict_info | TEXT | - | 冲突信息 | 记录冲突原因 |
| operator_id | BIGINT | - | 操作人ID | 管理员ID |
| operator_name | VARCHAR | 50 | 操作人姓名 | - |
| remark | TEXT | - | 备注 | - |
| create_time | DATETIME | - | 创建时间 | - |
| update_time | DATETIME | - | 更新时间 | - |

---

### 5. tb_notice - 通知公告表

**功能说明：** 存储系统通知和公告信息

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| notice_id | BIGINT | - | 公告ID | 主键，自增 |
| title | VARCHAR | 200 | 公告标题 | - |
| content | TEXT | - | 公告内容 | - |
| notice_type | VARCHAR | 20 | 公告类型 | system-系统公告, booking-排课通知 |
| target_user_id | BIGINT | - | 目标用户ID | 0表示全部用户 |
| is_read | TINYINT | - | 是否已读 | 0-未读，1-已读 |
| publisher_id | BIGINT | - | 发布者ID | - |
| publisher_name | VARCHAR | 50 | 发布者姓名 | - |
| publish_time | DATETIME | - | 发布时间 | - |
| create_time | DATETIME | - | 创建时间 | - |

---

### 6. tb_statistics - 统计数据表（数据看板用）

**功能说明：** 存储汇总统计数据，用于数据看板展示

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| stat_id | BIGINT | - | 统计ID | 主键，自增 |
| semester | VARCHAR | 50 | 学期 | - |
| stat_type | VARCHAR | 50 | 统计类型 | booking_count, lab_usage, course_type等 |
| stat_key | VARCHAR | 100 | 统计键 | 如：实验室号、课程类型等 |
| stat_value | DECIMAL | 10,2 | 统计值 | - |
| stat_date | DATE | - | 统计日期 | - |
| create_time | DATETIME | - | 创建时间 | - |

---

### 7. tb_system_config - 系统配置表

**功能说明：** 存储系统配置参数

| 字段名 | 类型 | 长度 | 说明 | 备注 |
|--------|------|------|------|------|
| config_id | BIGINT | - | 配置ID | 主键，自增 |
| config_key | VARCHAR | 100 | 配置键 | 唯一 |
| config_value | TEXT | - | 配置值 | - |
| config_desc | VARCHAR | 255 | 配置描述 | - |
| create_time | DATETIME | - | 创建时间 | - |
| update_time | DATETIME | - | 更新时间 | - |

---

## 索引建议

虽然不使用外键约束，但建议创建以下索引以提高查询效率：

### tb_user 表
- `idx_username` - username字段
- `idx_openid` - openid字段

### tb_booking 表
- `idx_user_id` - user_id字段
- `idx_semester` - semester字段
- `idx_status` - status字段
- `idx_create_time` - create_time字段

### tb_schedule 表
- `idx_booking_id` - booking_id字段
- `idx_lab_id` - lab_id字段
- `idx_semester_weekday` - semester和weekday联合索引
- `idx_week_period` - week_range和class_period联合索引

### tb_laboratory 表
- `idx_room_number` - room_number字段
- `idx_status` - status字段

### tb_notice 表
- `idx_target_user` - target_user_id字段
- `idx_publish_time` - publish_time字段

---

## 数据字典

### 用户类型（user_type）
- `teacher` - 教师
- `admin` - 管理员

### 课程类型（course_type）
- `实验教学`
- `实验作业`
- `工作实习`
- `毕业设计`

### 申请状态（booking.status）
- `pending` - 待审核
- `approved` - 已通过
- `rejected` - 已拒绝
- `scheduled` - 已排课

### 排课方式（schedule_type）
- `auto` - 自动排课
- `manual` - 手动排课

### 公告类型（notice_type）
- `system` - 系统公告
- `booking` - 排课通知

---

## 数据关系说明

虽然不使用外键约束，但表之间存在以下逻辑关系：

1. **tb_user ↔ tb_booking**：一个用户可以有多个排课申请
2. **tb_booking ↔ tb_schedule**：一个申请对应一条排课结果
3. **tb_laboratory ↔ tb_schedule**：一个实验室可以有多个排课安排
4. **tb_user ↔ tb_notice**：一个用户可以接收多条通知

---

## 初始化数据说明

系统初始化时需要导入：
1. 默认管理员账号
2. 实验室基础数据（根据CSV文件导入）
3. 系统配置参数（学期列表、课程类型等）
4. 示例通知公告

---

**文档版本：** v1.0  
**创建日期：** 2024-10-13  
**更新日期：** 2024-10-13


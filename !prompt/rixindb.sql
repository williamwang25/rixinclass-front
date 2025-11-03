-- =========================================================
-- RixinClass 实验室排课系统 - 初始化建库建表脚本
-- 版本: v1.0
-- 数据库: rixinclass
-- 字符集: utf8mb4 / utf8mb4_unicode_ci
-- =========================================================

/*!40101 SET NAMES utf8mb4 */;
CREATE DATABASE IF NOT EXISTS `rixinclass`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `rixinclass`;

-- =========================================================
-- 1. 用户表（教师/管理员）- 适配微信小程序登录
-- =========================================================
DROP TABLE IF EXISTS `rx_user`;
CREATE TABLE `rx_user` (
  `user_id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `open_id`          VARCHAR(100) DEFAULT NULL            COMMENT '微信OpenID（小程序登录主键）',
  `wechat_user_id`   VARCHAR(100) DEFAULT NULL            COMMENT '微信用户ID',
  `nick_name`        VARCHAR(50)  DEFAULT NULL            COMMENT '昵称',
  `avatar`           VARCHAR(255) DEFAULT NULL            COMMENT '头像URL',
  `name`             VARCHAR(50)  DEFAULT NULL            COMMENT '真实姓名',
  `phone`            VARCHAR(20)  DEFAULT NULL            COMMENT '联系电话',
  `email`            VARCHAR(100) DEFAULT NULL            COMMENT '邮箱',
  `user_type`        TINYINT      NOT NULL DEFAULT 0      COMMENT '用户类型：0教师 1管理员',
  `status`           TINYINT      NOT NULL DEFAULT 1      COMMENT '状态：0禁用 1正常',
  `latest_visit_at`  DATETIME     DEFAULT NULL            COMMENT '最后访问时间',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_by`        BIGINT       DEFAULT NULL            COMMENT '创建人',
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_by`        BIGINT       DEFAULT NULL            COMMENT '更新人',
  `is_deleted`       TINYINT      NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_open_id` (`open_id`),
  KEY `idx_wechat_user_id` (`wechat_user_id`),
  KEY `idx_user_type_status` (`user_type`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表（教师/管理员）- 微信小程序登录';



-- =========================================================
-- 2. 实验室表
-- =========================================================
DROP TABLE IF EXISTS `labs`;
CREATE TABLE `labs` (
  `lab_id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '实验室ID',
  `lab_room`       VARCHAR(50)  NOT NULL                COMMENT '实验室编号（如：505）',
  `lab_name`       VARCHAR(100) NOT NULL                COMMENT '实验室名称',
  `building`       VARCHAR(50)  NOT NULL                COMMENT '所在楼栋（如：软件楼）',
  `floor`          INT          DEFAULT NULL            COMMENT '楼层',
  `capacity`       INT          NOT NULL                COMMENT '容量（可容纳人数）',
  `software_env`   TEXT         DEFAULT NULL            COMMENT '软件环境（JSON）',
  `hardware_env`   TEXT         DEFAULT NULL            COMMENT '硬件环境/设备说明',
  `support_notes`  TEXT         DEFAULT NULL            COMMENT '支持课程/使用说明',
  `lab_admin`      VARCHAR(50)  DEFAULT NULL            COMMENT '实验室负责人',
  `status`         TINYINT      NOT NULL DEFAULT 1      COMMENT '状态：0维护 1正常 2停用',
  `remark`         TEXT         DEFAULT NULL            COMMENT '备注',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  `is_deleted`     TINYINT      NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`lab_id`),
  UNIQUE KEY `uk_lab_room` (`lab_room`),
  KEY `idx_status` (`status`),
  KEY `idx_building_floor` (`building`, `floor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='实验室信息';


-- =========================================================
-- 3. 排课申请表
-- =========================================================
DROP TABLE IF EXISTS `booking`;
CREATE TABLE `booking` (
  `booking_id`        BIGINT       NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `booking_no`        VARCHAR(50)  NOT NULL                COMMENT '申请编号（唯一）',
  `user_id`           BIGINT       NOT NULL                COMMENT '申请教师ID（软关联）',
  `academic_year`     VARCHAR(20)  NOT NULL                COMMENT '学年（如：2025-2026）',
  `semester`          VARCHAR(20)  NOT NULL                COMMENT '学期（如：第一学期）',
  `course_code`       VARCHAR(50)  NOT NULL                COMMENT '课程代码',
  `course_type`       VARCHAR(30)  NOT NULL                COMMENT '课程类型（如：实验教学/作业/实习/毕设等）',
  `course_name`       VARCHAR(100) NOT NULL                COMMENT '课程名称',
  `required_hours`    INT          NOT NULL                COMMENT '大纲要求实验学时',
  `booking_hours`     INT          NOT NULL                COMMENT '预约实验学时',
  `class_name`        VARCHAR(100) NOT NULL                COMMENT '授课班级',
  `student_count`     INT          NOT NULL                COMMENT '学生人数',
  `time_slots`        JSON         DEFAULT NULL            COMMENT '时间段（JSON，备用字段）',
  `software_requirements` TEXT     DEFAULT NULL            COMMENT '软件环境要求',
  `other_requirements`    TEXT     DEFAULT NULL            COMMENT '其他要求/备注',
  `teacher_name`      VARCHAR(50)  NOT NULL                COMMENT '教师姓名',
  `teacher_phone`     VARCHAR(20)  NOT NULL                COMMENT '教师电话',
  `teacher_email`     VARCHAR(100) NOT NULL                COMMENT '教师邮箱',
  `teacher_signature` VARCHAR(255) DEFAULT NULL            COMMENT '教师签名图片URL',
  `status`            TINYINT      NOT NULL DEFAULT 0      COMMENT '状态：0待审 1通过 2拒绝 3取消',
  `review_user_id`    BIGINT       DEFAULT NULL            COMMENT '审核人ID（管理员）',
  `review_time`       DATETIME     DEFAULT NULL            COMMENT '审核时间',
  `review_remark`     VARCHAR(255) DEFAULT NULL            COMMENT '审核备注/拒绝原因',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  `is_deleted`        TINYINT      NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `uk_booking_no` (`booking_no`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_academic_year` (`academic_year`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排课申请表';


-- =========================================================
-- 3-1. 排课申请时间段表（便于排课算法查询冲突）
-- =========================================================
DROP TABLE IF EXISTS `booking_time_slots`;
CREATE TABLE `booking_time_slots` (
  `slot_id`       BIGINT   NOT NULL AUTO_INCREMENT COMMENT '时间段ID',
  `booking_id`    BIGINT   NOT NULL                COMMENT '关联申请ID',
  `weekday`       TINYINT  NOT NULL                COMMENT '星期（1-7：周一到周日）',
  `week_start`    INT      NOT NULL                COMMENT '开始周（如：1）',
  `week_end`      INT      NOT NULL                COMMENT '结束周（如：16）',
  `period_start`  INT      NOT NULL                COMMENT '开始节次（如：1）',
  `period_end`    INT      NOT NULL                COMMENT '结束节次（如：4）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  `is_deleted`    TINYINT  NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`slot_id`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_time` (`weekday`, `week_start`, `week_end`, `period_start`, `period_end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排课申请时间段表';


-- =========================================================
-- 4. 排课结果表（自动/人工），含冲突标识
-- =========================================================
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `schedule_id`    BIGINT       NOT NULL AUTO_INCREMENT COMMENT '排课ID',
  `booking_id`     BIGINT       NOT NULL                COMMENT '关联申请ID（软关联）',
  `lab_id`         BIGINT       NOT NULL                COMMENT '实验室ID（软关联）',
  `academic_year`  VARCHAR(20)  NOT NULL                COMMENT '学年（快照，如：2025-2026）',
  `semester`       VARCHAR(20)  NOT NULL                COMMENT '学期（快照，如：第一学期）',
  `weekday`        TINYINT      NOT NULL                COMMENT '星期（1-7）',
  `week_start`     INT          NOT NULL                COMMENT '开始周',
  `week_end`       INT          NOT NULL                COMMENT '结束周',
  `period_start`   INT          NOT NULL                COMMENT '开始节次',
  `period_end`     INT          NOT NULL                COMMENT '结束节次',
  `course_name`    VARCHAR(100) NOT NULL                COMMENT '课程名称（快照）',
  `teacher_name`   VARCHAR(50)  NOT NULL                COMMENT '教师姓名（快照）',
  `class_name`     VARCHAR(100) NOT NULL                COMMENT '班级名称（快照）',
  `student_count`  INT          NOT NULL                COMMENT '学生数（快照）',
  `lab_assistant`  VARCHAR(50)  DEFAULT NULL            COMMENT '实验员（可选）',
  `is_conflict`    TINYINT      NOT NULL DEFAULT 0      COMMENT '是否冲突：0否 1是',
  `conflict_reason`VARCHAR(255) DEFAULT NULL            COMMENT '冲突原因',
  `schedule_type`  TINYINT      NOT NULL DEFAULT 1      COMMENT '排课类型：0自动 1手动',
  `status`         TINYINT      NOT NULL DEFAULT 1      COMMENT '状态：0取消 1正常',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  `is_deleted`     TINYINT      NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`schedule_id`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_lab_time` (`lab_id`, `weekday`, `week_start`, `week_end`, `period_start`, `period_end`),
  KEY `idx_conflict` (`is_conflict`),
  KEY `idx_academic_year` (`academic_year`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排课结果表';


-- =========================================================
-- 4-1. 排课冲突详情表（管理员处理冲突专用）
-- =========================================================
DROP TABLE IF EXISTS `schedule_conflict`;
CREATE TABLE `schedule_conflict` (
  `conflict_id`       BIGINT        NOT NULL AUTO_INCREMENT COMMENT '冲突ID',
  `schedule_id_1`     BIGINT        NOT NULL                COMMENT '冲突排课ID-1',
  `schedule_id_2`     BIGINT        NOT NULL                COMMENT '冲突排课ID-2',
  `booking_id_1`      BIGINT        DEFAULT NULL            COMMENT '冲突申请ID-1（便于追溯）',
  `booking_id_2`      BIGINT        DEFAULT NULL            COMMENT '冲突申请ID-2（便于追溯）',
  `conflict_type`     VARCHAR(50)   NOT NULL                COMMENT '冲突类型：time_overlap/lab_occupied/resource_shortage',
  `conflict_detail`   TEXT          DEFAULT NULL            COMMENT '冲突详情描述',
  `conflict_level`    TINYINT       NOT NULL DEFAULT 1      COMMENT '冲突等级：0轻微 1一般 2严重',
  `resolve_status`    TINYINT       NOT NULL DEFAULT 0      COMMENT '解决状态：0未处理 1处理中 2已解决 3已忽略',
  `resolve_user_id`   BIGINT        DEFAULT NULL            COMMENT '处理人ID（管理员）',
  `resolve_time`      DATETIME      DEFAULT NULL            COMMENT '解决时间',
  `resolve_remark`    TEXT          DEFAULT NULL            COMMENT '解决方案/备注',
  `create_time`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user`       BIGINT        DEFAULT NULL            COMMENT '创建人',
  `update_time`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user`       BIGINT        DEFAULT NULL            COMMENT '更新人',
  `is_deleted`        TINYINT       NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`conflict_id`),
  KEY `idx_schedule_1` (`schedule_id_1`),
  KEY `idx_schedule_2` (`schedule_id_2`),
  KEY `idx_booking_1` (`booking_id_1`),
  KEY `idx_booking_2` (`booking_id_2`),
  KEY `idx_resolve_status` (`resolve_status`),
  KEY `idx_conflict_type` (`conflict_type`),
  KEY `idx_resolve_user` (`resolve_user_id`, `resolve_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排课冲突详情表（管理员处理冲突专用）';


-- =========================================================
-- 5. 公告表（面向全体或指定对象）
-- =========================================================
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `notice_id`     BIGINT        NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `title`         VARCHAR(200)  NOT NULL                COMMENT '标题',
  `content`       TEXT          NOT NULL                COMMENT '正文',
  `notice_type`   VARCHAR(255)  NOT NULL                COMMENT '类型',
  `target_user_id`BIGINT        DEFAULT NULL            COMMENT '目标用户ID（NULL=全体）',
  `booking_id`    BIGINT        DEFAULT NULL            COMMENT '关联申请ID（可空）',
  `priority`      TINYINT       NOT NULL DEFAULT 0      COMMENT '优先级：0普通 1重要 2紧急',
  `is_read`       TINYINT       NOT NULL DEFAULT 0      COMMENT '已读：0否 1是（对单人通知可用）',
  `sender_id`     BIGINT        DEFAULT NULL            COMMENT '发送人（管理员）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  `is_deleted`    TINYINT       NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`notice_id`),
  KEY `idx_target_read` (`target_user_id`, `is_read`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_priority_time` (`priority`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公告/通知表';


-- =========================================================
-- 6. 消息表（管理员与教师一对一对话）
-- =========================================================
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `message_id`      BIGINT        NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `conversation_id` VARCHAR(100)  NOT NULL                COMMENT '会话ID（sender_id + receiver_id组合）',
  `sender_id`       BIGINT        NOT NULL                COMMENT '发送者ID',
  `receiver_id`     BIGINT        NOT NULL                COMMENT '接收者ID',
  `message_type`    VARCHAR(20)   NOT NULL DEFAULT 'text' COMMENT '消息类型：text/image/file',
  `content`         TEXT          NOT NULL                COMMENT '消息内容',
  `booking_id`      BIGINT        DEFAULT NULL            COMMENT '关联的申请ID（可选）',
  `file_url`        VARCHAR(255)  DEFAULT NULL            COMMENT '附件URL（图片/文件）',
  `is_read`         TINYINT       NOT NULL DEFAULT 0      COMMENT '是否已读：0否 1是',
  `read_time`       DATETIME      DEFAULT NULL            COMMENT '阅读时间',
  `create_time`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user`     BIGINT        DEFAULT NULL            COMMENT '创建人',
  `update_time`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user`     BIGINT        DEFAULT NULL            COMMENT '更新人',
  `is_deleted`      TINYINT       NOT NULL DEFAULT 0      COMMENT '是否删除：0否 1是',
  PRIMARY KEY (`message_id`),
  KEY `idx_conversation` (`conversation_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_receiver_read` (`receiver_id`, `is_read`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表（管理员与教师对话）';



-- =========================================================
-- 7. 管理员审核日志（申请审核、冲突处理等）
-- =========================================================
DROP TABLE IF EXISTS `authlog`;
CREATE TABLE `authlog` (
  `audit_id`     BIGINT       NOT NULL AUTO_INCREMENT COMMENT '审核日志ID',
  `booking_id`   BIGINT       DEFAULT NULL            COMMENT '关联申请ID',
  `schedule_id`  BIGINT       DEFAULT NULL            COMMENT '关联排课ID',
  `admin_user_id`BIGINT       NOT NULL                COMMENT '管理员ID',
  `action`       VARCHAR(50)  NOT NULL                COMMENT '动作：approve/reject/resolve_conflict/update_schedule/other',
  `remark`       VARCHAR(255) DEFAULT NULL            COMMENT '备注/理由',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '操作人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  PRIMARY KEY (`audit_id`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_schedule` (`schedule_id`),
  KEY `idx_admin_time` (`admin_user_id`, `create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员审核日志';


-- =========================================================
-- 8. 数据统计表（聚合汇总结果，便于看板）
-- =========================================================
DROP TABLE IF EXISTS `statistics`;
CREATE TABLE `statistics` (
  `stat_id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  `stat_date`          DATE         NOT NULL                COMMENT '统计日期',
  `stat_type`          VARCHAR(50)  NOT NULL                COMMENT '统计类型（daily/weekly/monthly/semester）',
  `academic_year`      VARCHAR(20)  DEFAULT NULL            COMMENT '学年',
  `semester`           VARCHAR(20)  DEFAULT NULL            COMMENT '学期',
  `total_bookings`     INT          NOT NULL DEFAULT 0      COMMENT '总申请数',
  `pending_bookings`   INT          NOT NULL DEFAULT 0      COMMENT '待审核数',
  `approved_bookings`  INT          NOT NULL DEFAULT 0      COMMENT '已通过数',
  `rejected_bookings`  INT          NOT NULL DEFAULT 0      COMMENT '已拒绝数',
  `total_schedules`    INT          NOT NULL DEFAULT 0      COMMENT '总排课数',
  `conflict_schedules` INT          NOT NULL DEFAULT 0      COMMENT '冲突排课数',
  `total_students`     INT          NOT NULL DEFAULT 0      COMMENT '总学生数',
  `lab_usage_rate`     DECIMAL(5,2) NOT NULL DEFAULT 0.00   COMMENT '实验室使用率(%)',
  `stat_data`          JSON         DEFAULT NULL            COMMENT '扩展统计JSON',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  PRIMARY KEY (`stat_id`),
  UNIQUE KEY `uk_date_type` (`stat_date`, `stat_type`),
  KEY `idx_year_sem` (`academic_year`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统计数据表';


-- =========================================================
-- 9. 系统配置表（当前学期、统一收集时间等）
-- =========================================================
DROP TABLE IF EXISTS `rx_sysconfig`;
CREATE TABLE `rx_sysconfig` (
  `config_id`    BIGINT       NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key`   VARCHAR(100) NOT NULL                COMMENT '配置键（唯一）',
  `config_value` TEXT         DEFAULT NULL            COMMENT '配置值',
  `config_type`  VARCHAR(50)  NOT NULL DEFAULT 'system' COMMENT '配置类型',
  `description`  VARCHAR(255) DEFAULT NULL            COMMENT '说明',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `create_user` BIGINT   DEFAULT NULL                      COMMENT '创建人',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `update_user` BIGINT   DEFAULT NULL                      COMMENT '更新人',
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表（键值对）';


-- =============================================
-- 日新智课数据库建表脚本
-- 数据库名称: rixinclass
-- 版本: v1.0
-- 创建日期: 2024-10-13
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS rixinclass DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rixinclass;

-- =============================================
-- 1. 用户表
-- =============================================
DROP TABLE IF EXISTS tb_user;
CREATE TABLE tb_user (
    user_id BIGINT AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    real_name VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
    phone VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
    email VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    user_type VARCHAR(20) DEFAULT 'teacher' COMMENT '用户类型：teacher-教师, admin-管理员',
    openid VARCHAR(100) DEFAULT NULL COMMENT '微信OpenID',
    status TINYINT DEFAULT 1 COMMENT '账号状态：0-禁用，1-正常',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (user_id),
    UNIQUE KEY uk_username (username),
    KEY idx_openid (openid),
    KEY idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 2. 排课申请表
-- =============================================
DROP TABLE IF EXISTS tb_booking;
CREATE TABLE tb_booking (
    booking_id BIGINT AUTO_INCREMENT COMMENT '预约表编号',
    user_id BIGINT NOT NULL COMMENT '申请教师ID',
    semester VARCHAR(50) NOT NULL COMMENT '学期，如：2025-2026学年 第一学期',
    course_code VARCHAR(50) DEFAULT NULL COMMENT '课程代码',
    course_type VARCHAR(20) DEFAULT NULL COMMENT '课程类型：实验教学/实验作业/工作实习/毕业设计',
    course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
    required_hours INT DEFAULT 0 COMMENT '大纲要求实验学时',
    booking_hours INT DEFAULT 0 COMMENT '预约实验学时',
    class_name VARCHAR(100) DEFAULT NULL COMMENT '授课班级',
    student_count INT DEFAULT 0 COMMENT '选课人数',
    experiment_time VARCHAR(200) DEFAULT NULL COMMENT '实验时间，如：星期一 1-16周（3-4节）',
    weekday TINYINT DEFAULT NULL COMMENT '星期几：1-7',
    week_range VARCHAR(50) DEFAULT NULL COMMENT '教学周范围，如：1-16',
    class_period VARCHAR(50) DEFAULT NULL COMMENT '第几节课，如：3-4',
    software_requirements TEXT COMMENT '软件环境要求',
    other_requirements TEXT COMMENT '其他要求（备注）',
    teacher_name VARCHAR(50) DEFAULT NULL COMMENT '教师姓名',
    teacher_phone VARCHAR(20) DEFAULT NULL COMMENT '教师联系电话',
    teacher_email VARCHAR(100) DEFAULT NULL COMMENT '教师邮箱',
    teacher_signature VARCHAR(255) DEFAULT NULL COMMENT '教师签名（图片URL或base64）',
    status VARCHAR(20) DEFAULT 'pending' COMMENT '申请状态：pending-待审核, approved-已通过, rejected-已拒绝, scheduled-已排课',
    reject_reason TEXT COMMENT '拒绝原因',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (booking_id),
    KEY idx_user_id (user_id),
    KEY idx_semester (semester),
    KEY idx_status (status),
    KEY idx_weekday (weekday),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排课申请表';

-- =============================================
-- 3. 实验室表
-- =============================================
DROP TABLE IF EXISTS tb_laboratory;
CREATE TABLE tb_laboratory (
    lab_id BIGINT AUTO_INCREMENT COMMENT '实验室ID',
    room_number VARCHAR(50) NOT NULL COMMENT '实验室房间号，如：505-506',
    lab_name VARCHAR(100) NOT NULL COMMENT '实验室名称',
    capacity INT DEFAULT 0 COMMENT '容纳人数',
    software_environment TEXT COMMENT '软件环境（多行文本）',
    hardware_environment VARCHAR(255) DEFAULT NULL COMMENT '硬件环境（PC品牌型号等）',
    supported_courses TEXT COMMENT '支持的课程（多个课程用换行或分号分隔）',
    status TINYINT DEFAULT 1 COMMENT '实验室状态：0-维护中，1-可用',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (lab_id),
    UNIQUE KEY uk_room_number (room_number),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='实验室表';

-- =============================================
-- 4. 排课结果表
-- =============================================
DROP TABLE IF EXISTS tb_schedule;
CREATE TABLE tb_schedule (
    schedule_id BIGINT AUTO_INCREMENT COMMENT '排课记录ID',
    booking_id BIGINT NOT NULL COMMENT '申请表编号',
    lab_id BIGINT NOT NULL COMMENT '实验室ID',
    room_number VARCHAR(50) DEFAULT NULL COMMENT '上课地点（冗余字段）',
    semester VARCHAR(50) DEFAULT NULL COMMENT '学期（冗余字段）',
    course_name VARCHAR(100) DEFAULT NULL COMMENT '课程名称（冗余字段）',
    teacher_name VARCHAR(50) DEFAULT NULL COMMENT '教师姓名（冗余字段）',
    weekday TINYINT DEFAULT NULL COMMENT '星期几：1-7',
    week_range VARCHAR(50) DEFAULT NULL COMMENT '教学周范围，如：1-16',
    class_period VARCHAR(50) DEFAULT NULL COMMENT '第几节课，如：3-4',
    student_count INT DEFAULT 0 COMMENT '选课人数',
    lab_assistant VARCHAR(50) DEFAULT NULL COMMENT '实验员姓名',
    lab_assistant_phone VARCHAR(20) DEFAULT NULL COMMENT '实验员电话',
    schedule_type VARCHAR(20) DEFAULT 'auto' COMMENT '排课方式：auto-自动排课, manual-手动排课',
    is_conflict TINYINT DEFAULT 0 COMMENT '是否冲突：0-无冲突，1-有冲突',
    conflict_info TEXT COMMENT '冲突信息',
    operator_id BIGINT DEFAULT NULL COMMENT '操作人ID（管理员）',
    operator_name VARCHAR(50) DEFAULT NULL COMMENT '操作人姓名',
    remark TEXT COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (schedule_id),
    KEY idx_booking_id (booking_id),
    KEY idx_lab_id (lab_id),
    KEY idx_semester_weekday (semester, weekday),
    KEY idx_week_period (week_range, class_period)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排课结果表';

-- =============================================
-- 5. 通知公告表
-- =============================================
DROP TABLE IF EXISTS tb_notice;
CREATE TABLE tb_notice (
    notice_id BIGINT AUTO_INCREMENT COMMENT '公告ID',
    title VARCHAR(200) NOT NULL COMMENT '公告标题',
    content TEXT COMMENT '公告内容',
    notice_type VARCHAR(20) DEFAULT 'system' COMMENT '公告类型：system-系统公告, booking-排课通知',
    target_user_id BIGINT DEFAULT 0 COMMENT '目标用户ID，0表示全部用户',
    is_read TINYINT DEFAULT 0 COMMENT '是否已读：0-未读，1-已读',
    publisher_id BIGINT DEFAULT NULL COMMENT '发布者ID',
    publisher_name VARCHAR(50) DEFAULT NULL COMMENT '发布者姓名',
    publish_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (notice_id),
    KEY idx_target_user (target_user_id),
    KEY idx_publish_time (publish_time),
    KEY idx_notice_type (notice_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知公告表';

-- =============================================
-- 6. 统计数据表
-- =============================================
DROP TABLE IF EXISTS tb_statistics;
CREATE TABLE tb_statistics (
    stat_id BIGINT AUTO_INCREMENT COMMENT '统计ID',
    semester VARCHAR(50) DEFAULT NULL COMMENT '学期',
    stat_type VARCHAR(50) NOT NULL COMMENT '统计类型：booking_count, lab_usage, course_type等',
    stat_key VARCHAR(100) DEFAULT NULL COMMENT '统计键：如实验室号、课程类型等',
    stat_value DECIMAL(10,2) DEFAULT 0.00 COMMENT '统计值',
    stat_date DATE DEFAULT NULL COMMENT '统计日期',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (stat_id),
    KEY idx_semester (semester),
    KEY idx_stat_type (stat_type),
    KEY idx_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统计数据表';

-- =============================================
-- 7. 系统配置表
-- =============================================
DROP TABLE IF EXISTS tb_system_config;
CREATE TABLE tb_system_config (
    config_id BIGINT AUTO_INCREMENT COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_desc VARCHAR(255) DEFAULT NULL COMMENT '配置描述',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (config_id),
    UNIQUE KEY uk_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =============================================
-- 初始化数据
-- =============================================

-- 插入默认管理员账号（密码: admin123，实际使用需加密）
INSERT INTO tb_user (username, password, real_name, phone, email, user_type, status) VALUES
('admin', 'e10adc3949ba59abbe56e057f20f883e', '系统管理员', '010-12345678', 'admin@bjut.edu.cn', 'admin', 1);

-- 插入示例教师账号
INSERT INTO tb_user (username, password, real_name, phone, email, user_type, status) VALUES
('teacher001', 'e10adc3949ba59abbe56e057f20f883e', '张三', '13800138000', 'zhangsan@bjut.edu.cn', 'teacher', 1),
('teacher002', 'e10adc3949ba59abbe56e057f20f883e', '李四', '13800138001', 'lisi@bjut.edu.cn', 'teacher', 1);

-- 插入实验室数据（基于CSV文件）
INSERT INTO tb_laboratory (room_number, lab_name, capacity, software_environment, hardware_environment, supported_courses, status) VALUES
('505-506', '大数据与软件技术教学实验室', 100, 
'win-10\n1、Dev C++5.11\n2、visual studio 2010\n3、wireShark3.6.2\n4、gcc(ubuntu)', 
'惠普', 
'面向对象程序设计;计算机网络实验;高级语言程序设计;操作系统原理', 
1),
('518-519', '软件工程专业教学实验室', 100, 
'win7/win10\n1、Dev C++5.11\n2、visual studio 2010\n3、eclipse 2023.6\n4、wireShark3.6.2\n5、gcc(ubuntu)', 
'联想ThinkCenter', 
'面向对象程序设计;面向对象技术;计算机网络实验;高级语言程序设计;操作系统原理', 
1),
('513-514', '软件质量与测试实验室', 50, 
'Windows 10\n1、Powerdesign16.7\n2、Myeclipse2017\n3、Tomcat9.0.5\n4、Wildfly10.1.0 final\n5、SQLyog_Enterprise\n6、MySQL-8.0.29-winx64', 
'联想MT8000', 
'云服务工程;软件质量与测试', 
1);

-- 插入系统公告
INSERT INTO tb_notice (title, content, notice_type, target_user_id, publisher_id, publisher_name) VALUES
('关于2024-2025学年第二学期实验室排课的通知', '各位老师：\n\n2024-2025学年第二学期实验室排课工作即将开始，请各位老师按照要求提交排课申请。申请截止时间为2024年10月20日。\n\n实验中心\n2024年10月8日', 'system', 0, 1, '系统管理员'),
('实验室设备维护通知', '因设备维护需要，513-514实验室将于本周六进行系统升级，期间暂停使用。给您带来的不便敬请谅解。\n\n实验中心\n2024年10月5日', 'system', 0, 1, '系统管理员');

-- 插入系统配置
INSERT INTO tb_system_config (config_key, config_value, config_desc) VALUES
('current_semester', '2024-2025学年 第一学期', '当前学期'),
('semester_list', '2024-2025学年 第一学期;2024-2025学年 第二学期;2025-2026学年 第一学期;2025-2026学年 第二学期', '可选学期列表'),
('course_types', '实验教学;实验作业;工作实习;毕业设计', '课程类型列表'),
('class_periods', '1-2;3-4;5-6;7-8;9-10', '课时段列表'),
('teaching_weeks', '1-16;1-8;9-16', '常用教学周列表');

-- =============================================
-- 插入示例数据（用于测试）
-- =============================================

-- 插入示例排课申请
INSERT INTO tb_booking (
    user_id, semester, course_code, course_type, course_name, 
    required_hours, booking_hours, class_name, student_count,
    experiment_time, weekday, week_range, class_period,
    software_requirements, other_requirements,
    teacher_name, teacher_phone, teacher_email, status
) VALUES
(2, '2024-2025学年 第一学期', 'CS101', '实验教学', '面向对象程序设计',
 32, 32, '软件2201', 45,
 '星期一 1-16周（3-4节）', 1, '1-16', '3-4',
 'Dev C++5.11, visual studio 2010', '需要投影仪',
 '张三', '13800138000', 'zhangsan@bjut.edu.cn', 'pending'),
 
(3, '2024-2025学年 第一学期', 'CS201', '实验教学', '计算机网络实验',
 16, 16, '软件2202', 40,
 '星期三 1-8周（5-6节）', 3, '1-8', '5-6',
 'wireShark3.6.2, 需要连接互联网', '无',
 '李四', '13800138001', 'lisi@bjut.edu.cn', 'pending');

-- =============================================
-- 创建视图（可选）
-- =============================================

-- 排课详情视图（合并申请和排课结果）
CREATE OR REPLACE VIEW v_schedule_detail AS
SELECT 
    s.schedule_id,
    s.booking_id,
    b.semester,
    b.course_code,
    b.course_name,
    b.course_type,
    b.teacher_name,
    b.teacher_phone,
    b.class_name,
    b.student_count,
    s.room_number,
    l.lab_name,
    s.weekday,
    s.week_range,
    s.class_period,
    s.lab_assistant,
    s.lab_assistant_phone,
    s.schedule_type,
    s.is_conflict,
    b.software_requirements,
    b.other_requirements,
    s.create_time
FROM tb_schedule s
LEFT JOIN tb_booking b ON s.booking_id = b.booking_id
LEFT JOIN tb_laboratory l ON s.lab_id = l.lab_id;

-- 申请统计视图
CREATE OR REPLACE VIEW v_booking_statistics AS
SELECT 
    semester,
    course_type,
    status,
    COUNT(*) as booking_count,
    SUM(student_count) as total_students,
    SUM(booking_hours) as total_hours
FROM tb_booking
GROUP BY semester, course_type, status;

-- =============================================
-- 完成
-- =============================================

-- 显示所有表
SHOW TABLES;

-- 显示表统计信息
SELECT 
    TABLE_NAME as '表名',
    TABLE_COMMENT as '说明',
    TABLE_ROWS as '数据行数'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'rixinclass' 
  AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;


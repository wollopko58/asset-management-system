-- =========================================================
-- Asset Management System
-- Database Schema - MySQL
-- =========================================================

CREATE DATABASE IF NOT EXISTS asset_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE asset_management;

-- =========================================================
-- 1. users
-- ผู้ดูแลระบบ (Admin)
-- =========================================================

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. departments
-- แผนก / หน่วยงาน
-- =========================================================

CREATE TABLE departments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(50) UNIQUE,
    department_name VARCHAR(200) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 3. asset_types
-- ประเภทครุภัณฑ์
-- =========================================================

CREATE TABLE asset_types (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================================
-- 4. asset_managements
-- ข้อมูลครุภัณฑ์หลัก
-- =========================================================

CREATE TABLE asset_managements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

-- ข้อมูลครุภัณฑ์
asset_no VARCHAR(100) NOT NULL UNIQUE,
asset_name VARCHAR(200) NOT NULL,
asset_type_id INT UNSIGNED NOT NULL,
department_id INT UNSIGNED NOT NULL,

-- Hardware
mac_address VARCHAR(50),
serial_number VARCHAR(100),
processor VARCHAR(200),
ram VARCHAR(50),
storage_type VARCHAR(50),
storage_capacity VARCHAR(50),

-- Operating System
operating_system VARCHAR(100), os_license VARCHAR(100),

-- Microsoft Office
microsoft_office VARCHAR(100), office_license VARCHAR(100),

-- การจัดหา
acquisition_method VARCHAR(100),
fiscal_year SMALLINT UNSIGNED NOT NULL,

-- ผู้รับผิดชอบ
responsible_person VARCHAR(200), responsible_phone VARCHAR(20),

-- สถานะ
status ENUM(
    'ACTIVE',
    'REPAIR',
    'BROKEN',
    'DISPOSED'
) NOT NULL DEFAULT 'ACTIVE',

-- หมายเหตุ
note TEXT,

-- QR Code
qr_token VARCHAR(100) UNIQUE,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys


CONSTRAINT fk_asset_type
        FOREIGN KEY (asset_type_id)
        REFERENCES asset_types(id),

    CONSTRAINT fk_asset_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
);

-- =========================================================
-- 5. repairs_history
-- ประวัติการแจ้งซ่อมของครุภัณฑ์
--
-- ปัจจุบัน: กรอกข้อมูล Manual
-- อนาคต: สามารถรับข้อมูลจาก Repair System ผ่าน API
-- =========================================================


CREATE TABLE repairs_history (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    asset_id INT UNSIGNED NOT NULL,

-- เลข Ticket จากระบบแจ้งซ่อม
-- ปัจจุบันจะใส่หรือไม่ใส่ก็ได้
ticket_no VARCHAR(50) UNIQUE,

-- รายละเอียดปัญหา
description TEXT NOT NULL,

-- สถานะการซ่อม


status ENUM(
        'OPEN',
        'IN_PROGRESS',
        'RESOLVED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'OPEN',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_repair_asset
        FOREIGN KEY (asset_id)
        REFERENCES asset_managements(id)
);

-- =========================================================
-- 6. notifications
-- การแจ้งเตือนสำหรับ Admin
-- =========================================================

CREATE TABLE notifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id)
);

-- =========================================================
-- 7. asset_history
-- ประวัติการเปลี่ยนแปลง / โยกย้ายครุภัณฑ์
-- =========================================================


CREATE TABLE asset_history (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    asset_id INT UNSIGNED NOT NULL,

-- ประเภทการเปลี่ยนแปลง
-- เช่น TRANSFER, UPDATE, STATUS_CHANGE
action VARCHAR(50) NOT NULL,

-- แผนกเดิม / แผนกใหม่
old_department_id INT UNSIGNED, new_department_id INT UNSIGNED,

-- ผู้รับผิดชอบเดิม / ใหม่
old_responsible_person VARCHAR(200),
new_responsible_person VARCHAR(200),

-- Admin ที่ทำรายการ
changed_by INT UNSIGNED,
note TEXT,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- Foreign Keys


CONSTRAINT fk_history_asset
        FOREIGN KEY (asset_id)
        REFERENCES asset_managements(id),

    CONSTRAINT fk_history_old_department
        FOREIGN KEY (old_department_id)
        REFERENCES departments(id),

    CONSTRAINT fk_history_new_department
        FOREIGN KEY (new_department_id)
        REFERENCES departments(id),

    CONSTRAINT fk_history_user
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
);

-- =========================================================
-- 8. refresh_tokens
-- เก็บ Refresh Token สำหรับการต่ออายุ Access Token
-- =========================================================

CREATE TABLE refresh_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
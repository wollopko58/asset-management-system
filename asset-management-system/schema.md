# Asset Management Database Schema

**Database:** `asset_management`

**Database Engine:** MySQL

---

## ภาพรวมระบบ

Database สำหรับระบบบริหารจัดการครุภัณฑ์ โดยมีโครงสร้างหลักดังนี้

```text
users
 │
 ├── refresh_tokens
 │
 └── notifications

departments ───────────────┐
 │                        │
 │                        ▼
 └─────────────── asset_managements
                         │
                         ├── repairs_history
                         │
                         └── asset_history

asset_types ───────────────┘
```

### ตารางทั้งหมด

| #   | Table               | หน้าที่                                     |
| --- | ------------------- | ------------------------------------------- |
| 1   | `users`             | ผู้ดูแลระบบ                                 |
| 2   | `refresh_tokens`    | จัดเก็บ Refresh Token สำหรับ Authentication |
| 3   | `departments`       | แผนก / หน่วยงาน                             |
| 4   | `asset_types`       | ประเภทครุภัณฑ์                              |
| 5   | `asset_managements` | ข้อมูลครุภัณฑ์หลัก                          |
| 6   | `repairs_history`   | ประวัติการแจ้งซ่อม                          |
| 7   | `notifications`     | การแจ้งเตือน Admin                          |
| 8   | `asset_history`     | ประวัติการเปลี่ยนแปลง / โยกย้าย             |

---

# 1. users

เก็บข้อมูลผู้ใช้งานระบบ โดยระบบปัจจุบันมีเฉพาะ **Admin**

| Field           | Type           | Constraint / Default                             | Description                   |
| --------------- | -------------- | ------------------------------------------------ | ----------------------------- |
| `id`            | `INT UNSIGNED` | PK, AUTO_INCREMENT                               | รหัสผู้ใช้                    |
| `username`      | `VARCHAR(100)` | NOT NULL, UNIQUE                                 | ชื่อผู้ใช้สำหรับ Login        |
| `password_hash` | `VARCHAR(255)` | NOT NULL                                         | Password ที่ผ่านการ Hash แล้ว |
| `name`          | `VARCHAR(200)` | NOT NULL                                         | ชื่อผู้ใช้                    |
| `role`          | `VARCHAR(50)`  | NOT NULL, DEFAULT `'ADMIN'`                      | Role ของผู้ใช้                |
| `status`        | `BOOLEAN`      | NOT NULL, DEFAULT `TRUE`                         | สถานะการใช้งาน                |
| `created_at`    | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`            | วันที่สร้าง                   |
| `updated_at`    | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`, ON UPDATE | วันที่แก้ไขล่าสุด             |

### หมายเหตุ

- `username` ไม่สามารถซ้ำกันได้
- `password_hash` ต้องเก็บ Password ที่ Hash แล้ว ไม่ควรเก็บ Password จริง
- `status = TRUE` หมายถึงสามารถใช้งานระบบได้
- ปัจจุบัน `role` มีค่า Default เป็น `ADMIN`
- ระบบไม่มี Register API การสร้าง User สามารถจัดการผ่าน Database โดยตรง

---

# 2. refresh_tokens

เก็บ Refresh Token สำหรับใช้ขอ Access Token ใหม่เมื่อ Access Token หมดอายุ

| Field        | Type           | Constraint / Default                  | Description                 |
| ------------ | -------------- | ------------------------------------- | --------------------------- |
| `id`         | `INT UNSIGNED` | PK, AUTO_INCREMENT                    | รหัส Refresh Token          |
| `user_id`    | `INT UNSIGNED` | NOT NULL, FK                          | ผู้ใช้ที่เป็นเจ้าของ Token  |
| `token`      | `VARCHAR(500)` | NOT NULL, UNIQUE                      | Refresh Token               |
| `expires_at` | `DATETIME`     | NOT NULL                              | วันและเวลาที่ Token หมดอายุ |
| `created_at` | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | วันที่สร้าง Token           |

### หมายเหตุ

- Refresh Token ใช้สำหรับขอ Access Token ใหม่โดยไม่ต้อง Login ใหม่
- `token` ไม่สามารถซ้ำกันได้
- Token ที่หมดอายุไม่ควรนำกลับมาใช้งาน
- Logout สามารถใช้สำหรับยกเลิก / ลบ Refresh Token ของผู้ใช้ได้
- ตารางนี้มีความสัมพันธ์กับ `users`

### Foreign Key

```text
user_id → users.id
```

### ความสัมพันธ์

ผู้ใช้หนึ่งคนสามารถมี Refresh Token ได้หลายรายการ เช่น Login จากหลายอุปกรณ์หรือหลาย Session

```text
users
  │
  │ user_id
  ▼
refresh_tokens
```

---

# 3. departments

เก็บข้อมูลแผนกหรือหน่วยงานภายในองค์กร

| Field             | Type           | Constraint / Default                             | Description       |
| ----------------- | -------------- | ------------------------------------------------ | ----------------- |
| `id`              | `INT UNSIGNED` | PK, AUTO_INCREMENT                               | รหัสแผนก          |
| `department_code` | `VARCHAR(50)`  | UNIQUE                                           | รหัสแผนก          |
| `department_name` | `VARCHAR(200)` | NOT NULL                                         | ชื่อแผนก          |
| `status`          | `BOOLEAN`      | NOT NULL, DEFAULT `TRUE`                         | สถานะการใช้งาน    |
| `created_at`      | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`            | วันที่สร้าง       |
| `updated_at`      | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`, ON UPDATE | วันที่แก้ไขล่าสุด |

### หมายเหตุ

`status` ใช้สำหรับ Soft Delete / ปิดการใช้งานแผนก

```text
TRUE  = ใช้งาน
FALSE = ปิดการใช้งาน
```

ข้อมูลจะไม่ถูกลบออกจาก Database จริง

---

# 4. asset_types

เก็บประเภทของครุภัณฑ์

ตัวอย่าง:

- Computer
- Printer
- UPS
- Monitor

| Field         | Type           | Constraint / Default                             | Description       |
| ------------- | -------------- | ------------------------------------------------ | ----------------- |
| `id`          | `INT UNSIGNED` | PK, AUTO_INCREMENT                               | รหัสประเภท        |
| `name`        | `VARCHAR(100)` | NOT NULL, UNIQUE                                 | ชื่อประเภท        |
| `description` | `TEXT`         | NULL                                             | รายละเอียด        |
| `status`      | `BOOLEAN`      | NOT NULL, DEFAULT `TRUE`                         | สถานะการใช้งาน    |
| `created_at`  | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`            | วันที่สร้าง       |
| `updated_at`  | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`, ON UPDATE | วันที่แก้ไขล่าสุด |

### หมายเหตุ

`name` ไม่สามารถซ้ำกันได้

เช่น ไม่ควรมี:

```text
Computer
Computer
```

---

# 5. asset_managements

ตารางหลักสำหรับเก็บข้อมูลครุภัณฑ์

| Field                | Type                | Constraint / Default                             | Description          |
| -------------------- | ------------------- | ------------------------------------------------ | -------------------- |
| `id`                 | `INT UNSIGNED`      | PK, AUTO_INCREMENT                               | รหัสครุภัณฑ์         |
| `asset_no`           | `VARCHAR(100)`      | NOT NULL, UNIQUE                                 | เลขครุภัณฑ์          |
| `asset_name`         | `VARCHAR(200)`      | NOT NULL                                         | ชื่อครุภัณฑ์         |
| `asset_type_id`      | `INT UNSIGNED`      | NOT NULL, FK                                     | ประเภทครุภัณฑ์       |
| `department_id`      | `INT UNSIGNED`      | NOT NULL, FK                                     | แผนกที่ครุภัณฑ์อยู่  |
| `mac_address`        | `VARCHAR(50)`       | NULL                                             | MAC Address          |
| `serial_number`      | `VARCHAR(100)`      | NULL                                             | Serial Number        |
| `processor`          | `VARCHAR(200)`      | NULL                                             | CPU / Processor      |
| `ram`                | `VARCHAR(50)`       | NULL                                             | RAM                  |
| `storage_type`       | `VARCHAR(50)`       | NULL                                             | ประเภท Storage       |
| `storage_capacity`   | `VARCHAR(50)`       | NULL                                             | ความจุ Storage       |
| `operating_system`   | `VARCHAR(100)`      | NULL                                             | ระบบปฏิบัติการ       |
| `os_license`         | `VARCHAR(100)`      | NULL                                             | License ของ OS       |
| `microsoft_office`   | `VARCHAR(100)`      | NULL                                             | Microsoft Office     |
| `office_license`     | `VARCHAR(100)`      | NULL                                             | License ของ Office   |
| `acquisition_method` | `VARCHAR(100)`      | NULL                                             | วิธีการจัดหา         |
| `fiscal_year`        | `SMALLINT UNSIGNED` | NOT NULL                                         | ปีงบประมาณ           |
| `responsible_person` | `VARCHAR(200)`      | NULL                                             | ผู้รับผิดชอบ         |
| `responsible_phone`  | `VARCHAR(20)`       | NULL                                             | เบอร์โทรศัพท์        |
| `status`             | `ENUM`              | NOT NULL, DEFAULT `'ACTIVE'`                     | สถานะครุภัณฑ์        |
| `note`               | `TEXT`              | NULL                                             | หมายเหตุ             |
| `qr_token`           | `VARCHAR(100)`      | UNIQUE                                           | Token สำหรับ QR Code |
| `created_at`         | `DATETIME`          | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`            | วันที่สร้าง          |
| `updated_at`         | `DATETIME`          | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`, ON UPDATE | วันที่แก้ไขล่าสุด    |

### Status ของครุภัณฑ์

```text
ACTIVE
REPAIR
BROKEN
DISPOSED
```

| Status     | ความหมาย             |
| ---------- | -------------------- |
| `ACTIVE`   | ใช้งานปกติ           |
| `REPAIR`   | อยู่ระหว่างซ่อม      |
| `BROKEN`   | ชำรุด                |
| `DISPOSED` | จำหน่าย / เลิกใช้งาน |

### Foreign Keys

```text
asset_type_id → asset_types.id
department_id → departments.id
```

ดังนั้นครุภัณฑ์หนึ่งรายการต้องมีประเภทและแผนกที่อ้างอิงอยู่จริง

---

# 6. repairs_history

เก็บประวัติการแจ้งซ่อมของครุภัณฑ์

ปัจจุบันสามารถกรอกข้อมูลแบบ Manual ได้ และในอนาคตสามารถรับข้อมูลจาก **Repair System ผ่าน API** ได้

| Field         | Type           | Constraint / Default                             | Description                |
| ------------- | -------------- | ------------------------------------------------ | -------------------------- |
| `id`          | `INT UNSIGNED` | PK, AUTO_INCREMENT                               | รหัสประวัติการซ่อม         |
| `asset_id`    | `INT UNSIGNED` | NOT NULL, FK                                     | ครุภัณฑ์ที่ถูกซ่อม         |
| `ticket_no`   | `VARCHAR(50)`  | NULL                                             | เลข Ticket จากระบบแจ้งซ่อม |
| `description` | `TEXT`         | NOT NULL                                         | รายละเอียดปัญหา            |
| `status`      | `ENUM`         | NOT NULL, DEFAULT `'OPEN'`                       | สถานะการซ่อม               |
| `created_at`  | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`            | วันที่สร้าง                |
| `updated_at`  | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP`, ON UPDATE | วันที่แก้ไขล่าสุด          |

### Status ของการซ่อม

```text
OPEN
IN_PROGRESS
RESOLVED
CANCELLED
```

| Status        | ความหมาย       |
| ------------- | -------------- |
| `OPEN`        | เปิดรายการซ่อม |
| `IN_PROGRESS` | กำลังดำเนินการ |
| `RESOLVED`    | ซ่อมเสร็จแล้ว  |
| `CANCELLED`   | ยกเลิกรายการ   |

### Foreign Key

```text
asset_id → asset_managements.id
```

---

# 7. notifications

เก็บการแจ้งเตือนสำหรับ Admin

| Field        | Type           | Constraint / Default                  | Description              |
| ------------ | -------------- | ------------------------------------- | ------------------------ |
| `id`         | `INT UNSIGNED` | PK, AUTO_INCREMENT                    | รหัสการแจ้งเตือน         |
| `user_id`    | `INT UNSIGNED` | NOT NULL, FK                          | Admin ที่ได้รับแจ้งเตือน |
| `title`      | `VARCHAR(200)` | NOT NULL                              | หัวข้อ                   |
| `message`    | `TEXT`         | NOT NULL                              | รายละเอียด               |
| `type`       | `VARCHAR(50)`  | NULL                                  | ประเภทการแจ้งเตือน       |
| `is_read`    | `BOOLEAN`      | NOT NULL, DEFAULT `FALSE`             | อ่านแล้วหรือยัง          |
| `created_at` | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | วันที่สร้าง              |

### สถานะการอ่าน

```text
FALSE = ยังไม่ได้อ่าน
TRUE  = อ่านแล้ว
```

### Foreign Key

```text
user_id → users.id
```

---

# 8. asset_history

เก็บประวัติการเปลี่ยนแปลงของครุภัณฑ์ เช่น การโยกย้ายแผนก การเปลี่ยนผู้รับผิดชอบ หรือการเปลี่ยนสถานะ

| Field                    | Type           | Constraint / Default                  | Description                 |
| ------------------------ | -------------- | ------------------------------------- | --------------------------- |
| `id`                     | `INT UNSIGNED` | PK, AUTO_INCREMENT                    | รหัสประวัติ                 |
| `asset_id`               | `INT UNSIGNED` | NOT NULL, FK                          | ครุภัณฑ์ที่มีการเปลี่ยนแปลง |
| `action`                 | `VARCHAR(50)`  | NOT NULL                              | ประเภทการเปลี่ยนแปลง        |
| `old_department_id`      | `INT UNSIGNED` | NULL, FK                              | แผนกเดิม                    |
| `new_department_id`      | `INT UNSIGNED` | NULL, FK                              | แผนกใหม่                    |
| `old_responsible_person` | `VARCHAR(200)` | NULL                                  | ผู้รับผิดชอบเดิม            |
| `new_responsible_person` | `VARCHAR(200)` | NULL                                  | ผู้รับผิดชอบใหม่            |
| `changed_by`             | `INT UNSIGNED` | NULL, FK                              | Admin ที่ทำรายการ           |
| `note`                   | `TEXT`         | NULL                                  | หมายเหตุ                    |
| `created_at`             | `DATETIME`     | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | วันที่เกิดการเปลี่ยนแปลง    |

### ตัวอย่าง `action`

```text
TRANSFER
UPDATE
STATUS_CHANGE
```

### Foreign Keys

```text
asset_id          → asset_managements.id
old_department_id → departments.id
new_department_id → departments.id
changed_by        → users.id
```

---

# ความสัมพันธ์ระหว่างตาราง

```text
                         ┌──────────────┐
                         │    users     │
                         └──────┬───────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 │ user_id                     │ user_id
                 ▼                             ▼
        ┌────────────────┐             ┌──────────────┐
        │ refresh_tokens │             │ notifications│
        └────────────────┘             └──────────────┘


┌──────────────┐
│ asset_types  │
└──────┬───────┘
       │ asset_type_id
       │
       ▼
┌──────────────────────┐
│  asset_managements   │
└──────┬─────────┬─────┘
       │         │
       │         │ asset_id
       │         ▼
       │   ┌──────────────────┐
       │   │ repairs_history  │
       │   └──────────────────┘
       │
       │ asset_id
       ▼
┌──────────────────────┐
│    asset_history     │
└──────────┬───────────┘
           │
           │ department
           ▼
    ┌──────────────┐
    │ departments  │
    └──────────────┘
```

---

# สรุปการใช้งานแต่ละตาราง

| Table               | ใช้ทำอะไร                                  |
| ------------------- | ------------------------------------------ |
| `users`             | Login และข้อมูล Admin                      |
| `refresh_tokens`    | จัดการ Refresh Token สำหรับ Authentication |
| `departments`       | จัดการแผนก/หน่วยงาน                        |
| `asset_types`       | จัดการประเภทครุภัณฑ์                       |
| `asset_managements` | ข้อมูลครุภัณฑ์ทั้งหมด                      |
| `repairs_history`   | ประวัติการซ่อม                             |
| `notifications`     | แจ้งเตือน Admin                            |
| `asset_history`     | เก็บประวัติการเปลี่ยนแปลง/โยกย้าย          |

---

# แนวทางการจัดการ Status

ระบบนี้มี Status อยู่หลายระดับตามหน้าที่ของข้อมูล

### Master Data

`departments`, `asset_types`

```text
TRUE  → ใช้งาน
FALSE → ปิดการใช้งาน
```

ใช้แนวคิด **Soft Delete** เพื่อรักษาข้อมูลเดิม

### Asset

`asset_managements.status`

```text
ACTIVE
REPAIR
BROKEN
DISPOSED
```

### Repair

`repairs_history.status`

```text
OPEN
IN_PROGRESS
RESOLVED
CANCELLED
```

### Notification

`notifications.is_read`

```text
FALSE → ยังไม่อ่าน
TRUE  → อ่านแล้ว
```

---

# Authentication

ระบบใช้ JWT Authentication โดยแบ่ง Token ออกเป็น 2 ประเภท

```text
Access Token
    ↓
ใช้สำหรับเรียก API
อายุสั้น

Refresh Token
    ↓
ใช้ขอ Access Token ใหม่
อายุยาว
```

Refresh Token ถูกจัดเก็บในตาราง `refresh_tokens` เพื่อให้สามารถตรวจสอบอายุและยกเลิก Token ได้

Authentication Flow:

```text
Login
  ↓
ตรวจสอบ Username / Password
  ↓
สร้าง Access Token
สร้าง Refresh Token
  ↓
เก็บ Refresh Token ลง Database
  ↓
ส่ง Token กลับ Client
  ↓
Client ใช้ Access Token เรียก API
  ↓
Access Token หมดอายุ
  ↓
POST /auth/refresh
  ↓
ตรวจสอบ Refresh Token
  ↓
สร้าง Access Token ใหม่
```

Logout สามารถยกเลิก Refresh Token เพื่อป้องกันการนำ Token กลับมาใช้ต่อ

---

# API Architecture

สำหรับการพัฒนา API แต่ละ Resource จะใช้โครงสร้าง:

```text
Route
  ↓
Validator
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL
```

สำหรับ Authentication จะมี Middleware เพิ่มเข้ามา:

```text
Request
  ↓
Auth Middleware
  ↓
Route
  ↓
Validator
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MySQL
```

ตัวอย่าง:

```text
POST /api/departments

        ↓

department.route.js

        ↓

department.validator.js

        ↓

department.controller.js

        ↓

department.service.js

        ↓

department.repository.js

        ↓

MySQL
```

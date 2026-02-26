-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2026 at 08:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bmusystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `borrow_history`
--

CREATE TABLE `borrow_history` (
  `id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `borrower_name` varchar(255) NOT NULL,
  `borrow_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `received_by` varchar(255) DEFAULT NULL,
  `reject_remark` text DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `status` enum('borrowed','returned','pending_borrow','pending_return','rejected') NOT NULL DEFAULT 'pending_borrow',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `borrow_history`
--

INSERT INTO `borrow_history` (`id`, `equipment_id`, `borrower_name`, `borrow_date`, `return_date`, `received_by`, `reject_remark`, `remark`, `status`, `created_at`, `updated_at`) VALUES
(4, 3, 'Tawan', '2026-02-27 01:34:40', '2026-02-27 01:34:46', NULL, NULL, NULL, 'returned', '2026-02-26 18:34:40', '2026-02-26 18:34:46'),
(5, 4, 'Tawan', '2026-02-27 01:34:54', '2026-02-27 01:44:19', NULL, NULL, NULL, 'returned', '2026-02-26 18:34:54', '2026-02-26 18:44:19'),
(6, 5, 'Tawan', '2026-02-27 01:46:51', '2026-02-27 01:47:06', 'Tawan', NULL, 'กฟ', 'returned', '2026-02-26 18:46:51', '2026-02-26 18:47:06'),
(7, 3, 'Tawan', '2026-02-27 02:18:03', '2026-02-28 00:00:00', NULL, NULL, 'TEST', 'borrowed', '2026-02-26 19:18:03', '2026-02-26 19:18:13');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  `asset_group_code` varchar(100) DEFAULT NULL,
  `asset_code` varchar(100) NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ref_document` varchar(255) DEFAULT NULL,
  `status` enum('usable','in_use','broken','repairing','borrowed','pending_borrow','pending_return') NOT NULL DEFAULT 'usable',
  `assigned_to` varchar(255) DEFAULT NULL,
  `assigned_date` datetime DEFAULT NULL,
  `checklist` text DEFAULT NULL,
  `current_location` enum('office','home') DEFAULT 'office',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_leased` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `category`, `sub_category`, `asset_group_code`, `asset_code`, `name`, `unit`, `description`, `ref_document`, `status`, `assigned_to`, `assigned_date`, `checklist`, `current_location`, `created_at`, `is_leased`) VALUES
(2, '์Notebook', '1', '2', '3', '4', '5', '7', '6', 'in_use', 'Tawan', '2026-02-27 00:46:15', '8', 'office', '2026-02-26 17:00:51', 0),
(3, 'คอมพิวเตอร์และอุปกรณ์', 'Notebook', 'COM-001', 'NB-24-001', 'Dell Latitude 3420', 'เครื่อง', 'CPU Core i5 / RAM 16GB / SSD 512GB (สภาพใหม่)', 'PO-2401001', 'borrowed', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(4, 'คอมพิวเตอร์และอุปกรณ์', 'Notebook', 'COM-001', 'NB-24-002', 'Dell Latitude 3420', 'เครื่อง', 'CPU Core i5 / RAM 16GB / SSD 512GB', 'PO-2401001', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(5, 'คอมพิวเตอร์และอุปกรณ์', 'Notebook', 'COM-001', 'NB-24-003', 'HP ProBook 440 G9', 'เครื่อง', 'CPU Core i7 / RAM 16GB / SSD 512GB (ผู้บริหาร)', 'PO-2402015', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(6, 'คอมพิวเตอร์และอุปกรณ์', 'Notebook', 'COM-001', 'NB-24-004', 'HP ProBook 440 G9', 'เครื่อง', 'CPU Core i7 / RAM 16GB / SSD 512GB', 'PO-2402015', 'in_use', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(7, 'คอมพิวเตอร์และอุปกรณ์', 'Notebook', 'COM-001', 'NB-24-005', 'Lenovo ThinkPad E14', 'เครื่อง', 'CPU Ryzen 5 / RAM 8GB / SSD 256GB', 'PO-2311088', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(8, 'คอมพิวเตอร์และอุปกรณ์', 'Mouse', 'COM-ACC', 'MS-24-001', 'Logitech Wireless Mouse M185', 'อัน', 'เมาส์ไร้สายสีดำ', 'PO-2401002', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(9, 'คอมพิวเตอร์และอุปกรณ์', 'Mouse', 'COM-ACC', 'MS-24-002', 'Logitech Wireless Mouse M185', 'อัน', 'เมาส์ไร้สายสีดำ', 'PO-2401002', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(10, 'คอมพิวเตอร์และอุปกรณ์', 'Mouse', 'COM-ACC', 'MS-24-003', 'Dell Optical Mouse USB', 'อัน', 'เมาส์มีสาย (แถมมากับเครื่อง)', 'PO-2401001', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(11, 'คอมพิวเตอร์และอุปกรณ์', 'Keyboard', 'COM-ACC', 'KB-24-001', 'Logitech K120 USB Keyboard', 'อัน', 'คีย์บอร์ดมาตรฐาน', 'PO-2401002', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(12, 'คอมพิวเตอร์และอุปกรณ์', 'Adapter/Charger', 'COM-ACC', 'AD-24-001', 'Dell 65W AC Adapter', 'อัน', 'สายชาร์จ Notebook Dell', 'PO-2401001', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(13, 'คอมพิวเตอร์และอุปกรณ์', 'Adapter/Charger', 'COM-ACC', 'AD-24-002', 'HP 65W Smart AC Adapter', 'อัน', 'สายชาร์จ Notebook HP', 'PO-2402015', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(14, 'เฟอร์นิเจอร์สำนักงาน', 'โต๊ะทำงาน', 'FUR-001', 'TB-24-001', 'โต๊ะทำงานไม้พาร์ติเคิล 120cm', 'ตัว', 'โต๊ะสีบีช พร้อลิ้นชัก', 'PO-2403005', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(15, 'เฟอร์นิเจอร์สำนักงาน', 'โต๊ะทำงาน', 'FUR-001', 'TB-24-002', 'โต๊ะทำงานไม้พาร์ติเคิล 120cm', 'ตัว', 'โต๊ะสีบีช พร้อลิ้นชัก', 'PO-2403005', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(16, 'เฟอร์นิเจอร์สำนักงาน', 'โต๊ะทำงาน', 'FUR-001', 'TB-24-003', 'โต๊ะผู้บริหาร 180cm', 'ตัว', 'โต๊ะไม้สักสีเข้ม รูปตัว L', 'PO-2403006', 'in_use', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(17, 'เฟอร์นิเจอร์สำนักงาน', 'เก้าอี้สำนักงาน', 'FUR-002', 'CH-24-001', 'เก้าอี้เพื่อสุขภาพ (Ergonomic)', 'ตัว', 'พนักพิงตาข่าย สีดำ พนักพิงศีรษะปรับได้', 'PO-2403007', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(18, 'เฟอร์นิเจอร์สำนักงาน', 'เก้าอี้สำนักงาน', 'FUR-002', 'CH-24-002', 'เก้าอี้เพื่อสุขภาพ (Ergonomic)', 'ตัว', 'พนักพิงตาข่าย สีดำ พนักพิงศีรษะปรับได้', 'PO-2403007', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(19, 'เฟอร์นิเจอร์สำนักงาน', 'เก้าอี้สำนักงาน', 'FUR-002', 'CH-24-003', 'เก้าอี้พนักงานทั่วไป', 'ตัว', 'เบาะผ้าสีน้ำเงิน', 'PO-2403008', '', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(20, 'เฟอร์นิเจอร์สำนักงาน', 'ตู้เก็บเอกสาร', 'FUR-003', 'CB-24-001', 'ตู้เหล็กบานเปิด 2 ประตู', 'ตู้', 'สีเทาอ่อน กุญแจครบ', 'PO-2403009', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(21, 'เครื่องใช้สำนักงาน', 'เครื่องพิมพ์ (Printer)', 'OFC-001', 'PR-24-001', 'Epson EcoTank L3250', 'เครื่อง', 'เครื่องปริ้นสี Wi-Fi All-in-one (อยู่แผนกบัญชี)', 'PO-2402030', 'in_use', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0),
(22, 'เครื่องใช้สำนักงาน', 'โปรเจคเตอร์', 'OFC-002', 'PJ-24-001', 'Epson EB-X51 XGA', 'เครื่อง', 'โปรเจคเตอร์ห้องประชุมใหญ่', 'PO-2402035', 'usable', NULL, NULL, NULL, 'office', '2026-02-26 18:29:43', 0);

-- --------------------------------------------------------

--
-- Table structure for table `equipment_passwords`
--

CREATE TABLE `equipment_passwords` (
  `id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_reports`
--

CREATE TABLE `repair_reports` (
  `id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `reporter_name` varchar(255) NOT NULL,
  `problem_detail` text NOT NULL,
  `report_date` datetime NOT NULL,
  `repair_status` enum('pending','repaired') DEFAULT 'pending',
  `resolved_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `role` enum('HR','IT','OwnerBMU','Employee') DEFAULT 'Employee',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `last_name`, `department`, `role`, `created_at`) VALUES
(1, 'admin', 'admin123', 'System', 'Admin', 'IT', 'IT', '2026-02-26 14:47:05'),
(2, 'Tawan', '$2b$10$yxdZ9Z1Eh2zIAMwrNeN78ugun6KAOhzqQl8ypQBlel/vd78eJfbiS', 'Tawan', 'Tawan', 'บัญชี', '', '2026-02-26 17:42:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `borrow_history`
--
ALTER TABLE `borrow_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_code` (`asset_code`);

--
-- Indexes for table `equipment_passwords`
--
ALTER TABLE `equipment_passwords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- Indexes for table `repair_reports`
--
ALTER TABLE `repair_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_id` (`equipment_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borrow_history`
--
ALTER TABLE `borrow_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `equipment_passwords`
--
ALTER TABLE `equipment_passwords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `repair_reports`
--
ALTER TABLE `repair_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrow_history`
--
ALTER TABLE `borrow_history`
  ADD CONSTRAINT `borrow_history_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `equipment_passwords`
--
ALTER TABLE `equipment_passwords`
  ADD CONSTRAINT `equipment_passwords_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `repair_reports`
--
ALTER TABLE `repair_reports`
  ADD CONSTRAINT `repair_reports_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

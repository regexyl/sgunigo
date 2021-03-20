-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 14, 2019 at 06:42 AM
-- Server version: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `applicant_details`
--
CREATE DATABASE IF NOT EXISTS `applicant_details` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `applicant_details`;

-- --------------------------------------------------------

--
-- Table structure for table `applicant_detailss`
--

DROP TABLE IF EXISTS `applicant_details`;
CREATE TABLE IF NOT EXISTS `applicant_details` 
(
  `nric` varchar(9) NOT NULL,
  `applicant_name` varchar(100) NOT NULL,
  PRIMARY KEY (`nric`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `applicant_details`
--

INSERT INTO `applicant_details` (`nric`,`applicant_name`) VALUES
('S9704965C', 'Aidil'),
('S1234567A', 'test1'),
('S7654321B', 'test2');
COMMIT;

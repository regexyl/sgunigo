-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:${MYSQL_PORT}
-- Generation Time: Jun 12, 2020 at 02:17 AM
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
-- Database: `order`
--
CREATE DATABASE IF NOT EXISTS `application` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `application`;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `application`;
CREATE TABLE IF NOT EXISTS `application` (
  `application_id` int(11) NOT NULL AUTO_INCREMENT,
  `nric` varchar(10) NOT NULL,
  `applicant_name` varchar(100) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `race` varchar(10) NOT NULL,
  `nationality` varchar(100) NOT NULL,
  `dob` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact_no` int(8) NOT NUll,
  `address` varchar(100) NOT NUll,
  `grades` varchar(10) NOT NULL,
  `university` varchar(100) NOT NULL,
  `course1` varchar(100) NOT NULL,
  `course2` varchar(100) NOT NULL,
  `course3` varchar(100) NOT NULL,
  `statement` varchar(1000) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'NEW',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`application_id`, `nric`, `applicant_name`, `email`, `contact_no`, `grades`,`university`,`course1`,`course2`, `course3`,`statement`, `status`, `created`, `modified`) VALUES
(1, 'S9704965C', 'Aidil', 'aidil393@gmail.com', '90227421', 'AAAA', 'SMU', 'Information systems','Computer Science','Economics', 'Accept me in pls i just want to study pls','NEW', '2020-06-12 02:14:55', '2020-06-12 02:14:55');
COMMIT;
-- --------------------------------------------------------

--

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

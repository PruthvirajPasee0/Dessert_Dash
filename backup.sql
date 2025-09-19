-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: dessert_dash
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('a56e6de6-fab6-4c99-891f-387d4c0e07fd','aaeec564971b8770b521cedf4302e2877b6b6053560a6e8ea69ca72e627b154f','2025-09-18 13:18:14.232','20250918131814_init',NULL,NULL,'2025-09-18 13:18:14.088',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `sweetId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Purchase_userId_fkey` (`userId`),
  KEY `Purchase_sweetId_fkey` (`sweetId`),
  CONSTRAINT `Purchase_sweetId_fkey` FOREIGN KEY (`sweetId`) REFERENCES `sweet` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Purchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sweet`
--

DROP TABLE IF EXISTS `sweet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sweet` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sweet`
--

LOCK TABLES `sweet` WRITE;
/*!40000 ALTER TABLE `sweet` DISABLE KEYS */;
INSERT INTO `sweet` VALUES ('78ac6be4-949e-11f0-9be4-b4b6861d0bf1','Chocolate Bar','Chocolate',5.00,0,'2025-09-18 20:17:48.000','2025-09-18 18:27:38.364'),('78ac79c1-949e-11f0-9be4-b4b6861d0bf1','Ladoo','Traditional',20.00,200,'2025-09-18 20:17:48.000','2025-09-18 20:17:48.000'),('78ac7ab6-949e-11f0-9be4-b4b6861d0bf1','Jalebi','Traditional',15.00,150,'2025-09-18 20:17:48.000','2025-09-18 20:17:48.000'),('78ac7aed-949e-11f0-9be4-b4b6861d0bf1','Gulab Jamun','Traditional',25.00,120,'2025-09-18 20:17:48.000','2025-09-18 20:17:48.000'),('78ac7b1f-949e-11f0-9be4-b4b6861d0bf1','Brownie','Bakery',60.00,80,'2025-09-18 20:17:48.000','2025-09-18 20:17:48.000'),('78ac7b4c-949e-11f0-9be4-b4b6861d0bf1','Cupcake','Bakery',40.00,90,'2025-09-18 20:17:48.000','2025-09-18 20:17:48.000'),('f6ea81b7-5393-45ba-a7ea-e686a34746aa','lime juice','traditional',300.00,200,'2025-09-18 17:44:41.547','2025-09-18 17:44:41.547');
/*!40000 ALTER TABLE `sweet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('1bc78cce-94a6-11f0-9be4-b4b6861d0bf1','Admin User','admin@example.com','$2b$10$0vv5euUoGz6hZAFYkPWBcOFsmr3rQikcQdbF9R1z4iNm1adS7POhW','admin','2025-09-18 21:12:28.000'),('67737737-be30-434f-952c-e57eb7947c5a','adam','adam@gmail.com','$2b$10$EJZArHvevUShO3ITOopN5e1mfhQP8iUYpTAIdtxY7XLtnHWgQNd4.','user','2025-09-18 15:02:07.382'),('7ff4cc7b-7741-4af6-85aa-8da8803f49f3','admin','admin@admin.com','$2b$10$y6/Z6qMi5N8/MY8At4ZcgOVMrs6yIK4RNn/6klJcNtjT/hc96Pzem','admin','2025-09-18 16:30:19.778'),('f87dc1d3-acc6-4168-a955-5511a3bb13ee','user','user@user.com','$2b$10$dMUgq3Us5gF/ZClUibBTZe.T42GyqjJMQBlBzSp3Knx74yLVjreba','user','2025-09-18 14:01:23.433');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-19  0:15:45

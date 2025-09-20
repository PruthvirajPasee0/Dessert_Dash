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
INSERT INTO `_prisma_migrations` VALUES ('43cce2e1-9e34-4489-b460-0dd7b88c462f','571e06623bf0969bd59d6c19727b7b67d26e32d9f888d6cdb1858776703a4a86','2025-09-20 05:02:50.332','20250920043752_added_columns_in_purchase_table',NULL,NULL,'2025-09-20 05:02:50.277',1),('51b5394b-a0b0-4827-a313-b4e219e5a5c4','aaeec564971b8770b521cedf4302e2877b6b6053560a6e8ea69ca72e627b154f','2025-09-20 05:02:50.260','20250918131814_init',NULL,NULL,'2025-09-20 05:02:50.141',1),('d68cd369-6a0c-473c-96bc-ad4b5590c2f7','2b7ae7e44f1f13387bf8a278104f3193c2efa914a51840420ae99f3cfeb63af1','2025-09-20 05:02:50.276','20250918184651_add_image_fields',NULL,NULL,'2025-09-20 05:02:50.262',1);
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
  `deliveryFee` decimal(10,2) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `paymentDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`paymentDetails`)),
  `paymentMethod` varchar(191) NOT NULL,
  `pricePerUnit` decimal(10,2) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `tax` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Purchase_orderId_key` (`orderId`),
  KEY `Purchase_userId_fkey` (`userId`),
  KEY `Purchase_sweetId_fkey` (`sweetId`),
  KEY `Purchase_orderId_idx` (`orderId`),
  CONSTRAINT `Purchase_sweetId_fkey` FOREIGN KEY (`sweetId`) REFERENCES `sweet` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Purchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
INSERT INTO `purchase` VALUES ('1cae48dd-9884-43cd-a0c1-2163c2bc735a','ff07c905-6824-4ff4-b898-83096bd54198','uuid-3',1,59.99,'2025-09-20 06:43:20.495',1.23,'ORD-600428-uuid-3','{\"upiId\":\"default@bhim\",\"timestamp\":\"2025-09-20T06:43:20.461Z\"}','BHIM',59.99,'completed',28.66),('25f2e606-3136-41e8-b1e6-0ac8535ff1de','12e77e5a-8b8c-4122-9d15-4a8bce4dc246','uuid-2',3,149.97,'2025-09-20 05:37:16.321',1.85,'ORD-636213-uuid-2','{\"upiId\":\"default@gpay\",\"timestamp\":\"2025-09-20T05:37:16.263Z\"}','GPay',49.99,'completed',47.50),('35cd89cc-0de3-4c07-9cb5-9d67a2d53db2','ff07c905-6824-4ff4-b898-83096bd54198','uuid-2',4,199.96,'2025-09-20 06:43:20.487',1.23,'ORD-600428-uuid-2','{\"upiId\":\"default@bhim\",\"timestamp\":\"2025-09-20T06:43:20.461Z\"}','BHIM',49.99,'completed',28.66),('61b2e4b4-9779-416a-a511-c54bcf14ee06','12e77e5a-8b8c-4122-9d15-4a8bce4dc246','uuid-1',4,799.96,'2025-09-20 05:37:16.330',1.85,'ORD-636213-uuid-1','{\"upiId\":\"default@gpay\",\"timestamp\":\"2025-09-20T05:37:16.263Z\"}','GPay',199.99,'completed',47.50),('94ff6917-966a-4f5d-85d0-3bc3409dbca2','12e77e5a-8b8c-4122-9d15-4a8bce4dc246','uuid-3',6,359.94,'2025-09-20 05:37:31.939',1.85,'ORD-651882-uuid-3','{\"upiId\":\"default@gpay\",\"timestamp\":\"2025-09-20T05:37:31.920Z\"}','GPay',59.99,'completed',40.50),('b1e48cb1-3f6f-48a3-b5a3-2fe71df0e219','ff07c905-6824-4ff4-b898-83096bd54198','uuid-1',3,599.97,'2025-09-20 06:43:20.483',1.23,'ORD-600428-uuid-1','{\"upiId\":\"default@bhim\",\"timestamp\":\"2025-09-20T06:43:20.461Z\"}','BHIM',199.99,'completed',28.66),('bb892763-65fa-4c4f-bdce-ba27e9c91713','12e77e5a-8b8c-4122-9d15-4a8bce4dc246','uuid-2',5,249.95,'2025-09-20 05:28:08.021',3.70,'ORD-087934','{\"upiId\":\"default@gpay\",\"timestamp\":\"2025-09-20T05:28:07.992Z\"}','GPay',49.99,'completed',25.00);
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
  `imageUrl` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sweet`
--

LOCK TABLES `sweet` WRITE;
/*!40000 ALTER TABLE `sweet` DISABLE KEYS */;
INSERT INTO `sweet` VALUES ('uuid-1','Chocolate Truffle','Chocolate',199.99,38,'2025-09-20 10:46:16.000','2025-09-20 06:43:20.479','https://picsum.photos/200/300?chocolate'),('uuid-2','Rasgulla','Indian Sweet',49.99,188,'2025-09-20 10:46:16.000','2025-09-20 06:43:20.486','https://picsum.photos/200/300?rasgulla'),('uuid-3','Ladoo','Indian Sweet',59.99,143,'2025-09-20 10:46:16.000','2025-09-20 06:43:20.493','https://picsum.photos/200/300?ladoo'),('uuid-4','Donut','Bakery',89.99,115,'2025-09-20 10:46:16.000','2025-09-20 05:37:31.945','https://picsum.photos/200/300?donut'),('uuid-5','Gulab Jamun','Indian Sweet',69.99,180,'2025-09-20 10:46:16.000','2025-09-20 10:46:16.000','https://picsum.photos/200/300?gulabjamun');
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
  `imageUrl` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('12e77e5a-8b8c-4122-9d15-4a8bce4dc246','admin','admin@admin.com','$2b$10$H9/gfW8dvyA1EjxoDLZvgOU000QoZj9FdcC6p.ZGkLptnJ5hPuY/O','admin','2025-09-20 05:17:17.856',NULL),('ff07c905-6824-4ff4-b898-83096bd54198','Kaeya','adam@gmail.com','$2b$10$xCE2KL0cCdbJGmrKft/RfuBscCs8EisymHfs.I.MycAG8VjP9co/q','user','2025-09-20 06:43:03.776',NULL);
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

-- Dump completed on 2025-09-20 19:27:16

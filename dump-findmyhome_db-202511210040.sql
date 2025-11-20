-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: findmyhome_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `note` text,
  `status` enum('pending','confirmed','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`user_id`,`room_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','resolved') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,1,5,'test1','2025-11-20 17:35:45');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `price` decimal(15,0) NOT NULL,
  `formatted_price` varchar(50) DEFAULT NULL,
  `area` int DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `address` text,
  `description` text,
  `image_url` text,
  `owner_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Căn hộ Vinhomes Central Park 2PN View Sông, Full Nội Thất','Chung cư cao cấp',18000000,'18 triệu/tháng',82,'Quận Bình Thạnh','208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM','Căn hộ tầng 25, view trực diện Landmark 81 và sông Sài Gòn. Nội thất nhập khẩu Châu Âu, chỉ cần xách vali vào ở. Tiện ích: Gym, Hồ bơi, Công viên 14ha.','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved'),(2,'Nhà nguyên căn mặt tiền đường Phan Huy Ích, tiện kinh doanh','Nhà phố',25000000,'25 triệu/tháng',120,'Quận Gò Vấp','150 Phan Huy Ích, Phường 12, Gò Vấp','Nhà kết cấu 1 trệt 3 lầu, mặt tiền đường lớn sầm uất. Tầng trệt trống suốt thích hợp làm văn phòng công ty hoặc showroom. Có thang máy.','https://decoxdesign.com/upload/images/cac-loai-can-ho-06-decox-design.jpg',NULL,'2025-11-20 17:25:00','approved'),(3,'Căn hộ Masteri Thảo Điền 1PN, phong cách Scandinavian','Căn hộ chung cư',14000000,'14 triệu/tháng',55,'Thành phố Thủ Đức','159 Xa Lộ Hà Nội, Thảo Điền, TP. Thủ Đức','Căn hộ thiết kế hiện đại, tông màu sáng. Ngay cạnh Vincom Mega Mall, kết nối trực tiếp ga Metro số 7. Cộng đồng cư dân văn minh.','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved'),(4,'Biệt thự mini khu Him Lam Quận 7, có sân vườn','Nhà nguyên căn',35000000,'35 triệu/tháng',200,'Quận 7','Đường số 5, Khu đô thị Him Lam, Tân Hưng, Quận 7','Nhà biệt thự mini có sân vườn nhỏ, gara ô tô. Khu vực an ninh tuyệt đối, bảo vệ 24/7. Gần Lotte Mart và trường quốc tế VSTAR.','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved'),(5,'Chung cư EHome 3 Bình Tân, 2PN thoáng mát','Căn hộ chung cư',6500000,'6,5 triệu/tháng',64,'Quận Bình Tân','103 Hồ Học Lãm, An Lạc, Bình Tân','Căn hộ tầng trung, view công viên nội khu. Nhà trống, có sẵn rèm cửa và máy lạnh. Phí quản lý thấp, nhiều cây xanh.','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved'),(6,'Nhà 1 trệt 2 lầu hẻm xe hơi Thành Thái, Quận 10','Nhà nguyên căn',16000000,'16 triệu/tháng',90,'Quận 10','Thành Thái, Phường 14, Quận 10','Nhà mới sơn sửa lại, hẻm rộng ô tô vào tận cửa. Gần bệnh viện 115 và ĐH Bách Khoa. Thích hợp gia đình ở lâu dài.','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved'),(7,'Căn hộ dịch vụ Studio ngay phố đi bộ Nguyễn Huệ','Chung cư cao cấp',12000000,'12 triệu/tháng',35,'Quận 1','Ngô Đức Kế, Bến Nghé, Quận 1','Studio full nội thất như khách sạn 5 sao. Bao điện nước, dọn phòng 2 lần/tuần. Vị trí đắc địa ngay trung tâm.','https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved'),(8,'Nhà cấp 4 có sân vườn rộng, đường Phạm Văn Đồng','Nhà nguyên căn',8000000,'8 triệu/tháng',150,'Thành phố Thủ Đức','Đường 23, Hiệp Bình Chánh, TP. Thủ Đức','Nhà cấp 4 cũ nhưng sạch sẽ, điểm nhấn là sân vườn rất rộng, thích hợp nuôi thú cưng hoặc trồng cây. Gần Gigamall.','https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop',NULL,'2025-11-20 17:25:00','approved');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('tenant','host','admin') DEFAULT 'tenant',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` bigint DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','banned') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'admin@gmail.com','$2b$10$id4rQBsQjJLZT0UkyZvVgOcgj9XsaCUVBcigKzmD1LG91ChArj8tm','Trần Văn Thái(admin)','admin','2025-11-20 17:30:14',NULL,NULL,'đă','active'),(5,'Host@gmail.com','$2b$10$iIIi/3lx7TS1/vcyeBKQD.q/O3KD7SZ3sg9CfAeZDWHSyxksEsx3C','Chủ Nhà(Host)','host','2025-11-20 17:30:27',NULL,NULL,'ưeq','active'),(7,'Guest@gmail.com','$2b$10$nx6TMYgt8tR1pAoS6YulQer3Qxrcg2jfKrQUkxzT6vXISkti0RKgi','Khách Hàng (Guest)','tenant','2025-11-20 17:33:56',NULL,NULL,'0123456789','active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'findmyhome_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21  0:40:59

CREATE DATABASE  IF NOT EXISTS `tfm_app` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tfm_app`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: tfm_app
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `debts`
--

DROP TABLE IF EXISTS `debts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `balance` decimal(10,2) NOT NULL,
  `members_groups_id` int NOT NULL,
  `members_users_id` int NOT NULL,
  PRIMARY KEY (`id`,`members_groups_id`,`members_users_id`),
  KEY `fk_debts_members1_idx` (`members_groups_id`,`members_users_id`),
  CONSTRAINT `fk_debts_members1` FOREIGN KEY (`members_groups_id`, `members_users_id`) REFERENCES `members` (`groups_id`, `users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debts`
--

LOCK TABLES `debts` WRITE;
/*!40000 ALTER TABLE `debts` DISABLE KEYS */;
INSERT INTO `debts` VALUES (58,-66.67,13,2),(59,200.01,13,11),(60,-66.67,13,5),(65,200.00,18,11),(66,-130.00,18,2),(74,-70.00,18,7),(75,480.00,19,11),(76,0.00,18,14),(77,40.00,20,14),(78,0.00,18,15),(79,402.00,21,15),(80,-240.00,21,14),(81,-12.00,21,16),(82,-150.00,21,18),(83,740.00,22,14),(85,-100.00,22,15);
/*!40000 ALTER TABLE `debts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Viaje a Estocolmo','Un viaje a Estocolmo de 5 amigos'),(2,'Mallorca','Increible viaje'),(3,'Viaje a España','Gastos para nuestro viaje a España'),(4,'Alquiler del piso','Gastos mensuales'),(5,'Fiesta oficina','Gastos para la fiesta de fin de año'),(6,'Viaje a Barcelona','Un viaje a Barcelona de 1 semana'),(7,'Viaje a Baleares','Un viaje a Mallorca de 10 dias'),(13,'Un grupo de pruebas','Un viaje a Mallorca de 10 dias'),(18,'Un grupo','Algo'),(19,'Un grupo de prueba','Nodemailer'),(20,'Un grupo de prueba','Nodemailer'),(21,'Un grupo de prueba','Nodemailer'),(22,'Un grupo de prueba para los pagos','payments');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invitations`
--

DROP TABLE IF EXISTS `invitations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `groups_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_has_groups_groups1_idx` (`groups_id`),
  KEY `fk_users_has_groups_users_idx` (`users_id`),
  CONSTRAINT `fk_users_has_groups_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `fk_users_has_groups_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invitations`
--

LOCK TABLES `invitations` WRITE;
/*!40000 ALTER TABLE `invitations` DISABLE KEYS */;
INSERT INTO `invitations` VALUES (1,2,1),(2,3,2),(3,1,3),(4,4,4),(5,5,5);
/*!40000 ALTER TABLE `invitations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `groups_id` int NOT NULL,
  `users_id` int NOT NULL,
  `role` enum('normal','admin') NOT NULL DEFAULT 'normal',
  PRIMARY KEY (`groups_id`,`users_id`),
  KEY `fk_groups_has_users_users1_idx` (`users_id`),
  KEY `fk_groups_has_users_groups1_idx` (`groups_id`),
  CONSTRAINT `fk_groups_has_users_groups1` FOREIGN KEY (`groups_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `fk_groups_has_users_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,1,'admin'),(1,2,'normal'),(1,4,'normal'),(1,5,'normal'),(1,6,'normal'),(2,2,'admin'),(2,3,'normal'),(2,7,'normal'),(3,1,'admin'),(3,2,'normal'),(3,8,'normal'),(3,9,'normal'),(4,3,'admin'),(4,4,'normal'),(4,5,'normal'),(5,1,'admin'),(5,6,'normal'),(5,7,'normal'),(5,8,'normal'),(5,10,'normal'),(7,2,'normal'),(7,5,'normal'),(7,6,'normal'),(7,11,'admin'),(13,2,'normal'),(13,5,'normal'),(13,11,'admin'),(18,2,'normal'),(18,7,'normal'),(18,11,'admin'),(18,14,'normal'),(18,15,'normal'),(19,11,'admin'),(20,14,'admin'),(21,14,'normal'),(21,15,'admin'),(21,16,'normal'),(21,18,'normal'),(22,14,'admin'),(22,15,'normal');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_participants`
--

DROP TABLE IF EXISTS `payment_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_participants` (
  `payment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`payment_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payment_participants_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payment_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_participants`
--

LOCK TABLES `payment_participants` WRITE;
/*!40000 ALTER TABLE `payment_participants` DISABLE KEYS */;
INSERT INTO `payment_participants` VALUES (8,2,66.67),(8,5,66.67),(8,11,66.67),(11,2,60.00),(11,11,60.00),(12,2,70.00),(12,7,70.00),(12,11,70.00),(13,11,40.00),(13,14,40.00),(14,11,40.00),(14,14,40.00),(15,11,40.00),(15,14,40.00),(16,11,40.00),(16,14,40.00),(17,11,40.00),(17,14,40.00),(18,11,40.00),(18,14,40.00),(19,11,40.00),(19,14,40.00),(20,11,40.00),(20,14,40.00),(21,11,40.00),(21,14,40.00),(22,11,40.00),(22,14,40.00),(23,11,40.00),(23,14,40.00),(24,11,40.00),(24,14,40.00),(25,14,40.00),(25,15,40.00),(27,14,40.00),(27,15,40.00),(28,14,40.00),(28,15,40.00),(29,14,40.00),(29,15,40.00),(31,14,40.00),(31,15,40.00),(32,14,40.00),(32,15,40.00),(33,15,12.00),(33,16,12.00),(34,15,150.00),(34,18,150.00),(37,14,160.00),(37,15,160.00),(38,14,160.00),(38,15,160.00),(39,14,160.00),(39,15,160.00),(40,14,50.00),(40,15,50.00),(41,14,50.00),(41,15,50.00);
/*!40000 ALTER TABLE `payment_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `paid_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `members_groups_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paid_by` (`paid_by`),
  KEY `members_groups_id` (`members_groups_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`paid_by`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`members_groups_id`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (8,200.00,'Desayuno y compras en supermercado',11,'2024-06-16 04:50:32',13),(11,120.00,'Desayuno y compras en supermercado',11,'2024-06-16 05:32:50',18),(12,210.00,'Cena',11,'2024-06-16 05:35:04',18),(13,80.00,'Cena',11,'2024-06-22 00:41:02',19),(14,80.00,'Cena',11,'2024-06-22 00:44:02',19),(15,80.00,'Cena',11,'2024-06-22 00:46:40',19),(16,80.00,'Cena',11,'2024-06-22 00:50:17',19),(17,80.00,'Cena',11,'2024-06-22 00:50:40',19),(18,80.00,'Cena',11,'2024-06-22 00:52:42',19),(19,80.00,'Cena',11,'2024-06-22 01:09:31',19),(20,80.00,'Cena',11,'2024-06-22 01:20:38',19),(21,80.00,'Cena',11,'2024-06-22 01:31:56',19),(22,80.00,'Cena',11,'2024-06-22 01:32:14',19),(23,80.00,'Cena',11,'2024-06-22 01:38:45',19),(24,80.00,'Cena',11,'2024-06-22 01:44:01',19),(25,80.00,'Cenita',14,'2024-06-22 01:58:01',20),(26,80.00,'Cenita',15,'2024-06-22 02:03:32',21),(27,80.00,'Cenita',15,'2024-06-22 02:03:37',21),(28,80.00,'Cenita',15,'2024-06-22 02:28:20',21),(29,80.00,'Cenita',15,'2024-06-22 05:02:42',21),(31,80.00,'Cenita',15,'2024-06-22 05:15:07',21),(32,80.00,'Cenita',15,'2024-06-22 05:18:30',21),(33,24.00,'Cenita',15,'2024-06-22 17:18:36',21),(34,300.00,'Viaje a las Maldivas',15,'2024-06-22 18:33:36',21),(37,320.00,'Viaje a las Maldivas',14,'2024-06-23 03:20:51',22),(38,320.00,'Viaje a las Maldivas',14,'2024-06-23 03:27:06',22),(39,320.00,'Viaje a las Maldivas - Actualizado',14,'2024-06-23 03:27:34',22),(40,100.00,'Rezar a dios para que salgan los €',14,'2024-06-23 22:43:02',22),(41,100.00,'Rezar a dios para que salgan los € (prueba2)',14,'2024-06-23 22:44:11',22);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` int NOT NULL,
  `profile_image` blob,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alice Johnson','Alice Johnson','alice@example.com','password1',0,NULL),(2,'Bob Smith','Bob Smith','bob@example.com','password2',0,NULL),(3,'Charlie Brown','Charlie Brown','charlie@example.com','password3',0,NULL),(4,'David Lee','David Lee','david@example.com','password4',0,NULL),(5,'Eva Green','Eva Green','eva@example.com','password5',0,NULL),(6,'Frank White','Frank White','frank@example.com','password6',0,NULL),(7,'Grace Kim','Grace Kim','grace@example.com','password7',0,NULL),(8,'Hannah Wright','Hannah Wright','hannah@example.com','password8',0,NULL),(9,'Isaac Brown','Isaac Brown','isaac@example.com','password9',0,NULL),(10,'Judy Davis','Judy Davis','judy@example.com','Password.123',0,NULL),(11,'testuser','testuser','testuser@example.com','$2a$09$xCCH.jdNL2B.yydwJ3AKAOUE.aS.v7uG7U3KNYOJj88vlekJDY1ke',12345,_binary 'profile_image-1719160090037-471038780.jpg'),(14,'Ibon','Ibon','iboedu@hotmail.com','$2a$09$o5gM/E5yW7dFNLoRpScC2OD3OcjIgqifuVfsN5SANMLsIz0Ojo3GC',12345,NULL),(15,'Alberto','Alberto','alberto.suarez.ing@gmail.com','$2a$09$0QKz7njdvNjYCg2pcAFATOiXQ45Qx2wsT/XrrtYxn4YfvsXrXjvMm',12345,NULL),(16,'Julia','Julia','juliasav2023@gmail.com','$2a$09$JIjXf5ElTN7e30g31ftCredNuweFH/GTL7VCNshzBiqc6hbLNq.Na',12345,NULL),(17,'1','1','1@gmail.com','$2a$09$Mn8VABTjsnYkHLoy6qvdpOWFg1wBGlNC1O1NEWh2KTa9Ttwn2eXGO',12345,NULL),(18,'Matilde','2','mati_jimenez_4@hotmail.com','$2a$09$QT1bI9Rueh3p30QkzMve7O29YTfqmWMTGBeWR8bwMj7EfZgH9UkAa',12345,NULL),(27,'Maria','3','m_m_ibanez@hotmail.com','$2a$09$LtAPzfj7K/9XN1KR.itCUOV3BvYV12SyP2FT1jPAxIu4Je5smNXYe',12345,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24  0:52:12

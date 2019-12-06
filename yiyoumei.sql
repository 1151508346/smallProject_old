/*
SQLyog Ultimate v8.32 
MySQL - 5.5.60 : Database - yiyoumei
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`yiyoumei` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `yiyoumei`;

/*Table structure for table `user_address` */

DROP TABLE IF EXISTS `user_address`;

CREATE TABLE `user_address` (
  `username` varchar(20) NOT NULL COMMENT '用户名',
  `userphone` varchar(11) NOT NULL COMMENT '手机号',
  `areapath` varchar(255) NOT NULL COMMENT '区域路径',
  `useraddress` varchar(255) NOT NULL COMMENT '详细地址',
  `isdefault` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否默认地址',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  KEY `username` (`username`),
  CONSTRAINT `FK_user_address` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_address` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varbinary(32) DEFAULT NULL,
  `avatar` varchar(20) DEFAULT 'default',
  `email` varchar(20) DEFAULT NULL,
  `telphone` varchar(11) DEFAULT NULL,
  `sex` enum('男','女') DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`userid`,`username`,`password`,`avatar`,`email`,`telphone`,`sex`,`address`) values (18,'aa123456','fa8549d6a6ed212fc277f65c6d8cc403','default','11515083@qq.com',NULL,NULL,NULL),(19,'a123456789','46b94547e01ea9ed21450ec3233e7136','default','a123456@qq.com',NULL,NULL,NULL),(20,'aaaa','bbbb','default',NULL,NULL,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

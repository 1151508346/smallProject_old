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

/*Table structure for table `buycar` */

DROP TABLE IF EXISTS `buycar`;

CREATE TABLE `buycar` (
  `userid` int(11) DEFAULT NULL,
  `goodsid` varchar(10) DEFAULT NULL,
  `buycount` int(11) DEFAULT NULL,
  `buysize` float DEFAULT NULL,
  KEY `FK_buycar_useid` (`userid`),
  KEY `FK_buycar_goodsid` (`goodsid`),
  CONSTRAINT `FK_buycar_goodsid` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`),
  CONSTRAINT `FK_buycar_useid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `buycar` */

insert  into `buycar`(`userid`,`goodsid`,`buycount`,`buysize`) values (19,'B00001',1,170),(19,'B00001',1,180),(19,'B00001',1,175),(19,'B00004',1,170);

/*Table structure for table `collecgoods` */

DROP TABLE IF EXISTS `collecgoods`;

CREATE TABLE `collecgoods` (
  `goodsid` varchar(10) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  KEY `goodsid` (`goodsid`),
  KEY `userid` (`userid`),
  CONSTRAINT `collecgoods_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`),
  CONSTRAINT `collecgoods_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `collecgoods` */

insert  into `collecgoods`(`goodsid`,`userid`) values ('B00003',19),('B00004',19),('B00001',19);

/*Table structure for table `goods` */

DROP TABLE IF EXISTS `goods`;

CREATE TABLE `goods` (
  `typeid` varchar(10) DEFAULT NULL,
  `goodsid` varchar(10) NOT NULL,
  `goodsname` varchar(100) DEFAULT NULL,
  `goodscount` int(11) DEFAULT NULL,
  `goodsprice` float DEFAULT NULL,
  `category` varchar(10) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  PRIMARY KEY (`goodsid`),
  KEY `goods_ibfk_1` (`typeid`),
  CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`typeid`) REFERENCES `goodstype` (`typeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `goods` */

insert  into `goods`(`typeid`,`goodsid`,`goodsname`,`goodscount`,`goodsprice`,`category`,`createtime`) values ('BOY','B00001','春秋休闲夹克男装青年韩版外衣加厚2019新款连帽修身机能外套潮流',100,128,'Jacket','2019-12-13 19:43:52'),('BOY','B00002','花花公子男士外套秋季上衣韩版潮流工装休闲夹克男装加大码春秋装',100,158,'Jacket','2020-01-09 19:43:56'),('BOY','B00003','路伊梵新款男外套春秋季男装韩版潮牌潮流百搭帅气宽松夹克上衣服',100,118,'Jacket','2019-12-21 19:47:07'),('BOY','B00004','秋装外套男韩版潮流宽松2019新款休闲百搭棒球服加绒加厚连帽夹克',100,108,'Jacket','2019-12-28 19:44:10'),('BOY','B00005','花花公子外套男士潮流韩版春秋潮牌秋冬加绒工装休闲夹克男装秋装',100,169,'Jacket','2019-12-05 19:44:14'),('BOY','B10001','花花公子加绒加厚中年男衬衫长袖纯棉宽松中老年保暖衬衣爸爸冬装',100,69,'shirt','2019-12-17 19:45:19'),('BOY','B10002','男装新品爆款啄木鸟衬衫修身免烫休闲中华立领男式长袖衬衣',100,98,'shirt','2019-12-09 19:49:43'),('BOY','B10003','商务法式袖扣衬衫男长袖商务职业工装白衬衣男西装寸衫打底衫斜纹',100,59,'shirt','2019-12-20 19:49:49'),('BOY','B10004','工装衬衫男商务套装销售工作服男女同款长袖正装衬衣定制刺绣LOGO',100,78,'shirt','2019-12-25 19:49:53'),('BOY','B10005','衬衫男长袖2019秋季新款潮流上衣服韩版时尚工装外套学生帅气衬衣',100,69,'shirt','2019-12-23 19:49:57'),('BOY','B20001','运动裤男冬季训练加绒宽松速干休闲长裤女秋冬款足球跑步健身裤子',100,38.9,'pants','2019-12-10 19:55:29'),('BOY','B20002','新款休闲裤男士棉弹力运动修身长裤九分裤束脚裤子韩版潮流哈伦裤',100,78,'pants','2019-12-19 19:55:33'),('BOY','B20003','2019秋冬新款牛仔裤男潮牌韩版潮流修身小脚黑色时尚休闲长裤百搭',100,146,'pants','2019-12-21 19:55:36'),('BOY','B20004','秋装休闲裤男士宽松收口学生运动男裤子韩版潮流冬季九分裤男加绒',100,79,'pants','2019-12-27 19:55:38'),('BOY','B20005','花花公子男裤长裤休闲牛仔裤男士韩版加绒黑色潮牌修身小脚裤子男',100,129,'pants','2019-12-21 19:55:41'),('CHILDREN','C00001','童装/男童/女童 仿羊羔绒运动长裤 421494 优衣库',100,99,'pants','2019-12-07 19:21:24'),('CHILDREN','C00002','童装小中大童加绒加厚冬款春秋款2019新款迷彩战狼长裤',100,19.9,'pants','2019-12-10 19:19:05'),('CHILDREN','C00003','女童裤子2019新款洋气韩版儿童工装裤休闲秋冬外穿中大童加绒运动',100,59.5,'pants','2019-12-13 19:19:15'),('CHILDREN','C00004','儿童工装裤潮牌韩版男童加绒裤子棉裤外穿一体绒秋冬加厚款中大童',100,49,'pants','2019-12-04 19:09:12'),('CHILDREN','C00005','十岁女童裤子秋冬外穿宽松中大童灯芯绒条绒加绒工装裤女孩束口裤',100,69,'pants','2019-12-02 19:19:22'),('CHILDREN','C10001','巴拉巴拉儿童羽绒服女童宝宝冬2019新款羽绒外套',100,650,'Jacket','2019-12-19 19:33:11'),('CHILDREN','C10002','女童加绒外套2019新款洋气儿童装12-15岁秋冬装拼色加厚保暖风衣',100,198,'Jacket','2019-12-07 19:24:16'),('CHILDREN','C10003','校服小学生冲锋衣加绒三件套秋冬装幼儿园园服儿童运动班服单上衣',100,75,'Jacket','2019-12-01 19:24:20'),('CHILDREN','C10004','童大衣2019新款洋气儿童外套秋冬装中大童加厚保暖毛呢子上衣潮',100,295,'Jacket','2019-12-28 19:24:24'),('CHILDREN','C10005','小童装冬装女童毛毛衣外套加绒加厚女宝宝冬季上衣可爱卡通衣服潮',100,65,'Jacket','2020-01-01 19:24:53'),('CHILDREN','C20001','女童毛衣连衣裙2019新款秋冬加绒毛衣裙儿童针织公主裙长袖裙子冬',100,58.5,'dress','2020-01-03 19:26:42'),('CHILDREN','C20002','香港靓妞女童连衣裙秋冬装2019新款洋气宝宝儿童针织长袖公主裙子',100,85.36,'dress','2020-01-04 19:26:49'),('CHILDREN','C20003','童装韩版2019春秋季女童连衣裙中大童长袖蕾丝波点+网纱两件套装',100,78,'dress','2020-01-05 19:29:34'),('CHILDREN','C20004','女童连衣裙秋冬装2019新款中大童中国风大红色网纱裙公主裙加绒裙',100,95,'dress','2020-01-06 19:29:41'),('CHILDREN','C20005','2019夏装新款女童拖尾连衣裙礼服婚纱裙儿童生日公主裙钢琴演出服',100,78,'dress','2020-01-07 19:29:48');

/*Table structure for table `goodsdetail` */

DROP TABLE IF EXISTS `goodsdetail`;

CREATE TABLE `goodsdetail` (
  `goodsid` varchar(10) DEFAULT NULL,
  `size` float DEFAULT NULL,
  `goodssizenum` int(3) DEFAULT NULL,
  KEY `goodsid` (`goodsid`),
  CONSTRAINT `goodsdetail_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `goodsdetail` */

insert  into `goodsdetail`(`goodsid`,`size`,`goodssizenum`) values ('B00001',175,30),('B00001',180,40),('B00001',170,30),('B00002',170,30),('B00002',180,40),('B00002',175,30),('B00003',170,30),('B00003',175,30),('B00003',180,40),('B00004',175,30),('B00004',170,30),('B00004',180,30),('B00005',180,40),('B00005',170,40),('B00005',175,40),('B10001',175,30),('B10001',170,30),('B10001',180,30),('B10001',180,40),('B10002',180,40),('B10002',175,40),('B10002',175,30),('B10002',170,30),('B10003',170,30),('B10003',175,30),('B10003',180,40),('B10004',170,30),('B10004',175,30),('B10004',180,40),('B10005',180,40),('B10005',175,30),('B10005',170,30),('B20001',170,30),('B20001',175,30),('B20001',180,40),('B20002',170,30),('B20002',175,30),('B20002',180,40),('B20003',170,30),('B20003',175,30),('B20003',180,40),('B20004',170,30),('B20004',175,30),('B20004',180,40),('B20005',170,30),('B20005',175,30),('B20005',180,40),('C00001',170,30),('C00001',175,30),('C00001',180,40),('C00002',170,30),('C00002',175,30),('C00002',180,40),('C00003',170,30),('C00003',175,30),('C00003',180,40),('C00004',170,30),('C00004',175,30),('C00004',180,40),('C00005',170,30),('C00005',175,30),('C00005',180,40),('C10001',170,30),('C10001',175,30),('C10001',180,40),('C10002',170,30),('C10002',175,30),('C10002',180,40),('C10003',170,30),('C10003',175,30),('C10003',180,40),('C10004',170,30),('C10004',175,30),('C10004',180,40),('C10005',170,30),('C10005',175,30),('C10005',180,40),('C20001',170,30),('C20001',175,30),('C20001',180,40),('C20002',170,30),('C20002',175,30),('C20002',180,40),('C20003',170,30),('C20003',175,30),('C20003',180,40),('C20004',170,30),('C20004',175,30),('C20004',180,40),('C20005',170,30),('C20005',175,30),('C20005',180,40),('C20001',170,30),('C20001',175,30),('C20001',180,40),('C20002',170,30),('C20002',175,30),('C20002',180,40),('C20003',170,30),('C20003',175,30),('C20003',180,40),('C20004',170,30),('C20004',175,30),('C20004',180,40),('C20005',170,30),('C20005',175,30),('C20005',180,40);

/*Table structure for table `goodstype` */

DROP TABLE IF EXISTS `goodstype`;

CREATE TABLE `goodstype` (
  `typeid` varchar(10) NOT NULL,
  `typename` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`typeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `goodstype` */

insert  into `goodstype`(`typeid`,`typename`) values ('BOY','男装'),('CHILDREN','童装'),('GIRL','女装'),('START','明星大牌'),('SUIT','精品套装');

/*Table structure for table `order` */

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `orderid` int(10) unsigned DEFAULT NULL COMMENT '单号',
  `goodsid` varchar(10) DEFAULT NULL COMMENT '商品ID',
  `username` varchar(20) DEFAULT NULL COMMENT '用户',
  `purchasetime` datetime DEFAULT NULL COMMENT '购买时间',
  `goodsstatus` int(11) DEFAULT NULL COMMENT '货物状态',
  KEY `orderid` (`orderid`),
  KEY `goodsid` (`goodsid`),
  KEY `username` (`username`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `order` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
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

/*Data for the table `user` */

insert  into `user`(`userid`,`username`,`password`,`avatar`,`email`,`telphone`,`sex`,`address`) values (18,'aa123456','fa8549d6a6ed212fc277f65c6d8cc403','default','11515083@qq.com',NULL,NULL,NULL),(19,'a123456789','46b94547e01ea9ed21450ec3233e7136','default','a123456@qq.com',NULL,NULL,NULL),(20,'aaaa','bbbb','default',NULL,NULL,NULL,NULL);

/*Table structure for table `user_address` */

DROP TABLE IF EXISTS `user_address`;

CREATE TABLE `user_address` (
  `username` varchar(20) NOT NULL COMMENT '用户名',
  `receiver` varchar(20) DEFAULT NULL COMMENT '收货人',
  `receivephone` varchar(11) NOT NULL COMMENT '手机号',
  `areapath` varchar(255) NOT NULL COMMENT '区域路径',
  `detailaddress` varchar(255) NOT NULL COMMENT '详细地址',
  `isdefault` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否默认地址',
  `zipcode` char(6) DEFAULT NULL COMMENT '邮编',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  KEY `username` (`username`),
  CONSTRAINT `FK_user_address` FOREIGN KEY (`username`) REFERENCES `user` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_address` */

insert  into `user_address`(`username`,`receiver`,`receivephone`,`areapath`,`detailaddress`,`isdefault`,`zipcode`,`createtime`) values ('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:18:08'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:18:55'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:19:14'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:19:18'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:19:18'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:19:18'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:19:25'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:19:26'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:21:12'),('aa123456','dsafdsafasd','12345678998','陕西省,咸阳市,礼泉县','123564',0,'123456','2019-12-09 19:21:36'),('aa123456','sadfsdaf','12345678998','陕西省,咸阳市,礼泉县','asdfasdf',0,'123456','2019-12-09 19:22:05'),('aa123456','asd123','12345698765','陕西省,咸阳市,礼泉县','asd654',0,'123654','2019-12-09 19:38:49'),('aa123456','aaaaaaaaaaaa','12345678912','陕西省,咸阳市,礼泉县','asdasdas',0,'123456','2019-12-09 19:40:38'),('aa123456','aaaaaaaaaaaa','12345678912','陕西省,咸阳市,礼泉县','asdasdas',0,'123456','2019-12-09 19:41:55'),('aa123456','asdasd','12345678921','陕西省,咸阳市,礼泉县','asdasd132',0,'123456','2019-12-09 19:45:30');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

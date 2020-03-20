/*
SQLyog Ultimate v10.51 
MySQL - 5.5.60 : Database - yiyoumei2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`yiyoumei2` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `yiyoumei2`;

/*Table structure for table `auditlog` */

DROP TABLE IF EXISTS `auditlog`;

CREATE TABLE `auditlog` (
  `auditid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `operateway` varchar(30) DEFAULT NULL,
  `operatetime` datetime DEFAULT NULL,
  KEY `auditid` (`auditid`),
  KEY `userid` (`userid`),
  CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `auditlog` */

insert  into `auditlog`(`auditid`,`userid`,`operateway`,`operatetime`) values (2,19,'登录成功','2020-03-20 14:40:11'),(3,19,'取消支付','2020-03-20 14:55:37'),(4,19,'取消支付','2020-03-20 14:56:16'),(5,19,'商品ID:C00004,尺寸:175 加入购物车','2020-03-20 14:57:19'),(6,19,'原价支付成功','2020-03-20 14:57:26');

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

insert  into `buycar`(`userid`,`goodsid`,`buycount`,`buysize`) values (19,'C00004',1,175);

/*Table structure for table `collecgoods` */

DROP TABLE IF EXISTS `collecgoods`;

CREATE TABLE `collecgoods` (
  `goodsid` varchar(10) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  KEY `goodsid` (`goodsid`),
  KEY `userid` (`userid`),
  CONSTRAINT `collecgoods_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `collecgoods_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `collecgoods` */

insert  into `collecgoods`(`goodsid`,`userid`) values ('B00003',19),('B00004',19),('B00001',19),('C00005',19),('G20001',19),('B00002',19),('B10005',19);

/*Table structure for table `coupon` */

DROP TABLE IF EXISTS `coupon`;

CREATE TABLE `coupon` (
  `couponid` int(11) NOT NULL AUTO_INCREMENT COMMENT '优惠券ID',
  `userid` int(11) DEFAULT NULL COMMENT '用户ID',
  `goodsid` varchar(10) DEFAULT NULL COMMENT '商品ID',
  `couponprice` float DEFAULT NULL COMMENT '优惠价格',
  `couponstatus` int(1) DEFAULT NULL COMMENT '优惠券状态',
  `starttime` datetime DEFAULT NULL COMMENT '开始时间',
  `endtime` datetime DEFAULT NULL COMMENT '结束时间',
  PRIMARY KEY (`couponid`),
  KEY `userid` (`userid`),
  KEY `goodsid` (`goodsid`),
  CONSTRAINT `coupon_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `coupon_ibfk_2` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

/*Data for the table `coupon` */

insert  into `coupon`(`couponid`,`userid`,`goodsid`,`couponprice`,`couponstatus`,`starttime`,`endtime`) values (1,19,'B00001',20,1,'2020-01-06 01:13:32','2020-01-16 01:13:36'),(8,19,'B00002',20,1,'2020-01-06 17:13:39','2020-01-16 17:13:43'),(9,19,'B00003',16,1,'2020-01-13 17:13:47','2020-01-14 17:13:50'),(10,19,'B00004',28,1,'2020-01-06 17:13:53','2020-01-29 17:13:56'),(11,19,'B10005',30,0,'2020-03-18 16:00:00','2020-03-20 08:45:55'),(12,19,'B00005',30,0,'2020-03-18 16:00:00','2020-03-20 16:00:00'),(13,19,'B10003',30,0,'2020-03-18 16:00:00','2020-03-20 16:00:00');

/*Table structure for table `evaluatedetail` */

DROP TABLE IF EXISTS `evaluatedetail`;

CREATE TABLE `evaluatedetail` (
  `evaluateid` int(11) NOT NULL AUTO_INCREMENT COMMENT '评价id',
  `userid` int(11) DEFAULT NULL COMMENT '用户id',
  `goodsid` varchar(10) DEFAULT NULL COMMENT '商品id',
  `evaluatecontent` varchar(100) DEFAULT NULL COMMENT '评价内容',
  `grade` int(1) DEFAULT NULL COMMENT '评价等级',
  PRIMARY KEY (`evaluateid`),
  KEY `userid` (`userid`),
  KEY `goodsid` (`goodsid`),
  CONSTRAINT `evaluatedetail_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `evaluatedetail_ibfk_2` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `evaluatedetail` */

insert  into `evaluatedetail`(`evaluateid`,`userid`,`goodsid`,`evaluatecontent`,`grade`) values (2,19,'B00003','这个东西很棒棒哒',4),(3,19,'B00002','这个东西很棒棒哒',4),(5,19,'B00002','aaaa',5),(6,19,'B00003','aaaa',5),(7,19,'B00003','aaaaa',5),(8,19,'C00004','这个商品特别好 ，便宜....',5);

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
  CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`typeid`) REFERENCES `goodstype` (`typeid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `goods` */

insert  into `goods`(`typeid`,`goodsid`,`goodsname`,`goodscount`,`goodsprice`,`category`,`createtime`) values ('BOY','B00001','春秋休闲夹克男装青年韩版外衣加厚2019新款连帽修身机能外套潮流',82,128,'Jacket','2019-12-13 19:43:52'),('BOY','B00002','花花公子男士外套秋季上衣韩版潮流工装休闲夹克男装加大码春秋装',90,158,'Jacket','2020-01-09 19:43:56'),('BOY','B00003','路伊梵新款男外套春秋季男装韩版潮牌潮流百搭帅气宽松夹克上衣服',83,118,'Jacket','2019-12-21 11:49:57'),('BOY','B00004','秋装外套男韩版潮流宽松2019新款休闲百搭棒球服加绒加厚连帽夹克',79,108,'Jacket','2019-12-28 19:44:10'),('BOY','B00005','花花公子外套男士潮流韩版春秋潮牌秋冬加绒工装休闲夹克男装秋装',97,169,'Jacket','2019-12-05 19:44:14'),('BOY','B10001','花花公子加绒加厚中年男衬衫长袖纯棉宽松中老年保暖衬衣爸爸冬装',98,69,'shirt','2019-12-17 19:45:19'),('BOY','B10002','男装新品爆款啄木鸟衬衫修身免烫休闲中华立领男式长袖衬衣',100,98,'shirt','2019-12-09 19:49:43'),('BOY','B10003','商务法式袖扣衬衫男长袖商务职业工装白衬衣男西装寸衫打底衫斜纹',100,59,'shirt','2019-12-20 19:49:49'),('BOY','B10004','工装衬衫男商务套装销售工作服男女同款长袖正装衬衣定制刺绣LOGO',100,78,'shirt','2019-12-25 19:49:53'),('BOY','B10005','衬衫男长袖2019秋季新款潮流上衣服韩版时尚工装外套学生帅气衬衣',97,69,'shirt','2019-12-21 19:49:57'),('BOY','B20001','运动裤男冬季训练加绒宽松速干休闲长裤女秋冬款足球跑步健身裤子',100,38.9,'pants','2019-12-10 19:55:29'),('BOY','B20002','新款休闲裤男士棉弹力运动修身长裤九分裤束脚裤子韩版潮流哈伦裤',100,78,'pants','2019-12-19 19:55:33'),('BOY','B20003','2019秋冬新款牛仔裤男潮牌韩版潮流修身小脚黑色时尚休闲长裤百搭',100,146,'pants','2019-12-21 19:55:36'),('BOY','B20004','秋装休闲裤男士宽松收口学生运动男裤子韩版潮流冬季九分裤男加绒',99,79,'pants','2019-12-27 19:55:38'),('BOY','B20005','花花公子男裤长裤休闲牛仔裤男士韩版加绒黑色潮牌修身小脚裤子男',100,129,'pants','2019-12-21 19:55:41'),('CHILDREN','C00001','童装/男童/女童 仿羊羔绒运动长裤 421494 优衣库',100,99,'pants','2019-12-07 19:21:24'),('CHILDREN','C00002','童装小中大童加绒加厚冬款春秋款2019新款迷彩战狼长裤',100,19.9,'pants','2019-12-10 19:19:05'),('CHILDREN','C00003','女童裤子2019新款洋气韩版儿童工装裤休闲秋冬外穿中大童加绒运动',100,59.5,'pants','2019-12-13 19:19:15'),('CHILDREN','C00004','儿童工装裤潮牌韩版男童加绒裤子棉裤外穿一体绒秋冬加厚款中大童',99,49,'pants','2019-12-04 19:09:12'),('CHILDREN','C00005','十岁女童裤子秋冬外穿宽松中大童灯芯绒条绒加绒工装裤女孩束口裤',100,69,'pants','2019-12-02 19:19:22'),('CHILDREN','C10001','巴拉巴拉儿童羽绒服女童宝宝冬2019新款羽绒外套',100,650,'Jacket','2019-12-19 19:33:11'),('CHILDREN','C10002','女童加绒外套2019新款洋气儿童装12-15岁秋冬装拼色加厚保暖风衣',100,198,'Jacket','2019-12-07 19:24:16'),('CHILDREN','C10003','校服小学生冲锋衣加绒三件套秋冬装幼儿园园服儿童运动班服单上衣',100,75,'Jacket','2019-12-01 19:24:20'),('CHILDREN','C10004','童大衣2019新款洋气儿童外套秋冬装中大童加厚保暖毛呢子上衣潮',100,295,'Jacket','2019-12-28 19:24:24'),('CHILDREN','C10005','小童装冬装女童毛毛衣外套加绒加厚女宝宝冬季上衣可爱卡通衣服潮',100,65,'Jacket','2020-01-01 19:24:53'),('CHILDREN','C20001','女童毛衣连衣裙2019新款秋冬加绒毛衣裙儿童针织公主裙长袖裙子冬',100,58.5,'dress','2020-01-03 19:26:42'),('CHILDREN','C20002','香港靓妞女童连衣裙秋冬装2019新款洋气宝宝儿童针织长袖公主裙子',100,85.36,'dress','2020-01-04 19:26:49'),('CHILDREN','C20003','童装韩版2019春秋季女童连衣裙中大童长袖蕾丝波点+网纱两件套装',100,78,'dress','2020-01-05 19:29:34'),('CHILDREN','C20004','女童连衣裙秋冬装2019新款中大童中国风大红色网纱裙公主裙加绒裙',100,95,'dress','2020-01-06 19:29:41'),('CHILDREN','C20005','2019夏装新款女童拖尾连衣裙礼服婚纱裙儿童生日公主裙钢琴演出服',100,78,'dress','2020-01-07 19:29:48'),('GIRL','G00002','2019新款女装秋冬千鸟格中长款毛呢外套女黑色拼接西装领呢子大衣',100,248,'Jacket','2020-01-07 19:29:48'),('GIRL','G00003','^@^MissYIYI 高档小香风系列!时髦格纹双面尼外套19秋冬新品28981',100,418,'Jacket','2020-01-07 19:29:48'),('GIRL','G00004','特大码女装240斤230胖人mm棉衣冬装外套220胖妹妹棉服宽松棉袄200',100,169,'Jacket','2020-01-07 19:29:48'),('GIRL','G00005','2019春装新款韩版仿水貂绒毛衣女外套宽松中长款针织开衫大衣春秋',100,168,'Jacket','2020-01-07 19:29:48'),('GIRL','G10001','2019秋冬季新款大码女装胖妹妹时尚洋气显瘦针织A字半身短裙子潮',100,69.9,'dress','2019-12-10 19:19:05'),('GIRL','G10002','伊莎贝尔伴娘礼服2019新款秋季中长款裙日常可穿仙气质姐妹装冬女',100,50,'dress','2019-12-28 19:24:24'),('GIRL','G10003','针织衫套裙秋冬装气质女很仙淑女名媛小香风仿貂绒毛衣裙子两件套',100,110,'dress','2020-01-05 19:29:34'),('GIRL','G10004','秋装2019年新款季复古裙大码女装胖妹妹修身显瘦短袖雪纺连衣裙子',100,62,'dress','2019-12-28 19:24:24'),('GIRL','G10005','连衣裙女秋冬新款中长款宽松韩版无袖包臀打底裙背心吊带裙莫代尔',100,39,'dress','2019-12-28 19:24:24'),('GIRL','G20001','皮裤女加绒加厚冬外穿高腰显瘦亚光2019新款秋冬款黑色打底裤小脚',100,68,'pants','2019-12-28 19:24:24'),('GIRL','G20002','2019秋装新款大码宽松牛仔裤女胖MM高腰老爹裤胖妹220斤显瘦学生',100,99,'pants','2020-01-05 19:29:34'),('GIRL','G20003','设计感不对称斜门襟休闲高品质九分西裤港风职场女',100,198,'pants','2019-12-28 19:24:24'),('GIRL','G20004','秋冬大码女装胖妹妹加绒加厚加肥加大宽松显瘦松紧腰金丝绒阔腿裤',100,79,'pants','2019-12-10 19:19:05'),('GIRL','G20005','2019秋季新款女裤运动休闲裤子学生宽松束脚纯棉白色加绒冬季卫裤',100,65,'pants','2019-12-10 19:19:05'),('GIRL','G30001','孕妇装秋冬款上衣时尚2019新款羊羔毛卫衣裙加绒加厚辣妈连衣裙',100,65,'gravida','2020-01-05 19:29:34'),('GIRL','G30002','孕妇装孕妇毛衣2019年冬款加肥加厚宽松版孕妇上衣 时尚毛衣',100,138,'gravida','2019-12-10 19:19:05'),('GIRL','G30003','Angel妈咪~哺乳孕妇秋冬装时尚高领印花加绒加厚哺乳裙宽松孕妇裙',100,59,'gravida','2019-12-10 19:19:05'),('GIRL','G30004','孕妇装秋款套装冬装时尚款外出网红2019秋冬季新款加绒加厚两件套',100,49,'gravida','2019-12-10 19:19:05'),('GIRL','G30005','孕妇装秋款套装冬装加绒上衣内搭打底衫时尚款连衣裙卫衣秋冬款女',100,76,'gravida','2019-12-01 19:24:20'),('SUIT','J00001','白色西装女套装2019秋冬新款休闲时尚气质韩版职业装女士西服正装',100,148,'suit','2019-12-01 19:24:20'),('SUIT','J00002','雪纺衬衫女长袖2019秋装新款名媛白衬衣打底衫职业装商务工装上衣',100,79,'suit','2019-12-01 19:24:20'),('SUIT','J00003','卫衣套装秋冬韩版2019新款气质时尚加厚加绒女士休闲运动两件套潮',100,228,'suit','2019-12-01 19:24:20'),('SUIT','J00004','金丝绒套装女2019秋冬新款时尚休闲运动服加绒加厚卫衣冬季两件套',100,228,'suit','2019-12-01 19:24:20'),('START','S00001','2019秋冬新款鞠婧祎明星同款ins超火百搭连帽卫衣纯色长袖上衣女',100,68,'start','2019-12-01 19:24:20'),('START','S00002','杨幂同款连帽卫衣女2019秋冬新款韩版学生百搭宽松显瘦加绒上衣潮',100,356,'start','2019-12-28 19:24:24'),('START','S00003','2019夏新款anglebaby杨颖明星同款连衣裙中长款高端名媛时尚礼服',100,229,'start','2019-12-28 19:24:24'),('START','S00004','2019夏季韩版赵丽颖同款一字领刺绣露肩收腰蕾丝超仙连衣裙仙女裙',100,138,'start','2020-01-05 19:29:34');

/*Table structure for table `goodsdetail` */

DROP TABLE IF EXISTS `goodsdetail`;

CREATE TABLE `goodsdetail` (
  `goodsid` varchar(10) DEFAULT NULL,
  `size` float DEFAULT NULL,
  `goodssizenum` int(3) DEFAULT NULL,
  KEY `goodsid` (`goodsid`),
  CONSTRAINT `goodsdetail_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `goodsdetail` */

insert  into `goodsdetail`(`goodsid`,`size`,`goodssizenum`) values ('B00001',175,16),('B00001',180,38),('B00001',170,28),('B00002',170,23),('B00002',180,40),('B00002',175,30),('B00003',170,30),('B00003',175,24),('B00003',180,28),('B00004',175,28),('B00004',170,21),('B00004',180,20),('B00005',180,40),('B00005',170,27),('B00005',175,30),('B10001',175,30),('B10001',170,28),('B10001',180,40),('B10002',180,40),('B10002',175,30),('B10002',175,30),('B10002',170,30),('B10003',170,30),('B10003',175,30),('B10003',180,40),('B10005',180,39),('B10005',175,30),('B10005',170,28),('B20001',170,30),('B20001',175,30),('B20001',180,40),('B20002',170,30),('B20002',175,30),('B20002',180,40),('B20003',170,30),('B20003',175,30),('B20003',180,40),('B20004',170,30),('B20004',175,30),('B20004',180,39),('B20005',170,30),('B20005',175,30),('B20005',180,40),('C00001',170,30),('C00001',175,30),('C00001',180,40),('C00002',170,30),('C00002',175,30),('C00002',180,40),('C00003',170,30),('C00003',175,30),('C00003',180,40),('C00004',170,30),('C00004',175,29),('C00004',180,40),('C00005',170,30),('C00005',175,30),('C00005',180,40),('C10001',170,30),('C10001',175,30),('C10001',180,40),('C10002',170,30),('C10002',175,30),('C10002',180,40),('C10003',170,30),('C10003',175,30),('C10003',180,40),('C10004',170,30),('C10004',175,30),('C10004',180,40),('C10005',170,30),('C10005',175,30),('C10005',180,40),('C20001',170,30),('C20001',175,30),('C20001',180,40),('C20002',170,30),('C20002',175,30),('C20002',180,40),('C20003',170,30),('C20003',175,30),('C20003',180,40),('C20004',170,30),('C20004',175,30),('C20004',180,40),('C20005',170,30),('C20005',175,30),('C20005',180,40),('C20001',170,30),('C20001',175,30),('C20001',180,40),('C20002',170,30),('C20002',175,30),('C20002',180,40),('C20003',170,30),('C20003',175,30),('C20003',180,40),('C20004',170,30),('C20004',175,30),('C20004',180,40),('C20005',170,30),('C20005',175,30),('C20005',180,40),('G00002',170,30),('G00002',175,30),('G00002',180,40),('G00003',170,30),('G00003',175,30),('G00003',180,40),('G00004',170,30),('G00004',175,30),('G00004',180,40),('G00005',170,30),('G00005',175,30),('G00005',180,40),('G10001',170,30),('G10001',175,30),('G10001',180,40),('G10002',170,30),('G10002',175,30),('G10002',180,40),('G10003',170,30),('G10003',175,30),('G10003',180,40),('G10004',170,30),('G10004',175,30),('G10004',180,40),('G10005',170,30),('G10005',175,30),('G10005',180,40),('G20001',170,30),('G20001',175,30),('G20001',180,40),('G20002',170,30),('G20002',175,30),('G20002',180,40),('G20003',170,30),('G20003',175,30),('G20003',180,40),('G20004',170,30),('G20004',175,30),('G20004',180,40),('G20005',170,30),('G20005',175,30),('G20005',180,40),('G30001',170,30),('G30001',175,30),('G30001',180,40),('G30002',170,30),('G30002',175,30),('G30002',180,40),('G30003',170,30),('G30003',175,30),('G30003',180,40),('G30004',170,30),('G30004',175,30),('G30004',180,40),('G30005',170,30),('G30005',175,30),('G30005',180,40),('J00001',170,30),('J00001',175,30),('J00001',180,40),('J00002',170,30),('J00002',175,30),('J00002',180,40),('J00003',170,30),('J00003',175,30),('J00003',180,40),('J00004',170,30),('J00004',175,30),('J00004',180,40),('S00001',170,30),('S00001',175,30),('S00001',180,40),('S00002',170,30),('S00002',175,30),('S00002',180,40),('S00003',170,30),('S00003',175,30),('S00003',180,40),('S00004',170,30),('S00004',175,30),('S00004',180,40);

/*Table structure for table `goodstype` */

DROP TABLE IF EXISTS `goodstype`;

CREATE TABLE `goodstype` (
  `typeid` varchar(10) NOT NULL,
  `typename` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`typeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `goodstype` */

insert  into `goodstype`(`typeid`,`typename`) values ('BOY','男装'),('CHILDREN','童装'),('GIRL','女装'),('START','明星大牌'),('SUIT','精品套装');

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `orderid` int(11) NOT NULL AUTO_INCREMENT COMMENT '单号',
  `goodsid` varchar(10) DEFAULT NULL COMMENT '商品ID',
  `userid` int(11) DEFAULT NULL COMMENT '用户',
  `purchasetime` datetime DEFAULT NULL COMMENT '购买时间',
  `count` int(3) DEFAULT NULL COMMENT '购买数量',
  `size` float DEFAULT NULL COMMENT '购买尺寸',
  `goodsstatus` int(11) DEFAULT NULL COMMENT '货物状态',
  PRIMARY KEY (`orderid`),
  KEY `orderid` (`orderid`),
  KEY `goodsid` (`goodsid`),
  KEY `username` (`userid`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `orders` */

insert  into `orders`(`orderid`,`goodsid`,`userid`,`purchasetime`,`count`,`size`,`goodsstatus`) values (1,'C00004',19,'2020-03-19 22:57:24',1,175,3);

/*Table structure for table `signin` */

DROP TABLE IF EXISTS `signin`;

CREATE TABLE `signin` (
  `userid` int(11) DEFAULT NULL COMMENT '用户ID',
  `signindate` datetime DEFAULT NULL COMMENT '签到时期',
  `integral` int(11) DEFAULT NULL COMMENT '积分',
  `pattern` varchar(8) DEFAULT NULL COMMENT '获取积分方式',
  KEY `userid` (`userid`),
  CONSTRAINT `signin_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `signin` */

insert  into `signin`(`userid`,`signindate`,`integral`,`pattern`) values (19,'2020-01-16 18:35:07',5,'签到'),(19,'2020-01-17 16:20:17',5,'签到'),(19,'2020-01-18 19:17:34',5,'签到'),(19,'2020-01-19 20:03:02',5,'签到'),(19,'2020-01-23 14:40:19',5,'签到');

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
  `user_address` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`userid`,`username`,`password`,`avatar`,`email`,`telphone`,`sex`,`user_address`) values (19,'a123456789','604369c9a06248eac6bbf8ab69e8e602','default','1151508343@qq.com','13098027958','男','陕西省咸阳市 '),(44,'b123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','男','陕西省咸阳市礼泉县南坊镇东南村'),(45,'g123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','女','陕西省咸阳市礼泉县南坊镇东南村'),(46,'wangguohan','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','男','陕西省咸阳市礼泉县南坊镇东南村'),(47,'j123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','女','陕西省咸阳市礼泉县南坊镇东南村'),(48,'h123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','女','陕西省咸阳市礼泉县南坊镇东南村'),(49,'f123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','女','陕西省咸阳市礼泉县南坊镇东南村'),(50,'c123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','女','陕西省咸阳市礼泉县南坊镇东南村'),(51,'d123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','13026336655','女','陕西省咸阳市礼泉县南坊镇东南村'),(54,'d123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','123456789@q','女','陕西省咸阳市礼泉县南坊镇东南村'),(55,'d123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','123456789@q','男','陕西省咸阳市礼泉县南坊镇东南村'),(56,'d123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','123456789@q','女','陕西省咸阳市礼泉县南坊镇东南村'),(57,'d123456789','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','123456789@q','男','陕西省咸阳市礼泉县南坊镇东南村'),(58,'ddad','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','123456789@q','女','陕西省咸阳市礼泉县南坊镇东南村'),(59,'asdsadas','604369c9a06248eac6bbf8ab69e8e602','default','123456789@qq.com','123456789@q','女','陕西省咸阳市礼泉县南坊镇东南村'),(60,'aaa','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(62,'ddd','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(63,'eee','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(64,'fff','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(65,'ggg','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(66,'hhh','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(67,'iii','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(68,'jjj','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村'),(69,'ccc','604369c9a06248eac6bbf8ab69e8e602','default','132456789@qq.com','13098027959','男','陕西省咸阳市礼泉县南坊镇东南村');

/*Table structure for table `user_address` */

DROP TABLE IF EXISTS `user_address`;

CREATE TABLE `user_address` (
  `addressid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL COMMENT '用户ID',
  `receiver` varchar(20) DEFAULT NULL COMMENT '收货人',
  `receivephone` varchar(11) NOT NULL COMMENT '手机号',
  `areapath` varchar(255) NOT NULL COMMENT '区域路径',
  `detailaddress` varchar(255) NOT NULL COMMENT '详细地址',
  `isdefault` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否默认地址',
  `zipcode` char(6) DEFAULT NULL COMMENT '邮编',
  `createtime` datetime DEFAULT NULL COMMENT '创建时间',
  KEY `addressid` (`addressid`),
  KEY `userid` (`userid`),
  CONSTRAINT `user_address_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `user_address` */

insert  into `user_address`(`addressid`,`userid`,`receiver`,`receivephone`,`areapath`,`detailaddress`,`isdefault`,`zipcode`,`createtime`) values (11,19,'hanhan','12345678910','陕西省,咸阳市,礼泉县','陕西咸阳礼泉',0,'713209','2020-01-14 19:49:10'),(14,19,'hanhan6','12369857412','陕西省,咸阳市,礼泉县','陕西省，咸阳市 南坊镇东南村',1,'702322','2020-01-14 19:52:03');

/*Table structure for table `visited` */

DROP TABLE IF EXISTS `visited`;

CREATE TABLE `visited` (
  `goodsid` varchar(10) DEFAULT NULL COMMENT '商品ID',
  `userid` int(11) DEFAULT NULL COMMENT '用户ID',
  `visitedtime` datetime DEFAULT NULL COMMENT '浏览时间',
  KEY `goodsid` (`goodsid`),
  KEY `userid` (`userid`),
  CONSTRAINT `visited_ibfk_1` FOREIGN KEY (`goodsid`) REFERENCES `goods` (`goodsid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `visited_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `visited` */

insert  into `visited`(`goodsid`,`userid`,`visitedtime`) values ('B00003',19,'2020-01-23 15:17:18'),('B20004',19,'2020-02-21 17:31:50'),('B00001',19,'2020-03-20 14:40:29'),('B00001',19,'2020-03-20 14:41:55'),('B00001',19,'2020-03-20 14:42:19'),('C00004',19,'2020-03-20 14:44:31'),('B00001',19,'2020-03-20 14:54:55'),('B00001',19,'2020-03-20 14:55:06'),('B00001',19,'2020-03-20 14:55:19'),('C00004',19,'2020-03-20 14:57:11');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

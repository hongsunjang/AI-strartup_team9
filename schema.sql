CREATE TABLE `contents` (
  `diary_create` datetime NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `content` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`diary_create`)
);
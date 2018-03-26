CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` NVARCHAR(50) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `image` VARCHAR(2083) DEFAULT NULL,
  `sitter` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `appointments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sitter_id` INT NOT NULL,
  `owner_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `dogs` NVARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `appointments_sitter_id`
    FOREIGN KEY (`sitter_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `appointments_owner_id`
    FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sitter_id` INT NOT NULL,
  `owner_id` INT NOT NULL,
  `rating` TINYINT(1) NOT NULL,
  `comment` NVARCHAR(2000) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `reviews_sitter_id`
    FOREIGN KEY (`sitter_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `reviews_owner_id`
    FOREIGN KEY (`owner_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `rankings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sitter_id` INT NOT NULL,
  `score` FLOAT DEFAULT NULL,
  `rating` FLOAT DEFAULT NULL,
  `rank` FLOAT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sitter_id_UNIQUE` (`sitter_id`),
  CONSTRAINT `rankings_sitter_id`
    FOREIGN KEY (`sitter_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

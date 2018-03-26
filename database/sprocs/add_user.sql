DROP procedure IF EXISTS add_user;
DELIMITER $$
CREATE PROCEDURE add_user
(
  IN p_name NVARCHAR(50),
  IN p_email VARCHAR(254),
  IN p_phone VARCHAR(30),
  IN p_image VARCHAR(2083),
  IN p_sitter TINYINT(1),
  IN p_score FLOAT
)
BEGIN
  INSERT IGNORE INTO users
	(
    name,
		email,
    phone,
    image,
    sitter
	)
	VALUES
	(
    p_name,
		p_email,
		p_phone,
		p_image,
		p_sitter
	);

  IF p_sitter = 1 THEN
    INSERT IGNORE INTO rankings
	  (
      sitter_id,
		  score,
      rating,
      rank
	  )
	  VALUES
	  (
      (SELECT id FROM users WHERE email = p_email),
      p_score,
      0,
      0
    );
  END IF;
END$$

DELIMITER ;

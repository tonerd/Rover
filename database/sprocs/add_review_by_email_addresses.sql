DROP procedure IF EXISTS add_review_by_email_addresses;
DELIMITER $$
CREATE PROCEDURE add_review_by_email_addresses
(
  IN p_sitter_email VARCHAR(254),
  IN p_owner_email VARCHAR(254),
  IN p_rating TINYINT(1),
  IN p_comment NVARCHAR(2000)
)
BEGIN
	INSERT INTO reviews
	(
		sitter_id,
    owner_id,
		rating,
    comment
	)
	VALUES
	(
    (SELECT id FROM users WHERE email = p_sitter_email),
    (SELECT id FROM users WHERE email = p_owner_email),
    p_rating,
		p_comment
	);
END$$

DELIMITER ;

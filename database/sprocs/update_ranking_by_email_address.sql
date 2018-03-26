DROP procedure IF EXISTS update_ranking_by_email_address;
DELIMITER $$
CREATE PROCEDURE update_ranking_by_email_address
(
  IN p_email NVARCHAR(254)
)
BEGIN
  SET @USER_ID = (
    SELECT id
    FROM
      users
    WHERE
      email = p_email
  );

  IF @USER_ID IS NOT NULL THEN
    CALL update_ranking_by_sitter_id(@USER_ID);
  END IF;
END$$

DELIMITER ;

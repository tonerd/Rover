DROP procedure IF EXISTS add_appointment_by_email_addresses;
DELIMITER $$
CREATE PROCEDURE add_appointment_by_email_addresses
(
  IN p_sitter_email VARCHAR(254),
  IN p_owner_email VARCHAR(254),
  IN p_start_date DATE,
  IN p_end_date DATE,
  IN p_dogs NVARCHAR(150)
)
BEGIN
  IF p_start_date <= p_end_date THEN
	  INSERT INTO appointments
	  (
		  sitter_id,
      owner_id,
		  start_date,
		  end_date,
		  dogs
	  )
	  VALUES
	  (
      (SELECT id FROM users WHERE email = p_sitter_email),
      (SELECT id FROM users WHERE email = p_owner_email),
      p_start_date,
		  p_end_date,
		  p_dogs
	  );
  END IF;
END$$

DELIMITER ;

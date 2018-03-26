DROP procedure IF EXISTS get_sitters_by_page_and_rank;
DELIMITER $$
CREATE PROCEDURE get_sitters_by_page_and_rank
(
  IN p_start INT,
  IN p_size INT,
  IN p_rating FLOAT
)
BEGIN
	SELECT
    SQL_CALC_FOUND_ROWS
    users.name,
    users.image,
    rankings.rating
	FROM
    users
    INNER JOIN rankings
      ON users.id = rankings.sitter_id
  WHERE
    rankings.rating >= p_rating
	ORDER BY rankings.rank DESC
  LIMIT p_start, p_size;

  SELECT FOUND_ROWS() AS total;
END$$

DELIMITER ;

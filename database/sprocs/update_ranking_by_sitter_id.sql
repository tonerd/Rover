DROP procedure IF EXISTS update_ranking_by_sitter_id;
DELIMITER $$
CREATE PROCEDURE update_ranking_by_sitter_id
(
  IN p_user_id INT
)
BEGIN
  SET @REVIEW_COUNT = (
    SELECT COUNT(*)
    FROM
      reviews
    WHERE
      sitter_id = p_user_id
  );

  SET @RATING = (
    SELECT AVG(rating)
    FROM
      reviews
    WHERE
      sitter_id = p_user_id
  );

  SET @SCORE = (
    SELECT score
    FROM rankings
    WHERE sitter_id = p_user_id
  );

  UPDATE rankings
  SET
    rating = @RATING,
    rank =
      CASE WHEN @REVIEW_COUNT = 0 THEN
        @SCORE
      WHEN @REVIEW_COUNT < 10 THEN
        (@RATING - @SCORE) / 10 * @REVIEW_COUNT + @SCORE
      ELSE
        @RATING
      END
  WHERE sitter_id = p_user_id;

END$$

DELIMITER ;

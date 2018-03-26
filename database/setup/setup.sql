CREATE DATABASE `rover`;
CREATE DATABASE `rover_test`;

CREATE USER 'rover'@'localhost' IDENTIFIED BY 'password';
GRANT EXECUTE ON rover.* TO 'rover'@'localhost';

CREATE USER 'rover_test'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, DELETE, EXECUTE ON rover_test.* TO 'rover_test'@'localhost';

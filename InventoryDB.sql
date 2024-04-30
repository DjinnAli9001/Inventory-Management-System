###Dynamic Web Development Final Project Atif Ali

CREATE DATABASE inventory_fp;
USE inventory_fp;

### TABLE 1- Inventory
CREATE TABLE inventory(
	serialID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
	Type VARCHAR(255) NOT NULL,
    Brand VARCHAR(255) NOT NULL,
    Price DOUBLE NOT NULL
);
SELECT * FROM inventory;


### Table 2 - Supplier
CREATE TABLE supplier(
	serialID INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(50)
	
);
SELECT * FROM supplier;


### Table 3 - Location
CREATE TABLE location(
	serialID INT PRIMARY KEY AUTO_INCREMENT,
    location_type VARCHAR(50)
);
SELECT * FROM location;



#### TRIGGER for adding inputs into other tables

DELIMITER //

-- CREATE TRIGGER new_records
-- AFTER INSERT ON inventory
-- FOR EACH ROW 
-- BEGIN
-- IF NEW.serialID IS NOT NULL THEN
-- 	INSERT INTO location(serialID) VALUES (NEW.serialID);
--     INSERT INTO supplier(serialID) VALUES (NEW.serialID);
-- END IF;
-- END //

DELIMITER ;





SELECT * FROM inventory;
SELECT * FROM supplier;
SELECT * FROM location;
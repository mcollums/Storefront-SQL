DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(80) NOT NULL,
 dept_name VARCHAR(30) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
 stock_quantity INT NOT NULL,
 PRIMARY KEY (item_id)
);

-- Create new example rows
INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES("Rhubarb Candle", "Home Decor", 10, 100),
      ("Set of 5 Ostrich Feather Coasters", "Home Decor", 80, 100),
      ("Limited Edition Megamind Action Figure", "Toys", 55, 86),
      ("Knee-Length Socks (10)", "Clothing", 17.89, 150),
      ("\"Remake Season 8 of \'Game of Thrones'!\" Yard Sign", "Outdoors", 12.99, 300),
      ("How to Win Friends and Influence People (Carnegie)", "Books", 10.99, 100),
      ("Lavender Potpourri (Unscented)", "Home Decor", 5.23, 200),
      ("One Chinchilla", "Pets", 80, 200),
      ("Cage for said Chinchilla", "Pets", 30, 100),
      ("Mystery-Surprise Box", "Misc", 30, 10);

SELECT * FROM products;
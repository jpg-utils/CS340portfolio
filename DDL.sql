-- Group 8 Sean Bleyl & Joshua Griep

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS ProductLocation;
DROP TABLE IF EXISTS ProductsOrdered;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 0;
 
-- Create Customers table:
CREATE TABLE Customers (
customerID INT NOT NULL AUTO_INCREMENT,
firstName VARCHAR(25) NOT NULL,
lastName VARCHAR(25) NOT NULL,
phone VARCHAR(10) NOT NULL,
email VARCHAR(30) NOT NULL,
PRIMARY KEY (customerID)
);

-- Insert data into Customers:
INSERT INTO Customers  (firstName, lastName, phone, email)
VALUES('Leroy', 'Jenkins', '9495551234', 'leroyjenkins@gmail.com'),
('Luke', 'Skywalker', '5858775692', 'theforceiswithyou@yahoo.com'),
('Martha', 'Stewart', '3129855025', 'chefstewart@gmail.com');

-- Create Products table:
CREATE TABLE Products (
productID INT NOT NULL AUTO_INCREMENT,
productName VARCHAR(50) NOT NULL,
productType VARCHAR(15) NOT NULL,
unitPrice FLOAT(19,2) NOT NULL,
PRIMARY KEY (productID)
);

-- Insert data into Products:
INSERT INTO Products (productName,productType, unitPrice)
VALUES('Sofa', 'Stock',  1200.00),
('Custom-Order Desk', 'Custom', 1599.99),
('Office Chair', 'Stock',  299.99);

-- Create Locations table:
CREATE TABLE Locations (
locationID INT NOT NULL AUTO_INCREMENT,
locationName VARCHAR(25) NOT NULL,
locationAddress VARCHAR(50) NOT NULL,
locationCity VARCHAR(25) NOT NULL,
locationStateAbbr VARCHAR(2) NOT NULL,
phone VARCHAR(10) NOT NULL,
PRIMARY KEY (locationID)
);
 
-- Insert data into Locations:
INSERT INTO Locations (locationName, locationAddress, locationCity, locationStateAbbr, phone)
values ('Los Angeles', '5900 Wilshire Blvd', 'Los Angeles', 'CA', '3235551234'),
('Bay Area',   '747 Howard St', 'San Francisco','CA', '4155555678'),
('Chicago',  '525 S Racine Ave', 'Chicago', 'IL', '3125559012'),
('New York City', '660 5th Ave', 'New York', 'NY', '2125553456');
 
-- Create Employees table:
CREATE TABLE Employees (
employeeID INT NOT NULL AUTO_INCREMENT,
firstName VARCHAR(25) NOT NULL,
lastName VARCHAR(25) NOT NULL,
phone VARCHAR(10) NOT NULL,
email VARCHAR(30) NOT NULL,
employeeAddress VARCHAR(50) NOT NULL,
employeeCity VARCHAR(25) NOT NULL,
employeeStateAbbr VARCHAR(2) NOT NULL,
locationID INT NOT NULL,
ordersFulfilledCount INT NULL,
ordersActiveCount INT NULL,
employeeRole VARCHAR(10) NOT NULL,
PRIMARY KEY (employeeID),
FOREIGN KEY (locationID) REFERENCES Locations(locationID) ON DELETE CASCADE
);
 
-- Insert data into Employees:
INSERT INTO Employees (firstName,lastName, phone, email, employeeAddress, employeeCity, employeeStateAbbr, locationID, ordersFulfilledCount, ordersActiveCount, employeeRole)
VALUES('Dwayne', 'Johnson', '9497891234', 'WhatsCooking@mac.com', '32 Beverly Park Ter', 'Beverly Hills', 'CA', (select locationID from Locations where locationName ='Los Angeles'), 5,  2, 'Sales'),
('Mark', 'Zuckerberg',  '9495550002', 'bob@furnitech.com', '1456 Edgewood Drive', 'Palo Alto', 'CA', (select locationID from Locations where locationName ='Bay Area'), 20, 3, 'Manager'),
('Billy', 'Mays',  '3124204789', 'OxiClean@gmail.com', '100 Elm Street', 'Naperville', 'IL', (select locationID from Locations where locationName ='Chicago'), 50, 6, 'Manager'),
('Jerry', 'Seinfeld', '5625550003', 'charlie@furnitech.com', '4601 Austin Blvd',  'Long Island', 'NY', (select locationID from Locations where locationName ='New York City'), 10, 1, 'Designer');

-- Create Orders table:
CREATE TABLE Orders (
orderID INT NOT NULL AUTO_INCREMENT,
customerID INT NOT NULL,
employeeID INT NULL,
locationID INT NOT NULL,
address VARCHAR(100) NOT NULL,
dateOrdered DATE NOT NULL,
dateEstimateDelivery DATE NOT NULL,
dateDelivered DATE NULL,
orderStatus VARCHAR(10) NOT NULL,
subtotal DECIMAL(8,2) NOT NULL,
tax DECIMAL(5,2) NOT NULL,
orderTotal DECIMAL(8,2) NOT NULL,
PRIMARY KEY (orderID),
FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE,
FOREIGN KEY (employeeID) REFERENCES Employees(employeeID) ON DELETE SET NULL,
FOREIGN KEY (locationID) REFERENCES Locations(locationID) ON DELETE CASCADE
);

-- Insert data into Orders:
INSERT INTO Orders (customerID, employeeID,locationID, address,dateOrdered, dateEstimateDelivery, dateDelivered, orderStatus,subtotal,tax,orderTotal)
VALUES( (select customerID from Customers where firstName ='Leroy' and lastName='Jenkins'), (select employeeID from Employees where firstName ='Billy' and lastName='Mays'), (select locationID from Locations where locationName ='Bay Area'), '100 Elm Street, San Diego, CA 91942', '2025-04-20', '2025-04-25', NULL, 'Pending', 1200.00,  90.00,  1290.00),
( (select customerID from Customers where firstName ='Luke' and lastName='Skywalker'), NULL, (select locationID from Locations where locationName ='Chicago'), '9463 Vineyard Ave, Napa, CA 94558','2025-04-16', '2025-04-25', '2025-04-25', 'Delivered', 3199.98,  275.98,  3475.96);

-- Create ProductsOrdered table:
CREATE TABLE ProductsOrdered (
orderItemID INT NOT NULL AUTO_INCREMENT,
orderID INT NOT NULL,
productID INT NOT NULL,
quantity INT NOT NULL,
productPrice DECIMAL(8,2) NOT NULL,
totalProductPrice DECIMAL(8,2) NOT NULL,
PRIMARY KEY (orderItemID),
FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE CASCADE
);

-- Insert data into ProductsOrdered: this table is an absolute nightmare to code, because you need customer, location, and date to increase odds the result is 1, and it still doesn't guarantee it
INSERT INTO ProductsOrdered (orderID, productID, quantity, productPrice, totalProductPrice)
VALUES
  (
    (
      SELECT o.orderID
      FROM Orders o
      JOIN Customers c ON o.customerID = c.customerID
      WHERE c.firstName = 'Leroy'
        AND c.lastName  = 'Jenkins'
      LIMIT 1
    ),
    1, 1, 1200.00, 1200.00
  ),
  (
    2, 2, 2, 1599.99, 3199.98
  );

-- Create ProductLocation table:
CREATE TABLE ProductLocation (
productLocationID INT NOT NULL AUTO_INCREMENT,
locationID INT NOT NULL,
productID INT NOT NULL,
PRIMARY KEY (productLocationID),
FOREIGN KEY (locationID) REFERENCES Locations(locationID) ON DELETE CASCADE,
FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE CASCADE
);
  
-- Insert data into ProductLocation:
INSERT INTO ProductLocation (locationID, productID)
VALUES((select locationID from Locations where locationName ='Chicago'), (select productID from Products where productName ='Sofa')),
( (select locationID from Locations where locationName ='Bay Area'), (select productID from Products where productName ='Office Chair')),
( (select locationID from Locations where locationName ='Chicago'), (select productID from Products where productName ='Office Chair')),
( (select locationID from Locations where locationName ='Bay Area'), (select productID from Products where productName ='Sofa'));

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

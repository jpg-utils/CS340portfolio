-- Group 8 Sean Bleyl & Joshua Griep

DELIMITER //

CREATE PROCEDURE ResetFurniTech()
BEGIN
 SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE ProductsOrdered;
  TRUNCATE TABLE ProductLocation;
  TRUNCATE TABLE Orders;
  TRUNCATE TABLE Employees;
  TRUNCATE TABLE Customers;
  TRUNCATE TABLE Products;
  TRUNCATE TABLE Locations;

-- Insert data into Customers:
INSERT INTO Customers  (firstName, lastName, phone, email)
VALUES('Leroy', 'Jenkins', '9495551234', 'leroyjenkins@gmail.com'),
('Luke', 'Skywalker', '5858775692', 'theforceiswithyou@yahoo.com'),
('Martha', 'Stewart', '3129855025', 'chefstewart@gmail.com');

-- Insert data into Products:
INSERT INTO Products (productName,productType, unitPrice)
VALUES('Sofa', 'Stock',  1200.00),
('Custom-Order Desk', 'Custom', 1599.99),
('Office Chair', 'Stock',  299.99);

-- Insert data into Locations:
INSERT INTO Locations (locationName, locationAddress, locationCity, locationStateAbbr, phone)
values ('Los Angeles', '5900 Wilshire Blvd', 'Los Angeles', 'CA', '3235551234'),
('Bay Area',   '747 Howard St', 'San Francisco','CA', '4155555678'),
('Chicago',  '525 S Racine Ave', 'Chicago', 'IL', '3125559012'),
('New York City', '660 5th Ave', 'New York', 'NY', '2125553456');

-- Insert data into Employees:
INSERT INTO Employees (firstName,lastName, phone, email, employeeAddress, employeeCity, employeeStateAbbr, locationID, ordersFulfilledCount, ordersActiveCount, employeeRole)
VALUES('Dwayne', 'Johnson', '9497891234', 'WhatsCooking@mac.com', '32 Beverly Park Ter', 'Beverly Hills', 'CA', (select locationID from Locations where locationName ='Los Angeles'), 5,  2, 'Sales'),
('Mark', 'Zuckerberg',  '9495550002', 'bob@furnitech.com', '1456 Edgewood Drive', 'Palo Alto', 'CA', (select locationID from Locations where locationName ='Bay Area'), 20, 3, 'Manager'),
('Billy', 'Mays',  '3124204789', 'OxiClean@gmail.com', '100 Elm Street', 'Naperville', 'IL', (select locationID from Locations where locationName ='Chicago'), 50, 6, 'Manager'),
('Jerry', 'Seinfeld', '5625550003', 'charlie@furnitech.com', '4601 Austin Blvd',  'Long Island', 'NY', (select locationID from Locations where locationName ='New York City'), 10, 1, 'Designer');

-- Insert data into Orders:
INSERT INTO Orders (customerID, employeeID,locationID, address,dateOrdered, dateEstimateDelivery, dateDelivered, orderStatus,subtotal,tax,orderTotal)
VALUES( (select customerID from Customers where firstName ='Leroy' and lastName='Jenkins'), (select employeeID from Employees where firstName ='Billy' and lastName='Mays'), (select locationID from Locations where locationName ='Bay Area'), '100 Elm Street, San Diego, CA 91942', '2025-04-20', '2025-04-25', NULL, 'Pending', 1200.00,  120.00,  1320.00),
( (select customerID from Customers where firstName ='Luke' and lastName='Skywalker'), NULL, (select locationID from Locations where locationName ='Chicago'), '9463 Vineyard Ave, Napa, CA 94558','2025-04-16', '2025-04-25', '2025-04-25', 'Delivered', 3199.98,  320.00,  3519.98);


-- Insert data into ProductsOrdered: this table is an absolute nightmare to code, because you need customer, location, and date to increase odds the result is 1, and it still doesn't guarantee it
INSERT INTO ProductsOrdered (orderID, productID, quantity, productPrice, totalProductPrice)
VALUES
  (
    (SELECT o.orderID
     FROM Orders o
     JOIN Customers c ON o.customerID = c.customerID
     WHERE c.firstName = 'Leroy'
       AND c.lastName = 'Jenkins'
     LIMIT 1),
    (SELECT p.productID FROM Products p WHERE p.productName = 'Sofa' LIMIT 1),
    1,
    (SELECT p.unitPrice FROM Products p WHERE p.productName = 'Sofa' LIMIT 1),
    (SELECT p.unitPrice FROM Products p WHERE p.productName = 'Sofa' LIMIT 1)
  ),
  (
    (SELECT o.orderID
     FROM Orders o
     JOIN Customers c ON o.customerID = c.customerID
     WHERE c.firstName = 'Luke'
       AND c.lastName = 'Skywalker'
     LIMIT 1),
    (SELECT p.productID FROM Products p WHERE p.productName = 'Custom-Order Desk' LIMIT 1),
    2,
    (SELECT p.unitPrice FROM Products p WHERE p.productName = 'Custom-Order Desk' LIMIT 1),
    2 * (SELECT p.unitPrice FROM Products p WHERE p.productName = 'Custom-Order Desk' LIMIT 1)
  );


INSERT INTO ProductLocation (locationID, productID)
VALUES((select locationID from Locations where locationName ='Chicago'), (select productID from Products where productName ='Sofa')),
( (select locationID from Locations where locationName ='Bay Area'), (select productID from Products where productName ='Office Chair')),
( (select locationID from Locations where locationName ='Chicago'), (select productID from Products where productName ='Office Chair')),
( (select locationID from Locations where locationName ='Los Angeles'), (select productID from Products where productName ='Office Chair')),
( (select locationID from Locations where locationName ='New York City'), (select productID from Products where productName ='Sofa')),
( (select locationID from Locations where locationName ='Bay Area'), (select productID from Products where productName ='Sofa'));
END //

-- CUD operation to demonstrate RESET
CREATE PROCEDURE DeleteLeroy()
BEGIN
    DELETE FROM Customers WHERE firstName='Leroy' AND lastName='Jenkins';
END //

-- Procedure for Creating a Customer
CREATE PROCEDURE sp_CreateCustomer(
  IN p_firstName VARCHAR(25),
  IN p_lastName VARCHAR(25),
  IN p_phone VARCHAR(10),
  IN p_email VARCHAR(30)
)
BEGIN
  INSERT INTO Customers (firstName, lastName, phone, email)
  VALUES (p_firstName, p_lastName, p_phone, p_email);
END //

-- Procedure for Updating a Customer
CREATE PROCEDURE sp_UpdateCustomer(
  IN p_customerID INT,
  IN p_firstName VARCHAR(25),
  IN p_lastName VARCHAR(25),
  IN p_phone VARCHAR(10),
  IN p_email VARCHAR(30)
)
BEGIN
  UPDATE Customers
  SET firstName = p_firstName,
      lastName = p_lastName,
      phone = p_phone,
      email = p_email
  WHERE customerID = p_customerID;
END //

-- Procedure for Deleting a Customer
CREATE PROCEDURE DeleteCustomer(
  IN p_customerID INT
)
BEGIN
  DELETE FROM Customers
  WHERE customerID = p_customerID;
END //

-- Procedure for Creating an Order Detail (ProductsOrdered)
CREATE PROCEDURE sp_CreateOrderDetail(
  IN p_orderID INT,
  IN p_productID INT,
  IN p_quantity INT,
  IN p_unitPrice DECIMAL(8,2)
)
BEGIN
  INSERT INTO ProductsOrdered (orderID, productID, quantity, productPrice, totalProductPrice)
  VALUES (p_orderID, p_productID, p_quantity, p_unitPrice, p_quantity * p_unitPrice);
END //

-- Procedure for Updating an Order Detail
CREATE PROCEDURE UpdateOrderDetail(
  IN p_orderItemID INT,
  IN p_quantity INT,
  IN p_unitPrice DECIMAL(8,2)
)
BEGIN
  UPDATE ProductsOrdered
  SET quantity = p_quantity,
      productPrice = p_unitPrice,
      totalProductPrice = p_quantity * p_unitPrice
  WHERE orderItemID = p_orderItemID;
END //

-- Procedure for Deleting an Order Detail
CREATE PROCEDURE DeleteOrderDetail(
  IN p_orderItemID INT
)
BEGIN
  DELETE FROM ProductsOrdered
  WHERE orderItemID = p_orderItemID;
END //
  

SET FOREIGN_KEY_CHECKS = 1;
END //

DELIMITER ;
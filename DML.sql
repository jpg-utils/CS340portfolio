-- Group 8 Sean Bleyl & Joshua Griep
-- SELECT, INSERT, UPDATE and DELETE queries for each table


-- Customers CRUD

-- Select customers
SELECT customerID, firstName, lastName, phone, email
FROM Customers;

-- Add customer
INSERT INTO Customers (firstName, lastName, phone, email)
VALUES (@firstName@, @lastName@, @phone@, @email@);

-- Update customer
UPDATE Customers
    SET firstName = @firstName@, lastName = @lastName@, phone = @phone@, email = @email@
    WHERE customerID = @customerID@;

-- Delete customer
DELETE FROM Customers
    WHERE customerID = @customerID@;


-- Products CRUD

-- Select products
SELECT productID, productName, productType, unitPrice
FROM Products;

-- Add product
INSERT INTO Products (productName, productType, unitPrice)
VALUES (@productName@, @productType@, @unitPrice@);

-- Update product
UPDATE Products
    SET productName = @productName@, productType = @productType@, unitPrice = @unitPrice@
    WHERE productID = @productID@;

-- Delete product
DELETE FROM Products
    WHERE productID = @productID@;


-- Locations CRUD

-- Select locations
SELECT locationID, locationName, locationAddress, locationCity, locationStateAbbr, phone
FROM Locations;

-- Add location
INSERT INTO Locations (locationName, locationAddress, locationCity, locationStateAbbr, phone)
VALUES (@locationName@, @locationAddress@, @locationCity@, @locationStateAbbr@, @phone@);

-- Update location
UPDATE Locations
    SET locationName = @locationName@, locationAddress = @locationAddress@,
        locationCity = @locationCity@, locationStateAbbr = @locationStateAbbr@, phone = @phone@
    WHERE locationID = @locationID@;

-- Delete location
DELETE FROM Locations
    WHERE locationID = @locationID@;


-- Employees CRUD

-- Select employees
SELECT employeeID, firstName, lastName, phone, email, employeeAddress, employeeCity, employeeStateAbbr, locationID, ordersFulfilledCount, ordersActiveCount, employeeRole
FROM Employees;

-- Add employee
INSERT INTO Employees (firstName, lastName, phone, email, employeeAddress, employeeCity, employeeStateAbbr, locationID, ordersFulfilledCount, ordersActiveCount, employeeRole)
SELECT @firstName@, @lastName@, @phone@, @email@, @employeeAddress@, @employeeCity@, @employeeStateAbbr@, l.locationID, @ordersFulfilledCount@, @ordersActiveCount@, @employeeRole@
FROM Locations AS l
WHERE l.locationName = @selectedBranchName@;

-- Update employee
UPDATE Employees AS e
JOIN Locations  AS l ON l.locationName = @selectedBranchName@
    SET firstName = @firstName@, lastName = @lastName@, phone = @phone@, email = @email@, employeeAddress = @employeeAddress@, employeeCity = @employeeCity@, 
    employeeStateAbbr = @employeeStateAbbr@, locationID = @locationID@, ordersFulfilledCount = @ordersFulfilledCount@, ordersActiveCount = @ordersActiveCount@, 
    employeeRole = @employeeRole@
    WHERE employeeID = @employeeID@;

-- Delete employee
DELETE FROM Employees
    WHERE employeeID = @employeeID@;


-- Orders CRUD

-- Select orders
SELECT o.orderID, c.firstName AS customerFirst, c.lastName AS customerLast, o.employeeID, o.locationID, o.address, o.dateOrdered, o.dateEstimateDelivery, o.dateDelivered, 
o.orderStatus, o.subtotal, o.tax, o.orderTotal
FROM Orders o
JOIN Customers c ON o.customerID = c.customerID;

-- Add order
INSERT INTO Orders (customerID, employeeID, locationID, address, dateOrdered, dateEstimateDelivery, dateDelivered, orderStatus, subtotal, tax, orderTotal)
VALUES ((SELECT customerID FROM Customers WHERE firstName = @customerFirst@ AND lastName = @customerLast@),
    (SELECT employeeID FROM Employees WHERE firstName = @employeeFirst@ AND lastName = @employeeLast@),
    (SELECT locationID FROM Locations WHERE locationName = @locationName@), @address@, @dateOrdered@, @dateEstimateDelivery@, @dateDelivered@, @orderStatus@, @subtotal@, @tax@, @orderTotal@
);

-- Update order
UPDATE Orders
    SET customerID = (SELECT customerID FROM Customers WHERE firstName = @customerFirst@ AND lastName = @customerLast@),
        employeeID = (SELECT employeeID FROM Employees WHERE firstName = @employeeFirst@ AND lastName = @employeeLast@),
        locationID = (SELECT locationID FROM Locations WHERE locationName = @locationName@), address = @address@, dateOrdered = @dateOrdered@, dateEstimateDelivery = @dateEstimateDelivery@, 
        dateDelivered = @dateDelivered@, orderStatus = @orderStatus@, subtotal = @subtotal@, tax = @tax@, orderTotal = @orderTotal@
    WHERE orderID = @orderID@;

-- Delete order
DELETE FROM Orders
    WHERE orderID = @orderID@;


-- ProductsOrdered CRUD

-- Select products in orders
SELECT po.orderItemID, po.orderID, p.productName, po.quantity, po.productPrice, po.totalProductPrice
FROM ProductsOrdered po
JOIN Products p ON po.productID = p.productID;

-- Add product to order
INSERT INTO ProductsOrdered (orderID, productID, quantity, productPrice, totalProductPrice)
VALUES (@orderID@, (SELECT productID FROM Products WHERE productName = @productName@), @quantity@, @productPrice@, @totalProductPrice@);

-- Update product in order
UPDATE ProductsOrdered
    SET productID = (SELECT productID FROM Products WHERE productName = @productName@), quantity = @quantity@, productPrice = @productPrice@, totalProductPrice = @totalProductPrice@
    WHERE orderItemID = @orderItemID@;

-- Delete product from order
DELETE FROM ProductsOrdered
    WHERE orderItemID = @orderItemID@;


-- ProductLocation CRUD

-- Select product locations
SELECT pl.productLocationID, pl.locationID, l.locationName, pl.productID, p.productName
FROM ProductLocation pl
JOIN Locations l ON pl.locationID = l.locationID
JOIN Products p ON pl.productID = p.productID;

-- Add product to location
-- Add product to location (using friendly field lookups)
INSERT INTO ProductLocation (locationID, productID)
VALUES ((SELECT locationID FROM Locations WHERE locationName = @locationName@), (SELECT productID FROM Products WHERE productName = @productName@));

-- Update product location
-- Update product location (using friendly field lookups)
UPDATE ProductLocation
    SET locationID = (SELECT locationID FROM Locations WHERE locationName = @locationName@), productID = (SELECT productID FROM Products WHERE productName = @productName@)
    WHERE productLocationID = @productLocationID@;


-- Delete product from location
DELETE FROM ProductLocation
    WHERE productLocationID = @productLocationID@;

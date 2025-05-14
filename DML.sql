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
VALUES (@firstName@, @lastName@, @phone@, @email@, @employeeAddress@, @employeeCity@, @employeeStateAbbr@, @locationID@, @ordersFulfilledCount@, @ordersActiveCount@, @employeeRole@);

-- Update employee
UPDATE Employees
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
VALUES (@customerID@, @employeeID@, @locationID@, @address@, @dateOrdered@, @dateEstimateDelivery@, @dateDelivered@, @orderStatus@, @subtotal@, @tax@, @orderTotal@);

-- Update order
UPDATE Orders
    SET customerID = @customerID@, employeeID = @employeeID@, locationID = @locationID@, address = @address@, dateOrdered = @dateOrdered@, 
    dateEstimateDelivery = @dateEstimateDelivery@, dateDelivered = @dateDelivered@, orderStatus = @orderStatus@, subtotal = @subtotal@, tax = @tax@, orderTotal = @orderTotal@
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
VALUES (@orderID@, @productID@, @quantity@, @productPrice@, @totalProductPrice@);

-- Update product in order
UPDATE ProductsOrdered
    SET quantity = @quantity@, productPrice = @productPrice@, totalProductPrice = @totalProductPrice@
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
INSERT INTO ProductLocation (locationID, productID)
VALUES (@locationID@, @productID@);

-- Update product location
UPDATE ProductLocation
    SET locationID = @locationID@, productID = @productID@
    WHERE productLocationID = @productLocationID@;

-- Delete product from location
DELETE FROM ProductLocation
    WHERE productLocationID = @productLocationID@;

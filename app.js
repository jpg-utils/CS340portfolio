// Joshua Griep, Sam Bleyl
//CS340- Introduction to Databases
//adapted from the CS340 Exploration- Web application technology (node.js stack)
// ########## SETUP

// Express for API routes and calls
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

<<<<<<< HEAD
const PORT = 2992;
=======
const PORT = 2998;
>>>>>>> 185142f (Initial commit on sbleyl branch)

// Database for CRUD actions on the data
const db = require('./database/db-connector.js');

// Handlebars for templating 
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});



//retrieve a list of our current customers
app.get('/customers', async function (req, res) {
    try {
        // returns all attributes on the customer
        const query1 = `SELECT \
            Customers.customerID AS 'id', \
            Customers.firstName AS 'first', \
            Customers.lastName AS 'last', \
            Customers.phone AS 'phone', \
            Customers.email AS 'email' FROM Customers;`;
        const [customers] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('customers', { customers: customers});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


//retrieve a list of our current products
app.get('/products', async function (req, res) {
    try {
<<<<<<< HEAD
        // returns all attributes on the product
        const query1 = `SELECT \
            Products.productName AS 'name', \
            Products.productType AS 'type', \
            Products.unitPrice AS 'price' \ 
=======
        // Fixed SQL query - removed trailing space after 'price' \
        const query1 = `SELECT 
            Products.productID AS 'id', \
            Products.productName AS 'name',
            Products.productType AS 'type',
            Products.unitPrice AS 'price'
>>>>>>> 185142f (Initial commit on sbleyl branch)
            FROM Products;`;
        const [products] = await db.query(query1);

        // Render the Products Table inside of the products.hbs file
        res.render('products', { products: products});
    } catch (error) {
        console.error('Error executing queries:', error);
<<<<<<< HEAD
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
=======
        console.error('Error details:', error.code, error.message);
        
        // Send a more informative error message
        res.status(500).send(
            "Database connection error (code: " + (error.code || "unknown") + "). " +
            "Please try again later or contact your instructor."
>>>>>>> 185142f (Initial commit on sbleyl branch)
        );
    }
});




//retrieve a list of our locations
app.get('/locations', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
<<<<<<< HEAD
        Locations.locationName as 'branch', \
        Locations.locationAddress as 'address', \
        Locations.locationCity AS 'city', \
        Locations.locationStateAbbr AS 'state', \
        Locations.phone AS 'phone' FROM Locations;`;
=======
            Locations.locationID AS 'id',
            Locations.locationName AS 'name',
            Locations.locationAddress AS 'address',
            Locations.locationCity AS 'city',
            Locations.locationStateAbbr AS 'state',
            Locations.phone AS 'phone' FROM Locations;`;
>>>>>>> 185142f (Initial commit on sbleyl branch)
        const [locations] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('locations', { locations: locations});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


//retrieve a list of employees- requires join to get Branch worked
app.get('/employees', async function (req, res) {
    try {
        // returns relevant attributes on locations
<<<<<<< HEAD
        const query1 = `SELECT  \
        Employees.firstName as 'first', \
        Employees.lastName as 'last', \
        Employees.employeeRole AS 'role', \
        Employees.ordersActiveCount AS 'active', \
        Employees.phone AS 'phone', \
        Locations.locationName AS 'branch' FROM Employees \
        JOIN Locations ON Employees.locationID = Locations.LocationID \
        ORDER BY branch`;
        const [employees] = await db.query(query1);

        // Render the employees Table inside of the employees.hbs file
        res.render('employees', { employees: employees});
=======
        const query1 = `SELECT  
            Employees.employeeID           AS id,
            Employees.firstName            AS first,
            Employees.lastName             AS last,
            Employees.phone                AS phone,
            Employees.email                AS email,
            Employees.employeeAddress      AS address,
            Employees.employeeCity         AS city,
            Employees.employeeStateAbbr    AS state,
            Employees.locationID           AS locationID,
            Employees.ordersFulfilledCount AS fulfilled,
            Employees.ordersActiveCount    AS active,
            Employees.employeeRole         AS role
        FROM Employees
        JOIN Locations ON Employees.locationID = Locations.locationID
        ORDER BY Employees.employeeID;`;
        const [employees] = await db.query(query1);

        // Render the employees Table inside of the employees.hbs file
        res.render('employees', { employees });
>>>>>>> 185142f (Initial commit on sbleyl branch)
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});

//retrieve a list of orders- requires joins
app.get('/orders', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
<<<<<<< HEAD
        Orders.orderID as 'id', \
        Customers.firstName as 'customerFirst', \
        Customers.lastName as 'customerLast', \
        Employees.lastName as 'employee', \
        Locations.locationName AS 'branch', \
        Orders.dateEstimateDelivery AS 'estimate', \
        Orders.orderStatus AS 'status', \
        Orders.subtotal AS 'subtotal', \
        Orders.tax AS 'tax', \
        Orders.orderTotal AS 'total' FROM ORDERS \
        JOIN Locations ON Orders.locationID = Locations.locationID \
        JOIN Customers ON Customers.customerID = Orders.customerID \
        JOIN Employees ON Employees.employeeID = Orders.employeeID \
        ORDER BY estimate;`;
        const [orders] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('orders', { orders: orders});
=======
            Orders.orderID          AS orderID,
            Orders.customerID       AS customerID,
            Orders.employeeID       AS employeeID,
            Orders.locationID       AS locationID,
            Orders.address          AS address,
            Orders.dateOrdered      AS dateOrdered,
            Orders.dateEstimateDelivery AS dateEstimateDelivery,
            Orders.dateDelivered    AS dateDelivered,
            Orders.orderStatus      AS orderStatus,
            Orders.subtotal         AS subtotal,
            Orders.tax              AS tax,
            Orders.orderTotal       AS orderTotal
        FROM Orders
        ORDER BY Orders.dateEstimateDelivery;`;
        const [orders] = await db.query(query1);

        const formatted = orders.map(o => ({
        ...o,
        dateOrdered: o.dateOrdered.toISOString().split('T')[0],
        dateEstimateDelivery: o.dateEstimateDelivery.toISOString().split('T')[0],
        dateDelivered: o.dateDelivered
            ? o.dateDelivered.toISOString().split('T')[0]
            : null
        }));


        // Render the Customer Table inside of the customer.hbs file
        res.render('orders', { orders: formatted});
>>>>>>> 185142f (Initial commit on sbleyl branch)
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});

//Products Ordered table -not yet implemented but the easiest way will be as a 'view button' from the order
//select Product.productName, productsOrdered.quantity, productsOrdered.productprice as 'indprice', productsordered.totalproductprice as 'totalproduct'  
//retrieve a list of orders- requires joins
app.get('/orders/:id', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
        Products.productName, \
        ProductsOrdered.quantity, \
        ProductsOrdered.productprice as 'indprice', \
        ProductsOrdered.totalproductprice as 'totalproduct' \
        FROM Products \
        JOIN ProductsOrdered ON ProductsOrdered.productID = Products.productID \
        WHERE ProductsOrdered.orderID = ${req.params.id};`;
        const [invoice] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('invoice', { invoice: invoice});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


app.get('/locations/:id', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
        Locations.locationName as 'site', \
        Products.productName as 'product' \
        FROM ProductLocation \
        JOIN Products ON ProductLocation.productID = Products.productID \
        JOIN Locations ON ProductLocation.locationID = Locations.locationID \
        WHERE ProductLocation.locationID = ${req.params.id};`;
        const [inventory] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('inventory', { inventory: inventory});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});
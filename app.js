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

const PORT = 2998;

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
        // returns all attributes on the product
        const query1 = `SELECT \
            Products.productName AS 'name', \
            Products.productType AS 'type', \
            Products.unitPrice AS 'price' \ 
            FROM Products;`;
        const [products] = await db.query(query1);

        // Render the Products Table inside of the products.hbs file
        res.render('products', { products: products});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});




//retrieve a list of our locations
app.get('/locations', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
        Locations.locationID as 'id', \
        Locations.locationName as 'branch', \
        Locations.locationAddress as 'address', \
        Locations.locationCity AS 'city', \
        Locations.locationStateAbbr AS 'state', \
        Locations.phone AS 'phone' FROM Locations;`;
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
        const query1 = `SELECT  \
        Employees.employeeID as 'id', \
        Employees.firstName as 'first', \
        Employees.lastName as 'last', \
        Employees.employeeRole AS 'role', \
        Employees.ordersActiveCount AS 'active', \
        Employees.phone AS 'phone', \
        Locations.locationName AS 'branch' FROM Employees \
        JOIN Locations ON Employees.locationID = Locations.LocationID \
        ORDER BY branch`;
        const [employees] = await db.query(query1);

        const query2 =`SELECT * FROM Locations`;
        const [locations] = await db.query(query2);

        // Render the employees Table inside of the employees.hbs file
        res.render('employees', { employees: employees, locations: locations});
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
        Orders.orderID as 'id', \
        Customers.firstName as 'customerFirst', \
        Customers.lastName as 'customerLast', \
        Employees.lastName as 'employee', \
        Locations.locationName AS 'branch', \
        DATE_format(Orders.dateEstimateDelivery, "%m/%e/%y") AS 'estimate', \
        Orders.orderStatus AS 'status', \
        Orders.subtotal AS 'subtotal', \
        Orders.tax AS 'tax', \
        Orders.orderTotal AS 'total' FROM Orders \
        JOIN Locations ON Orders.locationID = Locations.locationID \
        JOIN Customers ON Customers.customerID = Orders.customerID \
        JOIN Employees ON Employees.employeeID = Orders.employeeID \
        ORDER BY estimate;`;
        const [orders] = await db.query(query1);
        const query2 = `SELECT \
            Customers.customerID AS 'id', \
            Customers.firstName AS 'first', \
            Customers.lastName AS 'last', \
            Customers.phone AS 'phone', \
            Customers.email AS 'email' FROM Customers;`
        const [customers] = await db.query(query2);
        const query3 = `SELECT \
            Products.productID AS 'ID', \
            Products.productName AS 'name', \
            Products.productType AS 'type', \
            Products.unitPrice AS 'price' \ 
            FROM Products;`;
        const [products] = await db.query(query3);;
        const query4 = `SELECT  \
            Employees.employeeID as 'id', \
            Employees.firstName as 'first', \
            Employees.lastName as 'last' \
            FROM Employees;`;
        const [employees] = await db.query(query4);

        // Render the Customer Table inside of the customer.hbs file
        res.render('orders', { orders: orders, customers:customers, products:products, employees:employees});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


//retrieve a list of orders- requires joins
app.get('/invoices', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
        ProductsOrdered.orderID as 'ID', \
        Products.productName, \
        ProductsOrdered.quantity, \
        ProductsOrdered.productprice as 'indprice', \
        ProductsOrdered.totalproductprice as 'totalproduct' \
        FROM Products \
        JOIN ProductsOrdered ON ProductsOrdered.productID = Products.productID;`;
        const [invoice] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('invoices', { invoice: invoice});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});



//retrieve a list of orders- requires joins
app.get('/invoices/:id', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
        ProductsOrdered.orderID as 'ID', \
        Products.productName, \
        ProductsOrdered.quantity, \
        ProductsOrdered.productprice as 'indprice', \
        ProductsOrdered.totalproductprice as 'totalproduct' \
        FROM Products \
        JOIN ProductsOrdered ON ProductsOrdered.productID = Products.productID \
        WHERE ProductsOrdered.orderID = ${req.params['id']};`;
        const [invoice] = await db.query(query1);

        // Render the Customer Table inside of the customer.hbs file
        res.render('invoices', { invoice: invoice});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


app.get('/inventory', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT  \
        Locations.locationName as 'site', \
        Products.productName as 'product' \
        FROM ProductLocation \
        JOIN Products ON ProductLocation.productID = Products.productID \
        JOIN Locations ON ProductLocation.locationID = Locations.locationID`;
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




app.get('/inventory/:id', async function (req, res) {
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

app.get('/purchase', async function (req, res) {
    try {
        // returns relevant attributes on locations
        const query1 = `SELECT \
            Customers.customerID AS 'id', \
            Customers.firstName AS 'first', \
            Customers.lastName AS 'last', \
            Customers.phone AS 'phone', \
            Customers.email AS 'email' FROM Customers;`
        const [customers] = await db.query(query1);
        const query2 = `SELECT \
            Products.productID AS 'ID', \
            Products.productName AS 'name', \
            Products.productType AS 'type', \
            Products.unitPrice AS 'price' \ 
            FROM Products;`;
        const [products] = await db.query(query2);;
        const query3 = `SELECT  \
            Employees.employeeID as 'id', \
            Employees.firstName as 'first', \
            Employees.lastName as 'last' \
            FROM Employees;`;
        const [employees] = await db.query(query3);

        // Render the Customer Table inside of the customer.hbs file
        res.render('purchase', { customers: customers, employees: employees, products:products});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});

// Reset Procedure
app.get('/reset', async (req, res) => {
  try {
    await db.query(`CALL ResetFurniTech();`);
    res.redirect('/');
    console.log('Redirect Success')
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).send('Database reset failed');
  }
});

// Demo Delete for Leroy Jenkins
app.get('/demo-delete', async (req, res) => {
  try {
    await db.query(`CALL DeleteLeroy();`);
    res.redirect('/customers');
  } catch (error) {
    console.error('Error running demo delete:', error);
    res.status(500).send('Demo delete failed');
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

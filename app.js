// Joshua Griep, Sam Bleyl
//CS340- Introduction to Databases
//adapted from the CS340 Exploration- Web application technology (node.js stack)
// ########## SETUP

// Express for API routes and calls
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = 5422;

// Database for CRUD actions on the data
const db = require('./database/db-connector.js');

// Handlebars for templating 
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

app.use(express.static('public'));
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
            productID   AS id,
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
app.get('/employees', async (req, res) => {
  try {
    const [employees] = await db.query(`
      SELECT 
        e.employeeID   AS id,
        e.firstName    AS first,
        e.lastName     AS last,
        e.employeeRole AS role,
        e.ordersActiveCount AS active,
        e.phone,
        e.locationID,
        l.locationName AS branch
      FROM Employees e
      LEFT JOIN Locations l ON e.locationID = l.locationID
      ORDER BY e.employeeID;
    `);

    const [locations] = await db.query(`
      SELECT locationID AS id, locationName AS branch
      FROM Locations
      ORDER BY locationName;
    `);

    res.render('employees', { employees, locations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//retrieve a list of orders- requires joins
// ─── app.js ───
app.get('/orders', async (req, res) => {
  try {
    const query1 = `SELECT
        o.orderID   AS id,
        c.firstName AS customerFirst,
        c.lastName  AS customerLast,
        e.lastName  AS employee,
        DATE_FORMAT(o.dateEstimateDelivery, '%m/%e/%y') AS estimate,
        o.orderStatus AS status,
        o.subtotal,
        o.tax,
        o.orderTotal AS total
      FROM Orders o
      JOIN Customers c ON o.customerID = c.customerID
      LEFT JOIN Employees e ON o.employeeID = e.employeeID
      ORDER BY estimate;`;
    const [orders]    = await db.query(query1);

    const [customers] = await db.query(`
      SELECT customerID AS id, firstName AS first, lastName AS last
      FROM Customers;
    `);

    const [employees] = await db.query(`
      SELECT employeeID AS id, firstName AS first, lastName AS last
      FROM Employees;
    `);

    res.render('orders', { orders, customers, employees });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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


// retrieve a list of order details - requires joins
app.get('/orderdetails', async function (req, res) {
  try {
    // returns relevant order details for all orders, customer, and product information
    const query = `SELECT  \
        ProductsOrdered.orderID as 'id', \
        Customers.firstName as 'customerFirst', \
        Customers.lastName as 'customerLast', \
        DATE_FORMAT(Orders.dateEstimateDelivery, '%m/%e/%y') as 'estimate', \
        Orders.orderStatus as 'status', \
        Orders.orderTotal as 'total', \
        Products.productName as 'product', \
        ProductsOrdered.quantity as 'quantity', \
        ProductsOrdered.productPrice as 'unitPrice', \
        ProductsOrdered.totalProductPrice as 'lineTotal' \
        FROM ProductsOrdered \
        JOIN Orders ON ProductsOrdered.orderID = Orders.orderID \
        JOIN Customers ON Orders.customerID = Customers.customerID \
        JOIN Products ON ProductsOrdered.productID = Products.productID \
        ORDER BY ProductsOrdered.orderID;`;
        const [orderdetails] = await db.query(query);

        // Render the Order Details Table inside of the orderdetails.hbs file
        res.render('orderdetails', { orderdetails });
  } catch (error) {
    console.error('Error executing queries:', error);
    // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


// retrieve a list of order details - requires joins
app.get('/orderdetails/:id', async function (req, res) {
  try {
    // returns relevant order details for a selected order based on its ID
    const query = `SELECT  \
        ProductsOrdered.orderID as 'id', \
        Customers.firstName as 'customerFirst', \
        Customers.lastName as 'customerLast', \
        DATE_FORMAT(Orders.dateEstimateDelivery, '%m/%e/%y') as 'estimate', \
        Orders.orderStatus as 'status', \
        Orders.orderTotal as 'total', \
        Products.productName as 'product', \
        ProductsOrdered.quantity as 'quantity', \
        ProductsOrdered.productPrice as 'unitPrice', \
        ProductsOrdered.totalProductPrice as 'lineTotal' \
        FROM ProductsOrdered \
        JOIN Orders ON ProductsOrdered.orderID = Orders.orderID \
        JOIN Customers ON Orders.customerID = Customers.customerID \
        JOIN Products ON ProductsOrdered.productID = Products.productID \
        WHERE ProductsOrdered.orderID = ? \
        ORDER BY ProductsOrdered.orderID;`;
        const [orderdetails] = await db.query(query, [req.params.id]);

        // Render the Order Details Table inside of the orderdetails.hbs file
        res.render('orderdetails', { orderdetails });
  } catch (error) {
        console.error(`Error executing queries: #${req.params.id}:`, error);
        // Send a generic error message to the browser
        res.status(500).send(
            "We're sorry, we've hit an error on our end. Please check back in a few minutes"
        );
    }
});


// LIST ALL INVENTORY
app.get('/inventory', async (req, res) => {
  try {
    const query1 = `
      SELECT
        productLocationID      AS id,
        Locations.locationName AS site,
        Products.productName   AS product
      FROM ProductLocation
      JOIN Products  ON ProductLocation.productID  = Products.productID
      JOIN Locations ON ProductLocation.locationID = Locations.locationID
    `;
    const [inventory] = await db.query(query1);
    res.render('inventory', { inventory });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

// LIST ONE LOCATION’S INVENTORY
app.get('/inventory/:id', async (req, res) => {
  try {
    const query1 = `
      SELECT
        productLocationID      AS id,
        Locations.locationName AS site,
        Products.productName   AS product
      FROM ProductLocation
      JOIN Products  ON ProductLocation.productID  = Products.productID
      JOIN Locations ON ProductLocation.locationID = Locations.locationID
      WHERE ProductLocation.locationID = ?
    `;
    const [inventory] = await db.query(query1, [req.params.id]);
    res.render('inventory', { inventory });
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});


app.get('/purchase', async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT
        customerID AS id,
        firstName  AS first,
        lastName   AS last
      FROM Customers;
    `);

    const [employees] = await db.query(`
      SELECT
        employeeID AS id,
        firstName  AS first,
        lastName   AS last
      FROM Employees;
    `);

    const [products] = await db.query(`
      SELECT
        productID   AS id,
        productName AS name,
        productType AS type,
        unitPrice   AS price
      FROM Products;
    `);

    res.render('purchase', { customers, employees, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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

// CREATE Customer
app.post('/add-customer', async (req, res) => {
  console.log('POST /add-customer body:', req.body);
  try {
    const { first, last, phone, email } = req.body;
    await db.query(
      `INSERT INTO Customers (firstName, lastName, phone, email)
       VALUES (?, ?, ?, ?)`,
      [first, last, phone, email]
    );
    const [rows] = await db.query(
      `SELECT customerID AS id, firstName AS first, lastName AS last, phone, email
       FROM Customers ORDER BY customerID`
    );
    return res.json(rows);
  } catch (err) {
    console.error('error in POST /add-customer:', err);
    return res.status(500).send(`DB error: ${err.message}`);
  }
});

// UPDATE Customer
app.put('/put-customer', async (req, res) => {
  try {
    const { id, firstNameValue, lastNameValue, phoneValue, emailValue } = req.body;
    await db.query(
      `UPDATE Customers
         SET firstName = ?,
             lastName  = ?,
             phone     = ?,
             email     = ?
       WHERE customerID = ?`,
      [firstNameValue, lastNameValue, phoneValue, emailValue, id]
    );
    return res.sendStatus(204);
  } catch (err) {
    console.error('error in PUT /put-customer:', err);
    return res.sendStatus(400);
  }
});

// DELETE Customer
app.delete('/delete-customer', async (req, res) => {
    const customerID = parseInt(req.body.id);
    console.log("DELETE route hit with body ID:", customerID);

    if (!customerID) {
        return res.status(400).send("Missing or invalid customer ID.");
    }

    try {
        const [result] = await db.query(
            `DELETE FROM Customers WHERE customerID = ?`,
            [customerID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send("Customer not found.");
        }

        return res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).send("Failed to delete customer.");
    }
});

// CREATE Product
app.post('/add-product', async (req, res) => {
  console.log('POST /add-product body:', req.body);
  try {
    const { name, type, price } = req.body;
    await db.query(
      `INSERT INTO Products (productName, productType, unitPrice)
       VALUES (?, ?, ?)`,
      [name, type, price]
    );
    const [rows] = await db.query(
      `SELECT productID AS id,
              productName AS name,
              productType AS type,
              unitPrice   AS price
       FROM Products
       ORDER BY productID`
    );
    return res.json(rows);
  } catch (err) {
    console.error('error in POST /add-product:', err);
    return res.status(500).send(`DB error: ${err.message}`);
  }
});

// UPDATE Product
app.put('/put-product', async (req, res) => {
  try {
    const { id, nameValue, typeValue, priceValue } = req.body;
    await db.query(
      `UPDATE Products
         SET productName = ?,
             productType = ?,
             unitPrice   = ?
       WHERE productID = ?`,
      [nameValue, typeValue, priceValue, id]
    );
    return res.sendStatus(204);
  } catch (err) {
    console.error('error in PUT /put-product:', err);
    return res.sendStatus(400);
  }
});

// DELETE Product
app.delete('/delete-product', async (req, res) => {
  const productID = parseInt(req.body.id);
  console.log("DELETE /delete-product with body ID:", productID);

  if (!productID) {
    return res.status(400).send("Missing or invalid product ID.");
  }

  try {
    const [result] = await db.query(
      `DELETE FROM Products WHERE productID = ?`,
      [productID]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send("Product not found.");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send("Failed to delete product.");
  }
});


// CREATE Location
app.post('/add-location', async (req, res) => {
  try {
    const { branch, address, city, state, phone } = req.body;
    await db.query(
      `INSERT INTO Locations
         (locationName, locationAddress, locationCity, locationStateAbbr, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [branch, address, city, state, phone]
    );
    const [rows] = await db.query(`
      SELECT
        locationID AS id,
        locationName AS branch,
        locationAddress AS address,
        locationCity    AS city,
        locationStateAbbr AS state,
        phone
      FROM Locations
      ORDER BY locationID
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// UPDATE Location
app.put('/put-location', async (req, res) => {
  try {
    const { id, address, city, state, phone } = req.body;
    await db.query(
      `UPDATE Locations
         SET locationAddress    = ?,
             locationCity       = ?,
             locationStateAbbr  = ?,
             phone              = ?
       WHERE locationID = ?`,
      [address, city, state, phone, id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// DELETE Location
app.delete('/delete-location', async (req, res) => {
  try {
    const id = parseInt(req.body.id);
    if (!id) return res.status(400).send('Missing ID');
    const [result] = await db.query(
      `DELETE FROM Locations WHERE locationID = ?`,
      [id]
    );
    if (result.affectedRows === 0) return res.status(404).send('Not found');
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// CREATE Employee
app.post('/add-employee', async (req, res) => {
  const { first, last, role, active, phone, locID } = req.body;
  try {
    await db.query(`
      INSERT INTO Employees
        (firstName,lastName,employeeRole,ordersActiveCount,phone,locationID,ordersFulfilledCount)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `, [
      first,
      last,
      role,
      active,
      phone,
      locID === 'NULL' ? null : locID
    ]);

    const [rows] = await db.query(`
      SELECT 
        e.employeeID   AS id,
        e.firstName    AS first,
        e.lastName     AS last,
        e.employeeRole AS role,
        e.ordersActiveCount AS active,
        e.phone,
        e.locationID,
        l.locationName AS branch
      FROM Employees e
      LEFT JOIN Locations l ON e.locationID = l.locationID
      ORDER BY e.employeeID;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// UPDATE Employee
app.put('/put-employee', async (req, res) => {
  const { id, role, active, phone, locID } = req.body;
  try {
    await db.query(`
      UPDATE Employees
         SET employeeRole      = ?,
             ordersActiveCount = ?,
             phone             = ?,
             locationID        = ?
       WHERE employeeID = ?
    `, [
      role,
      active,
      phone,
      locID === 'NULL' ? null : locID,
      id
    ]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});


// DELETE Employee
app.delete('/delete-employee', async (req, res) => {
  try {
    const id = parseInt(req.body.id);
    if (!id) return res.status(400).send('Missing ID');
    const [r] = await db.query(
      `DELETE FROM Employees WHERE employeeID = ?`,
      [id]
    );
    if (r.affectedRows===0) return res.status(404).send('Not found');
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// UPDATE Order
app.put('/put-order', async (req, res) => {
  const { id, customerID, employeeID, estimate, status } = req.body;
  if (!id || !customerID || !employeeID || !estimate || !status) {
    return res.status(400).send('Missing fields');
  }
  try {
    await db.query(
      `UPDATE Orders
         SET customerID           = ?,
             employeeID           = ?,
             dateEstimateDelivery = ?,
             orderStatus          = ?
       WHERE orderID = ?`,
      [customerID, employeeID, estimate, status, id]
    );
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).send('DB error');
  }
});

// DELETE Order
app.delete('/delete-order', async (req, res) => {
  const orderID = parseInt(req.body.id);
  if (!orderID) return res.status(400).send('Missing order ID');
  try {
    const [r] = await db.query(
      `DELETE FROM Orders WHERE orderID = ?`, [orderID]
    );
    if (r.affectedRows === 0) return res.status(404).send('Not found');
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

// UPDATE Order Detail
app.put('/put-orderdetail', async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id, quantityVal, unitPriceVal } = req.body;
    await conn.beginTransaction();

    await conn.query(
      `UPDATE ProductsOrdered
         SET quantity           = ?,
             productPrice       = ?,
             totalProductPrice  = ? * ?
       WHERE orderItemID = ?`,
      [quantityVal, unitPriceVal, quantityVal, unitPriceVal, id]
    );

    const [[{ totalProductPrice }]] = await conn.query(
      `SELECT totalProductPrice
         FROM ProductsOrdered
        WHERE orderItemID = ?`,
      [id]
    );
    const detailTotalNum = parseFloat(totalProductPrice);

    const [[{ orderID }]] = await conn.query(
      `SELECT orderID
         FROM ProductsOrdered
        WHERE orderItemID = ?`,
      [id]
    );

    const [[{ newSubtotal }]] = await conn.query(
      `SELECT SUM(totalProductPrice) AS newSubtotal
         FROM ProductsOrdered
        WHERE orderID = ?`,
      [orderID]
    );
    const subtotalNum = parseFloat(newSubtotal);
    const taxNum      = +(subtotalNum * 0.10).toFixed(2);
    const totalNum    = +(subtotalNum + taxNum).toFixed(2);

    await conn.query(
      `UPDATE Orders
         SET subtotal   = ?,
             tax        = ?,
             orderTotal = ?
       WHERE orderID = ?`,
      [
        subtotalNum.toFixed(2),
        taxNum.toFixed(2),
        totalNum.toFixed(2),
        orderID
      ]
    );

    await conn.commit();

    return res.json({
      detailTotal:     detailTotalNum.toFixed(2),
      orderSubtotal:   subtotalNum.toFixed(2),
      orderTax:        taxNum.toFixed(2),
      orderTotal:      totalNum.toFixed(2)
    });
  } catch (err) {
    await conn.rollback();
    console.error('error in PUT /put-orderdetail:', err);
    return res.status(500).json({ error: 'Database error' });
  } finally {
    conn.release();
  }
});

// DELETE Order Detail
app.delete('/delete-orderdetail', async (req, res) => {
  const orderItemID = parseInt(req.body.id);
  if (!orderItemID) {
    return res.status(400).send("Missing or invalid line item ID.");
  }

  try {
    const [result] = await db.query(
      `DELETE FROM ProductsOrdered WHERE orderItemID = ?`,
      [orderItemID]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send("Line item not found.");
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error('error in DELETE /delete-orderdetail:', err);
    return res.status(500).send("Failed to delete line item.");
  }
});

// DELETE Inventory
app.delete('/delete-inventory', async (req, res) => {
  const inventoryID = parseInt(req.body.id);
  console.log("DELETE /delete-inventory with ID:", inventoryID);

  if (!inventoryID) {
    return res.status(400).send("Missing or invalid inventory ID.");
  }

  try {
    const [result] = await db.query(
      `DELETE FROM ProductLocation WHERE productLocationID = ?`,
      [inventoryID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Inventory record not found.");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return res.status(500).send("Failed to delete inventory.");
  }
});


// CREATE ORDER
app.post('/add-order', async (req, res) => {
  const { customerID, employeeID, productID, quantity } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const DEFAULT_LOCATION_ID = 2;
    const [orderResult] = await conn.query(
      `INSERT INTO Orders
         (customerID, employeeID, locationID, address, dateOrdered,
          dateEstimateDelivery, orderStatus, subtotal, tax, orderTotal)
       VALUES (?, ?, ?, 'n/a', CURDATE(),
               DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Pending',
               0, 0, 0)`,
      [customerID, employeeID, DEFAULT_LOCATION_ID]
    );
    const orderID = orderResult.insertId;

    const [[{ unitPrice }]] = await conn.query(
      `SELECT unitPrice FROM Products WHERE productID = ?`,
      [productID]
    );

    const lineTotal = unitPrice * quantity;
    await conn.query(
      `INSERT INTO ProductsOrdered
         (orderID, productID, quantity, productPrice, totalProductPrice)
       VALUES (?, ?, ?, ?, ?)`,
      [orderID, productID, quantity, unitPrice, lineTotal]
    );

    // Recompute sums at 10% tax
    const subtotal = lineTotal;
    const tax      = +(subtotal * 0.10).toFixed(2);
    const total    = +(subtotal + tax).toFixed(2);
    await conn.query(
      `UPDATE Orders
         SET subtotal  = ?, 
             tax       = ?, 
             orderTotal= ?
       WHERE orderID = ?`,
      [subtotal.toFixed(2), tax.toFixed(2), total.toFixed(2), orderID]
    );

    await conn.commit();
    res.sendStatus(200);

  } catch (err) {
    await conn.rollback();
    console.error('Error in POST /add-order:', err);
    res.status(500).send('Database error');
  } finally {
    conn.release();
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

// Get the objects we need to modify
let addCustomer = document.getElementById('create_customer_form');

// Modify the objects we need
addCustomer.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("create_customer_fname");
    let inputLastName  = document.getElementById("create_customer_lname");
    let inputPhone     = document.getElementById("create_customer_phone");
    let inputEmail     = document.getElementById("create_customer_email");
    
    // Get the values from the form fields
    let firstNameValue = inputFirstName.value.trim();
    let lastNameValue = inputLastName.value.trim();
    let phoneValue = inputPhone.value.trim();
    let emailValue = inputEmail.value.trim();
    
    // Fixed condition check - now properly validates all fields
    if (!firstNameValue || !lastNameValue || !phoneValue || !emailValue) {
        alert("Please fill in all fields");
        return;
    }

    // Put our data we want to send in a javascript object
    // Property names must match what server expects
    let data = {
        first: firstNameValue,
        last:  lastNameValue,
        phone: phoneValue,
        email: emailValue,
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Reset form only after successful submission
            addCustomer.reset();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            alert("Error adding customer. Please try again.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from Customers
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    // Fixed: Use querySelector to find the table body since there's no id="customer-data"
    let currentTable = document.querySelector("table tbody");
    
    if (!currentTable) {
        console.error("Could not find table body");
        return;
    }

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    // Server returns customerID, firstName, lastName based on your query
    idCell.innerText = newRow.id;
    firstNameCell.innerText = newRow.first;
    lastNameCell.innerText = newRow.last;
    phoneCell.innerText = newRow.phone;
    emailCell.innerText = newRow.email;
    
    // Add delete button (handled by separate delete_customer.js file)
    let deleteButton = document.createElement("BUTTON");
    deleteButton.className = "delete-customer";
    deleteButton.setAttribute("data-id", newRow.id);
    deleteButton.innerText = "Delete";
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Update the select dropdown for updates
    let selectMenu = document.querySelector("select[name='update_customer_id']");
    if (selectMenu) {
        let option = document.createElement("option");
        option.text = `#${newRow.id} — ${newRow.first} ${newRow.last}`;
        option.value = newRow.id;
        selectMenu.appendChild(option);
    }
}
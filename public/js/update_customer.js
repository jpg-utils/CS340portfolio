// Get the objects we need to modify
let updateCustomers = document.getElementById('update_customer_form');

// Modify the objects we need
updateCustomers.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("update_customer_id");
    let inputFirstName = document.getElementById("update_customer_fname");
    let inputLastName = document.getElementById("update_customer_lname");
    let inputPhone = document.getElementById("update_customer_phone");
    let inputEmail = document.getElementById("update_customer_email");


    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;

    
    if (firstNameValue, lastNameValue, emailValue, phoneValue == '') {
        return;
    };

    // Put our data we want to send in a javascript object
    let data = {
        id:        customerIDValue,
        firstName: firstNameValue,
        lastName:  lastNameValue,
        phone:     phoneValue,
        email:     emailValue,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `/customers/${customerIDValue}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, customerIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    updateCustomers.reset();
});


function updateRow(data, customerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customer-data");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
           
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            td1.innerHTML = parsedData[0].firstName; 
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            td2.innerHTML = parsedData[0].lastName;
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            td3.innerHTML = parsedData[0].email; 
            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            td4.innerHTML = parsedData[0].phone; 
       }
       location.reload();
    }
};
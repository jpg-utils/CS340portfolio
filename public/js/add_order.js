// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Get the form element we need to modify
  const form = document.getElementById('new_purchase_form');

  // Listen for the submit event on the form
  form.addEventListener('submit', e => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Retrieve and trim the values from the form fields
    const customerID = document.getElementById('new_purchase_customer').value;
    const employeeID = document.getElementById('new_purchase_employee').value;
    const productID  = document.getElementById('new_purchase_product').value;
    const quantity   = document.getElementById('new_purchase_count').value.trim();

    // Validate that all form fields have been filled out
    if (!customerID || !employeeID || !productID || !quantity) {
      return alert('Please select a customer, employee, product and enter a quantity.');
    }

    // Build the payload object to send to the server
    const data = { customerID, employeeID, productID, quantity };

    // Set up our AJAX request using XMLHttpRequest
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/add-order', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Define the response handler for our AJAX request
    xhttp.onreadystatechange = () => {
      // Check if the request is complete
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          // On success: Reload the page to update the order list
          location.reload();
        } else {
          // If an error occurred, log the error and alert the user
          console.error('Error adding order:', xhttp.responseText);
          alert('Error placing order. Please try again.');
        }
      }
    };

    // Send the JSON payload to the server
    xhttp.send(JSON.stringify(data));
  });
});

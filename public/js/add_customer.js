// {{!--Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, General Debugging, generating basic JS pattern for collecting form fields and posting. Adapted. 5/27}}

// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Get the form element we need to modify
  const form = document.getElementById('create_customer_form');

  // Listen for the submit event on the form
  form.addEventListener('submit', e => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Retrieve and trim the values from the form fields
    const first = document.getElementById('create_customer_fname').value.trim();
    const last = document.getElementById('create_customer_lname').value.trim();
    const phone = document.getElementById('create_customer_phone').value.trim();
    const email = document.getElementById('create_customer_email').value.trim();

    // Validate that all form fields have been filled out
    if (!first || !last || !phone || !email) {
      return alert('Please fill in all fields.');
    }

    // Build the payload object to send to the server
    const payload = { first, last, phone, email };

    // Set up our AJAX request using XMLHttpRequest
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/add-customer', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Define the response handler for our AJAX request
    xhttp.onreadystatechange = () => {
      // Check if the request is complete
      if (xhttp.readyState === 4) {
        if (xhttp.status === 201) {
          // On success: Add the new customer to the table and reset the form
          addRowToTable(xhttp.responseText);
          form.reset();
        } else {
          // If an error occurred, alert the user
          alert('Error adding customer. Please try again.');
        }
      }
    };

    // Send the JSON payload to the server
    xhttp.send(JSON.stringify(payload));
  });
});

/**
 * Adds a new customer row to the table using the server's JSON response.
 * @param {string} json
 */
function addRowToTable(json) {
  // Parse the JSON response into an array of customer records
  const rows = JSON.parse(json);

  // Get the most recently added customer
  const cust = rows[rows.length - 1];

  // Find the table body where customer rows are appended
  const tbody = document.querySelector('#customers-table tbody');

  // Create a new table row element and attach the customer ID as a data attribute
  const tr = document.createElement('tr');
  tr.dataset.value = cust.id;

  // Populate the row with the customer's data and a delete button
  tr.innerHTML = `
    <td>${cust.id}</td>
    <td>${cust.first}</td>
    <td>${cust.last}</td>
    <td>${cust.phone}</td>
    <td>${cust.email}</td>
    <td><button class="delete-customer" data-id="${cust.id}">Delete</button></td>
  `;

  // Append the new row to the table body in the DOM
  tbody.appendChild(tr);

  // Update the customer update dropdown list, if it exists in the DOM
  const sel = document.querySelector('select[name="update_customer_id"]');
  if (sel) {
    // Create a new option element for the newly added customer
    const opt = document.createElement('option');
    opt.value = cust.id;
    opt.text  = `#${cust.id} — ${cust.first} ${cust.last}`;
    // Add the new option into the select menu
    sel.appendChild(opt);
  }
}

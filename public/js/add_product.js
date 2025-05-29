// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Get the form element we need to modify
  const form = document.getElementById('create_product_form');

  // Listen for the submit event on the form
  form.addEventListener('submit', e => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Retrieve and trim the values from the form fields
    const name  = document.getElementById('create_product_name').value.trim();
    const type  = document.getElementById('create_product_type').value.trim();
    const price = document.getElementById('create_product_price').value.trim();

    // Validate that all form fields have been filled out
    if (!name || !type || !price) {
      return alert('Please fill in all fields.');
    }

    // Build the payload object to send to the server
    const payload = { name, type, price };

    // Set up our AJAX request using XMLHttpRequest
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/add-product', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Define the response handler for our AJAX request
    xhttp.onreadystatechange = () => {
      // Check if the request is complete
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          // On success: Add the new product to the table and reset the form
          addRowToTable(xhttp.responseText);
          form.reset();
        } else {
          // If an error occurred, alert the user
          alert('Error adding product. Please try again.');
        }
      }
    };

    // Send the JSON payload to the server
    xhttp.send(JSON.stringify(payload));
  });
});

/**
 * Adds a new product row to the table using the server's JSON response.
 * @param {string} json
 */
function addRowToTable(json) {
  // Parse the JSON response into an array of product records
  const rows = JSON.parse(json);

  // Get the most recently added product (assumed to be the last object)
  const prod = rows[rows.length - 1];

  // Find the table body where product rows are appended
  const tbody = document.querySelector('#products-table tbody');

  // Create a new table row element and attach the product ID as a data attribute
  const tr = document.createElement('tr');
  tr.dataset.value = prod.id;

  // Populate the row with the product's data and a delete button
  tr.innerHTML = `
    <td>${prod.name}</td>
    <td>${prod.type}</td>
    <td>${prod.price}</td>
    <td><button class="delete-product" data-id="${prod.id}">Delete</button></td>
  `;

  // Append the new row to the table body in the DOM
  tbody.appendChild(tr);

  // Update the product update dropdown list, if it exists in the DOM
  const sel = document.querySelector('select[name="update_product_id"]');
  if (sel) {
    // Create a new option element for the newly added product
    const opt = document.createElement('option');
    opt.value = prod.id;
    opt.text  = `#${prod.id} — ${prod.name}`;
    // Add the new option into the select menu
    sel.appendChild(opt);
  }
}

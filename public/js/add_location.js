// {{!-- Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging, 5/27}}

// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Get the form element we need to modify
  const form = document.getElementById('create_location_form');

  // Listen for the submit event on the form
  form.addEventListener('submit', e => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Retrieve and trim the values from the form fields
    const branch  = document.getElementById('create_location_branch').value.trim();
    const address = document.getElementById('create_location_address').value.trim();
    const city    = document.getElementById('create_location_city').value.trim();
    const state   = document.getElementById('create_location_state').value.trim();
    const phone   = document.getElementById('create_location_phone').value.trim();

    // Validate that all form fields have been filled out
    if (!branch || !address || !city || !state || !phone) {
      return alert('Please fill in all fields.');
    }

    // Build the payload object to send to the server
    const data = { branch, address, city, state, phone };

    // Set up our AJAX request using XMLHttpRequest
    const x = new XMLHttpRequest();
    x.open('POST', '/add-location', true);
    x.setRequestHeader('Content-Type', 'application/json');

    // Define the response handler for our AJAX request
    x.onreadystatechange = () => {
      // Check if the request is complete and successful
      if (x.readyState === 4 && x.status === 200) {
        // On success: Add the new location row to the table and reset the form
        addRowToTable(x.responseText);
        form.reset();
      } else if (x.readyState === 4) {
        // If an error occurred, alert the user
        alert('Error adding location.');
      }
    };

    // Send the JSON payload to the server
    x.send(JSON.stringify(data));
  });
});

/**
 * Adds a new location row to the table using the server's JSON response.
 * @param {string} json - The JSON string representing an array of location objects.
 */
function addRowToTable(json) {
  // Parse the JSON response into an array of location records
  const rows = JSON.parse(json);

  // Get the most recently added location (assumed to be the last object)
  const loc = rows[rows.length - 1];

  // Find the table body where location rows are appended
  const tbody = document.querySelector('table tbody');

  // Create a new table row element and attach the location ID as a data attribute
  const tr = document.createElement('tr');
  tr.dataset.value = loc.id;

  // For each key we want to display, create a table cell and populate it with the location's data
  ['id', 'branch', 'address', 'city', 'state', 'phone'].forEach(key => {
    const td = document.createElement('td');
    td.innerText = loc[key] || '';
    tr.appendChild(td);
  });

  // Populate additional cells with a "View Inventory" link and a delete button
  tr.insertAdjacentHTML('beforeend', `
    <td><a href="/inventory/${loc.id}">View Inventory</a></td>
    <td><button class="delete-location" data-id="${loc.id}">Delete</button></td>
  `);

  // Append the new row to the table body in the DOM
  tbody.appendChild(tr);

  // Update the location update dropdown list, if it exists in the DOM
  const upd = document.querySelector('#update_location_id');
  if (upd) {
    // Create a new option element for the newly added location
    const opt = document.createElement('option');
    opt.value = loc.id;
    opt.text  = `#${loc.id} — ${loc.branch}`;
    // Add the new option into the select menu
    upd.appendChild(opt);
  }
}

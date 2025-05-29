// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Get the form element we need to modify
  const form = document.getElementById('create_employee_form');

  // Listen for the submit event on the form
  form.addEventListener('submit', async e => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Retrieve and trim the values from the form fields
    const first  = document.getElementById('create_employee_fname').value.trim();
    const last   = document.getElementById('create_employee_lname').value.trim();
    const role   = document.getElementById('create_employee_role').value;
    const active = document.getElementById('create_employee_active').value;
    const phone  = document.getElementById('create_employee_phone').value.trim();
    const locID  = document.getElementById('create_employee_site').value;

    // Validate that all form fields have been filled out
    if (!first || !last || !role || active === '' || !phone || !locID) {
      return alert('Please fill in all fields.');
    }

    // Build the payload object to send to the server
    const payload = { first, last, role, active, phone, locID };

    // Set up our AJAX request
    const res = await fetch('/add-employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Check if the response from the server is not OK
    if (!res.ok) {
      return alert('Error adding employee.');
    }

    // Parse JSON response into an array of employee objects
    const rows = await res.json();

    // Get the most recently added employee
    const emp = rows[rows.length - 1];

    // Find the table body where employee rows are appended
    const tbody = document.querySelector('table tbody');

    // Create a new table row element and attach the employee ID as a data attribute
    const tr = document.createElement('tr');
    tr.dataset.value = emp.id;
    tr.dataset.locationid = emp.locationID;

    // Populate the row with the employee's data and a delete button
    tr.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.first}</td>
      <td>${emp.last}</td>
      <td>${emp.role}</td>
      <td>${emp.active}</td>
      <td>${emp.phone}</td>
      <td>${emp.branch}</td>
      <td><button class="delete-employee" data-id="${emp.id}">Delete</button></td>
    `;

    // Append the new row to the table body in the DOM
    tbody.appendChild(tr);

    // Update the employee update dropdown list, if it exists in the DOM
    const upd = document.getElementById('update_employee_id');
    // Create a new option element for the newly added employee
    const opt = document.createElement('option');
    opt.value = emp.id;
    opt.text  = `#${emp.id} — ${emp.first} ${emp.last}`;
    // Add the new option into the select menu
    upd.appendChild(opt);

    // Reset the form fields after successful submission
    form.reset();
  });
});

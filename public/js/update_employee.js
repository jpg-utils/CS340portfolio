// Get the objects we need to modify
const form  = document.getElementById('update_employee_form');
const sel   = document.getElementById('update_employee_id');
const roleI = document.getElementById('update_employee_role');
const actI  = document.getElementById('update_employee_active');
const phoneI= document.getElementById('update_employee_phone');
const siteI = document.getElementById('update_employee_site');

// When an employee is selected, prefill the form fields
sel.addEventListener('change', () => {
  const id = sel.value;
  // Find the table row with that data-value
  const row = document.querySelector(`tr[data-value='${id}']`);
  if (!row) return;
  const cells = row.querySelectorAll('td');
  roleI.value  = cells[3].innerText;
  actI.value   = cells[4].innerText;
  phoneI.value = cells[5].innerText;
  siteI.value  = row.dataset.locationid;
});

// Handle the form submission
form.addEventListener('submit', async e => {
  e.preventDefault();

  const id     = sel.value;
  const role   = roleI.value;
  const active = actI.value;
  const phone  = phoneI.value.trim();
  const locID  = siteI.value;

  // Condition check: validate that all fields have been filled
  if (!id || !role || active === '' || !phone || !locID) {
    alert('Please fill in all fields.');
    return;
  }

  // Prepare the payload to match what the server expects, and send the PUT request
  const res = await fetch('/put-employee', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, role, active, phone, locID })
  });
  if (res.status !== 204) {
    return alert('Error updating employee.');
  }

  // Immediately update the table row in-place with the new employee details
  const row = document.querySelector(`tr[data-value='${id}']`);
  const cells = row.querySelectorAll('td');
  // Overwrite each changed cell
  cells[3].innerText = role;
  cells[4].innerText = active;
  cells[5].innerText = phone;
  
  // Get the new branch text from the site <select> and update the branch cell
  const branchText = siteI.selectedOptions[0].text;
  cells[6].innerText = branchText;
  
  // Update the data-locationid attribute for next time updates are made
  row.dataset.locationid = locID;

  // Clear the update form after submission
  form.reset();
});

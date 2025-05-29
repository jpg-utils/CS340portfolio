// Get the objects we need to modify
const form = document.getElementById('update_location_form');
const sel  = document.getElementById('update_location_id');
const inpA = document.getElementById('update_location_address');
const inpC = document.getElementById('update_location_city');
const inpS = document.getElementById('update_location_state');
const inpP = document.getElementById('update_location_phone');

// When a location is selected, prefill the form fields
sel.addEventListener('change', () => {
  // Find the table row with the matching data-value attribute
  const row = document.querySelector(`tr[data-value='${sel.value}']`);
  if (!row) return;
  const cells = row.querySelectorAll('td');
  inpA.value = cells[2].innerText;
  inpC.value = cells[3].innerText;
  inpS.value = cells[4].innerText;
  inpP.value = cells[5].innerText;
});

// Handle the form submission for updating a location
form.addEventListener('submit', e => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Retrieve the selected location id and trimmed values from the form inputs
  const id = sel.value;
  const address = inpA.value.trim();
  const city = inpC.value.trim();
  const state = inpS.value.trim();
  const phone = inpP.value.trim();

  // Condition check: Validate that all fields are filled
  if (!id || !address || !city || !state || !phone) {
    return alert('Please fill in all fields.');
  }

  // Send the PUT request to update the location details on the server
  fetch('/put-location', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, address, city, state, phone })
  })
  .then(r => {
    // Throw an error if the update was not successful
    if (r.status !== 204) throw new Error('Update failed');

    // Immediately update the table row with the new location details
    const row = document.querySelector(`tr[data-value='${id}']`);
    const cells = row.querySelectorAll('td');
    cells[2].innerText = address;
    cells[3].innerText = city;
    cells[4].innerText = state;
    cells[5].innerText = phone;

    // Update dropdown text remains the same, so no update is needed for it

    // Clear the update form fields after successful submission
    form.reset();
  })
  .catch(err => {
    // Log the error and alert the user if the update fails
    console.error(err);
    alert('Error updating location.');
  });
});

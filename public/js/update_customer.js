
// Get the objects we need to modify
const updateForm = document.getElementById('update_customer_form');
const selectCustomer = updateForm.querySelector('select[name="update_customer_id"]');
const inputFirst = document.getElementById('update_customer_fname');
const inputLast = document.getElementById('update_customer_lname');
const inputPhone = document.getElementById('update_customer_phone');
const inputEmail = document.getElementById('update_customer_email');

// When a customer is selected, prefill the form fields
selectCustomer.addEventListener('change', () => {
  const id = selectCustomer.value;
  // Find the table row with that data-value
  const row = document.querySelector(`tr[data-value='${id}']`);
  if (!row) return;
  const cells = row.querySelectorAll('td');
  inputFirst.value = cells[1].innerText;
  inputLast.value = cells[2].innerText;
  inputPhone.value = cells[3].innerText;
  inputEmail.value = cells[4].innerText;
});

// Handle the form submission
updateForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const id = selectCustomer.value;
  const firstNameValue = inputFirst.value.trim();
  const lastNameValue = inputLast.value.trim();
  const phoneValue = inputPhone.value.trim();
  const emailValue = inputEmail.value.trim();

// Condition check, validates all fields
if (!id || !firstNameValue || !lastNameValue || !phoneValue || !emailValue) {
    alert('Please select a customer and fill in all fields.');
    return;
  }

  // Prepare the payload to match what the server expects
  const data = { id, firstNameValue, lastNameValue, phoneValue, emailValue };

  // Send the PUT request
  fetch('/put-customer', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(resp => {
      if (resp.status === 204) {
        // Update the table row in-place
        const row = document.querySelector(`tr[data-value='${id}']`);
        const cells = row.querySelectorAll('td');
        cells[1].innerText = firstNameValue;
        cells[2].innerText = lastNameValue;
        cells[3].innerText = phoneValue;
        cells[4].innerText = emailValue;

        // Update the dropdown text
        const option = selectCustomer.querySelector(`option[value='${id}']`);
        option.text = `#${id} — ${firstNameValue} ${lastNameValue}`;

        // Clear form
        updateForm.reset();
      } else {
        alert('Update failed. Please try again.');
      }
    })
    .catch(err => {
      console.error('Error updating customer:', err);
      alert('Error updating customer. Check console.');
    });
});
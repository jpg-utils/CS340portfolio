// {{!-- Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging, 5/27}}

// Get the objects we need to modify
const updateForm    = document.getElementById('update_product_form');
const selectProduct = updateForm.querySelector('select[name="update_product_id"]');
const inputName     = document.getElementById('update_product_name');
const inputType     = document.getElementById('update_product_type');
const inputPrice    = document.getElementById('update_product_price');

// When a product is selected, prefill the form fields
selectProduct.addEventListener('change', () => {
  const id = selectProduct.value;
  // Find the table row with that data-value
  const row = document.querySelector(`tr[data-value='${id}']`);
  if (!row) return;
  const cells = row.querySelectorAll('td');
  // cells[0] is name, [1] is type, [2] is price
  inputName.value  = cells[0].innerText;
  inputType.value  = cells[1].innerText;
  inputPrice.value = cells[2].innerText;
});

// Handle the form submission
updateForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const id         = selectProduct.value;
  const nameValue  = inputName.value.trim();
  const typeValue  = inputType.value.trim();
  const priceValue = inputPrice.value.trim();

  // Condition check, validates all fields
  if (!id || !nameValue || !typeValue || !priceValue) {
    alert('Please select a product and fill in all fields.');
    return;
  }

  // Prepare the payload to match what the server expects
  const data = { id, nameValue, typeValue, priceValue };

  // Send the PUT request
  fetch('/put-product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(resp => {
      if (resp.status === 204) {
        // Update the table row in-place
        const row = document.querySelector(`tr[data-value='${id}']`);
        const cells = row.querySelectorAll('td');
        cells[0].innerText = nameValue;
        cells[1].innerText = typeValue;
        cells[2].innerText = priceValue;

        // Update the dropdown text
        const option = selectProduct.querySelector(`option[value='${id}']`);
        option.text = `#${id} — ${nameValue}`;

        // Clear form
        updateForm.reset();
      } else {
        alert('Update failed. Please try again.');
      }
    })
    .catch(err => {
      console.error('Error updating product:', err);
      alert('Error updating product. Check console.');
    });
});

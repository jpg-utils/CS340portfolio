// Get the objects we need to modify
const updateForm = document.getElementById('update_orderdetail_form');
const selectDetail = updateForm.querySelector('select[name="itemId"]');
const inputQuantity = updateForm.querySelector('input[name="quantity"]');
const inputPrice = updateForm.querySelector('input[name="unitPrice"]');

// When an order detail is selected, prefill the form fields
selectDetail.addEventListener('change', () => {
  const id = selectDetail.value;
  // Find the table row with that data-value
  const row = document.querySelector(`tr[data-value='${id}']`);
  if (!row) return;
  const cells = row.querySelectorAll('td');
  inputQuantity.value = cells[7].innerText;
  inputPrice.value = cells[8].innerText;
});

// Handle the form submission
updateForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const id = selectDetail.value;
  const quantityVal = inputQuantity.value.trim();
  const unitPriceVal = inputPrice.value.trim();

  // Condition check, validates all fields
  if (!id || !quantityVal || !unitPriceVal) {
    alert('Please fill out all fields.');
    return;
  }

  // Prepare the payload and send the PUT request
  const { detailTotal, orderSubtotal, orderTax, orderTotal, orderID } =
    await fetch('/put-orderdetail', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantityVal, unitPriceVal })
    }).then(r => r.json());

  // Update the table row in-place with the new order detail values
  const row = document.querySelector(`tr[data-value='${id}']`);
  const cells = row.querySelectorAll('td');
  cells[7].innerText = quantityVal;
  cells[8].innerText = parseFloat(unitPriceVal).toFixed(2);
  cells[9].innerText = parseFloat(detailTotal).toFixed(2);
  cells[5].innerText = parseFloat(orderTotal).toFixed(2);

  // Update the dropdown option text to reflect the new quantity
  const opt = selectDetail.querySelector(`option[value='${id}']`);
  opt.text = `#${id} — ${cells[6].innerText} (Qty:${quantityVal})`;

  // If the Orders page is present, update its totals
  const orderRow = document.getElementById(`order-${orderID}`);
  if (orderRow) {
    orderRow.querySelector('.subtotal').innerText = parseFloat(orderSubtotal).toFixed(2);
    orderRow.querySelector('.tax').innerText = parseFloat(orderTax).toFixed(2);
    orderRow.querySelector('.total').innerText = parseFloat(orderTotal).toFixed(2);
  }

  // Clear the update form
  updateForm.reset();
});

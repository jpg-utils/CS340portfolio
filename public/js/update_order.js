// {{!-- Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging 5/27}}

// Get the objects we need to modify
const updateForm = document.getElementById('update_order_form');
const selOrd = updateForm.querySelector('#update_order_id');
const selCust = updateForm.querySelector('#update_order_customer');
const selEmp = updateForm.querySelector('#update_order_employee');
const inpDate = updateForm.querySelector('#update_order_estimate');
const selStat = updateForm.querySelector('#update_order_status');

// When an order is selected, prefill the form fields
selOrd.addEventListener('change', () => {
  const id = selOrd.value;
  // Find the table row with that data-value
  const row = document.getElementById(`order-${id}`);
  if (!row) return;
  // Populate the form fields using the data attributes from the table row
  selCust.value = row.dataset.customerid;
  selEmp.value = row.dataset.employeeid;
  inpDate.value = row.dataset.estimateiso;
  selStat.value = row.dataset.status;
});

// Handle the form submission
updateForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  const id = selOrd.value;
  const customer = selCust.value;
  const employee = selEmp.value;
  const estimate = inpDate.value;
  const status = selStat.value;

  // Condition check, validates all fields
  if (!id || !customer || !employee || !estimate || !status) {
    alert('Please fill out all fields.');
    return;
  }

  // Prepare the payload to match what the server expects
  const data = { id, customerID: customer, employeeID: employee, estimate, status };

  // Send the PUT request
  const res = await fetch('/put-order', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status !== 204) {
    console.error(await res.text());
    return alert('Error updating order');
  }

  // Update the table row in-place
  const row = document.getElementById(`order-${id}`);
  // Update the data attributes on the row for future reference
  row.dataset.customerid = customer;
  row.dataset.employeeid = employee;
  row.dataset.estimateiso = estimate;
  row.dataset.status = status;

  // Update the table cells:
  // 2nd/3rd cells: Extract and update customer first and last name from the dropdown text
  const custName = selCust.selectedOptions[0].text.split('—')[1].trim().split(' ');
  row.querySelector('td:nth-child(2)').innerText = custName[0];
  row.querySelector('td:nth-child(3)').innerText = custName[1];
  // 4th cell: Update employee information using the selected dropdown text
  row.querySelector('td:nth-child(4)').innerText =
    selEmp.selectedOptions[0].text.split('—')[1].trim();
  // 5th cell: Format and update the estimate date for display
  const d = new Date(estimate);
  row.querySelector('td:nth-child(5)').innerText =
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
  // 6th cell: Update the order status
  row.querySelector('td:nth-child(6)').innerText = status;

  // Clear form
  updateForm.reset();
});

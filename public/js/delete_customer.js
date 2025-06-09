// Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging, generating basic JS pattern for handling delete-button clicks and sending DELETE requests. Adapted. 5/27}}

// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Attach a click event listener to the table body to handle delete button clicks
  document.querySelector('table tbody').addEventListener('click', e => {
    // Check if the clicked element matches the delete-customer button
    if (!e.target.matches('.delete-customer')) return;

    // Retrieve the customer ID from the clicked button's data attribute
    const id = e.target.dataset.id;

    // Confirm with the user before deleting the customer
    if (!confirm('Delete this customer?')) return;

    // Send a DELETE request to the server with the customer ID
    fetch('/delete-customer', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(r => {
      // Check if the deletion was successful (HTTP status 204 means no content)
      if (r.status === 204) {
        // On success: Remove the corresponding table row from the DOM
        const row = document.querySelector(`tr[data-value='${id}']`);
        if (row) {
          row.remove();
        }
        // Also remove the corresponding option from the update dropdown, if it exists
        const opt = document.querySelector(
          `#update_customer_form select[name="update_customer_id"] option[value="${id}"]`
        );
        if (opt) {
          opt.remove();
        }
      } else {
        // If an error occurred, alert the user
        alert('Error deleting customer.');
      }
    });
  });
});

// {{!-- Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging 5/27}}

// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Attach a click event listener to all delete-order buttons
  document.querySelectorAll('.delete-order').forEach(btn => {
    btn.addEventListener('click', () => {
      // Retrieve the order ID from the clicked button's data attribute
      const orderID = btn.getAttribute('data-id');
      if (!orderID) return;
      
      // Confirm with the user before deleting the order
      if (!confirm(`Really delete order #${orderID}?`)) return;
      
      // Send a DELETE request to the server with the order ID
      fetch('/delete-order', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderID })
      })
      .then(r => {
        // Check if the deletion was successful (HTTP status 204 means no content)
        if (r.status === 204) {
          // On success: Remove the corresponding table row from the DOM
          const row = document.getElementById(`order-${orderID}`);
          if (row) row.remove();
        } else {
          // If an error occurred, alert the user
          alert('Failed to delete order.');
        }
      })
      .catch(err => {
        // Log any network errors and alert the user of the failure
        console.error('delete-order error', err);
        alert('Error deleting order.');
      });
    });
  });
});

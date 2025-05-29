// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Attach a click event listener to the table body to handle delete button clicks
  document.querySelector('table tbody').addEventListener('click', e => {
    // Check if the clicked element matches the delete-employee button
    if (!e.target.matches('.delete-employee')) return;

    // Retrieve the employee ID from the clicked button's data attribute
    const id = e.target.dataset.id;

    // Validate that an ID exists and confirm deletion with the user
    if (!id || !confirm('Delete this employee?')) return;

    // Send a DELETE request to the server with the employee ID using the fetch API
    fetch('/delete-employee', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    .then(r => {
      // Check if the deletion was successful (HTTP status 204 indicates success)
      if (r.status === 204) {
        // Remove the corresponding table row from the DOM
        const row = document.querySelector(`tr[data-value='${id}']`);
        if (row) row.remove();

        // Remove the corresponding option from the employee update dropdown, if it exists
        const opt = document.querySelector(
          `#update_employee_form select[name="update_employee_id"] option[value="${id}"]`
        );
        if (opt) opt.remove();
      } else {
        // If an error occurred on the server, alert the user
        alert('Error deleting employee. Please try again.');
      }
    })
    .catch(err => {
      // Log any network or unexpected errors and alert the user about the network error
      console.error('delete-employee error', err);
      alert('Network error deleting employee.');
    });
  });
});

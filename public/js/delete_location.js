// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Attach a click event listener to the table body to handle delete button clicks
  document.querySelector('table tbody').addEventListener('click', e => {
    // Check if the clicked element matches the delete-location button
    if (!e.target.matches('.delete-location')) return;

    // Retrieve the location ID from the clicked button's data attribute
    const id = e.target.dataset.id;

    // Confirm with the user before proceeding with the deletion
    if (!confirm('Delete this location?')) return;

    // Send a DELETE request to the server with the location ID using the fetch API
    fetch('/delete-location', {
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

        // Remove the corresponding option from the update location dropdown list, if it exists
        const opt = document.querySelector(`#update_location_id option[value='${id}']`);
        if (opt) opt.remove();
      } else {
        // If an error occurred, alert the user
        alert('Error deleting location.');
      }
    });
  });
});

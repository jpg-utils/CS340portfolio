// {{!-- Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging, 5/27}}

// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.delete-inventory').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const inventoryID = btn.dataset.id;
      if (!inventoryID) return;
      if (!confirm(`Really delete this product from the location?`)) return;

      fetch('/delete-inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: inventoryID })
      })
      .then(r => {
        if (r.status === 204) {
          const row = document.getElementById(`inventory-${inventoryID}`);
          if (row) row.remove();
        } else {
          alert('Failed to delete inventory record.');
        }
      })
      .catch(err => {
        console.error('delete-inventory error', err);
        alert('Error deleting inventory.');
      });
    });
  });
});

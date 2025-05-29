// Create
document.getElementById('create_customer_form')
  .addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    await fetch('/customers', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        create_customer_fname:  f.create_customer_fname.value,
        create_customer_lname:  f.create_customer_lname.value,
        create_customer_phone:  f.create_customer_phone.value,
        create_customer_email:  f.create_customer_email.value,
      })
    });
    window.location.reload();
  });

// Update
document.getElementById('update_customer_form')
  .addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const id = f.update_customer_id.value;
    await fetch(`/customers/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        firstName: f.update_customer_fname.value,
        lastName:  f.update_customer_lname.value,
        phone:     f.update_customer_phone.value,
        email:     f.update_customer_email.value
      })
    });
    window.location.reload();
  });

// Delete (delegated)
document.querySelectorAll('.delete-customer').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (!confirm('Delete this customer?')) return;
    await fetch(`/customers/${btn.dataset.id}`, { method: 'DELETE' });
    window.location.reload();
  });
});
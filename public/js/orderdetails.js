// CREATE
document.getElementById('create_orderdetail_form')
    .addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    await fetch('/orderdetails', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        orderId:   f.orderId.value,
        productId: f.productId.value,
        quantity:  f.quantity.value,
        unitPrice: f.unitPrice.value
    })
    });
    window.location.reload();
  });

// UPDATE
document.getElementById('update_orderdetail_form')
    .addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    await fetch(`/orderdetails/${f.itemId.value}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        quantity:  f.quantity.value,
        unitPrice: f.unitPrice.value
    })
    });
    window.location.reload();
  });

// DELETE
document.querySelectorAll('.delete-orderdetail').forEach(btn => {
    btn.addEventListener('click', async () => {
    if (!confirm('Delete this line?')) return;
    await fetch(`/orderdetails/${btn.dataset.id}`, { method:'DELETE' });
    window.location.reload();
});
});

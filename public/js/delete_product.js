// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
  // Attach a click event listener to the table body to handle delete button clicks
  document.querySelector('table tbody').addEventListener('click', e => {
    // Check if the clicked element or its ancestor is a delete-product button
    const btn = e.target.closest('button.delete-product');
    if (!btn) return;
    
    // Retrieve the product ID from the clicked button's data attribute
    const productID = btn.getAttribute('data-id');
    console.log('clicked delete, data-id =', productID);
    if (!productID) {
      console.error("No product ID found on this button.");
      return;
    }
    
    // Confirm with the user before deleting the product
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    // Send a DELETE request to the server with the product ID
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-product", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = () => {
      // Check if the request is complete
      if (xhttp.readyState === 4) {
        // Check if deletion was successful (HTTP status 204 means no content)
        if (xhttp.status === 204) {
          // On success: Remove the corresponding table row from the DOM
          const row = document.querySelector(`tr[data-value='${productID}']`);
          if (row) row.remove();
          // Also remove the corresponding option from the update product dropdown, if it exists
          const sel = document.querySelector("select[name='update_product_id']");
          if (sel) {
            const opt = sel.querySelector(`option[value='${productID}']`);
            if (opt) opt.remove();
          }
        } else {
          // If an error occurred, log the error and alert the user
          console.error("Failed to delete product:", xhttp.responseText);
          alert("Error deleting product. Please try again.");
        }
      }
    };
    // Send the DELETE request with the product ID payload
    xhttp.send(JSON.stringify({ id: productID }));
  });
});

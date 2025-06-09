// {{!-- Joshua Griep, Sean Bleyl, CS340, assistance of AI tools used. ChatGPT, general debugging, handling M:N records for DELETE. Adapted. 5/27}}

// Wait for the DOM to be fully loaded before running our code
window.addEventListener('DOMContentLoaded', () => {
    // Select all delete buttons
    const deleteButtons = document.querySelectorAll('.delete-orderdetail');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Retrieve the order‐detail ID from data-id
            const detailID = this.getAttribute('data-id');
            if (!detailID) {
                console.error("No order detail ID found for deletion.");
                return;
            }

            if (!confirm("Are you sure you want to delete this line item?")) {
                return;
            }

            // AJAX DELETE
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", "/delete-orderdetail", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 204) {
                        removeOrderdetailFromDOM(detailID);
                    } else {
                        console.error("Failed to delete order detail:", xhttp.responseText);
                        alert("Error deleting line item. Please try again.");
                    }
                }
            };
            xhttp.send(JSON.stringify({ id: detailID }));
        });
    });
});

function removeOrderdetailFromDOM(detailID) {
    // Remove the table row
    const row = document.querySelector(`tr[data-value='${detailID}']`);
    if (row) row.remove();

    // Remove the corresponding <option> from the update form
    const selectMenu = document.querySelector("#update_orderdetail_form select[name='itemId']");
    if (selectMenu) {
        const opt = selectMenu.querySelector(`option[value='${detailID}']`);
        if (opt) opt.remove();
    }
}

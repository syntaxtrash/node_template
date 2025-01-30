$(document).ready(function() {
    $(".add-to-cart-form").on("submit", handleAddToCart);
    $(".product-image").on("click", showProductImageModal);
});

/* Handles the submission of the add-to-cart form */
function handleAddToCart() {
    const form = $(this);
    const quantityInput = form.find("input[name='quantity']");
    const quantity = parseInt(quantityInput.val());

    quantityInput.val((quantity > 0) ? quantity : 1);

    $.post(form.attr("action"), form.serialize(), (result) => {
        alert(result.message);
        if (result.status) {
            quantityInput.val(1);
        }
    });

    return false;
}

/* Handle showing image in modal */
function showProductImageModal() {
    const image = $(this);
    const image_src = image.attr("src");
    const image_name = image.attr("alt");

    $("#modal-image").attr("src", image_src);
    $("#modal-image").attr("alt", image_name);
    
    $("#show-image-modal").modal("show");

    return false;
}
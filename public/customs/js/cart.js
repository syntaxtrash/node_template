$(document).ready(function() {
    $("#carts-container")
        .on("click", ".decrease-qty-btn, .increase-qty-btn", handleChangeCartQuantity)
        .on("submit", "form.update-cart-form", handleSubmitUpdateCart)
        .on("submit", "form.remove-to-cart-form", handleSubmitRemoveToCart)
        .on("submit", "form.checkout-form", handleSubmitCheckOut)
});

/* Handles the quantity change event for increase and decrease buttons. */
function handleChangeCartQuantity(){
    $(".decrease-qty-btn,.increase-qty-btn").addClass("disabled");

    const change_quantity_button = $(this);    
    const quantity_input = change_quantity_button.siblings("input[name='quantity']");
    const is_increase = change_quantity_button.hasClass("increase-qty-btn");
    const current_quantity = quantity_input.val();
    const row_field = change_quantity_button.closest("tr");

    if(is_increase){
        quantity_input.val(parseInt(quantity_input.val()) + 1);
        updateSubtotalTexts(row_field, true)
    }
    /* If minus, add checking to avoid 0 or negative quantity. */
    else if(!is_increase && current_quantity > 1){
        quantity_input.val(parseInt(quantity_input.val()) - 1);
        updateSubtotalTexts(row_field, false)
    }

    change_quantity_button.closest("form.update-cart-form").submit();
}

/* Handles the form submission for updating the cart. */
function handleSubmitUpdateCart(){
    const update_cart_form = $(this);

    $.post(update_cart_form.attr("action"), update_cart_form.serialize(), (result) => {        
        if(!result.status){
            alert(result.message);
        }

        $(".decrease-qty-btn,.increase-qty-btn").removeClass("disabled");
    });

    return false;
}

/* Handles the form submission for removing an item from the cart. */
function handleSubmitRemoveToCart(){
    const remove_to_cart_form = $(this);

    $.post(remove_to_cart_form.attr("action"), remove_to_cart_form.serialize(), (result) => {
        if(result.status){
            location.reload();
        }
        else{
            alert(result.message);
        }
    });

    return false;
}

/* Handles the form submission for checking out. */
function handleSubmitCheckOut(){
    const checkout_form = $(this);
    const order = [];
    let order_details = "Order Details:\n\n";

    $(".cart-product").each(function(){
        const product = $(this);
        const name = product.find(".name").text();
        const price = product.find(".price").text();
        const quantity = product.find("input[name='quantity']").val();
        const subtotal = product.find(".subtotal").text();
        
        order.push({name, price, quantity, subtotal});
        order_details += `${quantity} ${name.trim()} = ${subtotal}\n`;
    });
    
    order_details += `Overall Total: ${$("#overall-total").text()}`;

    $.post(checkout_form.attr("action"), checkout_form.serialize(), (result) => {
        if(result.status){
            alert(order_details);
            location.reload();
        }
        else{
            alert(result.message);
        }
    });

    return false;
}

/* Handles the updating of the subtotal text for a product row. */
function updateSubtotalTexts(row_field, is_increment){
    const product_price = parseInt(row_field.find("span.price").text());
    const subtotal_field = row_field.find("span.subtotal")
    const current_subtotal = parseInt(subtotal_field.text());
    const new_subtotal = (is_increment)
        ? current_subtotal + product_price 
        : current_subtotal - product_price;
    
    subtotal_field.text(new_subtotal);

    updateOverallTotalText(product_price, is_increment);
}

/* Handles the updating of the overall total text. */
function updateOverallTotalText(amount, is_increment){
    const overall_total_field = $("#overall-total");
    const current_overall_total = parseInt(overall_total_field.text());
    const new_overall_total = (is_increment) 
        ? current_overall_total + amount 
        : current_overall_total - amount;
    
    overall_total_field.text(new_overall_total || 0);
}
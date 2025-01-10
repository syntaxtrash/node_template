$(document).ready(function() {
    $("#cart-container")
        .on("click", ".decrease-qty-btn, .increase-qty-btn", handleChangeQuantity)
        .on("submit", "form.update-cart-form", handleSubmitUpdateCart)
        .on("submit", "form.remove-to-cart-form", handleRemoveToCart)
});

function handleChangeQuantity(){
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

function handleRemoveToCart(){
    const remove_to_cart_form = $(this);

    $.post(remove_to_cart_form.attr("action"), remove_to_cart_form.serialize(), (result) => {
        if(result.status){
            const cart_row = remove_to_cart_form.closest("tr");
            
            updateOverallTotalText(parseInt(cart_row.find("span.subtotal").text()));
            cart_row.remove();
        }
        else{
            alert(result.message);
        }

    });

    return false;
}

function updateSubtotalTexts(row_field, is_increment){
    const product_price = parseInt(row_field.find("span.price").text());
    const subtotal_field = row_field.find("span.subtotal")
    const current_subtotal = parseInt(subtotal_field.text());
    
    const new_subtotal = is_increment ? current_subtotal + product_price : current_subtotal - product_price;
    subtotal_field.text(new_subtotal);

    updateOverallTotalText(product_price, is_increment);
}

function updateOverallTotalText(amount, is_increment){
    const overall_total_field = $("#overall-total");
    const current_overall_total = parseInt(overall_total_field.text());
    const new_overall_total = is_increment ? current_overall_total + amount : current_overall_total - amount;
    
    overall_total_field.text(new_overall_total || 0);
}
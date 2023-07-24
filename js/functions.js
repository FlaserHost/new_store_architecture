const calculation = (e, currentAmount, cart) => {
    const currentItemId = +e.target.closest('.cart-item').dataset.itemId;
    const cartGet = cart.get(currentItemId);
    const itemPrice = cartGet.item_price;
    const totalCost = currentAmount * itemPrice;

    cart.set(currentItemId, {...cartGet, item_amount: currentAmount, item_total_cost: totalCost});

    e.target.parentElement.nextElementSibling.querySelector('.item-price').innerText = `${totalCost} ₽`;

    localStorage.myCart = JSON.stringify(Array.from(cart.values()));
}

const finalSumm = (cart, totalSumm) => {
    const finalSum = Array.from(cart.values()).reduce((summ, item) => summ + item.item_total_cost, 0);
    totalSumm.innerText = `Итого: ${finalSum} ₽`;
}
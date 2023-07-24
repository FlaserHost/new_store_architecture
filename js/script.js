const items = [
    {
        item_id: 1,
        item_img: 'img/mustard.jpg',
        item_title: 'Горчица',
        item_description: 'В интернет-магазине "Твой дом " вы можете купить Горчица Kuhne Дижонская острая, 250 мл недорого по цене 289р.. Также ознакомьтесь с другими предложениям бренда Kuhne.',
        item_price: 289,
        item_amount: 1,
        item_total_cost: 289
    },
    {
        item_id: 2,
        item_img: 'img/mayonnaise.jpg',
        item_title: 'Майонез',
        item_description: 'Самое то, чтобы заправить пельмени',
        item_price: 120,
        item_amount: 1,
        item_total_cost: 120
    },
    {
        item_id: 3,
        item_img: 'img/tomato.jpg',
        item_title: 'Томатная паста',
        item_description: 'Самое то, чтобы заправить вермишель',
        item_price: 90,
        item_amount: 1,
        item_total_cost: 90
    },
    {
        item_id: 4,
        item_img: 'img/jam.jpg',
        item_title: 'Малиновый джем',
        item_description: 'Ярко-алый, густой, с вкраплениями мякоти сочных ягод и малиновых косточек — таков натуральный джем торговой марки «Махеевъ», приготовленный без консервантов и ароматизаторов. Джем расфасован в стеклянные стаканчики, подходящие для подачи к столу.',
        item_price: 220,
        item_amount: 1,
        item_total_cost: 220
    },
    {
        item_id: 5,
        item_img: 'img/hop-suneli.jpg',
        item_title: 'Хмели-сунели',
        item_description: 'Ароматная приправа, состоящая из высушенных и мелко измельчённых пряностей. Традиционно используется на территории Закавказья, главным образом в грузинской и абхазской кухне',
        item_price: 319,
        item_amount: 1,
        item_total_cost: 319
    },
];

document.addEventListener('DOMContentLoaded', () => {
    const showcaseLayout = document.querySelector('.showcase');
    const showcase = items.map((item, index) => `<article class="item item-${item.item_id}" id="item-${item.item_id}">
        <div class="info-wrapper">
            <div class="face">
                <div class="logo">
                    <img src="${item.item_img}" alt="${item.item_img}">
                </div>
            </div>
            <div class="details">
                <h2 class="item-title">${item.item_title}</h2>
                <p class="item-description">${item.item_description}</p>
            </div>
        </div>
        <div class="btn-place btn-place-${index}" data-item-number="${index}" data-item-id="${item.item_id}">
            <div class="price">
                <span class="item-price">${item.item_price} ₽</span>
            </div>
            <span class="item-added">Товар добавлен в корзину</span>
        </div>
    </article>`);

    showcase.forEach(item => showcaseLayout.insertAdjacentHTML('beforeend', item));

    const modalWindow = document.querySelector('.modal-cart-window');
    const cartBtn = document.getElementById('cart-btn');
    const itemsAmounts = document.querySelector('.items-amount');

    const cart = new Map();
    document.querySelectorAll('.btn-place').forEach(place => {
        const addToCart = document.createElement('button');
        addToCart.classList.add('add-to-cart-btn');
        addToCart.innerText = 'Добавить в корзину';

        addToCart.addEventListener('click', e => {
            const currentItemNumber = e.target.parentElement.dataset.itemNumber;

            const addedNotice = e.target.parentElement.querySelector('.item-added');
            addedNotice.style.display = 'none';
            addedNotice.style.display = 'flex';
            e.target.style.display = 'none';

            cart.set(items[currentItemNumber].item_id, items[currentItemNumber]);
            localStorage.myCart = JSON.stringify(Array.from(cart.values()));
            itemsAmounts.innerText = cart.size;
            cartBtn.style.display = 'flex';
        });

        place.insertAdjacentElement('beforeend', addToCart);
    });

    if (localStorage.myCart) {
        const myCart = JSON.parse(localStorage.myCart);

        myCart.forEach(item => {
            cart.set(item.item_id, item);
            const savedBtnPlace = document.querySelector(`[data-item-id="${item.item_id}"]`);
            const itemAdded = savedBtnPlace.querySelector('.item-added');
            savedBtnPlace.querySelector('.add-to-cart-btn').style.display = 'none';
            itemAdded.style.display = 'none';
            itemAdded.style.display = 'flex';
        });

        itemsAmounts.innerText = cart.size;
        cartBtn.style.display = 'flex';
    }

    const totalSumm = document.getElementById('cart-total');

    cartBtn.addEventListener('click', e => {
        e.currentTarget.style.display = 'none';
        document.body.style.overflow = 'hidden';

        document.querySelector('.modal-cart-window').style.display = 'flex';
        const cartItems = Array.from(cart.values()).map(item => `
        <article class="cart-item" data-item-id="${item.item_id}">
            <figure class="item-logo">
                <img src="${item.item_img}" alt="${item.item_title}">
            </figure>
            <h3 class="item-title">${item.item_title}</h3>
            <div class="item-controls">
                <button class="item-control-btn" type="button">-</button>
                <input class="item-amount-field" type="number" value="${item.item_amount}">
                <button class="item-control-btn" type="button">+</button>
            </div>
            <div class="price">
                <span class="item-price">${item.item_total_cost} ₽</span>
            </div>
            <div class="item-remover">
                <button class="delete-btn" type="button">
                    <img class="trash" src="img/trash.svg" alt="Удалить">                
                </button>
            </div>
        </article>
    `);

        const cartBody = `<div class="cart-body">${cartItems.join('')}</div>`;
        document.querySelector('.modal-cart > .modal-title').insertAdjacentHTML('afterend', cartBody);

        const itemControls = document.querySelectorAll('.item-controls');
        itemControls.forEach(itemControl => {
            itemControl.addEventListener('click', e => {
                if (e.target.classList.contains('item-control-btn')) {
                    const currentSign = e.target.innerText;
                    const amountField = e.target.parentElement.querySelector('.item-amount-field');
                    let currentAmount = +amountField.value;

                    if (currentSign === '+') {
                        currentAmount++;
                    } else {
                        if (currentAmount > 1) {
                            currentAmount--;
                        }
                    }

                    amountField.value = currentAmount;
                    calculation(e, currentAmount, cart);
                    finalSumm(cart, totalSumm);
                }
            });

            itemControl.addEventListener('change', e => {
                const currentAmount = e.target.value;

                if (currentAmount >= 1) {
                    calculation(e, currentAmount, cart);
                    finalSumm(cart, totalSumm);
                } else {
                    calculation(e, 1, cart);
                    e.target.value = 1;
                    finalSumm(cart, totalSumm);
                }
            });
        });

        const delBtns = document.querySelectorAll('.delete-btn');
        delBtns.forEach(btn => btn.addEventListener('click', e => {
            const currentParent = e.currentTarget.closest('.cart-item');
            const currentTitle = currentParent.querySelector('.item-title').innerText;
            const agreed = confirm(`Удалить товар "${currentTitle}" из корзины?`);

            if (agreed) {
                const currentItemId = +currentParent.dataset.itemId;
                const showcaseItem = document.getElementById(`item-${currentItemId}`);
                cart.delete(currentItemId);
                localStorage.myCart = JSON.stringify(Array.from(cart.values()));
                currentParent.remove();
                showcaseItem.querySelector('.item-added').style.display = 'none';
                showcaseItem.querySelector('.add-to-cart-btn').style.display = 'block';
                itemsAmounts.innerText = cart.size;
                finalSumm(cart, totalSumm);

                if (cart.size === 0) {
                    const cartBody = document.querySelector('.cart-body');
                    modalWindow.style.display = 'none';
                    cartBtn.style.display = 'none';
                    cartBody.remove();
                    localStorage.removeItem('myCart');
                }
            }
        }));

        finalSumm(cart, totalSumm);
    });

    document.getElementById('close-cross').addEventListener('click', () => {
        const cartBody = document.querySelector('.cart-body');
        modalWindow.style.display = 'none';
        cartBody.remove();
        cartBtn.style.display = 'flex';
        document.body.removeAttribute('style');
    });
});

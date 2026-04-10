let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCart();

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    let totalItems = 0;
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="text-muted small px-2">Cart is empty</p>`;
        cartTotal.textContent = "Total: $0.00";
        cartCount.textContent = 0;
        return;
    }

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartItems.innerHTML += `
            <li class="d-flex justify-content-between align-items-center px-2 mb-2">
                <span class="small" style="max-width: 150px;">${item.title} (x${item.quantity})</span>
                <span class="small fw-bold">$${itemTotal.toFixed(2)}</span>
                <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${index})">✕</button>
            </li>
        `;
    });
    const myArray = JSON.stringify(cart);
    localStorage.setItem("cart", myArray);

    cartItems.innerHTML += `
        <hr>
        <div class="px-2 pb-2">
            <button class="btn btn-sm btn-outline-danger w-100" onclick="clearCart()">Clear Cart</button>
        </div>
    `;

    cartCount.textContent = totalItems;
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
    localStorage.removeItem("cart");
}

fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        data.products.forEach(product => {
            const card = `
                <div class="col mb-5">
                    <div class="card h-100">
                        <img class="card-img-top p-3" src="${product.thumbnail}" style="height: 250px; object-fit: contain;" />
                        <div class="card-body p-4">
                            <div class="text-center">                            
                                <h5 class="fw-bolder">${product.title}</h5>
                                <p class="text-muted small">${product.category}</p>
                                <p class="small-desc text">${product.description}</p>
                                <p class="fw-bold">$${product.price}</p>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <div class="d-flex justify-content-center align-items-center mb-2">
                                    <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="decrease">-</button>
                                    <span class="mx-3 quantity-display" data-quantity="1">1</span>
                                    <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="increase">+</button>
                                </div>
                                <a href="#" class="btn btn-outline-dark mt-auto add-to-cart"
                                    data-title="${product.title}"
                                    data-price="${product.price}">
                                    Add to cart
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("product-container").innerHTML += card;
        });

        document.querySelectorAll(".quantity-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const card = button.closest(".card");
                const quantityDisplay = card.querySelector(".quantity-display");
                let quantity = parseInt(quantityDisplay.getAttribute("data-quantity"));
                
                if (button.getAttribute("data-action") === "increase") {
                    quantity++;
                } else if (button.getAttribute("data-action") === "decrease" && quantity > 1) {
                    quantity--;
                }
                
                quantityDisplay.textContent = quantity;
                quantityDisplay.setAttribute("data-quantity", quantity);
            });
        });

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const card = button.closest(".card");
                const quantityDisplay = card.querySelector(".quantity-display");
                const quantity = parseInt(quantityDisplay.getAttribute("data-quantity"));
                
                const title = button.getAttribute("data-title");
                const price = parseFloat(button.getAttribute("data-price"));
                
                const existingItem = cart.find(item => item.title === title);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        title: title,
                        price: price,
                        quantity: quantity
                    });
                }
                updateCart();
            });
        });
    });


document.getElementById("order-form").addEventListener("submit", function(e) {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById("name").value.trim();
    const nameRegex = /^[a-zA-zåäöÅÄÖ\s]+$/;

    if (name.length < 2 || name.length > 50 || !nameRegex.test(name)) {
        document.getElementById("name-error").textContent = "Name must be between 2 and 50 characters and only contain letters. ";
        valid = false;
    } else {
        document.getElementById("name-error").textContent = "";
    }

    const phone = document.getElementById("phone").value.trim();
    const phoneRegex = /^[0-9\-()\s]{1,20}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById("phone-error").textContent = "Phone can only contain numbers, dashes and parentheses. Max 20 characters.";
        valid = false;
    } else {
        document.getElementById("phone-error").textContent = "";
    }

    const email = document.getElementById("email").value.trim();
    if (!email.includes("@") || email.length > 50) {
        document.getElementById("email-error").textContent = "Email must contain @ and be max 50 characters.";
        valid = false;
    } else {
        document.getElementById("email-error").textContent = "";
    }

    const street = document.getElementById("street").value.trim();
    if (street.length < 2 || street.length > 50) {
        document.getElementById("street-error").textContent = "Street address must be between 2 and 50 characters.";
        valid = false;
    } else {
        document.getElementById("street-error").textContent = "";
    }

    const postal = document.getElementById("postal").value.trim();
    const postalRegex = /^\d{5}$/;
    if (!postalRegex.test(postal)) {
        document.getElementById("postal-error").textContent = "Postal code must be exactly 5 digits.";
        valid = false;
    } else {
        document.getElementById("postal-error").textContent = "";
    }

    const city = document.getElementById("city").value.trim();
    if (city.length < 2 || city.length > 20) {
        document.getElementById("city-error").textContent = "City must be between 2 and 20 characters.";
        valid = false;
    } else {
        document.getElementById("city-error").textContent = "";
    }

    if (cart.length === 0) {
        alert("Please add at least one product to your cart first!");
        valid = false;
    }

    if (valid) {
        alert("Order placed successfully!");
        cart = [];
        updateCart();
        document.getElementById("order-form").reset();
    }
});

//localStorage.setItem("test", "Hej Manolis!");
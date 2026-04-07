let cart = [];

// Använder en dropdown funktion för själva carten kolla på denna!
function updateCart() {
    var cartItems = document.getElementById("cart-items");
    var cartCount = document.getElementById("cart-count");
    var cartTotal = document.getElementById("cart-total");

    // Uppdatera siffran på varukorgs-ikonen
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        // Om tom
        cartItems.innerHTML = '<p class="text-muted small px-2">Cart is empty</p>';
        cartTotal.textContent = "Total: $0.00";
    } 
    else {
        // Om det finns något: hämta den sista produkten som lades till
        var lastItem = cart[cart.length - 1];

        // Visa bara den produkten (ingen loop behövs)
        cartItems.innerHTML = '<li class="px-2 small">' + lastItem.title + ' - $' + lastItem.price + '</li>';
        
        // Uppdatera priset direkt från produkten
        cartTotal.textContent = "Total: $" + lastItem.price;
    }
}

// Fetch products (Hur API nyckeln läggs in) 
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {
// Hur själva "kortet ska se ut alltså hur produkterna ska synas (ÄNDRA DESCRIPTION) Gör den "kortare" via substring"
        products.forEach(product => {
            const card = `
                <div class="col mb-5">
                    <div class="card h-100">
                        <img class="card-img-top p-3" src="${product.image}" style="height: 250px; object-fit: contain;" />
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

        // Add to cart funktionen ( kolla här) 
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                cart.push({
                    title: button.getAttribute("data-title"),
                    price: parseFloat(button.getAttribute("data-price"))
                });
                updateCart();
            });
        });
    });

// Skapar själva Formen här ( Kolla hur denna fungerar)
// Varje del är för formen kan ha gjort fel på några delar men använde mig av att göra "samma sak" på alla
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
   // ÄNDRA DENNA!! Den vill att man ska skriva 5 digits på rad utan mellanslag men postkod har väl mellanslag? 
   // Kolla om ni kan fixa borde vara andra raden i  denna kod
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
// Denna är en pop up som sker när väl allt har skrivits in i formen och en place order har skett! 
// Ganska tråkig kanske bör göra lite roligare! : ) 
    if (valid) {
        alert("Order placed successfully!");
        cart = [];
        updateCart();
        document.getElementById("order-form").reset();
    }
});
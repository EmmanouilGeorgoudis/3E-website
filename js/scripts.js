let hasProduct = false;

function addToCart(name, price) {

    if (hasProduct === true) {
        return;
    }

    document.getElementById("cart-items").innerHTML = `<li>${name} - $${price}</li>`;
    document.getElementById("cart-total").textContent = "Total: $" + price;
    document.getElementById("cart-count").textContent = "1";
    
    hasProduct = true;
}

fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {
        products.forEach(product => {
            // Här kortar vi ner beskrivningen och titeln direkt i templaten
            const shortTitle = product.title.substring(0, 20);
            const shortDesc = product.description.substring(0, 50) + "...";

            const card = `
                <div class="col mb-5">
                    <div class="card h-100">
                        <img class="card-img-top p-3" src="${product.image}" style="height: 250px; object-fit: contain;" />
                        <div class="card-body p-4">
                            <div class="text-center">                            
                                <h5 class="fw-bolder">${shortTitle}</h5>
                                <p class="text-muted small">${product.category}</p>
                                <p class="small">${shortDesc}</p>
                                <p class="fw-bold">$${product.price}</p>
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center">
                                <button class="btn btn-outline-dark mt-auto" 
                                    onclick="addToCart('${product.title.replace(/'/g, "\\'")}', ${product.price})">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById("product-container").innerHTML += card;
        });
        // Vi behöver inte document.querySelectorAll(".add-to-cart") längre 
        // eftersom vi använder onclick direkt på knappen ovan.
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
if (hasProduct === false) {
        alert("Please add at least one product to your cart first!");
        valid = false;
    }
    if (valid) {
        alert("Order placed successfully!");
        
        hasProduct = false; 
        
        document.getElementById("cart-items").innerHTML = `<p class="text-muted small px-2">Cart is empty</p>`;
        document.getElementById("cart-count").textContent = "0";
        document.getElementById("cart-total").textContent = "Total: $0.00";
        
        document.getElementById("order-form").reset();
    }
});
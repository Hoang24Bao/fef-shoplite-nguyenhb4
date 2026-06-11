
const cartTableBody = document.querySelector("#cart-table-body");
const cartContentArea = document.querySelector("#cart-content-area");
const cartStatus = document.querySelector("#cart-status");

const renderCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];

    if (localCart.length === 0) {
        cartStatus.innerHTML = `
            <div class="py-5">
                <p class="lead text-muted mb-4">Your cart is currently empty!</p>
                <a href="index.html" class="btn btn-primary px-4 py-2">Back to Home</a>
            </div>
        `;
        cartContentArea.classList.add("d-none");
        return;
    }

    cartStatus.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Synchronizing and calculating your cart total...</p>
    `;

    try {
        const allProducts = await fetchAPI("/products");
        cartStatus.innerHTML = "";
        cartContentArea.classList.remove("d-none");

        let sumInvoice = 0;

        const htmlRows = localCart.map(cartItem => {
            const matchedProduct = allProducts.find(p => p.id === cartItem.id);

            if (!matchedProduct) return "";

            const lineTotal = matchedProduct.price * cartItem.quantity;
            sumInvoice += lineTotal;

            const isDisabled = cartItem.quantity <= 1 ? "disabled" : "";

            return `
                <tr>
                    <td data-label="Product">
                        <div class="d-flex align-items-center text-start cart-product-wrapper">
                            <img src="${matchedProduct.image}" class="cart-item-img me-2" alt="${matchedProduct.title}">
                            <span class="fw-bold cart-item-title">${matchedProduct.title}</span>
                        </div>
                    </td>
                    <td data-label="Price">$${matchedProduct.price.toFixed(2)}</td>
                    <td data-label="Quantity">
                        <div class="input-group input-group-sm">
                            <button onclick="changeQty(${cartItem.id}, -1)" class="btn btn-outline-secondary" type="button" ${isDisabled}>-</button>
                            <input type="text" class="form-control text-center bg-white" value="${cartItem.quantity}" readonly>
                            <button onclick="changeQty(${cartItem.id}, 1)" class="btn btn-outline-secondary" type="button">+</button>
                        </div>
                    </td>
                    <td data-label="Total" class="fw-bold">$${lineTotal.toFixed(2)}</td>
                    <td data-label="Action">
                        <button onclick="deleteItem(${cartItem.id})" class="btn btn-sm btn-danger">Remove</button>
                    </td>
                </tr>
            `;
        }).join("");

        cartTableBody.innerHTML = htmlRows;

        document.querySelector("#cart-subtotal").textContent = `$${sumInvoice.toFixed(2)}`;
        document.querySelector("#cart-total-price").textContent = `$${sumInvoice.toFixed(2)}`;

    } catch (error) {
        cartStatus.innerHTML = `
            <div class="alert alert-danger">
                An error occurred while loading cart data!
            </div>
        `;
    }
};

const changeQty = (productId, delta) => {
    let cart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];
    const targetItem = cart.find(item => item.id === productId);

    if (targetItem) {
        if (delta === -1 && targetItem.quantity <= 1) {
            return; 
        }

        targetItem.quantity += delta;
    }

    localStorage.setItem("shoplite_cart", JSON.stringify(cart));
    updateNavbarCartCount();
    renderCart();
};

const deleteItem = (productId) => {
    let cart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem("shoplite_cart", JSON.stringify(cart));
    updateNavbarCartCount();
    renderCart();
};

document.addEventListener("DOMContentLoaded", renderCart);
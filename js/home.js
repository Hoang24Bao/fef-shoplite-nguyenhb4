
const productGrid = document.querySelector("#product-grid");
const productStatus = document.querySelector("#product-status");

const loadProducts = async () => {
    productStatus.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading products, please wait...</p>
    `;
    
    try {
        const products = await fetchAPI("/products");
        productStatus.innerHTML = "";
        
        if (products.length === 0) {
            productStatus.textContent = "No products found.";
            return;
        }

        const htmlCards = products.map(product => {
            return `
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm">
                        <img src="${product.image}" class="card-img-top product-card-img" alt="${product.title}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-truncate" title="${product.title}">${product.title}</h5>
                            <p class="card-text text-success fw-bold mt-auto">$${product.price.toFixed(2)}</p>
                            <div class="d-grid gap-2 mt-3">
                                <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                                <button onclick="addToCart(${product.id})" class="btn btn-primary btn-sm">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
        
        productGrid.innerHTML = htmlCards;
        
    } catch (error) {
        productStatus.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Unable to connect to the server. Please check your internet connection.
            </div>
        `;
    }
};

const addToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem("shoplite_cart", JSON.stringify(cart));
    updateNavbarCartCount();
    alert("Product added to cart successfully!");
};

document.addEventListener("DOMContentLoaded", loadProducts);
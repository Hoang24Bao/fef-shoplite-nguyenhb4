const detailArea = document.querySelector("#product-detail-area");
const detailStatus = document.querySelector("#detail-status");

const loadProductDetail = async () => {
    const urlParameters = new URLSearchParams(window.location.search);
    const productId = urlParameters.get("id");
    
    if (!productId) {
        detailStatus.innerHTML = `<div class="alert alert-warning">Invalid product ID!</div>`;
        return;
    }
    
    detailStatus.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading product details...</p>
    `;
    
    try {
        const product = await fetchAPI(`/products/${productId}`);
        detailStatus.innerHTML = "";
        detailArea.classList.remove("d-none");
        
        detailArea.innerHTML = `
            <div class="col-12 col-md-6 text-center">
                <img src="${product.image}" class="img-fluid rounded p-4 shadow-sm" style="max-height: 450px;" alt="${product.title}">
            </div>
            <div class="col-12 col-md-6 d-flex flex-column justify-content-center">
                <span class="badge bg-secondary align-self-start mb-2 text-uppercase">${product.category}</span>
                <h1 class="h2 fw-bold mb-3">${product.title}</h1>
                <p class="h3 text-success fw-bold mb-4">$${product.price.toFixed(2)}</p>
                <hr>
                <h5 class="fw-bold">Product Description:</h5>
                <p class="text-muted mb-4">${product.description}</p>
                <div class="mb-4">
                    <span class="text-warning fw-bold">★ ${product.rating ? product.rating.rate : 'N/A'}</span> 
                    <span class="text-secondary ms-2">
                        (${product.rating ? product.rating.count : 0} reviews)
                    </span>
                </div>
                <button onclick="addSingleProductToCart(${product.id})" class="btn btn-primary btn-lg px-4 py-2 col-12 col-md-6">
                    Add to Cart
                </button>
            </div>
        `;
    } catch (error) {
        detailStatus.innerHTML = `
            <div class="alert alert-danger">
                Product not found or unable to load product data!
            </div>
        `;
    }
};

const addSingleProductToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem("shoplite_cart", JSON.stringify(cart));
    updateNavbarCartCount();
    alert("Item added to cart successfully!");
};

document.addEventListener("DOMContentLoaded", loadProductDetail);
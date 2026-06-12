
const productGrid = document.querySelector("#product-grid");
const productStatus = document.querySelector("#product-status");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-select");

let originalProducts = []; 

const renderProductGrid = (productsToDisplay) => {
    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = `
            <div class="col-12 text-center my-5 py-3">
                <p class="lead text-muted">☹ No products found matching your filter criteria!</p>
            </div>
        `;
        return;
    }

    const htmlCards = productsToDisplay.map(product => {
        return `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card h-100 shadow-sm border-0 bg-white">
                    <img src="${product.image}" class="card-img-top product-card-img" alt="${product.title}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-light text-secondary align-self-start mb-2 text-uppercase" style="font-size: 0.7rem;">${product.category}</span>
                        <h5 class="card-title h6 fw-bold" title="${product.title}">${product.title}</h5>
                        <p class="card-text text-success fw-bold mt-auto mb-0">$${product.price.toFixed(2)}</p>
                        <div class="d-grid gap-2 mt-3">
                            <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm">Details</a>
                            <button onclick="addToCart(${product.id})" class="btn btn-primary btn-sm">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    productGrid.innerHTML = htmlCards;
};

const initializeApp = async () => {
    productStatus.innerHTML = `
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Connecting to ShopLite catalog...</p>
    `;
    
    try {
        const [productsData, categoriesData] = await Promise.all([
            fetchAPI("/products"),
            fetchAPI("/products/categories")
        ]);

        originalProducts = productsData;
        productStatus.innerHTML = ""; 

        categoriesData.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
            categorySelect.appendChild(option);
        });

        renderProductGrid(originalProducts);

    } catch (error) {
        productStatus.innerHTML = `
            <div class="alert alert-danger shadow-sm d-inline-block" role="alert">
                🚀 Server maintenance or Internet connection lost. Please try again later!
            </div>
        `;
    }
};

const filterProductsHandler = () => {
    const keyword = searchInput.value.toLowerCase().trim(); // Standardize lowercase and trim extra spaces [Chapter 3]
    const selectedCategory = categorySelect.value;

    const filteredResult = originalProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(keyword);

        const matchesCategory = (selectedCategory === "all") || (product.category === selectedCategory);

        return matchesSearch && matchesCategory;
    });

    renderProductGrid(filteredResult);
};


searchInput.addEventListener("input", filterProductsHandler);

categorySelect.addEventListener("change", filterProductsHandler);

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

document.addEventListener("DOMContentLoaded", initializeApp);
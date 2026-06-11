const API_BASE_URL = "https://fakestoreapi.com";

const fetchAPI = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`Network Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Fetch API error at endpoint ${endpoint}:`, error);
        throw error;
    }
};

const updateNavbarCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("shoplite_cart")) || [];
    const totalItems = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);
    
    const cartBadge = document.querySelector("#cart-badge");
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
};

document.addEventListener("DOMContentLoaded", updateNavbarCartCount);
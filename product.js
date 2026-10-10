const productId = Number(new URLSearchParams(window.location.search).get('id'));
const product = products.find(item => item.id === productId);
const details = document.getElementById('product-details');

if (!product) {
    details.innerHTML = `
        <div class="product-not-found">
            <h1>Product not found</h1>
            <p>This product could not be found.</p>
            <a href="index.html#products">Return to products</a>
        </div>
    `;
} else {
    document.title = `${product.name} | Nexora`;

    details.innerHTML = `
        <div class="product-details">
            <div class="product-preview">
                <span class="product-preview-icon">${product.icon}</span>
            </div>

            <div class="product-information">
                <span class="product-brand">${product.brand}</span>
                <span class="product-detail-tag">${product.tag}</span>
                <h1>${product.name}</h1>
                <p class="product-description">${product.description}</p>
                <div class="product-detail-price">${formatPrice(product.price)}</div>
                <button class="product-detail-buy" id="product-buy">
                    Add to Basket
                </button>
            </div>
        </div>
    `;

    document.getElementById('product-buy').addEventListener('click', () => {
        const user = localStorage.getItem('nexora-user');

        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        let cart = [];

        try {
            cart = JSON.parse(localStorage.getItem('nexora-cart') || '[]');
        } catch {
            cart = [];
        }

        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('nexora-cart', JSON.stringify(cart));

        const button = document.getElementById('product-buy');
        button.textContent = 'Added to Basket ✓';

        setTimeout(() => {
            button.textContent = 'Add to Basket';
        }, 1500);
    });
}
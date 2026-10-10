
const products = [
    {
        id: 1,
        name: 'Apple iPhone 16',
        brand: 'Apple',
        price: 699,
        icon: '📱',
        description: '6.1-inch OLED display, A18 chip, 48 MP camera.',
        tag: 'Popular',
        category: 'Smartphones'
    },
    {
        id: 2,
        name: 'Samsung Galaxy S25 Ultra',
        brand: 'Samsung',
        price: 1199,
        icon: '📱',
        description: 'Premium Android smartphone with S Pen and advanced cameras.',
        tag: 'Flagship',
        category: 'Smartphones'
    },
    {
        id: 3,
        name: 'Xiaomi 15',
        brand: 'Xiaomi',
        price: 799,
        icon: '📱',
        description: 'Flagship performance, Leica cameras and AMOLED display.',
        tag: 'Bestseller',
        category: 'Smartphones'
    },
    {
        id: 4,
        name: 'Apple iPhone 16 Pro',
        brand: 'Apple',
        price: 899,
        icon: '📱',
        description: 'ProMotion display, A18 Pro chip and advanced camera system.',
        tag: 'Pro',
        category: 'Smartphones'
    },
    {
        id: 5,
        name: 'Samsung Galaxy A56 5G',
        brand: 'Samsung',
        price: 399,
        icon: '📱',
        description: 'Super AMOLED display, 5G connectivity and versatile cameras.',
        tag: 'Value pick',
        category: 'Smartphones'
    },
    {
        id: 6,
        name: 'Xiaomi Redmi Note 14 Pro 5G',
        brand: 'Xiaomi',
        price: 299,
        icon: '📱',
        description: 'AMOLED display, 200 MP main camera and fast charging.',
        tag: 'Popular',
        category: 'Smartphones'
    },
    {
        id: 7,
        name: 'Apple MacBook Air 13 M4',
        brand: 'Apple',
        price: 999,
        icon: '💻',
        description: 'Lightweight laptop with Apple M4 chip and Liquid Retina display.',
        tag: 'Featured',
        category: 'Laptops'
    },
    {
        id: 8,
        name: 'ASUS ROG Zephyrus G16',
        brand: 'ASUS',
        price: 1899,
        icon: '💻',
        description: 'Gaming laptop with high-refresh-rate display and dedicated graphics.',
        tag: 'Gaming',
        category: 'Laptops'
    },
    {
        id: 9,
        name: 'Lenovo Legion 5',
        brand: 'Lenovo',
        price: 1299,
        icon: '💻',
        description: 'Performance laptop designed for gaming and demanding applications.',
        tag: 'Gaming',
        category: 'Laptops'
    },
    {
        id: 10,
        name: 'Apple iPad Air M3',
        brand: 'Apple',
        price: 599,
        icon: '📲',
        description: 'Powerful tablet with Liquid Retina display and Apple Pencil support.',
        tag: 'New',
        category: 'Tablets'
    },
    {
        id: 11,
        name: 'Samsung Galaxy Tab S10+',
        brand: 'Samsung',
        price: 999,
        icon: '📲',
        description: 'Large AMOLED tablet with S Pen support and multitasking features.',
        tag: 'Premium',
        category: 'Tablets'
    },
    {
        id: 12,
        name: 'Xiaomi Pad 7',
        brand: 'Xiaomi',
        price: 399,
        icon: '📲',
        description: 'High-resolution display, powerful processor and productivity features.',
        tag: 'Value pick',
        category: 'Tablets'
    },
    {
        id: 13,
        name: 'Apple AirPods 4',
        brand: 'Apple',
        price: 129,
        icon: '🎧',
        description: 'Wireless earbuds with spatial audio and USB-C charging case.',
        tag: 'Popular',
        category: 'Audio'
    },
    {
        id: 14,
        name: 'Sony WH-1000XM5',
        brand: 'Sony',
        price: 299,
        icon: '🎧',
        description: 'Over-ear wireless headphones with active noise cancellation.',
        tag: 'Bestseller',
        category: 'Audio'
    },
    {
        id: 15,
        name: 'Samsung Galaxy Watch7',
        brand: 'Samsung',
        price: 249,
        icon: '⌚',
        description: 'Smartwatch with fitness tracking and health monitoring features.',
        tag: 'Smart choice',
        category: 'Wearables'
    },
    {
        id: 16,
        name: 'Apple Watch Series 10',
        brand: 'Apple',
        price: 399,
        icon: '⌚',
        description: 'Slim smartwatch with fitness tracking and an Always-On Retina display.',
        tag: 'Premium',
        category: 'Wearables'
    }
];


const state = {
    cart: JSON.parse(localStorage.getItem('nexora-cart') || '[]'),
    user: JSON.parse(localStorage.getItem('nexora-user') || 'null')
};

const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const userStatus = document.getElementById('user-status');
const signinButton = document.getElementById('signin-button');
const signoutButton = document.getElementById('signout-button');
const modal = document.getElementById('auth-modal');
const closeModal = document.getElementById('close-modal');
const signinForm = document.getElementById('signin-form');
const checkoutButton = document.getElementById('checkout-button');
const heroSignin = document.getElementById('hero-signin');

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

function renderProducts() {
    productGrid.innerHTML = products.map((product) => `
        <article class="product-card">
            <a class="product-card-link" href="product.html?id=${product.id}">
                <div class="product-image" aria-label="${product.name}">${product.icon}</div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span class="product-tag">${product.tag}</span>
                </div>
            </a>
            <div class="product-meta">
                <button class="buy-button" data-product-id="${product.id}">Buy</button>
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.buy-button').forEach((button) => {
        button.addEventListener('click', () => {
            addToCart(Number(button.dataset.productId));
        });
    });
}

function addToCart(productId) {
    if (!state.user) {
        openModal();
        return;
    }

    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const existing = state.cart.find((item) => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('nexora-cart', JSON.stringify(state.cart));
    renderCart();
}

function renderCart() {
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Your basket is empty.</li>';
        cartCount.textContent = '0';
        totalPrice.textContent = '$0.00';
        localStorage.setItem('nexora-cart', JSON.stringify(state.cart));
        return;
    }

    cartItems.innerHTML = state.cart.map((item) => `
        <li class="cart-item">
            <div class="cart-item-info">
                <span>${item.name} × ${item.quantity}</span>
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
            <button
                class="cart-remove-button"
                data-remove-id="${item.id}"
                aria-label="Remove ${item.name}"
                title="Remove product"
            >×</button>
        </li>
    `).join('');

    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = String(
        state.cart.reduce((sum, item) => sum + item.quantity, 0)
    );

    totalPrice.textContent = formatPrice(total);
    localStorage.setItem('nexora-cart', JSON.stringify(state.cart));

    document.querySelectorAll('.cart-remove-button').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = Number(button.dataset.removeId);
            state.cart = state.cart.filter((item) => item.id !== productId);
            renderCart();
        });
    });
}

function updateHeader() {
    if (state.user) {
        const profileName = state.user.email.split('@')[0];
        userStatus.textContent = `Signed in as ${profileName}`;
        signinButton.classList.add('hidden');
        signoutButton.classList.remove('hidden');
    } else {
        userStatus.textContent = 'Guest';
        signinButton.classList.remove('hidden');
        signoutButton.classList.add('hidden');
    }
}

function openModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const validUsers = {
        'demo@nexora.com': 'demo123',
        'admin@nexora.com': 'admin123',
        'user@nexora.com': '123456'
    };

    if (validUsers[email] && validUsers[email] === password) {
        state.user = { email };
        localStorage.setItem('nexora-user', JSON.stringify(state.user));
        updateHeader();
        signinForm.reset();
        closeAuthModal();
        return;
    }

    alert('Invalid email or password. Use the demo account shown in the form.');
}

function signOut() {
    state.user = null;
    localStorage.removeItem('nexora-user');
    updateHeader();
    renderCart();
}

function handleCheckout() {
    if (!state.user) {
        openModal();
        return;
    }

    if (state.cart.length === 0) {
        alert('Your basket is empty. Please choose a product first.');
        return;
    }

    const orderTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`Thank you for your purchase, ${state.user.email}! Your total is ${formatPrice(orderTotal)}.`);
    state.cart = [];
localStorage.setItem('nexora-cart', JSON.stringify(state.cart));
renderCart();
}

signinButton.addEventListener('click', openModal);
heroSignin.addEventListener('click', openModal);
closeModal.addEventListener('click', closeAuthModal);
modal.addEventListener('click', (event) => {
    if (event.target === modal) closeAuthModal();
});

signoutButton.addEventListener('click', signOut);
signinForm.addEventListener('submit', handleSignIn);
checkoutButton.addEventListener('click', handleCheckout);

renderProducts();
renderCart();
updateHeader();

const themeButton = document.querySelector("#theme-button");

function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    themeButton.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeButton.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark-theme")
        ? "light"
        : "dark";

    applyTheme(newTheme);
});

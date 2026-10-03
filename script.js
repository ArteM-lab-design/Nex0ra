const products = [
    {
        id: 1,
        name: 'Smart Speaker Pro',
        price: 99,
        icon: '🔊',
        description: 'Voice assistant, rich sound, smart home control.',
        tag: 'Bestseller'
    },
    {
        id: 2,
        name: 'Air Purifier Mini',
        price: 149,
        icon: '🌬️',
        description: 'Compact purifier for bedrooms, offices, and small spaces.',
        tag: 'New'
    },
    {
        id: 3,
        name: 'Smart Lamp Plus',
        price: 79,
        icon: '💡',
        description: 'Adjustable lighting with app control and motion detection.',
        tag: 'Popular'
    },
    {
        id: 4,
        name: 'Portable Charger X',
        price: 59,
        icon: '🔋',
        description: 'Fast charging power bank with USB-C and wireless support.',
        tag: 'Top rated'
    },
    {
        id: 5,
        name: 'Wi-Fi Security Cam',
        price: 179,
        icon: '📷',
        description: 'Motion alerts, night vision, and full HD live recording.',
        tag: 'Secure'
    },
    {
        id: 6,
        name: 'Thermostat Smart',
        price: 129,
        icon: '🌡️',
        description: 'Energy-saving temperature control for every room.',
        tag: 'Eco'
    }
];

const state = {
    cart: [],
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
            <div class="product-image" aria-label="${product.name}">${product.icon}</div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <span class="product-price">${formatPrice(product.price)}</span>
            </div>
            <p>${product.description}</p>
            <div class="product-meta">
                <span class="product-tag">${product.tag}</span>
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

    renderCart();
}

function renderCart() {
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">Your basket is empty.</li>';
        cartCount.textContent = '0';
        totalPrice.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = state.cart.map((item) => `
        <li>
            <span>${item.name} × ${item.quantity}</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </li>
    `).join('');

    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = String(state.cart.reduce((sum, item) => sum + item.quantity, 0));
    totalPrice.textContent = formatPrice(total);
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


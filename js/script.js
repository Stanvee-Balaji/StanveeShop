

// ── BASE URL ──
const BASE_URL = 'https://api.stanveeshop.com';

// const BASE_URL = 'https://api.stanveeshop.com';



// ── CART CACHE (instant paint, corrected after fetch) ──
const CART_CACHE_KEY = 'sv_cart_cache';

function saveCartCache({ count }) {
    try {
        localStorage.setItem(CART_CACHE_KEY, JSON.stringify({ count, ts: Date.now() }));
    } catch (e) {}
}

function readCartCache() {
    try {
        const raw = localStorage.getItem(CART_CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

// ── SLIDER ──
let currentSlide = 0;
const totalSlides = 5;
let sliderTimer;

function updateSlider() {
    document.querySelectorAll('.slider-slide').forEach((s, i) => {
        s.classList.toggle('active', i === currentSlide);
    });
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetTimer();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetTimer();
}

function goSlide(n) {
    currentSlide = n;
    updateSlider();
    resetTimer();
}

function resetTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(nextSlide, 5000);
}

sliderTimer = setInterval(nextSlide, 5000);

// ── CATEGORIES DROPDOWN ──
function toggleCat() {
    const d = document.getElementById('catDropdown');
    const a = document.getElementById('catArrow');
    if (!d) return;
    const open = d.classList.toggle('open');
    if (a) a.textContent = open ? '▴' : '▾';
}
document.addEventListener('click', function(e) {
    const wrap = document.querySelector('.cat-btn-wrap');
    if (wrap && !wrap.contains(e.target)) {
        const d = document.getElementById('catDropdown');
        const a = document.getElementById('catArrow');
        if (d) d.classList.remove('open');
        if (a) a.textContent = '▾';
    }
});

// ── MOBILE MENU ──
function toggleMobileMenu() {
    const menu = document.getElementById('mobileNavMenu');
    const btn = document.getElementById('mobileMenuBtn');
    const open = menu.classList.toggle('open');
    btn.textContent = open ? '✕' : '☰';
}

// ── MOBILE SEARCH ──
function toggleMobileSearch() {
    const row = document.getElementById('mobileSearchRow');
    const btn = document.getElementById('mobileSearchBtn');
    const open = row.classList.toggle('open');
    btn.textContent = open ? '✕' : '🔍';
    if (open) document.getElementById('mobileSearch').focus();
}

function clearMobileSearch() {
    document.getElementById('mobileSearch').value = '';
    document.getElementById('mobileSearchRow').classList.remove('open');
    document.getElementById('mobileSearchBtn').textContent = '🔍';
}


// ── SEARCH REDIRECT ──
['desktopSearch', 'mobileSearch'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            window.location.href = 'shop.html?search=' + encodeURIComponent(this.value.trim());
        }
    });
});

// ── STAR ICONS (5 stars) ──
function starsHTML(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += i <= rating ?
            '<img src="src/assets/star_icon.svg" alt="★" onerror="this.outerHTML=\'<span style=color:#f59e0b>★</span>\'">' :
            '<img src="src/assets/star_dull_icon.svg" alt="☆" onerror="this.outerHTML=\'<span style=color:#d1d5db>★</span>\'">';
    }
    return s;
}

// ── PRODUCT CARD HTML ──
// ── CART PRODUCT IDs (string ids added this session) ──
const cartedProducts = new Set();
let cartedNumericIds = []; // kept for backward-compat, holds product_id strings now

// ── PRODUCT STRING-ID → NUMERIC DB ID MAP (built when products load) ──
const productIdMap = {}; // e.g. { "802205": 134 }

function resolveCartedProducts() {
    // Reset first — otherwise removed items stay stuck as "Go to Cart"
    cartedProducts.clear();

    if (cartedNumericIds.length) {
        cartedNumericIds.forEach(pid => {
            cartedProducts.add(String(pid));
        });
    }
    updateCartButtons();
}

// ── FETCH USER'S EXISTING CART ON PAGE LOAD ──
async function fetchUserCart() {
    // Always reset local cart state before re-checking, so removed items
    // don't stay stuck as "Go to Cart" when we come back to this page.
    cartedProducts.clear();
    cartedNumericIds = [];
    const raw = localStorage.getItem('stanveeUser');
    if (!raw) return; // guest — nothing to mark

    let userId;
    try {
        userId = JSON.parse(raw).loginid;
    } catch (e) {
        return;
    }
    if (!userId) return;

    try {
        const res = await fetch(`${BASE_URL}/api/cart/${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.cartItems)) {
            cartedNumericIds = data.cartItems.map(item => item.productId);

            // Update the badge too, same source of truth as everywhere else
            const badge = document.getElementById('cartCount');
            if (badge) badge.textContent = data.cartItems.length;
            saveCartCache({ count: data.cartItems.length });

            // Resolve against productIdMap — if products already loaded, this
            // marks buttons immediately; if not, resolveCartedProducts() is
            // re-run at the end of loadProducts() once the map is built.
            resolveCartedProducts();
        }
    } catch (err) {
        console.error('[Cart] Failed to fetch user cart:', err);
    }
}

function updateCartButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.product-add-btn');
        if (!btn) return;
        const onclick = btn.getAttribute('onclick') || '';
        const match = onclick.match(/addToCart\('([^']+)'\)/);
        if (match && cartedProducts.has(match[1])) {
            btn.classList.add('go-to-cart-btn');
            btn.setAttribute('onclick', "event.stopPropagation();window.location.href='cart.html'");
            btn.innerHTML = '🛒 Go to Cart';
        }
    });
}

function productCardHTML(p, currency) {
    const img = p.image;
    const catSlug = (Array.isArray(p.category) && p.category[0] ? p.category[0] : 'product')
        .toLowerCase().replace(/\s+/g, '-');
    const url = `product_details.html?id=${p.product_id}&cat=${catSlug}`;
    const inCart = cartedProducts.has(p.product_id);
    const btnHTML = inCart ?
        `<button class="product-add-btn go-to-cart-btn" onclick="event.stopPropagation();window.location.href='cart.html'">
             🛒 Go to Cart
           </button>` :
        `<button class="product-add-btn" onclick="event.stopPropagation();addToCart('${p.product_id}')">
             <img src="src/assets/add_icon.svg" alt="" onerror="this.style.display='none'"/> Add to cart
           </button>`;
    return `
    <div class="product-card" onclick="window.location.href='${url}'">
      <div class="product-card-img">
        <img src="${img}" alt="${p.product_name}" loading="lazy"/>
      </div>
      <div class="product-card-body">
       
        <p class="product-name">${p.product_name}</p>
        <div class="product-price-row">
          <span class="offer-price">${currency}${p.offer_price}</span>
          <span class="orig-price">${currency}${p.mrp}</span>
        </div>
        ${p.max_points_utilization > 0 ? `<div class="points-badge">Discount Point ${p.max_points_utilization}</div>` : ''}
        ${btnHTML}
      </div>
    </div>`;
}

// ── LOAD PRODUCTS FROM API ──
const CURRENCY = '₹';
async function loadProducts() {
    try {
        const allGrid = document.getElementById('allProductsGrid');
        const homeGrid = document.getElementById('homeEssGrid');

        // "All Products" now shows featured products; Home Essentials unchanged (same BASE_URL)
        const [allRes, homeRes] = await Promise.all([
            fetch(`${BASE_URL}/api/products/featured?sortBy=productName&sortDir=asc&page=0&size=10`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }),
            fetch(`${BASE_URL}/api/products/categories/Home%20Essentials/products?size=10`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
        ]);

        const [allData, homeData] = await Promise.all([allRes.json(), homeRes.json()]);

        // Build productIdMap from all products returned
        [...(allData.data || []), ...(homeData.data || [])].forEach((p, index) => {
            productIdMap[p.product_id] = p.id || (index + 1);
        });

        // Render all products grid
        if (allData.status === 'success' && allData.data && allData.data.length) {
            allGrid.innerHTML = allData.data.map(p => productCardHTML(p, CURRENCY)).join('');
        } else {
            allGrid.innerHTML = '<p style="color:#6b7280;padding:16px">No products found.</p>';
        }

        // Render home essentials grid
        if (homeData.status === 'success' && homeData.data && homeData.data.length) {
            homeGrid.innerHTML = homeData.data.map(p => productCardHTML(p, CURRENCY)).join('');
        } else {
            homeGrid.innerHTML = '<p style="color:#6b7280;padding:16px">No products found.</p>';
        }

        // productIdMap is now built — resolve any cart items that arrived earlier
        resolveCartedProducts();
        updateCartButtons();

    } catch (err) {
        console.error('Failed to load products:', err);
        document.getElementById('allProductsGrid').innerHTML = '<p style="color:#ef4444;padding:16px">Failed to load products.</p>';
        document.getElementById('homeEssGrid').innerHTML = '<p style="color:#ef4444;padding:16px">Failed to load products.</p>';
    }
}
loadProducts();
fetchUserCart();

// ── ALWAYS REFETCH WHEN THIS PAGE IS SHOWN (fresh load OR back/forward) ──
// Not gating on event.persisted: some browsers silently disable bfcache
// (e.g. if any script on the page has an unload listener), in which case
// persisted is false even on a Back navigation, and the refetch would
// never fire. Always refetching here costs one harmless extra call on
// the very first load, but guarantees it works on every Back/Forward.
window.addEventListener('pageshow', function() {
    loadProducts();
    fetchUserCart();
});

// ── ADD TO CART ──
// Returns a Promise so callers (like the post-login flow) can `await` it
// instead of navigating away while the request is still in flight.
function addToCart(productStringId) {
    // Stanvee login stores the user object (with loginid) in localStorage
    const raw = localStorage.getItem('stanveeUser');
    if (!raw) {
        // remember which product the guest wanted, so we can auto-add it
        // right after they log in from this same modal
        sessionStorage.setItem('sv_pending_cart_product', productStringId);
        sessionStorage.setItem('sv_redirect_to_cart', '1');
        showToast('Login to add to cart', true);
        openLoginModal();
        return Promise.resolve();
    }

    let userId;
    try { userId = JSON.parse(raw).loginid; } catch (e) { userId = null; }
    if (!userId) {
        sessionStorage.setItem('sv_pending_cart_product', productStringId);
        sessionStorage.setItem('sv_redirect_to_cart', '1');
        showToast('Login to add to cart', true);
        openLoginModal();
        return Promise.resolve();
    }

// productStringId is sent directly to the API, so no map lookup needed.

    return fetch(BASE_URL + '/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,       // ✅ Stanvee loginid (e.g. "SV4189392")
                productId: productStringId, // ✅ numeric DB id (Long)
                quantity: 1,
                couponSelected: false
            })
        })
        .then(r => r.json())
        .then(d => {
            if (d.success) {
                cartedProducts.add(productStringId);
                // Update button on all cards for this product
                document.querySelectorAll('.product-card').forEach(card => {
                    const btn = card.querySelector('.product-add-btn');
                    if (btn && btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${productStringId}'`)) {
                        btn.classList.add('go-to-cart-btn');
                        btn.setAttribute('onclick', "event.stopPropagation();window.location.href='cart.html'");
                        btn.innerHTML = '🛒 Go to Cart';
                    }
                });
                const badge = document.getElementById('cartCount');
                if (badge) badge.textContent = (d.cartItems || []).length;
                saveCartCache({ count: (d.cartItems || []).length });
        if (sessionStorage.getItem('sv_redirect_to_cart')) {
                    sessionStorage.removeItem('sv_redirect_to_cart');
                    sessionStorage.setItem('sv_going_to_cart', '1');
                    setTimeout(() => { window.location.href = 'cart.html'; }, 800);
                } else {
                    showToast('Added to cart ✓');
                }
            } else {
                showToast(d.message || 'Could not add to cart', true);
            }
        })
        .catch(() => showToast('Network error – try again', true));
}

// ── TOAST ──
function showToast(msg, isError) {
    let t = document.getElementById('toastEl');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toastEl';
        t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:14px;font-weight:500;z-index:9999;transition:opacity .3s;pointer-events:none';
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = isError ? '#ef4444' : '#009483';
    t.style.color = '#fff';
    t.style.opacity = '1';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
        t.style.opacity = '0';
    }, 2500);
}
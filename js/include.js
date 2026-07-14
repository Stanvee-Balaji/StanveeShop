


document.addEventListener("DOMContentLoaded", async () => {

    // Header
    const header = document.getElementById("header");
    if (header) {
        const res = await fetch("includes/header.html");
        header.innerHTML = await res.text();
    }
restoreStanveeSession();
    refreshCartCount();
    fetchAndRenderCategories();

    // Let page-specific scripts (e.g. cart.html) know the header DOM now
    // exists, so they can safely paint live wallet balances into it. Fixes
    // a race where cart.html tried to write walletR/walletO before
    // header.html had finished injecting, silently no-op'ing the update.
    document.dispatchEvent(new CustomEvent('stanveeHeaderReady'));

    // ── Highlight active nav link based on current page ──
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.desktop-nav-links a, .mobile-nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Footer
    const footer = document.getElementById("footer");
    if (footer) {
        const res = await fetch("includes/footer.html");
        footer.innerHTML = await res.text();
    }

    // ── Topbar hide-on-scroll (must run AFTER header is injected) ──
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        window.addEventListener('scroll', () => {
            const current = window.scrollY || document.documentElement.scrollTop;
            if (current > 60) {
                topbar.classList.add('topbar-hidden');
            } else {
                topbar.classList.remove('topbar-hidden');
            }
        }, { passive: true });
    }

    // NOW load script.js
    const script = document.createElement("script");
    script.src = "js/script.js";
    document.body.appendChild(script);

    // ── If we just redirected here after a successful login, show the toast ──
    const justLoggedIn = sessionStorage.getItem("stanveeJustLoggedIn");
    if (justLoggedIn) {
        sessionStorage.removeItem("stanveeJustLoggedIn");
        showToastFallback(`Welcome, ${justLoggedIn}! Login successful ✓`);
    }
});

function openLoginModal() {
    document.getElementById("loginModalOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
    hideLoginError();
}

function closeLoginModal() {
    document.getElementById("loginModalOverlay").classList.remove("open");
    document.body.style.overflow = "";
    hideLoginError();
}

function showLoginError(msg) {
    const errEl = document.getElementById("loginModalError");
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = "block";
    }
}

function hideLoginError() {
    const errEl = document.getElementById("loginModalError");
    if (errEl) {
        errEl.textContent = "";
        errEl.style.display = "none";
    }
}

function closeLoginModalOutside(e) {
    if (e.target.id === "loginModalOverlay") closeLoginModal();
}

// ── HEADER UPDATE ON LOGIN ──
function getInitials(name) {
    if (!name) return "SV";
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0])
        : parts[0].slice(0, 2);
    return initials.toUpperCase();
}

// function updateHeaderForLoggedInUser(user) {
//     const guestNav = document.getElementById("guestNav");
//     const userNav = document.getElementById("userNav");
//     const walletAmt = document.getElementById("walletAmt");
//     const profileAvatar = document.getElementById("profileAvatar");
//     const profileDropdownName = document.getElementById("profileDropdownName");
//     const profileDropdownId = document.getElementById("profileDropdownId");

//     if (guestNav) guestNav.style.display = "none";
//     if (userNav) userNav.style.display = "flex";

//     if (walletAmt) {
//         walletAmt.textContent = Number(user.rwallet || 0).toLocaleString("en-IN");
//     }

//     if (profileAvatar) {
//         profileAvatar.textContent = getInitials(user.name);
//     }

//     if (profileDropdownName) {
//         profileDropdownName.textContent = user.name || "—";
//     }

//     if (profileDropdownId) {
//         profileDropdownId.textContent = user.loginid || "—";
//     }

//     console.log("[Header] Profile updated:", { name: user.name, loginid: user.loginid });
// }

// ── PROFILE DROPDOWN TOGGLE ──

function updateHeaderForLoggedInUser(user) {
    const guestNav = document.getElementById("guestNav");
    const userNav = document.getElementById("userNav");
    const walletAmt = document.getElementById("walletAmt");
    const profileAvatar = document.getElementById("profileAvatar");
    const profileDropdownName = document.getElementById("profileDropdownName");
    const profileDropdownId = document.getElementById("profileDropdownId");

    // new wallet elements
    const walletR = document.getElementById("walletR");
    const walletE = document.getElementById("walletE");
    const walletH = document.getElementById("walletH");
    const walletO = document.getElementById("walletO");

    if (guestNav) guestNav.style.display = "none";
    if (userNav) userNav.style.display = "flex";

    // walletAmt is the small top badge next to the cart icon — it must
    // show the COMBINED total (Shopping + WOW), same as the dropdown
    // breakdown below it. Previously this used rwallet alone, so the
    // badge showed only the Shopping Wallet portion while the dropdown
    // correctly showed both — the mismatch seen in the screenshots.
    const combinedWalletTotal = Number(user.rwallet || 0) + Number(user.owallet || 0);
    if (walletAmt) {
        walletAmt.textContent = combinedWalletTotal.toLocaleString("en-IN");
    }

    // Login-payload wallet numbers are shown ONLY as an instant-paint
    // placeholder — cart.html's refreshWalletBalances() (GetBalance API)
    // overwrites these with the live, authoritative balance right after.
    if (walletR) walletR.textContent = "₹" + Number(user.rwallet || 0).toLocaleString("en-IN");
    if (walletE) walletE.textContent = "₹" + Number(user.ewallet || 0).toLocaleString("en-IN");
    if (walletH) walletH.textContent = "₹" + Number(user.hwallet || 0).toLocaleString("en-IN");
    if (walletO) walletO.textContent = "₹" + Number(user.owallet || 0).toLocaleString("en-IN");

    if (profileAvatar) {
        profileAvatar.textContent = getInitials(user.name);
    }

    if (profileDropdownName) {
        profileDropdownName.textContent = user.name || "—";
    }

    if (profileDropdownId) {
        profileDropdownId.textContent = user.loginid || "—";
    }

    console.log("[Header] Profile updated:", {
        name: user.name,
        loginid: user.loginid,
        rwallet: user.rwallet,
        ewallet: user.ewallet,
        hwallet: user.hwallet,
        owallet: user.owallet
    });
}

function toggleProfile() {
    const dropdown = document.getElementById("profileDropdown");
    if (dropdown) dropdown.classList.toggle("open");
}

document.addEventListener("click", function (e) {
    const wrap = document.querySelector(".profile-wrap");
    const dropdown = document.getElementById("profileDropdown");
    if (wrap && dropdown && !wrap.contains(e.target)) {
        dropdown.classList.remove("open");
    }
});

// ── RESTORE SESSION ON PAGE LOAD ──
function restoreStanveeSession() {
    const loggedIn = localStorage.getItem("stanveeLoggedIn");
    const savedUser = localStorage.getItem("stanveeUser");
    if (loggedIn === "true" && savedUser) {
        try {
            updateHeaderForLoggedInUser(JSON.parse(savedUser));
        } catch (e) {
            console.error("[Session] Failed to restore session:", e);
            localStorage.removeItem("stanveeUser");
            localStorage.removeItem("stanveeLoggedIn");
        }
    }
}

function logout() {
    localStorage.removeItem("stanveeUser");
    localStorage.removeItem("stanveeLoggedIn");
    setCartBadge(0);
    location.reload();
}

// ── Minimal toast helper available even before script.js loads ──
function showToastFallback(msg, isError) {
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
    t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

const STANVEE_API_TOKEN = "abUnMar5489pidlAewUF4875brlstangwewera4i5n6";
const STANVEE_CART_BASE = "https://api.stanvee.com/api/cart";
const STANVEE_CATEGORIES_API = "http://localhost:8080/api/products/categories";

// ── CATEGORIES DROPDOWN (dynamic) ──
async function fetchAndRenderCategories() {
    const dropdown = document.getElementById("catDropdown");
    if (!dropdown) return; // header not injected yet

    try {
        const res = await fetch(STANVEE_CATEGORIES_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.status === "success" && Array.isArray(data.data) && data.data.length > 0) {
            renderCategoryDropdown(dropdown, data.data);
        } else {
            dropdown.innerHTML = `<div class="cat-dropdown-empty">No categories found</div>`;
        }
    } catch (err) {
        console.error("[Categories] Failed to fetch categories:", err);
        dropdown.innerHTML = `<div class="cat-dropdown-empty">Couldn't load categories</div>`;
    }
}

function renderCategoryDropdown(container, categories) {
    container.innerHTML = categories.map(cat => {
        const slug = slugifyCategory(cat);
        return `<a href="javascript:void(0)" data-category="${cat}" data-slug="${slug}">${cat}</a>`;
    }).join("");

    container.querySelectorAll("a[data-category]").forEach(link => {
        link.addEventListener("click", () => {
            const category = link.getAttribute("data-category");
            window.location.href = `shop.html?category=${encodeURIComponent(category)}`;
        });
    });
}

// ── CART COUNT ──
function setCartBadge(count) {
    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = count;
}

async function refreshCartCount() {
    const savedUser = localStorage.getItem("stanveeUser");
    if (!savedUser) {
        setCartBadge(0);
        return;
    }

    let userId;
    try {
        userId = JSON.parse(savedUser).loginid;
    } catch (e) {
        setCartBadge(0);
        return;
    }

    if (!userId) {
        setCartBadge(0);
        return;
    }

    try {
        const res = await fetch(`${STANVEE_CART_BASE}/${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.cartItems)) {
            setCartBadge(data.cartItems.length);
        } else {
            setCartBadge(0);
        }
    } catch (err) {
        console.error("[Cart] Failed to fetch cart count:", err);
        // leave badge as-is on network error, don't flash to 0
    }
}

document.addEventListener("submit", async (e) => {
    if (e.target.id !== "loginModalForm") return;

    e.preventDefault();
    hideLoginError();

    const username = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const submitBtn = e.target.querySelector(".login-modal-submit");

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";
    }

    try {
        const url = `https://stanveeservices.com/CheckLogin.aspx?token=${STANVEE_API_TOKEN}&Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}&action=login`;
        const res = await fetch(url);

        if (!res.ok) {
            console.error("[Login] HTTP error:", res.status, res.statusText);
            showLoginError("Server error. Please try again later.");
            return;
        }

        const rawText = await res.text();
        console.log("[Login] Raw response:", rawText);

        let result;
        try {
            result = JSON.parse(rawText);
        } catch (parseErr) {
            console.error("[Login] JSON parse failed:", parseErr, rawText);
            showLoginError("Unexpected server response. Please try again.");
            return;
        }

        console.log("[Login] Parsed response:", result);

        const isSuccess = result.status === "SUCCESS" && result.response === "OK" && result.data;

        if (isSuccess) {
            const user = result.data;

            try {
                localStorage.setItem("stanveeUser", JSON.stringify(user));
                localStorage.setItem("stanveeLoggedIn", "true");
                // flag so index.html knows to show the welcome toast after redirect
                sessionStorage.setItem("stanveeJustLoggedIn", user.name || user.loginid);
            } catch (storageErr) {
                console.error("[Login] localStorage write failed:", storageErr);
            }

            // Update header immediately too, in case redirect is slow
            updateHeaderForLoggedInUser(user);
            refreshCartCount();

            // Show toast right away as well (visible briefly before redirect)
            showToastFallback(`Welcome, ${user.name || user.loginid}! Login successful ✓`);

            closeLoginModal();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 600); // slightly longer so the toast is visible before navigating

        } else {
            const errMsg =
                (result.data && result.data.name) ||
                result.response ||
                "Invalid Login ID or Password. Please try again.";

            console.error("[Login] Failed login attempt:", result);
            showLoginError(errMsg);
        }
    } catch (err) {
        console.error("[Login] Request/network error:", err);
        showLoginError("Something went wrong. Please check your connection and try again.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Login";
        }
    }
});



// ── PRODUCT SEARCH ──
const STANVEE_SEARCH_API = "https://api.stanvee.com/api/products/search";

let searchRequestId = 0; // tracks latest request so stale responses get ignored

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function formatPrice(num) {
    return "₹" + Number(num || 0).toLocaleString("en-IN");
}

function slugifyCategory(cat) {
    if (!cat) return "";
    return cat.toString().trim().toLowerCase().replace(/\s+/g, "-");
}

function renderSearchResults(container, products) {
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `<div class="search-no-results">No products found</div>`;
        container.classList.add("open");
        return;
    }

    container.innerHTML = products.map(p => {
        const name = p.product_name || "";
        const image = p.image || "";
        const mrp = p.mrp ? formatPrice(p.mrp) : "";
        const offerPrice = p.offer_price ? formatPrice(p.offer_price) : "";
        const hasDiscount = p.mrp && p.offer_price && Number(p.mrp) > Number(p.offer_price);
        const catSlug = slugifyCategory(p.category && p.category[0]);

        return `
            <div class="search-result-item" data-product-id="${p.product_id || ''}" data-cat="${catSlug}">
                <img src="${image}" alt="${name}" class="search-result-img" onerror="this.style.visibility='hidden'" />
                <div class="search-result-info">
                    <div class="search-result-name">${name}</div>
                    <div class="search-result-price">
                        <span class="search-result-offer">${offerPrice}</span>
                        ${hasDiscount ? `<span class="search-result-mrp">${mrp}</span>` : ""}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    container.classList.add("open");

    container.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", () => {
            const productId = item.getAttribute("data-product-id");
            const cat = item.getAttribute("data-cat");
            window.location.href = `product_details.html?id=${encodeURIComponent(productId)}&cat=${encodeURIComponent(cat)}`;
        });
    });
}

function showSearchLoader(container) {
    if (!container) return;
    container.innerHTML = `<div class="search-loading"><span class="search-spinner"></span> Searching...</div>`;
    container.classList.add("open");
}

async function performProductSearch(query, container) {
    if (!query || query.trim().length === 0) {
        if (container) {
            container.innerHTML = "";
            container.classList.remove("open");
        }
        return;
    }

    showSearchLoader(container);

    const thisRequestId = ++searchRequestId; // mark this call as the latest

    try {
        const url = `${STANVEE_SEARCH_API}?q=${encodeURIComponent(query.trim())}&page=0&size=20&sortBy=productName&sortDir=asc`;
        const res = await fetch(url);

        // If a newer search started while this one was in flight, drop this result
        if (thisRequestId !== searchRequestId) return;

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (thisRequestId !== searchRequestId) return; // double-check after JSON parse too

        if (data.status === "success" && Array.isArray(data.data)) {
            renderSearchResults(container, data.data);
        } else {
            renderSearchResults(container, []);
        }
    } catch (err) {
        if (thisRequestId !== searchRequestId) return;
        console.error("[Search] Failed to fetch search results:", err);
        if (container) {
            container.innerHTML = `<div class="search-no-results">Something went wrong. Please try again.</div>`;
            container.classList.add("open");
        }
    }
}

const debouncedDesktopSearch = debounce((val) => {
    performProductSearch(val, document.getElementById("desktopSearchResults"));
}, 400);

const debouncedMobileSearch = debounce((val) => {
    performProductSearch(val, document.getElementById("mobileSearchResults"));
}, 400);

document.addEventListener("input", (e) => {
    if (e.target.id === "desktopSearch") {
        // show loader immediately as user types, before debounce fires
        showSearchLoader(document.getElementById("desktopSearchResults"));
        debouncedDesktopSearch(e.target.value);
    } else if (e.target.id === "mobileSearch") {
        showSearchLoader(document.getElementById("mobileSearchResults"));
        debouncedMobileSearch(e.target.value);
    }
});

// Run search immediately (no debounce) when user presses Enter — "the button" trigger
document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.target.id === "desktopSearch") {
        performProductSearch(e.target.value, document.getElementById("desktopSearchResults"));
    } else if (e.target.id === "mobileSearch") {
        performProductSearch(e.target.value, document.getElementById("mobileSearchResults"));
    }
});

// Close dropdowns on outside click
document.addEventListener("click", (e) => {
    const desktopBox = document.querySelector(".desktop-search");
    const desktopResults = document.getElementById("desktopSearchResults");
    if (desktopBox && desktopResults && !desktopBox.contains(e.target)) {
        desktopResults.classList.remove("open");
    }

    const mobileRow = document.getElementById("mobileSearchRow");
    const mobileResults = document.getElementById("mobileSearchResults");
    if (mobileRow && mobileResults && !mobileRow.contains(e.target)) {
        mobileResults.classList.remove("open");
    }
});

// Clear mobile search should also clear results
function clearMobileSearch() {
    const input = document.getElementById("mobileSearch");
    const results = document.getElementById("mobileSearchResults");
    if (input) input.value = "";
    if (results) {
        results.innerHTML = "";
        results.classList.remove("open");
    }
}
// /* =========================================================================
//    app-data.js
//    -------------------------------------------------------------------------
//    This is a plain-JS stand-in for your React `AppContext` (useAppContext()).
//    It mocks: products, categories, cart, logged-in user, wallet, addresses,
//    navigation between pages, and toast notifications — so every converted
//    page works on its own without a backend.

//    WHEN YOU WIRE THIS TO YOUR REAL BACKEND:
//    - Replace `App.PRODUCTS` with data fetched from your `/api/product/list`.
//    - Replace the cart/user/address localStorage helpers with real axios
//      calls to your existing endpoints (the function names match your React
//      code: getCartCount, updateCartItem, removeFromCart, etc.) so swapping
//      the internals is a drop-in job.
//    - Replace `App.navigate()` with real route changes once these pages live
//      behind your router / server.
//    ========================================================================= */

// const App = (() => {

//   const CURRENCY = "₹";

//   /* ---------------------------------------------------------------------
//      Placeholder product images (inline SVG data-URIs — no network needed)
//   --------------------------------------------------------------------- */
//   function placeholderImage(emoji, bg) {
//     const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
//       <rect width="100%" height="100%" fill="${bg}"/>
//       <text x="50%" y="52%" font-size="150" text-anchor="middle" dominant-baseline="central">${emoji}</text>
//     </svg>`;
//     return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
//   }

//   /* ---------------------------------------------------------------------
//      Categories  (mirrors assets.js -> categories)
//   --------------------------------------------------------------------- */
//   const CATEGORIES = [
//     { text: "Vegetables", path: "vegetables", bgColor: "#E3F5E1", icon: "🥦" },
//     { text: "Fruits",     path: "fruits",     bgColor: "#FEF6DA", icon: "🍎" },
//     { text: "Dairy",      path: "dairy",      bgColor: "#E0F4FB", icon: "🥛" },
//     { text: "Bakery",     path: "bakery",     bgColor: "#F6E8DA", icon: "🥐" },
//     { text: "Grains",     path: "grains",     bgColor: "#F1E7FD", icon: "🌾" },
//     { text: "Beverages",  path: "beverages",  bgColor: "#FCE7F3", icon: "🧃" },
//     { text: "Snacks",     path: "snacks",     bgColor: "#FFE9E0", icon: "🍪" },
//   ];

//   /* ---------------------------------------------------------------------
//      Products (mirrors what /api/product/list would return)
//   --------------------------------------------------------------------- */
//   const PRODUCTS = [
//     {
//       _id: "p1", name: "Fresh Broccoli", category: "Vegetables",
//       image: [placeholderImage("🥦", "#E3F5E1"), placeholderImage("🥦", "#D7EFD3")],
//       price: 60, offerPrice: 45, couponDiscount: 5, inStock: true,
//       description: ["Farm-fresh broccoli, rich in fiber and vitamins.", "Sourced daily from local farms.", "Best stored refrigerated."]
//     },
//     {
//       _id: "p2", name: "Organic Carrots (1kg)", category: "Vegetables",
//       image: [placeholderImage("🥕", "#E3F5E1"), placeholderImage("🥕", "#D7EFD3")],
//       price: 50, offerPrice: 38, couponDiscount: 4, inStock: true,
//       description: ["Sweet, crunchy organic carrots.", "Great for juicing or roasting.", "No pesticides used."]
//     },
//     {
//       _id: "p3", name: "Red Bell Pepper", category: "Vegetables",
//       image: [placeholderImage("🫑", "#E3F5E1")],
//       price: 70, offerPrice: 55, couponDiscount: 0, inStock: false,
//       description: ["Crisp, sweet bell peppers.", "Perfect for stir-fries and salads."]
//     },
//     {
//       _id: "p4", name: "Royal Gala Apples (1kg)", category: "Fruits",
//       image: [placeholderImage("🍎", "#FEF6DA"), placeholderImage("🍎", "#FBF0C2")],
//       price: 180, offerPrice: 149, couponDiscount: 15, inStock: true,
//       description: ["Crisp and juicy gala apples.", "Hand-picked for freshness.", "Rich in fiber and antioxidants."]
//     },
//     {
//       _id: "p5", name: "Bananas (Dozen)", category: "Fruits",
//       image: [placeholderImage("🍌", "#FEF6DA")],
//       price: 60, offerPrice: 49, couponDiscount: 5, inStock: true,
//       description: ["Naturally ripened bananas.", "Great source of potassium."]
//     },
//     {
//       _id: "p6", name: "Alphonso Mango (1kg)", category: "Fruits",
//       image: [placeholderImage("🥭", "#FEF6DA"), placeholderImage("🥭", "#FBF0C2")],
//       price: 350, offerPrice: 299, couponDiscount: 20, inStock: true,
//       description: ["The king of mangoes.", "Sweet, fragrant, export-grade quality."]
//     },
//     {
//       _id: "p7", name: "Full Cream Milk (1L)", category: "Dairy",
//       image: [placeholderImage("🥛", "#E0F4FB")],
//       price: 65, offerPrice: 60, couponDiscount: 0, inStock: true,
//       description: ["Pasteurized full-cream milk.", "Sourced from local dairy farms."]
//     },
//     {
//       _id: "p8", name: "Farm Fresh Paneer (200g)", category: "Dairy",
//       image: [placeholderImage("🧀", "#E0F4FB"), placeholderImage("🧀", "#CBEAF6")],
//       price: 90, offerPrice: 79, couponDiscount: 8, inStock: true,
//       description: ["Soft, fresh paneer made daily.", "High in protein."]
//     },
//     {
//       _id: "p9", name: "Multigrain Bread", category: "Bakery",
//       image: [placeholderImage("🍞", "#F6E8DA")],
//       price: 55, offerPrice: 45, couponDiscount: 5, inStock: true,
//       description: ["Soft multigrain loaf.", "Baked fresh every morning."]
//     },
//     {
//       _id: "p10", name: "Butter Croissant (Pack of 4)", category: "Bakery",
//       image: [placeholderImage("🥐", "#F6E8DA"), placeholderImage("🥐", "#EFDCC4")],
//       price: 120, offerPrice: 99, couponDiscount: 10, inStock: true,
//       description: ["Flaky, buttery croissants.", "Best enjoyed warm."]
//     },
//     {
//       _id: "p11", name: "Basmati Rice (5kg)", category: "Grains",
//       image: [placeholderImage("🌾", "#F1E7FD")],
//       price: 450, offerPrice: 399, couponDiscount: 25, inStock: true,
//       description: ["Long-grain aged basmati rice.", "Aromatic and fluffy when cooked."]
//     },
//     {
//       _id: "p12", name: "Orange Juice (1L)", category: "Beverages",
//       image: [placeholderImage("🧃", "#FCE7F3")],
//       price: 110, offerPrice: 95, couponDiscount: 10, inStock: true,
//       description: ["100% fresh-squeezed orange juice.", "No added sugar or preservatives."]
//     },
//     {
//       _id: "p13", name: "Roasted Almonds (250g)", category: "Snacks",
//       image: [placeholderImage("🍪", "#FFE9E0"), placeholderImage("🍪", "#FFD9C8")],
//       price: 220, offerPrice: 189, couponDiscount: 15, inStock: true,
//       description: ["Lightly roasted, unsalted almonds.", "A healthy snack any time of day."]
//     },
//   ];

//   /* ---------------------------------------------------------------------
//      localStorage-backed "session" helpers (stand in for AppContext state)
//   --------------------------------------------------------------------- */
//   function read(key, fallback) {
//     try {
//       const raw = localStorage.getItem(key);
//       return raw ? JSON.parse(raw) : fallback;
//     } catch (e) { return fallback; }
//   }
//   function write(key, value) {
//     localStorage.setItem(key, JSON.stringify(value));
//   }

//   function getUser() { return read("mock_user", null); }
//   function setUser(user) { write("mock_user", user); }
//   function logout() { localStorage.removeItem("mock_user"); }

//   function getWalletBalance() {
//     const u = getUser();
//     return u && typeof u.walletBalance === "number" ? u.walletBalance : 100; // demo default
//   }

//   function getCartItems() { return read("mock_cart", {}); }
//   function setCartItems(cart) { write("mock_cart", cart); }

//   function addToCart(productId, couponSelected = false) {
//     const cart = getCartItems();
//     if (cart[productId]) {
//       cart[productId].quantity = (cart[productId].quantity || 0) + 1;
//       cart[productId].couponSelected = couponSelected;
//     } else {
//       cart[productId] = { quantity: 1, couponSelected };
//     }
//     setCartItems(cart);
//   }

//   function updateCartItem(productId, quantity, couponSelected) {
//     const cart = getCartItems();
//     if (!cart[productId]) cart[productId] = {};
//     cart[productId].quantity = quantity;
//     cart[productId].couponSelected = couponSelected;
//     setCartItems(cart);
//   }

//   function removeFromCart(productId) {
//     const cart = getCartItems();
//     delete cart[productId];
//     setCartItems(cart);
//   }

//   function cartCount() {
//     const cart = getCartItems();
//     return Object.values(cart).reduce((sum, item) => sum + (item.quantity || 0), 0);
//   }

//   function getAddresses() { return read("mock_addresses", []); }
//   function addAddress(address) {
//     const list = getAddresses();
//     address._id = "addr_" + Date.now();
//     list.push(address);
//     write("mock_addresses", list);
//     return address;
//   }

//   /* ---------------------------------------------------------------------
//      Navigation — maps your React-Router paths to these static html files
//   --------------------------------------------------------------------- */
//   function navigate(path) {
//     if (path === "/" ) { window.location.href = "all-product.html"; return; }
//     if (path === "/products") { window.location.href = "all-product.html"; return; }
//     if (path === "/cart") { window.location.href = "cartnow.html"; return; }

//     const productMatch = path.match(/^\/products\/([^/]+)\/([^/]+)$/);
//     if (productMatch) {
//       window.location.href = `product-details.html?id=${encodeURIComponent(productMatch[2])}`;
//       return;
//     }
//     const categoryMatch = path.match(/^\/products\/([^/]+)$/);
//     if (categoryMatch) {
//       window.location.href = `product-category.html?category=${encodeURIComponent(categoryMatch[1])}`;
//       return;
//     }
//     if (path === "/my-orders") {
//       alert("My Orders page isn't part of this conversion batch yet.");
//       return;
//     }
//     if (path === "/add-address") {
//       const street = prompt("Street address:");
//       if (!street) return;
//       const city = prompt("City:") || "";
//       const state = prompt("State:") || "";
//       const country = prompt("Country:") || "";
//       addAddress({ street, city, state, country });
//       alert("Address added.");
//       window.location.reload();
//       return;
//     }
//     // Fallback: try it as a relative file
//     window.location.href = path.replace(/^\//, "");
//   }

//   /* ---------------------------------------------------------------------
//      Toast — minimal stand-in for react-hot-toast
//   --------------------------------------------------------------------- */
//   function ensureToastRoot() {
//     let root = document.getElementById("toast-root");
//     if (!root) {
//       root = document.createElement("div");
//       root.id = "toast-root";
//       root.style.cssText = "position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
//       document.body.appendChild(root);
//     }
//     return root;
//   }
//   function showToast(message, type) {
//     const root = ensureToastRoot();
//     const el = document.createElement("div");
//     el.textContent = message;
//     el.style.cssText = `
//       padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500;color:#fff;
//       box-shadow:0 4px 12px rgba(0,0,0,.15);
//       background:${type === "error" ? "#ef4444" : "#16a34a"};
//       opacity:0;transform:translateY(-6px);transition:all .25s ease;`;
//     root.appendChild(el);
//     requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
//     setTimeout(() => {
//       el.style.opacity = "0";
//       el.style.transform = "translateY(-6px)";
//       setTimeout(() => el.remove(), 250);
//     }, 2600);
//   }
//   const toast = {
//     success: (msg) => showToast(msg, "success"),
//     error: (msg) => showToast(msg, "error"),
//   };

//   /* ---------------------------------------------------------------------
//      Shared <ProductCard /> + skeleton renderers
//      (your real ProductCard.jsx / ProductSkeleton.jsx weren't included in
//      this batch, so this rebuilds the typical card/skeleton shape used
//      across AllProducts / ProductCategory / ProductDetails so all three
//      pages render consistently. Swap the markup below to match your real
//      component any time.)
//   --------------------------------------------------------------------- */
//   function starsHtml(filled) {
//     let out = "";
//     for (let i = 0; i < 5; i++) out += i < filled ? "★" : "☆";
//     return `<span class="text-amber-400 text-sm tracking-tight">${out}</span>`;
//   }

//   function createProductCard(product) {
//     const card = document.createElement("div");
//     card.className = "product-card border border-gray-200 rounded-md px-3 py-2 bg-white";

//     card.innerHTML = `
//       <div class="cursor-pointer flex items-center justify-center px-2 overflow-hidden rounded">
//         <img class="max-w-[120px] md:max-w-[140px] aspect-square object-contain" src="${product.image[0]}" alt="${product.name}" />
//       </div>
//       <div class="text-gray-500 text-sm mt-1">
//         <p>${product.category}</p>
//         <p class="text-gray-800 font-medium text-base truncate w-full">${product.name}</p>
//         <div class="flex items-center gap-1 mt-0.5">
//           ${starsHtml(4)} <span class="text-xs text-gray-400">(4)</span>
//         </div>
//         <div class="flex items-end justify-between mt-3">
//           <p class="text-base font-medium text-gray-800">
//             ${CURRENCY}${product.offerPrice}
//             <span class="text-gray-400 text-xs line-through ml-1">${CURRENCY}${product.price}</span>
//           </p>
//           <div class="qty-slot text-primary"></div>
//         </div>
//       </div>
//     `;

//     // navigate to product details on card click (but not on the qty controls)
//     card.addEventListener("click", () => {
//       navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
//       window.scrollTo(0, 0);
//     });

//     const qtySlot = card.querySelector(".qty-slot");

//     function renderQtyControl() {
//       const cart = getCartItems();
//       const qty = cart[product._id]?.quantity || 0;
//       qtySlot.innerHTML = "";

//       if (qty === 0) {
//         const btn = document.createElement("button");
//         btn.className = "flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 w-[72px] h-[34px] rounded text-primary font-medium text-sm";
//         btn.textContent = "Add";
//         btn.addEventListener("click", (e) => {
//           e.stopPropagation();
//           addToCart(product._id);
//           renderQtyControl();
//         });
//         qtySlot.appendChild(btn);
//       } else {
//         const wrap = document.createElement("div");
//         wrap.className = "flex items-center justify-center gap-2 w-[72px] h-[34px] bg-primary/15 rounded select-none";
//         wrap.innerHTML = `<button class="dec px-1">-</button><span class="text-sm font-medium">${qty}</span><button class="inc px-1">+</button>`;
//         wrap.querySelector(".dec").addEventListener("click", (e) => {
//           e.stopPropagation();
//           if (qty <= 1) removeFromCart(product._id);
//           else updateCartItem(product._id, qty - 1, getCartItems()[product._id]?.couponSelected || false);
//           renderQtyControl();
//         });
//         wrap.querySelector(".inc").addEventListener("click", (e) => {
//           e.stopPropagation();
//           updateCartItem(product._id, qty + 1, getCartItems()[product._id]?.couponSelected || false);
//           renderQtyControl();
//         });
//         qtySlot.appendChild(wrap);
//       }
//     }
//     renderQtyControl();

//     return card;
//   }

//   function createProductSkeleton() {
//     const card = document.createElement("div");
//     card.className = "border border-gray-200 rounded-md px-3 py-2 bg-white";
//     card.innerHTML = `
//       <div class="skeleton w-full aspect-square rounded"></div>
//       <div class="skeleton h-3 w-1/2 rounded mt-3"></div>
//       <div class="skeleton h-4 w-3/4 rounded mt-2"></div>
//       <div class="skeleton h-3 w-1/3 rounded mt-2"></div>
//       <div class="flex items-end justify-between mt-3">
//         <div class="skeleton h-4 w-16 rounded"></div>
//         <div class="skeleton h-[34px] w-[72px] rounded"></div>
//       </div>
//     `;
//     return card;
//   }

//   return {
//     CURRENCY,
//     CATEGORIES,
//     PRODUCTS,
//     placeholderImage,
//     getUser, setUser, logout, getWalletBalance,
//     getCartItems, setCartItems, addToCart, updateCartItem, removeFromCart, cartCount,
//     getAddresses, addAddress,
//     navigate,
//     toast,
//     starsHtml,
//     createProductCard,
//     createProductSkeleton,
//   };
// })();

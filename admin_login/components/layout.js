// ============================================================
// SHARED LAYOUT — injects the sidebar partial into every page,
// highlights the active nav item, and wires the logout button.
//
// Usage: include this script + have a <div id="sidebar-mount"></div>
// where the <aside id="sidebar"> used to be. See import instructions.
// ============================================================

(function () {
    const API_BASE = window.API_BASE || "https://api.stanveeshop.com";

    async function injectSidebar() {
        const mount = document.getElementById("sidebar-mount");
        if (!mount) {
            console.error("[layout] #sidebar-mount not found on this page.");
            return;
        }

        try {
            const res = await fetch("components/sidebar.html");
            if (!res.ok) throw new Error("Failed to fetch sidebar.html: " + res.status);
            const html = await res.text();
            mount.outerHTML = html; // replace the placeholder div with the real <aside>
        } catch (err) {
            console.error("[layout] Could not load shared sidebar:", err);
            return;
        }

        setActiveNav();
        wireLogout();
    }

    // Highlight current page's link + auto-open its parent group (if any)
    function setActiveNav() {
        const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

        document.querySelectorAll("#sidebar [data-page]").forEach(function (el) {
            if (el.getAttribute("data-page") === currentPage) {
                el.classList.add("active");
                const group = el.closest("details.sb-group");
                if (group) {
                    group.classList.add("active");
                    group.open = true;
                }
            }
        });
    }

    function wireLogout() {
        const btn = document.getElementById("logout-btn");
        if (!btn) return;
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const token = localStorage.getItem("adminSessionToken");
            localStorage.removeItem("adminSessionToken");
            localStorage.removeItem("adminEmail");
            fetch(API_BASE + "/api/admin/logout", {
                method: "POST",
                headers: token ? { "Authorization": token } : {}
            }).catch(function () {}).finally(function () {
                window.location.href = "index.html";
            });
        });
    }

    document.addEventListener("DOMContentLoaded", injectSidebar);
})();

document.addEventListener("DOMContentLoaded", async() => {

    // Header
    const header = document.getElementById("header");
    if (header) {
        const res = await fetch("includes/header.html");
        header.innerHTML = await res.text();
    }

    // Footer
    const footer = document.getElementById("footer");
    if (footer) {
        const res = await fetch("includes/footer.html");
        footer.innerHTML = await res.text();
    }

    // NOW load script.js
    const script = document.createElement("script");
    script.src = "js/script.js";
    document.body.appendChild(script);
});
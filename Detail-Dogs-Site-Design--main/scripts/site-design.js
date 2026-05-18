(function () {
    function isLocalPreview() {
        return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    }

    function normalizePath(value) {
        const path = String(value || "/").split("?")[0].split("#")[0];
        if (path === "/" || path === "/index" || path === "/index.html") return "/";
        return path.endsWith("/") ? path : `${path}/`;
    }

    function localDesign(design) {
        if (!isLocalPreview()) return design;
        try {
            return JSON.parse(localStorage.getItem("ddLocalSiteDesign") || "null") || design;
        } catch (error) {
            return design;
        }
    }

    function belongsToCurrentPage(item) {
        return normalizePath(item.path) === normalizePath(window.location.pathname);
    }

    function safeNumber(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function applyDesignItem(item) {
        if (!item || !item.selector) return;

        const element = document.querySelector(item.selector);
        if (!element) return;

        if (typeof item.text === "string") {
            element.textContent = item.text;
        }

        if (item.fontSize) {
            element.style.fontSize = item.fontSize;
        }

        const x = safeNumber(item.x);
        const y = safeNumber(item.y);
        const rotation = safeNumber(item.rotation);
        if (x || y || rotation) {
            const computed = window.getComputedStyle(element);
            if (computed.display === "inline") {
                element.style.display = "inline-block";
            }
            if (computed.position === "static") {
                element.style.position = "relative";
            }
            element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            element.style.transformOrigin = item.transformOrigin || "center";
            element.style.zIndex = item.zIndex || "2";
        } else {
            element.style.transform = "";
        }
    }

    async function loadDesign() {
        try {
            const response = await fetch(`/data/site-design.json?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) return;
            const design = localDesign(await response.json());
            const items = Array.isArray(design.items) ? design.items : [];
            items.filter(belongsToCurrentPage).forEach(applyDesignItem);
        } catch (error) {
            // Design overrides are optional. Keep the static page usable if they fail.
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadDesign);
    } else {
        loadDesign();
    }
})();

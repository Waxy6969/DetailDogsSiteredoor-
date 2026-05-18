(function () {
    function isLocalPreview() {
        return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    }

    function localCopy(copy) {
        if (!isLocalPreview()) return copy;
        try {
            return JSON.parse(localStorage.getItem("ddLocalSiteCopy") || "null") || copy;
        } catch (error) {
            return copy;
        }
    }

    function allowedHtml(value) {
        const template = document.createElement("template");
        template.innerHTML = String(value || "");
        template.content.querySelectorAll("*").forEach((element) => {
            if (!["SPAN", "BR", "STRONG", "EM"].includes(element.tagName)) {
                element.replaceWith(document.createTextNode(element.textContent || ""));
                return;
            }

            Array.from(element.attributes).forEach((attr) => {
                if (attr.name !== "class") element.removeAttribute(attr.name);
            });
        });
        return template.innerHTML;
    }

    function normalizePath(value) {
        const path = String(value || "/").split("?")[0].split("#")[0];
        if (path === "/" || path === "/index" || path === "/index.html") return "/";
        return path.endsWith("/") ? path : `${path}/`;
    }

    function itemBelongsToCurrentPage(item) {
        return normalizePath(item.path) === normalizePath(window.location.pathname);
    }

    function applyCopyItem(item) {
        if (!item || !item.selector || typeof item.value !== "string") return;

        document.querySelectorAll(item.selector).forEach((element) => {
            if (item.mode === "html") {
                element.innerHTML = allowedHtml(item.value);
            } else {
                element.textContent = item.value;
            }
        });
    }

    async function loadCopy() {
        try {
            const response = await fetch(`/data/site-copy.json?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) return;
            const copy = localCopy(await response.json());
            const items = Array.isArray(copy.items) ? copy.items : [];
            items.filter(itemBelongsToCurrentPage).forEach(applyCopyItem);
        } catch (error) {
            // Copy overrides are optional. Keep the static page readable if they fail.
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadCopy);
    } else {
        loadCopy();
    }
})();

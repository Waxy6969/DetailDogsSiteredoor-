(function () {
    const settingsPath = "/data/site-settings.json";
    const originalEmail = "detaildogsllc@gmail.com";
    const originalPhoneDisplay = "(484) 926-0606";
    const originalPhonePlain = "484-926-0606";

    function isLocalPreview() {
        return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    }

    function localSettings(settings) {
        if (!isLocalPreview()) return settings;
        try {
            return JSON.parse(localStorage.getItem("ddLocalSiteSettings") || "null") || settings;
        } catch (error) {
            return settings;
        }
    }

    function shouldSkipTextNode(node) {
        const parent = node.parentElement;
        if (!parent) return true;
        return ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(parent.tagName);
    }

    function replaceVisibleText(searchValue, replacementValue) {
        if (!searchValue || !replacementValue || searchValue === replacementValue) return;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!shouldSkipTextNode(node) && node.nodeValue.includes(searchValue)) {
                nodes.push(node);
            }
        }

        nodes.forEach((node) => {
            node.nodeValue = node.nodeValue.split(searchValue).join(replacementValue);
        });
    }

    function updateContactLinks(settings) {
        const email = String(settings.email || "").trim();
        const phoneHref = String(settings.phoneHref || "").trim();
        const phoneDisplay = String(settings.phoneDisplay || "").trim();

        if (email) {
            document.querySelectorAll('a[href^="mailto:"], form[action^="mailto:"]').forEach((element) => {
                const attr = element.tagName === "FORM" ? "action" : "href";
                const current = element.getAttribute(attr) || "";
                const queryIndex = current.indexOf("?");
                const query = queryIndex >= 0 ? current.slice(queryIndex) : "";
                element.setAttribute(attr, `mailto:${email}${query}`);
            });
            replaceVisibleText(originalEmail, email);
        }

        if (phoneHref) {
            document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
                link.setAttribute("href", `tel:${phoneHref}`);
            });
        }

        if (phoneDisplay) {
            replaceVisibleText(originalPhoneDisplay, phoneDisplay);
            replaceVisibleText(originalPhonePlain, phoneDisplay);
        }
    }

    function showAnnouncement(settings) {
        const isPublicSitePage = !window.location.pathname.startsWith("/dev-tools")
            && window.location.pathname !== "/construction"
            && window.location.pathname !== "/construction.html";
        if (!isPublicSitePage || !settings.announcementEnabled) return;

        const title = String(settings.announcementTitle || "Detail Dogs Update").trim();
        const text = String(settings.announcementText || "").trim();
        if (!text) return;

        const style = document.createElement("style");
        style.textContent = `
            .dd-site-announcement {
                position: relative;
                z-index: 30;
                display: grid;
                grid-template-columns: auto 1fr;
                gap: 0.85rem;
                align-items: center;
                padding: 0.75rem 4%;
                border-bottom: 1px solid rgba(24, 240, 228, 0.28);
                background: linear-gradient(135deg, rgba(255, 31, 79, 0.2), rgba(7, 20, 38, 0.94), rgba(0, 111, 232, 0.22));
                color: #fbfdff;
                font-family: Arial, Helvetica, sans-serif;
            }

            .dd-site-announcement strong {
                color: #18f0e4;
                font-size: 0.78rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            .dd-site-announcement span {
                color: #dce7f2;
                line-height: 1.35;
            }

            @media (max-width: 640px) {
                .dd-site-announcement {
                    grid-template-columns: 1fr;
                    gap: 0.3rem;
                }
            }
        `;

        const bar = document.createElement("aside");
        bar.className = "dd-site-announcement";
        bar.innerHTML = `<strong></strong><span></span>`;
        bar.querySelector("strong").textContent = title;
        bar.querySelector("span").textContent = text;

        document.head.appendChild(style);
        document.body.insertBefore(bar, document.body.firstChild);
    }

    async function loadSettings() {
        try {
            const response = await fetch(`${settingsPath}?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) return;
            const settings = localSettings(await response.json());
            updateContactLinks(settings);
            showAnnouncement(settings);
        } catch (error) {
            // Keep the static site usable if settings cannot load.
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadSettings);
    } else {
        loadSettings();
    }
})();

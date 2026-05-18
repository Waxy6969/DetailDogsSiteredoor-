(function () {
    const adminCookieValue = "erv_zbSXx48qypXLMjxQk_umzVdhmEYXJGgjsU50IUs";
    const isAdmin = document.cookie.split(";").some((cookie) => {
        return cookie.trim() === `dd_admin=${adminCookieValue}`;
    });

    if (isAdmin) return;

    const path = window.location.pathname;
    const isConstructionPage = path === "/construction" || path === "/construction.html";
    const isDevToolsPage = path === "/dev-tools" || path === "/dev-tools/" || path.startsWith("/dev-tools/");
    if (isConstructionPage || isDevToolsPage) return;

    function isLocalPreview() {
        return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    }

    if (isLocalPreview() && new URLSearchParams(window.location.search).get("dd-dev-preview") === "1") {
        return;
    }

    function localSettings(settings) {
        if (!isLocalPreview()) return settings;
        try {
            return JSON.parse(localStorage.getItem("ddLocalSiteSettings") || "null") || settings;
        } catch (error) {
            return settings;
        }
    }

    function sendToConstruction() {
        const nextPath = `${path}${window.location.search}${window.location.hash}`;
        window.location.replace(`/construction?next=${encodeURIComponent(nextPath)}`);
    }

    fetch(`/data/site-settings.json?v=${Date.now()}`, { cache: "no-store" })
        .then((response) => {
            if (!response.ok) throw new Error("Settings unavailable.");
            return response.json();
        })
        .then((settings) => {
            settings = localSettings(settings);
            if (!settings || settings.trafficMode !== "open") {
                sendToConstruction();
            }
        })
        .catch(() => {
            const settings = localSettings({ trafficMode: "construction" });
            if (!settings || settings.trafficMode !== "open") {
                sendToConstruction();
            }
        });
})();

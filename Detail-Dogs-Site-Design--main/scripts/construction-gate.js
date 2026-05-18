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
            if (!settings || settings.trafficMode !== "open") {
                sendToConstruction();
            }
        })
        .catch(sendToConstruction);
})();

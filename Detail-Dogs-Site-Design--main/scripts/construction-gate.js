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

    const nextPath = `${path}${window.location.search}${window.location.hash}`;
    window.location.replace(`/construction?next=${encodeURIComponent(nextPath)}`);
})();

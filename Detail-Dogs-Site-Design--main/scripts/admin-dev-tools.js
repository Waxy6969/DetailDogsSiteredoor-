(function () {
    const adminCookieValue = "erv_zbSXx48qypXLMjxQk_umzVdhmEYXJGgjsU50IUs";
    const isAdmin = document.cookie.split(";").some((cookie) => {
        return cookie.trim() === `dd_admin=${adminCookieValue}`;
    });

    if (!isAdmin) return;

    const path = window.location.pathname;
    if (path === "/construction" || path === "/construction.html" || path.startsWith("/dev-tools")) return;

    const currentPath = `${path}${window.location.search}${window.location.hash}`;
    const devLink = document.createElement("a");
    devLink.className = "dd-dev-tools-link";
    devLink.href = `/dev-tools/?target=${encodeURIComponent(currentPath)}`;
    devLink.setAttribute("aria-label", "Open admin dev view tools");
    devLink.textContent = "Dev View";

    const style = document.createElement("style");
    style.textContent = `
        .dd-dev-tools-link {
            position: fixed;
            right: 1rem;
            bottom: 1rem;
            z-index: 2147483000;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 42px;
            padding: 0 1rem;
            border: 1px solid rgba(22, 137, 255, 0.7);
            background: rgba(3, 8, 18, 0.88);
            color: #fbfdff;
            box-shadow: 0 12px 34px rgba(0, 0, 0, 0.45), 0 0 18px rgba(22, 137, 255, 0.28);
            font: 800 0.78rem/1 Arial, Helvetica, sans-serif;
            letter-spacing: 0.04em;
            text-decoration: none;
            text-transform: uppercase;
            backdrop-filter: blur(12px);
        }

        .dd-dev-tools-link:hover,
        .dd-dev-tools-link:focus-visible {
            border-color: rgba(255, 31, 79, 0.8);
            box-shadow: 0 12px 34px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 31, 79, 0.32);
            outline: none;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(devLink);
})();

const ADMIN_COOKIE_VALUE = "erv_zbSXx48qypXLMjxQk_umzVdhmEYXJGgjsU50IUs";
const DEFAULT_OWNER = "Waxy6969";
const DEFAULT_REPO = "Detail-Dogs-Site-Design-";
const DEFAULT_BRANCH = "main";
const SETTINGS_PATH = "data/site-settings.json";
const POSTS_PATH = "data/site-posts.json";
const COPY_PATH = "data/site-copy.json";
const VERCEL_PATH = "vercel.json";

const PROTECTED_REWRITES = [
    { source: "/api/(.*)", destination: "/api/$1" },
    { source: "/dev-tools", destination: "/dev-tools/index.html" },
    { source: "/dev-tools/(.*)", destination: "/dev-tools/$1" }
];

const CONSTRUCTION_REWRITE = {
    source: "/(.*)",
    missing: [
        {
            type: "cookie",
            key: "dd_admin",
            value: ADMIN_COOKIE_VALUE
        }
    ],
    destination: "/construction.html"
};

function sendJson(response, status, payload) {
    response.statusCode = status;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(payload));
}

function readBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk;
            if (body.length > 1_000_000) {
                reject(new Error("Admin payload is too large."));
                request.destroy();
            }
        });
        request.on("end", () => resolve(body));
        request.on("error", reject);
    });
}

function hasAdminCookie(request) {
    const cookie = request.headers.cookie || "";
    return cookie.split(";").some((value) => value.trim() === `dd_admin=${ADMIN_COOKIE_VALUE}`);
}

function assertString(value, label, maxLength) {
    const next = String(value || "").trim();
    if (!next) throw new Error(`${label} is required.`);
    if (next.length > maxLength) throw new Error(`${label} is too long.`);
    return next;
}

function cleanSettings(input) {
    const now = new Date().toISOString();
    return {
        businessName: assertString(input.businessName, "Business name", 90),
        email: assertString(input.email, "Email", 120),
        phoneDisplay: assertString(input.phoneDisplay, "Phone display", 40),
        phoneHref: assertString(input.phoneHref, "Phone link", 30),
        announcementEnabled: Boolean(input.announcementEnabled),
        announcementTitle: assertString(input.announcementTitle || "Detail Dogs Update", "Announcement title", 80),
        announcementText: String(input.announcementText || "").trim().slice(0, 260),
        trafficMode: input.trafficMode === "open" ? "open" : "construction",
        updatedAt: now
    };
}

function slugify(value) {
    return String(value || "site-post")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 58) || "site-post";
}

function cleanPosts(input) {
    const posts = Array.isArray(input.posts) ? input.posts : [];
    const now = new Date().toISOString();
    return {
        updatedAt: now,
        posts: posts.slice(0, 24).map((post, index) => {
            const title = assertString(post.title || `Site post ${index + 1}`, "Post title", 110);
            const createdAt = post.createdAt && !Number.isNaN(new Date(post.createdAt).getTime())
                ? new Date(post.createdAt).toISOString()
                : now;
            return {
                id: String(post.id || `${slugify(title)}-${Date.now()}-${index + 1}`).slice(0, 90),
                title,
                category: String(post.category || "Update").trim().slice(0, 50),
                body: String(post.body || "").trim().slice(0, 800),
                status: post.status === "published" ? "published" : "draft",
                createdAt
            };
        })
    };
}

function cleanCopy(input) {
    const items = Array.isArray(input.items) ? input.items : [];
    const now = new Date().toISOString();
    return {
        updatedAt: now,
        items: items.slice(0, 80).map((item, index) => ({
            id: String(item.id || `copy-item-${index + 1}`).trim().slice(0, 90),
            page: String(item.page || "Site").trim().slice(0, 50),
            path: String(item.path || "/").trim().slice(0, 120),
            label: String(item.label || `Text block ${index + 1}`).trim().slice(0, 90),
            selector: assertString(item.selector, "Copy selector", 180),
            mode: item.mode === "html" ? "html" : "text",
            value: String(item.value || "").trim().slice(0, 1600)
        }))
    };
}

function vercelConfigForTraffic(existingConfig, trafficMode) {
    const config = existingConfig && typeof existingConfig === "object" ? existingConfig : {};
    return {
        ...config,
        cleanUrls: config.cleanUrls !== false,
        trailingSlash: Boolean(config.trailingSlash),
        rewrites: trafficMode === "open" ? PROTECTED_REWRITES : [...PROTECTED_REWRITES, CONSTRUCTION_REWRITE]
    };
}

async function githubFetch(path, options = {}) {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || DEFAULT_OWNER;
    const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
    const url = `https://api.github.com/repos/${owner}/${repo}${path}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(options.headers || {})
        }
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
        const message = data && data.message ? data.message : `GitHub request failed with ${response.status}`;
        throw new Error(message);
    }
    return data;
}

async function readGithubJson(path, branch) {
    const file = await githubFetch(`/contents/${path}?ref=${encodeURIComponent(branch)}`);
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
}

async function commitFiles(files, message) {
    const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
    const ref = await githubFetch(`/git/ref/heads/${branch}`);
    const latestCommit = await githubFetch(`/git/commits/${ref.object.sha}`);
    const treeEntries = [];

    for (const file of files) {
        const blob = await githubFetch("/git/blobs", {
            method: "POST",
            body: JSON.stringify({
                content: Buffer.from(`${JSON.stringify(file.content, null, 2)}\n`, "utf8").toString("base64"),
                encoding: "base64"
            })
        });

        treeEntries.push({
            path: file.path,
            mode: "100644",
            type: "blob",
            sha: blob.sha
        });
    }

    const tree = await githubFetch("/git/trees", {
        method: "POST",
        body: JSON.stringify({
            base_tree: latestCommit.tree.sha,
            tree: treeEntries
        })
    });

    const commit = await githubFetch("/git/commits", {
        method: "POST",
        body: JSON.stringify({
            message,
            tree: tree.sha,
            parents: [ref.object.sha]
        })
    });

    await githubFetch(`/git/refs/heads/${branch}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha, force: false })
    });

    return commit.sha;
}

module.exports = async function handler(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return sendJson(response, 405, { error: "POST only." });
    }

    if (!hasAdminCookie(request)) {
        return sendJson(response, 401, { error: "Admin unlock required." });
    }

    if (!process.env.GITHUB_TOKEN) {
        return sendJson(response, 503, {
            error: "Admin saves are not configured yet. Add a private Vercel environment variable named GITHUB_TOKEN with repo contents write access."
        });
    }

    try {
        const payload = JSON.parse(await readBody(request));
        const action = payload.action;
        const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;

        if (action === "save-settings") {
            const settings = cleanSettings(payload.settings || {});
            const commit = await commitFiles([{ path: SETTINGS_PATH, content: settings }], "Update site settings from dev tools");
            return sendJson(response, 200, { ok: true, settings, commit, message: "Site settings saved." });
        }

        if (action === "save-posts") {
            const posts = cleanPosts(payload.posts || {});
            const commit = await commitFiles([{ path: POSTS_PATH, content: posts }], "Update site posts from dev tools");
            return sendJson(response, 200, { ok: true, posts, commit, message: "Site posts saved." });
        }

        if (action === "save-copy") {
            const copy = cleanCopy(payload.copy || {});
            const commit = await commitFiles([{ path: COPY_PATH, content: copy }], "Update site text from dev tools");
            return sendJson(response, 200, { ok: true, copy, commit, message: "Site text saved." });
        }

        if (action === "set-traffic") {
            const currentSettings = await readGithubJson(SETTINGS_PATH, branch);
            const currentVercel = await readGithubJson(VERCEL_PATH, branch);
            const trafficMode = payload.trafficMode === "open" ? "open" : "construction";
            const settings = cleanSettings({ ...currentSettings, trafficMode });
            const vercelConfig = vercelConfigForTraffic(currentVercel, trafficMode);
            const commit = await commitFiles([
                { path: SETTINGS_PATH, content: settings },
                { path: VERCEL_PATH, content: vercelConfig }
            ], `Set traffic mode to ${trafficMode}`);
            return sendJson(response, 200, {
                ok: true,
                trafficMode,
                settings,
                commit,
                message: trafficMode === "open" ? "Public traffic can reach the full site after deploy." : "Public traffic will see the construction page after deploy."
            });
        }

        return sendJson(response, 400, { error: "Unknown admin action." });
    } catch (error) {
        return sendJson(response, 500, { error: error.message || "Admin action failed." });
    }
};

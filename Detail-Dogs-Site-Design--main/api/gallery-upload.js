const ADMIN_COOKIE_VALUE = "erv_zbSXx48qypXLMjxQk_umzVdhmEYXJGgjsU50IUs";
const DEFAULT_OWNER = "Waxy6969";
const DEFAULT_REPO = "Detail-Dogs-Site-Design-";
const DEFAULT_BRANCH = "main";
const MANIFEST_PATH = "images/gallery/drive-gallery.json";
const CATEGORY_LABELS = {
    featured: "Featured Transformations",
    interior: "Interior Details",
    exterior: "Exterior Details",
    "paint-correction": "Paint Correction",
    ceramic: "Ceramic Coatings",
    headlights: "Headlight Restorations",
    shop: "Shop / Behind the Scenes"
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
            if (body.length > 6_000_000) {
                reject(new Error("Upload is too large. Try fewer or smaller photos."));
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

function slugify(value) {
    return String(value || "gallery-photo")
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 58) || "gallery-photo";
}

function titleFromName(value) {
    return String(value || "Gallery Photo")
        .replace(/\.[a-z0-9]+$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Gallery Photo";
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
            error: "Gallery upload is not configured yet. Add a private Vercel environment variable named GITHUB_TOKEN with repo contents write access."
        });
    }

    try {
        const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
        const payload = JSON.parse(await readBody(request));
        const images = Array.isArray(payload.images) ? payload.images : [];
        const category = CATEGORY_LABELS[payload.category] ? payload.category : "featured";

        if (!images.length) {
            return sendJson(response, 400, { error: "Choose at least one photo." });
        }

        if (images.length > 6) {
            return sendJson(response, 400, { error: "Upload 6 photos or fewer at a time." });
        }

        const ref = await githubFetch(`/git/ref/heads/${branch}`);
        const latestCommit = await githubFetch(`/git/commits/${ref.object.sha}`);
        const manifestFile = await githubFetch(`/contents/${MANIFEST_PATH}?ref=${encodeURIComponent(branch)}`);
        const manifest = JSON.parse(Buffer.from(manifestFile.content, "base64").toString("utf8"));
        const now = new Date().toISOString();
        const uploaded = [];
        const treeEntries = [];

        for (const [index, image] of images.entries()) {
            if (!image || !image.base64 || !/^image\/(jpeg|png|webp)$/i.test(image.mimeType || "")) {
                return sendJson(response, 400, { error: "Only JPG, PNG, or WebP images can be uploaded." });
            }

            const originalName = image.fileName || `gallery-photo-${index + 1}.jpg`;
            const title = (image.title || titleFromName(originalName)).trim();
            const extension = image.mimeType === "image/png" ? "png" : image.mimeType === "image/webp" ? "webp" : "jpg";
            const safeName = `${slugify(title || originalName)}-${Date.now()}-${index + 1}.${extension}`;
            const filePath = `images/gallery/drive/${category}/${safeName}`;
            const blob = await githubFetch("/git/blobs", {
                method: "POST",
                body: JSON.stringify({
                    content: image.base64,
                    encoding: "base64"
                })
            });

            treeEntries.push({
                path: filePath,
                mode: "100644",
                type: "blob",
                sha: blob.sha
            });

            const entry = {
                id: `site-upload-${Date.now()}-${index + 1}`,
                name: originalName,
                title,
                category,
                alt: image.alt || `${title} - Detail Dogs gallery photo`,
                fileName: safeName,
                src: `/${filePath}`,
                mimeType: image.mimeType,
                modifiedTime: now,
                size: Number(image.size) || Buffer.byteLength(image.base64, "base64"),
                uploadedFrom: "dev-tools"
            };

            uploaded.push(entry);
        }

        manifest.source = "git-gallery-folder";
        manifest.updatedAt = now;
        manifest.images = [...uploaded, ...(Array.isArray(manifest.images) ? manifest.images : [])];
        manifest.imageCount = manifest.images.length;

        const manifestBlob = await githubFetch("/git/blobs", {
            method: "POST",
            body: JSON.stringify({
                content: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, "utf8").toString("base64"),
                encoding: "base64"
            })
        });

        treeEntries.push({
            path: MANIFEST_PATH,
            mode: "100644",
            type: "blob",
            sha: manifestBlob.sha
        });

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
                message: `Upload ${uploaded.length} gallery photo${uploaded.length === 1 ? "" : "s"} from dev tools`,
                tree: tree.sha,
                parents: [ref.object.sha]
            })
        });

        await githubFetch(`/git/refs/heads/${branch}`, {
            method: "PATCH",
            body: JSON.stringify({
                sha: commit.sha,
                force: false
            })
        });

        return sendJson(response, 200, {
            ok: true,
            uploaded,
            commit: commit.sha,
            message: `Uploaded ${uploaded.length} photo${uploaded.length === 1 ? "" : "s"} to ${CATEGORY_LABELS[category]}.`
        });
    } catch (error) {
        return sendJson(response, 500, { error: error.message || "Gallery upload failed." });
    }
};

(async () => {
    const section = document.querySelector("[data-instagram-section]");
    const storyRail = document.querySelector("[data-instagram-stories]");
    const postGrid = document.querySelector("[data-instagram-posts]");
    const profileLinks = document.querySelectorAll("[data-instagram-profile]");

    if (!section || !storyRail || !postGrid) return;

    const fallbackProfile = "https://www.instagram.com/detail.dogs/";

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function rotateDaily(items, count = 5) {
        if (!items.length) return [];
        const day = Math.floor(Date.now() / 86400000);
        return Array.from({ length: Math.min(count, items.length) }, (_, index) => {
            return items[(day + index) % items.length];
        });
    }

    function renderStory(story) {
        const url = story.url || fallbackProfile;
        return `<a class="insta-story" href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(story.label || "Detail Dogs story")} on Instagram">
                    <span class="insta-story-ring"><img src="${escapeHtml(story.src)}" alt="${escapeHtml(story.label || "Detail Dogs Instagram story")}"></span>
                    <span>${escapeHtml(story.label || "Story")}</span>
                </a>`;
    }

    function renderPost(post) {
        const isReel = post.type === "reel" || post.type === "video";
        const url = post.url || fallbackProfile;
        return `<a class="insta-post-card" href="${escapeHtml(url)}" target="_blank" rel="noopener">
                    <span class="insta-media-wrap">
                        <img src="${escapeHtml(post.src)}" alt="${escapeHtml(post.title || "Detail Dogs Instagram post")}" loading="lazy">
                        ${isReel ? '<span class="insta-reel-badge">Reel</span>' : ""}
                    </span>
                    <span class="insta-post-copy">
                        <strong>${escapeHtml(post.title || "Detail Dogs Post")}</strong>
                        <span>${escapeHtml(post.caption || "See more on Instagram.")}</span>
                    </span>
                </a>`;
    }

    try {
        const response = await fetch("/data/instagram-feed.json", { cache: "no-store" });
        if (!response.ok) return;
        const feed = await response.json();
        const profileUrl = feed.profileUrl || fallbackProfile;
        const posts = Array.isArray(feed.posts) ? feed.posts.filter((post) => post && post.src) : [];
        const stories = Array.isArray(feed.stories) ? feed.stories.filter((story) => story && story.src) : [];

        profileLinks.forEach((link) => {
            link.href = profileUrl;
        });

        storyRail.innerHTML = rotateDaily(stories, 5).map(renderStory).join("");
        postGrid.innerHTML = posts.slice(0, 6).map(renderPost).join("");
        section.hidden = !posts.length && !stories.length;
    } catch (error) {
        section.hidden = true;
    }
})();

(function () {
    function isLocalPreview() {
        return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    }

    function localPosts(data) {
        if (!isLocalPreview()) return data;
        try {
            return JSON.parse(localStorage.getItem("ddLocalSitePosts") || "null") || data;
        } catch (error) {
            return data;
        }
    }

    function postDateLabel(value) {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    }

    function createPostsSection(posts) {
        const section = document.createElement("section");
        section.className = "site-posts-section";
        section.innerHTML = `
            <div class="site-posts-inner">
                <div class="features-header">
                    <h2 class="section-title">LATEST <span>UPDATES</span></h2>
                    <p class="section-subtitle">Fresh Detail Dogs notes, booking updates, and service posts.</p>
                </div>
                <div class="site-posts-grid"></div>
            </div>
        `;

        const grid = section.querySelector(".site-posts-grid");
        posts.forEach((post) => {
            const article = document.createElement("article");
            article.className = "site-post-card";
            const date = postDateLabel(post.createdAt);
            article.innerHTML = `
                <div class="site-post-meta"></div>
                <h3></h3>
                <p></p>
            `;
            article.querySelector(".site-post-meta").textContent = [post.category || "Update", date].filter(Boolean).join(" / ");
            article.querySelector("h3").textContent = post.title || "Detail Dogs Update";
            article.querySelector("p").textContent = post.body || "";
            grid.appendChild(article);
        });

        const style = document.createElement("style");
        style.textContent = `
            .site-posts-section {
                padding: 6rem 4%;
            }

            .site-posts-inner {
                max-width: var(--container-max, 1400px);
                margin: 0 auto;
            }

            .site-posts-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1rem;
                margin-top: 2rem;
            }

            .site-post-card {
                display: grid;
                gap: 0.85rem;
                min-height: 220px;
                padding: 1.25rem;
                border: 1px solid rgba(24, 240, 228, 0.38);
                background: linear-gradient(135deg, rgba(226, 233, 238, 0.1), rgba(0, 111, 232, 0.18));
                color: #fbfdff;
            }

            .site-post-card h3 {
                margin: 0;
                font-family: 'Bebas Neue', Arial, sans-serif;
                font-size: clamp(2rem, 4vw, 3rem);
                line-height: 0.95;
                letter-spacing: 1px;
            }

            .site-post-card p {
                margin: 0;
                color: #c1d0dc;
                line-height: 1.65;
            }

            .site-post-meta {
                color: #18f0e4;
                font-family: 'Space Mono', monospace;
                font-size: 0.72rem;
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            @media (max-width: 900px) {
                .site-posts-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
        return section;
    }

    async function loadPosts() {
        const home = document.querySelector("main#home");
        const contact = document.getElementById("contact");
        if (!home || !contact) return;

        try {
            const response = await fetch(`/data/site-posts.json?v=${Date.now()}`, { cache: "no-store" });
            if (!response.ok) return;
            const data = localPosts(await response.json());
            const posts = (Array.isArray(data.posts) ? data.posts : [])
                .filter((post) => post && post.status === "published" && (post.title || post.body))
                .slice(0, 6);
            if (!posts.length) return;
            home.insertBefore(createPostsSection(posts), contact);
        } catch (error) {
            // Posts are optional, so public pages should keep loading without them.
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadPosts);
    } else {
        loadPosts();
    }
})();

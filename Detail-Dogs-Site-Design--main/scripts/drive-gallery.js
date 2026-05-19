(async () => {
    const galleryGrids = document.querySelectorAll("[data-drive-gallery-grid]");
    const homeGrids = document.querySelectorAll("[data-drive-gallery-home]");
    const featureAreas = document.querySelectorAll("[data-drive-gallery-feature]");

    if (!galleryGrids.length && !homeGrids.length && !featureAreas.length) return;

    const categoryLabels = {
        all: "All",
        featured: "Featured Transformations",
        interior: "Interior Details",
        exterior: "Exterior Details",
        "paint-correction": "Paint Correction",
        ceramic: "Ceramic Coatings",
        headlights: "Headlight Restorations",
        shop: "Shop / Behind the Scenes"
    };

    function isLocalPreview() {
        return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    }

    function localGalleryImages() {
        if (!isLocalPreview()) return [];
        try {
            const images = JSON.parse(localStorage.getItem("ddLocalGalleryImages") || "[]");
            return Array.isArray(images) ? images : [];
        } catch (error) {
            return [];
        }
    }

    function escapeHtml(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function categoryLabel(category) {
        return categoryLabels[category] || "Detail Dogs Gallery";
    }

    function imageText(image) {
        return image.title || image.name || "Detail Dogs Result";
    }

    function popupFromImage(image) {
        const popup = document.getElementById("galleryPopup");
        const popupImage = document.getElementById("popupImage");
        const popupPrompt = document.getElementById("popupPrompt");
        const popupStyle = document.getElementById("popupStyle");

        if (!popup || !popupImage) return;

        popupImage.src = image.src;
        popupImage.alt = image.alt || imageText(image);
        if (popupPrompt) popupPrompt.textContent = imageText(image);
        if (popupStyle) popupStyle.textContent = categoryLabel(image.category);
        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function renderGalleryCard(image) {
        const title = imageText(image);

        return `<article class="gallery-result-card" data-category="${escapeHtml(image.category || "featured")}">
                    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || title)}" loading="lazy">
                </article>`;
    }

    function renderHomeItem(image) {
        return `<div class="gallery-item" data-category="${escapeHtml(image.category || "featured")}" data-drive-gallery-item="${escapeHtml(image.id)}">
                    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || imageText(image))}" loading="lazy">
                    <div class="item-info">
                        <p class="item-prompt">${escapeHtml(imageText(image))}</p>
                        <span class="item-style">${escapeHtml(categoryLabel(image.category))}</span>
                    </div>
                </div>`;
    }

    function applyCurrentFilter() {
        document.querySelectorAll(".filter-tabs").forEach((tabs) => {
            const active = tabs.querySelector(".filter-tab.active");
            if (!active) return;

            const filter = active.dataset.filter;
            document.querySelectorAll(".gallery-item").forEach((item) => {
                item.style.display = filter === "all" || item.dataset.category === filter ? "block" : "none";
            });
            document.querySelectorAll(".gallery-result-card").forEach((item) => {
                item.style.display = filter === "all" || item.dataset.category === filter ? "block" : "none";
            });
        });
    }

    try {
        const response = await fetch("/images/gallery/drive-gallery.json", { cache: "no-store" });
        if (!response.ok) return;

        const manifest = await response.json();
        const images = [...localGalleryImages(), ...(Array.isArray(manifest.images) ? manifest.images : [])];
        if (!images.length) return;

        featureAreas.forEach((area) => {
            const before = area.querySelector(".before-after-stage > .before-after-image");
            const after = area.querySelector(".before-after-overlay .before-after-image");

            if (before) before.src = images[0].src;
            if (before) before.alt = images[0].alt || imageText(images[0]);
            if (after) after.src = (images[1] || images[0]).src;
            if (after) after.alt = (images[1] || images[0]).alt || imageText(images[1] || images[0]);
        });

        galleryGrids.forEach((grid) => {
            grid.innerHTML = images.map(renderGalleryCard).join("");
        });

        homeGrids.forEach((grid) => {
            const homeImages = images.slice(0, 6);
            grid.innerHTML = homeImages.map(renderHomeItem).join("");
            grid.querySelectorAll("[data-drive-gallery-item]").forEach((item) => {
                const image = homeImages.find((candidate) => candidate.id === item.dataset.driveGalleryItem);
                if (image) item.addEventListener("click", () => popupFromImage(image));
            });
        });

        applyCurrentFilter();
    } catch (error) {
        console.warn("Drive gallery could not load.", error);
    }
})();

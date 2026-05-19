(async () => {
    const galleryGrids = document.querySelectorAll("[data-drive-gallery-grid]");
    const homeGrids = document.querySelectorAll("[data-drive-gallery-home]");
    const featureAreas = document.querySelectorAll("[data-drive-gallery-feature]");
    let popupItems = [];
    let popupIndex = 0;

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

    function popupElements() {
        const popup = document.getElementById("galleryPopup");
        const popupImage = document.getElementById("popupImage");
        const popupPrompt = document.getElementById("popupPrompt");
        const popupStyle = document.getElementById("popupStyle");
        const popupPrev = document.getElementById("popupPrev");
        const popupNext = document.getElementById("popupNext");

        return { popup, popupImage, popupPrompt, popupStyle, popupPrev, popupNext };
    }

    function setArrowState() {
        const { popupPrev, popupNext } = popupElements();
        const hasMultiple = popupItems.length > 1;

        [popupPrev, popupNext].forEach((button) => {
            if (!button) return;
            button.hidden = !hasMultiple;
            button.disabled = !hasMultiple;
        });
    }

    function showPopupItem(index) {
        const { popup, popupImage, popupPrompt, popupStyle } = popupElements();
        if (!popup || !popupImage || !popupItems.length) return;

        popupIndex = (index + popupItems.length) % popupItems.length;
        const image = popupItems[popupIndex];

        popupImage.src = image.src;
        popupImage.alt = image.alt || imageText(image);
        if (popupPrompt) popupPrompt.textContent = image.title || "";
        if (popupStyle) popupStyle.textContent = image.category ? categoryLabel(image.category) : "";
        setArrowState();
        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function popupFromImage(image) {
        popupItems = [image];
        showPopupItem(0);
    }

    function visibleGalleryItems() {
        return Array.from(document.querySelectorAll(".gallery-result-card"))
            .filter((card) => card.offsetParent !== null && card.style.display !== "none")
            .map((card) => {
                const image = card.querySelector("img");
                if (!image) return null;
                return {
                    src: image.currentSrc || image.src,
                    alt: image.alt || "Detail Dogs gallery photo",
                    title: card.dataset.galleryTitle || image.alt || "Detail Dogs gallery photo",
                    category: card.dataset.category || "featured",
                    card
                };
            })
            .filter(Boolean);
    }

    function openGalleryCard(card) {
        popupItems = visibleGalleryItems();
        const index = popupItems.findIndex((item) => item.card === card);
        showPopupItem(index >= 0 ? index : 0);
    }

    function bindGalleryCards() {
        document.querySelectorAll(".gallery-result-card").forEach((card) => {
            if (card.dataset.galleryBound === "true") return;
            card.dataset.galleryBound = "true";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Open gallery photo");
            card.addEventListener("click", () => openGalleryCard(card));
            card.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                openGalleryCard(card);
            });
        });
    }

    function closePopup() {
        const { popup } = popupElements();
        if (!popup) return;
        popup.classList.remove("active");
        document.body.style.overflow = "";
    }

    function movePopup(direction) {
        if (!popupItems.length) return;
        showPopupItem(popupIndex + direction);
    }

    function renderGalleryCard(image) {
        const title = imageText(image);

        return `<article class="gallery-result-card" data-category="${escapeHtml(image.category || "featured")}" data-gallery-title="${escapeHtml(title)}">
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

    function bindPopupControls() {
        const { popup, popupPrev, popupNext } = popupElements();
        const closeButton = document.getElementById("popupClose");
        const overlay = popup ? popup.querySelector(".popup-overlay") : null;

        if (popup && popup.dataset.galleryPopupBound !== "true") {
            popup.dataset.galleryPopupBound = "true";
            if (closeButton) closeButton.addEventListener("click", closePopup);
            if (overlay) overlay.addEventListener("click", closePopup);
            if (popupPrev) popupPrev.addEventListener("click", () => movePopup(-1));
            if (popupNext) popupNext.addEventListener("click", () => movePopup(1));
            document.addEventListener("keydown", (event) => {
                if (!popup.classList.contains("active")) return;
                if (event.key === "Escape") closePopup();
                if (event.key === "ArrowLeft") movePopup(-1);
                if (event.key === "ArrowRight") movePopup(1);
            });
        }
    }

    bindPopupControls();
    bindGalleryCards();

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
        bindGalleryCards();

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

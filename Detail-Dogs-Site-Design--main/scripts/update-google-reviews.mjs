import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dataPath = path.join(rootDir, "reviews", "google-reviews.json");
const reviewsPagePath = path.join(rootDir, "reviews", "index.html");

const fallbackProfileUrl = "https://www.google.com/search?sca_esv=be715597135c0019&hl=en&gl=us&authuser=2&output=search&q=Detail+Dogs&ludocid=468973801551960018&lsig=AB86z5WJyIPpRjtqM8EE9599bLKC&ved=1i%3A3%2Ct%3A109124%2Ce%3A2%2Cp%3AgCcGat_LMp6viLMPt8G2uAg%3A52";

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderGoogleReviews(data) {
    const reviews = Array.isArray(data.reviews) ? data.reviews.slice(0, 6) : [];
    const ratingCopy = data.rating && data.reviewCount
        ? `${data.rating} / 5 average from ${data.reviewCount} Google reviews`
        : "Real customer feedback from Google.";
    const profileUrl = data.profileUrl || fallbackProfileUrl;

    const cards = reviews.map((review) => {
        const category = review.category || "Google Review";
        const rating = review.rating ? `${escapeHtml(review.rating)} / 5 on Google` : "Google";
        const time = review.relativeTimeDescription
            ? `\n                        <span class="review-sync-note">${escapeHtml(review.relativeTimeDescription)}</span>`
            : `\n                        <span class="review-sync-note">Posted from the ${escapeHtml(data.businessName || "Detail Dogs")} Google Business Profile.</span>`;

        return `                    <article class="review-card google-review-card">
                        <div class="google-card-top">
                            <span class="service-pill">${escapeHtml(category)}</span>
                            <span class="google-rating-text">${rating}</span>
                        </div>
                        <p>"${escapeHtml(review.text)}"</p>
                        <strong>- ${escapeHtml(review.author || "Google reviewer")}</strong>${time}
                    </article>`;
    }).join("\n");

    return `            <!-- GOOGLE_REVIEWS_START -->
            <section class="review-section-block google-review-section" aria-label="Google reviews">
                <div class="review-section-heading google-review-heading">
                    <div>
                        <span class="service-pill">Posted Google Review</span>
                        <h2>${escapeHtml(ratingCopy)}</h2>
                    </div>
                    <a class="cta-btn-secondary review-source-link" href="${escapeHtml(profileUrl)}" target="_blank" rel="noopener">View on Google</a>
                </div>
                <div class="review-card-grid">
${cards}
                </div>
            </section>
            <!-- GOOGLE_REVIEWS_END -->`;
}

async function getPlaceId(apiKey) {
    if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;

    const query = process.env.GOOGLE_PLACE_QUERY || "Detail Dogs Reading Pennsylvania";
    const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
    url.searchParams.set("input", query);
    url.searchParams.set("inputtype", "textquery");
    url.searchParams.set("fields", "place_id,name,formatted_address");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url);
    const payload = await response.json();

    if (payload.status !== "OK" || !payload.candidates?.[0]?.place_id) {
        throw new Error(`Could not find Google place ID for "${query}". Google status: ${payload.status || "unknown"}`);
    }

    return payload.candidates[0].place_id;
}

async function fetchGoogleReviews() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) return null;

    const placeId = await getPlaceId(apiKey);
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "name,rating,user_ratings_total,reviews,url");
    url.searchParams.set("key", apiKey);

    const response = await fetch(url);
    const payload = await response.json();

    if (payload.status !== "OK") {
        throw new Error(`Google Place Details failed with status: ${payload.status || "unknown"}`);
    }

    const result = payload.result;
    return {
        businessName: result.name || "Detail Dogs",
        source: "Google Business Profile",
        profileUrl: result.url || fallbackProfileUrl,
        updatedAt: new Date().toISOString().slice(0, 10),
        rating: result.rating || null,
        reviewCount: result.user_ratings_total || null,
        reviews: (result.reviews || []).map((review) => ({
            author: review.author_name || "Google reviewer",
            rating: review.rating || null,
            relativeTimeDescription: review.relative_time_description || "",
            category: review.rating ? `${review.rating} / 5 Google Review` : "Google Review",
            text: review.text || "",
            source: "Google"
        })).filter((review) => review.text)
    };
}

async function readCurrentData() {
    const json = await fs.readFile(dataPath, "utf8");
    return JSON.parse(json);
}

async function updateReviewsPage(data) {
    const page = await fs.readFile(reviewsPagePath, "utf8");
    const nextBlock = renderGoogleReviews(data);
    const markerPattern = /            <!-- GOOGLE_REVIEWS_START -->[\s\S]*?            <!-- GOOGLE_REVIEWS_END -->/;

    if (!markerPattern.test(page)) {
        throw new Error("Could not find GOOGLE_REVIEWS_START / GOOGLE_REVIEWS_END markers in reviews/index.html");
    }

    await fs.writeFile(reviewsPagePath, page.replace(markerPattern, nextBlock), "utf8");
}

const liveData = await fetchGoogleReviews();
const data = liveData || await readCurrentData();

if (liveData) {
    await fs.writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

await updateReviewsPage(data);

if (!liveData) {
    console.log("No Google API key found. Refreshed reviews page from reviews/google-reviews.json.");
    console.log("Set GOOGLE_MAPS_API_KEY and either GOOGLE_PLACE_ID or GOOGLE_PLACE_QUERY to pull live Google reviews.");
} else {
    console.log(`Updated ${data.reviews.length} Google reviews for ${data.businessName}.`);
}

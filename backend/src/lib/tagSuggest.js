/**
 * Suggested tags for the composer.
 *
 * An author posting an Echo has to name the tags themselves, and the corpus is the
 * only place that knows which names are worth naming. A tag earns its keep on two
 * axes that pull against each other:
 *
 *   - it has to be widespread enough that a live Feed Scroll references it, or the
 *     Echo it is attached to lands nowhere; and
 *   - it has to be specific enough to niche the Echo, or it lands everywhere.
 *
 * The engine here is a small vector-space retrieval model over the existing corpus.
 * Every tag is turned into a weighted vector from the *content of the Echoes that
 * carry it* — its vocabulary, learned from real usage, with the tag's own name
 * stripped out. A draft is scored by cosine similarity against those vectors, so a
 * draft about iambic meter can reach `#poetry` without the word "poetry" appearing
 * anywhere in it. A literal name match is a separate, deliberately minor signal.
 *
 * There is no model, no network call and no dependency: it reads the collections it
 * already has, is deterministic, and runs offline. The corpus decides.
 *
 * Tag counts are read live from the index, which is built from the collections —
 * nothing about a tag's usage is stored on the tag itself.
 */

import Tag from "../models/tag.model.js";
import Echo from "../models/echo.model.js";
import Scroll from "../models/scroll.model.js";

// ---------------------------------------------------------------------------
// Tunables. The breadth/specificity balance in particular wants revisiting once
// real output has been read; everything here is meant to be moved.
// ---------------------------------------------------------------------------

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 8;

/** How many of a tag's most distinctive terms define its vector. */
const TOP_TERMS = 80;

// Score = (W_LEX·cosine + W_NAME·nameHit + W_COOC·cooc) · specificity · placement · inUse
const W_LEX = 1;
const W_NAME = 0.6;
const W_COOC = 0.5;

/** How hard to push back on tags that blanket the corpus. */
const BROAD_K = 6;

/** How much a tag that sits in live Feed Scrolls is lifted. */
const PLACE_W = 0.6;

/** Floor for a tag with a single Echo, so obscure names aren't erased. */
const INUSE_FLOOR = 0.5;

/** How many top-scoring candidates seed the co-occurrence expansion. */
const SEEDS = 3;

/** A seed must clear this cosine to be trusted to drag in neighbours. */
const MIN_SEED = 0.1;

/** Share of a seed's Echoes a neighbour must appear alongside to be admitted. */
const COOC_ADMIT = 0.15;

/** MMR trade-off: higher means more spread, less raw relevance. */
const MMR_LAMBDA = 0.4;

/** Below this, nothing is worth offering. */
const MIN_SCORE = 0.08;

/** Candidates within this fraction of the best score are eligible for MMR. */
const MIN_CANDIDATE_FRACTION = 0.15;

/** Index freshness. */
const INDEX_TTL_MS = 5 * 60 * 1000;

// ---------------------------------------------------------------------------
// Text. One tokenizer for both sides of the comparison, so however imperfect the
// stemming is, the draft and the profiles are put through the same lossy function.
// Deliberately conservative: plurals and possessives only. Aggressive stemming
// invents merges ("movies" -> "movy") in a corpus this literary.
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "as", "at", "be", "because", "been", "before", "being", "below",
    "between", "both", "but", "by", "can", "did", "do", "does", "doing", "down",
    "during", "each", "few", "for", "from", "further", "had", "has", "have",
    "having", "he", "her", "here", "hers", "him", "his", "how", "i", "if", "in",
    "into", "is", "it", "its", "just", "me", "more", "most", "my", "no", "nor",
    "not", "now", "of", "off", "on", "once", "only", "or", "other", "our", "out",
    "over", "own", "same", "she", "should", "so", "some", "such", "than", "that",
    "the", "their", "them", "then", "there", "these", "they", "this", "those",
    "through", "to", "too", "under", "until", "up", "very", "was", "we", "were",
    "what", "when", "where", "which", "while", "who", "whom", "why", "will",
    "with", "would", "you", "your",
]);

/** Minimal, safe morphological collapse: plurals and possessives only. */
export const stem = (token) => {
    if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) {
        return token.slice(0, -1);
    }
    return token;
};

/** Tokens for a piece of prose — stopwords and one-letter noise dropped. */
export const tokenize = (text) => {
    if (!text) return [];
    return String(text)
        .toLowerCase()
        .replace(/[‘’]/g, "'")
        .replace(/'s\b/g, "")
        .replace(/[^a-z0-9']+/g, " ")
        .split(/\s+/)
        .map((token) => token.replace(/^'+|'+$/g, ""))
        .filter((token) => token.length >= 2 && !STOPWORDS.has(token));
};

/**
 * Tokens for a tag name. Stopwords and length filters do not apply here — a tag
 * called "ai" or "the" is still a name, and it has to survive to be matched.
 */
const nameTokens = (name) =>
    String(name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .map(stem);

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

/**
 * Build the retrieval index from plain corpus rows — no database, so this is the
 * seam the tests use.
 *
 * @param {{tags: Array, echos: Array, scrolls: Array}} corpus
 */
export const buildIndex = ({ tags = [], echos = [], scrolls = [] } = {}) => {
    const nameById = new Map();
    for (const tag of tags) nameById.set(String(tag._id), tag.name);

    const N = echos.length;

    // Per-tag term counts (the tag's own name tokens removed), corpus term
    // frequencies, and tag co-occurrence over shared Echoes.
    const tagTermCounts = new Map();   // tagId -> Map(term -> count)
    const termDf = new Map();          // term -> number of Echoes containing it
    const df = new Map();              // tagId -> number of Echoes carrying it
    const cooc = new Map();            // tagId -> Map(tagId -> shared Echo count)

    for (const echo of echos) {
        const ids = [...new Set((echo.tags || []).map(String))].filter((id) => nameById.has(id));

        for (const id of ids) {
            df.set(id, (df.get(id) || 0) + 1);
        }
        for (const a of ids) {
            let row = cooc.get(a);
            if (!row) {
                row = new Map();
                cooc.set(a, row);
            }
            for (const b of ids) {
                if (a !== b) row.set(b, (row.get(b) || 0) + 1);
            }
        }

        const tokens = tokenize(echo.content).map(stem);
        if (tokens.length === 0) continue;

        const counts = new Map();
        for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
        for (const term of counts.keys()) termDf.set(term, (termDf.get(term) || 0) + 1);

        for (const id of ids) {
            const own = new Set(nameTokens(nameById.get(id)));
            let row = tagTermCounts.get(id);
            if (!row) {
                row = new Map();
                tagTermCounts.set(id, row);
            }
            for (const [term, count] of counts) {
                if (own.has(term)) continue;
                row.set(term, (row.get(term) || 0) + count);
            }
        }
    }

    const idf = new Map();
    for (const [term, count] of termDf) {
        idf.set(term, Math.log(1 + N / (1 + count)));
    }

    // Each tag becomes a unit-length tf-idf vector over its most distinctive
    // terms, stored inverted: term -> (tag -> weight). Scoring a draft then only
    // touches the terms the draft actually contains.
    const postings = new Map();
    const meta = new Map();

    for (const [tagId, counts] of tagTermCounts) {
        const weighted = [];
        for (const [term, count] of counts) {
            const weight = count * (idf.get(term) || 0);
            if (weight > 0) weighted.push([term, weight]);
        }
        if (weighted.length === 0) continue;

        weighted.sort((a, b) => b[1] - a[1]);
        const kept = weighted.slice(0, TOP_TERMS);
        const norm = Math.sqrt(kept.reduce((sum, [, weight]) => sum + weight * weight, 0));
        if (norm === 0) continue;

        for (const [term, weight] of kept) {
            let row = postings.get(term);
            if (!row) {
                row = new Map();
                postings.set(term, row);
            }
            row.set(tagId, weight / norm);
        }
    }

    // Live placement: how many public Feed Scrolls would actually admit an Echo
    // carrying this tag.
    const reach = new Map();
    for (const scroll of scrolls) {
        const included = scroll?.feedConfig?.includedTags || [];
        for (const tagId of new Set(included.map(String))) {
            if (nameById.has(tagId)) reach.set(tagId, (reach.get(tagId) || 0) + 1);
        }
    }

    let maxDf = 0;
    let maxReach = 0;
    for (const [tagId, name] of nameById) {
        const tagDf = df.get(tagId) || 0;
        const tagReach = reach.get(tagId) || 0;
        if (tagDf > maxDf) maxDf = tagDf;
        if (tagReach > maxReach) maxReach = tagReach;
        meta.set(tagId, { name, nameStems: nameTokens(name), df: tagDf, reach: tagReach });
    }

    return { N, idf, postings, cooc, meta, maxDf, maxReach };
};

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Rank corpus tags against a draft.
 *
 * @param {object} index      - from buildIndex
 * @param {string} content    - the draft Echo
 * @param {{exclude?: string[], limit?: number}} [options]
 * @returns {Array<{name, score, echoCount, feedCount}>}
 */
export const suggestTags = (index, content, { exclude = [], limit = DEFAULT_LIMIT } = {}) => {
    const max = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
    const tokens = tokenize(content).map(stem);
    if (tokens.length === 0) return [];

    const excluded = new Set((exclude || []).map((name) => String(name).trim().toLowerCase()));
    const draftStems = new Set(tokens);

    const counts = new Map();
    for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);

    // Draft tf-idf vector, and its length, computed once.
    const query = new Map();
    let querySq = 0;
    for (const [term, count] of counts) {
        const weight = count * (index.idf.get(term) || 0);
        if (weight > 0) {
            query.set(term, weight);
            querySq += weight * weight;
        }
    }
    if (querySq === 0) return [];
    const queryNorm = Math.sqrt(querySq);

    // Cosine similarity against every tag vector the draft touches.
    const cosine = new Map();
    for (const [term, weight] of query) {
        const row = index.postings.get(term);
        if (!row) continue;
        for (const [tagId, tagWeight] of row) {
            cosine.set(tagId, (cosine.get(tagId) || 0) + weight * tagWeight);
        }
    }
    for (const [tagId, value] of cosine) cosine.set(tagId, value / queryNorm);

    // Candidates: any tag with vocabulary overlap, plus any tag the draft names.
    const candidates = new Map();
    for (const [tagId, info] of index.meta) {
        if (excluded.has(info.name.toLowerCase())) continue;
        const similarity = cosine.get(tagId) || 0;
        const nameHit = info.nameStems.length > 0 && info.nameStems.every((stemmed) => draftStems.has(stemmed));
        if (similarity <= 0 && !nameHit) continue;
        candidates.set(tagId, { tagId, info, similarity, nameHit });
    }
    if (candidates.size === 0) return [];

    // The seeds of the expansion: the tags the draft's own vocabulary already
    // speaks for, confidently enough to vouch for their neighbours.
    const seeds = [...candidates.values()]
        .filter((candidate) => candidate.similarity >= MIN_SEED)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, SEEDS);

    if (seeds.length === 0 && ![...candidates.values()].some((c) => c.nameHit)) return [];

    // One round of expansion. A tag that shares Echoes with a seed earns a place
    // even with *no* vocabulary overlap at all — this is the whole point: the
    // draft about pitching a seed round can reach "technology" through the
    // company it keeps, not the words it uses.
    for (const seed of seeds) {
        const neighbours = index.cooc.get(seed.tagId);
        if (!neighbours) continue;
        for (const [otherId, shared] of neighbours) {
            if (candidates.has(otherId)) continue;
            const info = index.meta.get(otherId);
            if (!info || excluded.has(info.name.toLowerCase())) continue;
            if (shared / seed.info.df < COOC_ADMIT) continue;
            candidates.set(otherId, { tagId: otherId, info, similarity: 0, nameHit: false });
        }
    }

    const scored = [...candidates.values()].map((candidate) => {
        const { tagId, info, similarity, nameHit } = candidate;

        let coocRaw = 0;
        for (const seed of seeds) {
            if (seed.tagId === tagId) continue;
            const shared = index.cooc.get(seed.tagId)?.get(tagId) || 0;
            if (shared > 0 && seed.info.df > 0) coocRaw += shared / seed.info.df;
        }
        const coocNorm = Math.min(coocRaw, 1);

        const base = W_LEX * similarity + (nameHit ? W_NAME : 0) + W_COOC * coocNorm;

        // Broad tags: penalised, but gently, so "widespread" still counts for
        // something until a tag genuinely blankets the corpus.
        const breadth = index.N > 0 ? info.df / index.N : 0;
        const specificity = 1 / (1 + BROAD_K * breadth);

        const placement = 1 + PLACE_W *
            (index.maxReach > 0 ? Math.log1p(info.reach) / Math.log1p(index.maxReach) : 0);

        const inUse = index.maxDf > 1
            ? INUSE_FLOOR + (1 - INUSE_FLOOR) * (Math.log1p(info.df) / Math.log1p(index.maxDf))
            : 1;

        return {
            tagId,
            name: info.name,
            df: info.df,
            echoCount: info.df,
            feedCount: info.reach,
            score: base * specificity * placement * inUse,
        };
    }).filter((row) => row.score > 0);

    if (scored.length === 0) return [];
    scored.sort((a, b) => b.score - a.score);
    if (scored[0].score < MIN_SCORE) return [];

    // MMR: keep the best, then prefer candidates that say something new. Without
    // this the list is five near-synonyms; with it a widespread anchor and a
    // tight niche tag can sit side by side.
    const top = scored[0].score;
    const remaining = scored.filter((row) => row.score >= MIN_CANDIDATE_FRACTION * top);
    const selected = [];

    while (selected.length < max && remaining.length > 0) {
        let bestIndex = 0;
        let bestValue = -Infinity;
        for (let i = 0; i < remaining.length; i++) {
            const candidate = remaining[i];
            let overlap = 0;
            for (const chosen of selected) {
                const shared = index.cooc.get(candidate.tagId)?.get(chosen.tagId) || 0;
                const union = Math.min(candidate.df, chosen.df) || 1;
                overlap = Math.max(overlap, shared / union);
            }
            const value = (1 - MMR_LAMBDA) * (candidate.score / top) - MMR_LAMBDA * overlap;
            if (value > bestValue) {
                bestValue = value;
                bestIndex = i;
            }
        }
        selected.push(remaining[bestIndex]);
        remaining.splice(bestIndex, 1);
    }

    return selected.map((row) => ({
        name: row.name,
        score: Number(row.score.toFixed(4)),
        echoCount: row.echoCount,
        feedCount: row.feedCount,
    }));
};

// ---------------------------------------------------------------------------
// Cached corpus loader
// ---------------------------------------------------------------------------

let cache = null;

/** Drop the cached index. Called whenever an Echo's tags may have changed. */
export const invalidateTagIndex = () => {
    cache = null;
};

/** Build (or reuse) the index from the live collections. */
export const getTagIndex = async () => {
    if (cache && Date.now() - cache.builtAt < INDEX_TTL_MS) return cache.index;

    const [tags, echos, scrolls] = await Promise.all([
        Tag.find({}, "name").lean(),
        Echo.find({}, "content tags").lean(),
        Scroll.find({ type: "feed", isPrivate: false }, "feedConfig.includedTags").lean(),
    ]);

    const index = buildIndex({ tags, echos, scrolls });
    cache = { index, builtAt: Date.now() };
    return index;
};

/** Convenience: load the index and rank a draft against it. */
export const suggestTagsForContent = async (content, options) => {
    const index = await getTagIndex();
    return suggestTags(index, content, options);
};

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The product's intended audience is the **general public** — everyday social-media users who are tired of opaque, algorithm-driven feeds and want to decide for themselves what they see. On Echo they read short text posts, publish their own, follow people, and assemble their own feeds by hand or by rule.

Separately, the **real-world goal of this project is a portfolio showcase**: its most important "user" is a viewer evaluating the maker's craft (recruiter, peer, reviewer). Both audiences are real and both shape design — see Product Principles.

## Product Purpose

Echo is a social platform for short text posts, built around one idea captured in its own tagline: **"Ditch the Algorithm. Curate Your Feed."** Instead of an opaque ranking deciding what you see, you build your own views with **Scrolls**.

- **Echos** — concise text posts (the atomic content unit).
- **Scrolls** — the way content is organized and discovered. Two kinds:
  - **Curations**: hand-picked collections of Echos (a manual list you assemble and can share).
  - **Feeds**: self-configured dynamic views defined by declarative rules (tags, authors, dates, sort order) — a transparent, user-authored "algorithm."

Success for this project means **impressing the viewer**: because it is a portfolio piece, the design bar is bold, memorable, and portfolio-grade craft — while remaining a believable, genuinely usable social product, not a hollow demo.

## Positioning

The mechanism a neighboring product could not truthfully copy is **user-built feeds**. Where Twitter/Threads impose an opaque ranking, Echo hands the ranking to the user:

- **Feed Scrolls** are declarative and transparent — `tagMatchType` (all / any / none), included/excluded tags, author filters, date range, `sortBy` (most-liked / newest / oldest), a time window for "most liked" (1 day / 1 month / 1 year / all time), and an "exclude Echos I've already liked" option.
- **Curation Scrolls** are the manual counterpart — a curated collection rather than a rule.

The stance is anti-algorithm and pro-control: "No algorithms, no noise — just the Echos that matter to you."

## Operating Context

- Single-page web app; desktop and mobile web (mobile web is still web, not native).
- **Auth wall**: unauthenticated visitors see the marketing landing page, login, and signup only. Authenticated users get the full app (home feed, Scrolls, community/browse, search, profile, settings). A splash screen shows on load.
- **Core loops**: compose an Echo (optionally tagged) → it becomes available to feeds and search; browse and search across Echos, Scrolls, users, and tags; build and save Scrolls (curation or feed); follow users; like, dislike, and reply to Echos.

## Capabilities and Constraints

- **Echos**: text content up to 1000 characters; tags; likes and dislikes; threaded replies up to 500 characters each.
- **Scrolls**: two mutually exclusive types — `curation` (an ordered list of manually added Echos) and `feed` (dynamic, driven by `feedConfig` as described in Positioning). Scrolls can be private or public and can be saved by other users.
- **Tags**: globally unique named tags; the backbone of both discovery and feed filtering.
- **Users**: identified by **username + password only** (username min 3, password min 4 chars). There is **no email address** on the account, and therefore no email verification or password-reset flow. Users have a bio and lists of saved and created Scrolls.
- **Search**: across Echos, Scrolls, users, and tags (historically labeled "beta").
- **Technical constraints future design work must respect** (existing codebase, do not re-decide):
  - Frontend: React 19 SPA on Vite; **Tailwind CSS v4 + DaisyUI v5** for styling and theming (semantic tokens like `base-100/200/300`, `neutral`, `primary`, `base-content`); Zustand for state; React Router v7; **GSAP** for animation; `lucide-react` icons; `react-hot-toast` for notifications.
  - Backend: Express + MongoDB (Mongoose); cookie-based JWT auth.
- **Terminology (binding, used throughout code, routes, and copy)**: *Echo* = a post; *Scroll* = a collection or feed; *Curation* = a manual Scroll; *Feed* = a rule-based Scroll; *Tag*; *Community* = the social/following layer.

## Brand Commitments

- **Name**: Echo.
- **Product vocabulary** (Echo / Scroll / Curation / Feed / Tag) is central and binding — it is the product's identity, not incidental labeling.
- **Logo assets on hand** (in `frontend/public/`): `logo.svg`, `logo_large.svg`, `logo_only.png`, `logo_only_white.svg`, `logo_white.png`, `initial_white.svg`.
- **Existing brand signal**: the HTML `theme-color` is `#0d436d` (a deep blue). Recorded as an existing fact only; init does not define or lock the visual world.
- **Voice, as expressed in current copy** (observed, not user-locked): direct, empowering, lightly rebellious, and concise — e.g. "Ditch the Algorithm," "you're in control," "no noise." Future work may honor or deliberately evolve it, but should not contradict it without reason.

## Evidence on Hand

- The platform has **some genuine usage and content**, but the landing-page figures — "10K+ Users," "50K+ Echos," "5K+ Scrolls," "100% Your Control" — are **illustrative and rounded, not verified metrics**. Future work must not present them as precise or as proof of scale.
- **No testimonials, press, case studies, named customers, or benchmarks exist.** Future work must not fabricate them.
- Real assets: the logo set listed above.
- The strongest proof is the **working product itself** — auth, Echos, Scrolls (both types), tags, follow, search, replies, and likes are all functional. A live walkthrough is the primary demonstration.

## Product Principles

1. **Control is the product.** Every surface should make "you decide what you see" visible and effortless — never bury Scroll-building or imply an imposed algorithm. If a choice makes the user's authorship of their feed clearer, prefer it.
2. **Craft is the deliverable.** Because success is impressing the viewer, aim for a bold, memorable, portfolio-grade bar rather than the safe default — while keeping it a believable, usable real product, not a showreel of effects.
3. **Honest claims only.** With just "some real usage," never present illustrative stats as verified, and never invent testimonials, precise metrics, or proof of scale.
4. **Reward brevity.** Echos are short by design; favor fast scanning, quick composition, and low-friction reading over dense or heavyweight layouts.
5. **Two ways to curate, one mental model.** Keep the Curation (manual) vs. Feed (rule-based) distinction legible and consistent everywhere Scrolls appear, so the core concept never blurs.

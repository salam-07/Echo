---
name: Echo Editorial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dcdddd'
  on-secondary-container: '#5f6161'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 84px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 42px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
  stack-xl: 160px
  stack-md: 80px
---

## Brand & Style

This design system embodies "silence portrayed"—a sanctuary for digital consumption that prioritizes focus, intentionality, and quietude. The brand personality is poised, intellectual, and uncompromisingly minimalist. It targets an audience that values depth over speed and curation over algorithms.

The design style is **Editorial Minimalism**. It draws inspiration from high-end print journals and architectural theory, utilizing vast negative space to frame content as art. There are no decorative shadows or gradients; instead, the UI relies on strict structural alignment, hairline strokes, and the rhythmic interplay between dense typography and empty white space. The emotional response is one of calm, clarity, and authority.

## Colors

The palette is strictly monochromatic to ensure the UI recedes, allowing photography and typography to command attention.

- **Primary (#1A1A1A):** Used for all text, iconography, and high-emphasis borders. It provides the "ink" on the page.
- **Secondary (#F5F5F5):** A soft silver-grey used for subtle background shifts, distinguishing secondary sections (like curations) from the primary canvas.
- **Surface (#FFFFFF):** The foundational pure white. It is used to create "air" and perceived silence.

Interaction states should avoid color shifts. Use opacity changes (e.g., 60% opacity for hover) or subtle line-weight transitions to indicate state.

## Typography

The typographic system relies on a high-contrast pairing that mimics modern editorial layouts. 

**Playfair Display** is reserved for headlines and "Curations" titles. It should be typeset with tight tracking in large sizes to emphasize its elegant, high-contrast serifs. **Inter** provides a systematic, neutral counterpoint for body copy and "Scrolls" rules, ensuring high legibility and a contemporary, utilitarian feel. 

Large-scale display type (72px+) is a primary design element; use it to anchor the top of sections, allowing the text to bleed into the whitespace. All labels should be uppercase with generous letter spacing to act as structural markers.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. 

The spacing philosophy is "excessive air." Vertically, use `stack-xl` (160px) to separate major content sections, creating a sense of pause as the user scrolls. Horizontally, content should be centered within a 1280px container, though high-quality imagery may occasionally break the container to bleed to the edge of the viewport.

Photography should be treated as a structural element. Curations are displayed in an asymmetrical masonry layout, while "Scrolls" (rule-based feeds) follow a rigid, single-column vertical list to emphasize linear focus.

## Elevation & Depth

This system rejects shadows in favor of **Tonal Layering** and **Fine Lines**.

Depth is communicated through z-index stacking of flat surfaces. A "Scroll" or "Curation" may overlay a background image with 100% opacity, using a 1px hairline border (#1A1A1A at 10% opacity) to define the edge. Background blurs are not used; surfaces are either pure white or the subtle silver grey.

Line-based hierarchy is essential: use 1px horizontal rules to separate list items or header sections, echoing the structure of a newspaper or literary journal.

## Shapes

The shape language is strictly **Sharp (0px)**. 

Every UI element—from primary buttons to image containers and input fields—features 90-degree corners. This evokes a sense of architectural precision and formality. To maintain elegance without rounds, use ample internal padding (minimum 24px) within containers to ensure content never feels "trapped" by the sharp edges.

## Components

- **Buttons:** Rectangular with a 1px solid border. The primary button is solid #1A1A1A with white text; the secondary button is an "outline" style. No hover elevation—use a fill color inversion on hover.
- **Scrolls (Feeds):** Displayed as a clean list with 1px hairline dividers. Each entry uses `body-md` for content and `label-caps` for the rule-based metadata (e.g., "SOURCE / RELEVANCE").
- **Curations (Cards):** These are borderless containers where the image is the primary focus. The title (Playfair Display) sits below the image, left-aligned.
- **Input Fields:** A single 1px bottom border only (minimalist style). The label sits above in `label-caps`. Focus state is indicated by a weight increase of the bottom border to 2px.
- **Navigation:** A simple top bar with a text-based logo and 3-4 text links. No background fill; it should sit transparently over the white surface.
- **Image Treatment:** All photography must be monochrome or desaturated. Images should use `object-fit: cover` within sharp-edged containers.
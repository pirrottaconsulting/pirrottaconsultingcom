# SEO, LLMO, and Accessibility Notes

Updated May 18, 2026.

## SEO

- Descriptive page title and meta description.
- Canonical URLs.
- Open Graph and Twitter card metadata.
- `sitemap.xml` and `robots.txt`.
- Structured data using JSON-LD for the organization, website, services, and FAQ content.
- Semantic heading structure with one primary `h1` and section-level `h2`/`h3` content.
- Descriptive image alt text and explicit image dimensions to reduce layout shift.

## LLMO

- Added a visible FAQ section with concise answers to high-intent questions.
- Added root-level `llms.txt` and `llms-full.txt` files with a curated, model-readable site summary.
- Expanded structured data and on-page copy around services, audiences, and cost-saving community work.

`llms.txt` is an emerging convention, not an official W3C/IETF standard and not a guaranteed ranking signal. It is included because it is low-risk, readable, and useful as a concise source-of-truth document.

## Accessibility

- Mobile-first responsive layout with no horizontal overflow in tested desktop and mobile viewports.
- Skip link for keyboard users.
- Visible focus styles.
- Landmark elements for header, navigation, main content, and footer.
- Accessible link text and descriptive alt text.
- Decorative imagery marked with empty alt text or `aria-hidden`.
- High-contrast foreground/background color choices.
- Motion-reduction media query.

This is a WCAG-oriented implementation pass, not a legal certification.

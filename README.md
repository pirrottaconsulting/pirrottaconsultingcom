# Pirrotta Consulting Website

Static rebuild of `pirrottaconsulting.com`, replacing the current Carrd website with a lightweight site prepared for GitHub and AWS static hosting.

## Structure

- `index.html` - main website
- `404.html` - themed not-found page for missing routes
- `privacy.html` - Privacy Policy
- `terms.html` - Terms of Service
- `standard-terms.html` - legacy Standard Terms page retained, but no longer linked from the footer or sitemap
- `assets/css/styles.css` - site styles
- `assets/js/main.js` - contact form submission handling
- `assets/images/` - optimized public assets from the current site
- `docs/dns-before-cutover.txt` - read-only DNS inventory captured before any web cutover
- `robots.txt` and `sitemap.xml` - SEO support files
- `llms.txt` and `llms-full.txt` - LLM-readable site summaries
- `infrastructure/contact-form/` - Lambda source for the AWS-backed contact form
- `docs/seo-llmo-accessibility-notes.md` - implementation notes

## Local Preview

Open `index.html` directly, or run a simple static server:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deployment Notes

The target production architecture is:

- Private S3 bucket for static files
- CloudFront distribution
- Origin Access Control for S3 access
- HTTPS only
- Compression enabled
- Security headers response policy
- Default root object: `index.html`
- ACM certificate in `us-east-1` for `pirrottaconsulting.com` and `www.pirrottaconsulting.com`

DNS and email were intentionally not changed during the rebuild.

Preview deployment details are documented in `docs/aws-static-hosting-plan.md`.

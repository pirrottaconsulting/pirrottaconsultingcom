# AWS Static Hosting Plan

No DNS cutover has been performed.

## Target Architecture

- S3 bucket: private, static files only
- CloudFront: public entry point
- Origin Access Control: grants CloudFront access to the private S3 bucket
- Viewer protocol policy: redirect HTTP to HTTPS
- Compression: enabled
- Default root object: `index.html`
- Response headers: managed security headers policy
- Custom certificate: ACM in `us-east-1` for `pirrottaconsulting.com` and `www.pirrottaconsulting.com`

## DNS Cutover Later

When the production CloudFront distribution is ready and the ACM certificate is issued, only web traffic records should change:

- Apex `A`/`AAAA` alias for `pirrottaconsulting.com` to CloudFront
- `www` alias or CNAME for `www.pirrottaconsulting.com` to CloudFront

Do not change nameservers, MX, SPF, DKIM, DMARC, mail-related TXT, SRV, or DreamHost email settings.

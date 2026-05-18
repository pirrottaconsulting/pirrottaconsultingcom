# AWS Static Hosting Plan

No DNS cutover has been performed.

## Target Architecture

- S3 bucket: `pirrottaconsultingcom-preview-796973506838`
- CloudFront distribution: `EKWXPWAA7WKD2`
- CloudFront preview URL: `https://dklmsl6csyyrp.cloudfront.net`
- Origin Access Control: `E1SKYG5CB013NG`
- CloudFront invalidation completed: `I4HRRBYF7VQE0R2JKDU3WBO1P5`
- Viewer protocol policy: redirect HTTP to HTTPS
- Compression: enabled
- Default root object: `index.html`
- Response headers: managed security headers policy
- Custom certificate requested in `us-east-1`: `arn:aws:acm:us-east-1:796973506838:certificate/68635dbf-6856-44e5-8100-046c8ab52602`

The CloudFront preview distribution intentionally uses the default CloudFront hostname and certificate. No domain aliases were attached because the ACM certificate requires DNS validation first, and DNS must not be changed yet.

## Pending ACM Validation Records

These are certificate validation records only. They are not web traffic cutover records and have not been added to DNS.

- `_483c5c2cb5866c22f7cfcee14cfb7600.pirrottaconsulting.com.` `CNAME` `_ee23b05ae3cfd79b8b4e6e89b367d999.jkddzztszm.acm-validations.aws.`
- `_1fdb8017e628f954cba3a405030c90a8.www.pirrottaconsulting.com.` `CNAME` `_b36ffdd9831eec3768998530d78a7b0d.jkddzztszm.acm-validations.aws.`

## DNS Cutover Later

When the production CloudFront distribution is ready and the ACM certificate is issued, only web traffic records should change:

- Apex `A`/`AAAA` alias for `pirrottaconsulting.com` to the production CloudFront distribution.
- `www` alias or CNAME for `www.pirrottaconsulting.com` to the production CloudFront distribution.

Do not change nameservers, MX, SPF, DKIM, DMARC, mail-related TXT, SRV, or DreamHost email settings.

## Records That Must Not Be Touched

- Nameservers: `ns1.dreamhost.com`, `ns2.dreamhost.com`, `ns3.dreamhost.com`
- MX: `mx1.mailchannels.net`, `mx2.mailchannels.net`
- SPF TXT: `v=spf1 mx include:netblocks.dreamhost.com include:relay.mailchannels.net -all`
- Any DKIM records
- Any DMARC records
- Any mail-related TXT records
- Any SRV records
- Any DreamHost email settings

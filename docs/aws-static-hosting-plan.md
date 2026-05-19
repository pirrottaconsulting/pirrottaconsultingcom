# AWS Static Hosting Plan

Last updated: 2026-05-19.

CloudFront is ready for website DNS cutover. No DreamHost DNS cutover has been performed from this repo/session.

## Target Architecture

- S3 bucket: `pirrottaconsultingcom-preview-796973506838`
- CloudFront distribution: `EKWXPWAA7WKD2`
- CloudFront preview URL: `https://dklmsl6csyyrp.cloudfront.net`
- Origin Access Control: `E1SKYG5CB013NG`
- CloudFront alternate domain names attached:
  - `pirrottaconsulting.com`
  - `www.pirrottaconsulting.com`
- CloudFront distribution status after alias/certificate update: `Deployed`
- Latest CloudFront invalidation completed: `IEHPWXWJI3BMWW5JEJP0F7CR7N`
- Viewer protocol policy: redirect HTTP to HTTPS
- Compression: enabled
- Default root object: `index.html`
- Response headers: managed security headers policy
- Custom certificate in `us-east-1`: `arn:aws:acm:us-east-1:796973506838:certificate/68635dbf-6856-44e5-8100-046c8ab52602`
- ACM certificate status: `ISSUED`
- ACM certificate issued at: `2026-05-19T19:47:30.985000-04:00`

The CloudFront distribution now uses the issued ACM certificate with `sni-only` support and `TLSv1.2_2021` minimum protocol version.

## ACM Validation Records

These are certificate validation records only. They are not web traffic cutover records. They were visible in public DNS and ACM validation succeeded on 2026-05-19.

- `_483c5c2cb5866c22f7cfcee14cfb7600.pirrottaconsulting.com.` `CNAME` `_ee23b05ae3cfd79b8b4e6e89b367d999.jkddzztszm.acm-validations.aws.`
- `_1fdb8017e628f954cba3a405030c90a8.www.pirrottaconsulting.com.` `CNAME` `_b36ffdd9831eec3768998530d78a7b0d.jkddzztszm.acm-validations.aws.`

Keep these ACM validation CNAMEs in DNS for certificate renewal.

## DNS Cutover Next

Only web traffic records should change in DreamHost:

- Replace the current apex website record:
  - Current observed record: `pirrottaconsulting.com` `A` `172.66.0.70`
  - New DreamHost record: root/blank host `ALIAS` pointing to `dklmsl6csyyrp.cloudfront.net`
- Replace the current `www` website record:
  - Current observed record: `www.pirrottaconsulting.com` `CNAME` `pirrottaconsulting.com`
  - New DreamHost record: host `www` `CNAME` pointing to `dklmsl6csyyrp.cloudfront.net`

Do not create a root/apex `CNAME`; use DreamHost `ALIAS` for the root domain and `CNAME` only for `www`.

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

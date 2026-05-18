# Contact Form AWS Notes

The public site posts contact form submissions to API Gateway, which invokes a Lambda function. The Lambda function sends email through Amazon SES.

## Resources

- API Gateway endpoint: `https://s7lky9n4k2.execute-api.us-east-1.amazonaws.com/contact`
- Lambda function: `pirrottaconsulting-contact-form`
- IAM role: `pirrottaconsulting-contact-form-lambda-role`

## Spam Controls

- Required dropdown reason with server-side allowlist.
- Required name, email, and message validation.
- Hidden honeypot field.
- Submission timing check to reject unrealistically fast bot submissions.
- Message and field length caps.
- CORS origin allowlist for the CloudFront preview URL and production domains.
- API Gateway stage throttling.
- No tracking scripts.

## Email Privacy

The recipient email address is stored in Lambda environment configuration and is not exposed in site HTML, JavaScript, `llms.txt`, or footer links.

## DNS/Email Safety

No MX, SPF, DKIM, DMARC, nameserver, SRV, DreamHost, or mail-related DNS settings were changed for this form.

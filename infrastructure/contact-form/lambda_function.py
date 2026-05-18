import json
import os
import re
import time
from html import escape

import boto3


ses = boto3.client("sesv2", region_name=os.environ.get("AWS_REGION", "us-east-1"))

ALLOWED_REASONS = {
    "Digital strategy",
    "AI and workflow systems",
    "E-commerce or fan growth",
    "Nonprofit, school, church, or community operations",
    "UX/UI or customer experience",
    "Speaking or advisory",
    "Something else",
}

ALLOWED_ORIGINS = {
    "https://dklmsl6csyyrp.cloudfront.net",
    "https://pirrottaconsulting.com",
    "https://www.pirrottaconsulting.com",
    "http://localhost:8080",
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def response(status_code, body, origin=None):
    allow_origin = origin if origin in ALLOWED_ORIGINS else "https://pirrottaconsulting.com"
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Headers": "content-type",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
        },
        "body": json.dumps(body),
    }


def clean(value, limit):
    value = str(value or "").strip()
    value = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", value)
    return value[:limit]


def lambda_handler(event, context):
    headers = event.get("headers") or {}
    origin = headers.get("origin") or headers.get("Origin")

    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return response(204, {}, origin)

    if origin and origin not in ALLOWED_ORIGINS:
        return response(403, {"ok": False, "message": "Origin not allowed."}, origin)

    try:
        payload = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return response(400, {"ok": False, "message": "Invalid request."}, origin)

    if clean(payload.get("company_website"), 200):
        return response(200, {"ok": True}, origin)

    started_at = int(payload.get("started_at") or 0)
    elapsed = int(time.time() * 1000) - started_at if started_at else 0
    if elapsed < 3000 or elapsed > 86400000:
        return response(400, {"ok": False, "message": "Please try submitting the form again."}, origin)

    name = clean(payload.get("name"), 90)
    email = clean(payload.get("email"), 160)
    organization = clean(payload.get("organization"), 120)
    reason = clean(payload.get("reason"), 90)
    message = clean(payload.get("message"), 3000)

    if not name or not EMAIL_RE.match(email) or reason not in ALLOWED_REASONS or len(message) < 20:
        return response(400, {"ok": False, "message": "Please complete the required fields."}, origin)

    source = os.environ["CONTACT_FROM"]
    destination = os.environ["CONTACT_TO"]
    subject = f"Pirrotta Consulting website inquiry: {reason}"
    ip = event.get("requestContext", {}).get("http", {}).get("sourceIp", "unknown")
    user_agent = clean(headers.get("user-agent") or headers.get("User-Agent"), 240)

    text_body = "\n".join(
        [
            "New Pirrotta Consulting website inquiry",
            "",
            f"Name: {name}",
            f"Email: {email}",
            f"Organization: {organization or 'Not provided'}",
            f"Reason: {reason}",
            "",
            "Message:",
            message,
            "",
            f"Source IP: {ip}",
            f"User agent: {user_agent}",
        ]
    )

    html_body = f"""
    <h2>New Pirrotta Consulting website inquiry</h2>
    <p><strong>Name:</strong> {escape(name)}</p>
    <p><strong>Email:</strong> {escape(email)}</p>
    <p><strong>Organization:</strong> {escape(organization or "Not provided")}</p>
    <p><strong>Reason:</strong> {escape(reason)}</p>
    <p><strong>Message:</strong></p>
    <p>{escape(message).replace(chr(10), "<br>")}</p>
    <hr>
    <p><small>Source IP: {escape(ip)}<br>User agent: {escape(user_agent)}</small></p>
    """

    ses.send_email(
        FromEmailAddress=source,
        Destination={"ToAddresses": [destination]},
        ReplyToAddresses=[email],
        Content={
            "Simple": {
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {
                    "Text": {"Data": text_body, "Charset": "UTF-8"},
                    "Html": {"Data": html_body, "Charset": "UTF-8"},
                },
            }
        },
    )

    return response(200, {"ok": True, "message": "Thanks. Your message has been sent."}, origin)

from urllib.parse import urlparse, parse_qs

TRUSTED_DOMAINS = {
    "localhost",
    "intelshield.com",
    "www.intelshield.com",
    "is.praveenai.tech",
}

SUSPICIOUS_LOGIN_PARAMS = {
    "redirect",
    "return",
    "next",
    "continue",
    "url",
}

def calculate_phishing_risk(data):
    """
    Returns incremental phishing risk score (0–5)
    """
    risk = 0

    url = data.get("url", "")
    hostname = data.get("hostname", "")
    referrer = data.get("referrer", "")

    parsed_url = urlparse(url)
    parsed_referrer = urlparse(referrer) if referrer else None

    query_params = parse_qs(parsed_url.query)

    # 1️⃣ Redirect-based phishing (VERY strong signal)
    for param in SUSPICIOUS_LOGIN_PARAMS:
        if param in query_params:
            risk += 2

    # 2️⃣ Referrer mismatch (strong signal)
    if parsed_referrer and parsed_referrer.hostname:
        if parsed_referrer.hostname not in TRUSTED_DOMAINS:
            if hostname in TRUSTED_DOMAINS:
                risk += 2

    # 3️⃣ Cross-domain login attempt
    if "/login" in parsed_url.path:
        if hostname not in TRUSTED_DOMAINS:
            risk += 3

    # 4️⃣ Excessive subdomain depth (look-alike attack)
    if hostname.count(".") >= 3:
        risk += 1

    # 5️⃣ @ symbol trick
    if "@" in parsed_url.netloc:
        risk += 3

    if risk > 0:
        print("🪝 PHISHING SIGNAL:", {
            "url": url,
            "referrer": referrer,
            "risk": risk
        })

    return risk

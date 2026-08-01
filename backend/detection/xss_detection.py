import re

XSS_PATTERNS = [
    r"(?i)<script.*?>.*?</script>",
    r"(?i)javascript:",
    r"(?i)onerror\s*=",
    r"(?i)onload\s*=",
    r"(?i)onclick\s*=",
    r"(?i)<iframe",
    r"(?i)<img.*?onerror",
]

def detect_xss(payload):
    for pattern in XSS_PATTERNS:
        if re.search(pattern, payload):
            return True
    return False
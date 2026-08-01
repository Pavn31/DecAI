import re

SQLI_PATTERNS = [
    r"(?i)(\bor\b|\band\b)\s+\d+\s*=\s*\d+",
    r"(?i)union\s+select",
    r"(?i)drop\s+table",
    r"(?i)insert\s+into",
    r"(?i)delete\s+from",
    r"(?i)update\s+\w+\s+set",
    r"(?i)--",
    r"(?i)/\*.*\*/",
]

def detect_sql_injection(payload):
    for pattern in SQLI_PATTERNS:
        if re.search(pattern, payload):
            return True
    return False
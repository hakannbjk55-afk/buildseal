import sys
import json

try:
    with open("tests/invalid_utf8.json","r",encoding="utf-8") as f:
        data = json.load(f)
    print("FAIL: invalid UTF-8 accepted")
    sys.exit(1)
except Exception as e:
    print("REJECT_OK")

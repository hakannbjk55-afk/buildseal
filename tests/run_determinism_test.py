import hashlib
import json
import sys

def canonicalize(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":")).encode("utf-8")

input_data = {
    "b": 2,
    "a": 1
}

canonical_bytes = canonicalize(input_data)
hash_value = hashlib.sha256(canonical_bytes).hexdigest()

GOLDEN = "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777"

if hash_value != GOLDEN:
    print("Determinism FAILED")
    sys.exit(1)

print("Determinism OK")

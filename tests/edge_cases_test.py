import hashlib
import json
import math
import sys
import unicodedata

MAX_DEPTH = 64

def norm_value(x, depth=0):
    if depth > MAX_DEPTH:
        raise ValueError("DEPTH_LIMIT_EXCEEDED")

    if isinstance(x, dict):
        return {k: norm_value(v, depth+1) for k, v in x.items()}

    if isinstance(x, list):
        return [norm_value(v, depth+1) for v in x]

    if isinstance(x, str):
        # NFC normalize
        return unicodedata.normalize("NFC", x)

    if isinstance(x, float):
        if math.isnan(x) or math.isinf(x):
            raise ValueError("NAN_INF_REJECTED")
        # -0.0 -> 0.0
        if x == 0.0:
            return 0.0
        return x

    return x

def canonical_bytes(obj):
    obj = norm_value(obj, 0)
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    # canonical text ending: single LF
    return (s + "\n").encode("utf-8")

def sha256hex(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()

def must_eq(a, b, msg):
    if a != b:
        print("FAIL:", msg)
        print(" A:", a)
        print(" B:", b)
        sys.exit(1)

def must_raise(fn, msg):
    try:
        fn()
    except Exception:
        return
    print("FAIL:", msg)
    sys.exit(1)

# 1) Key order determinism
h1 = sha256hex(canonical_bytes({"b":2,"a":1}))
h2 = sha256hex(canonical_bytes({"a":1,"b":2}))
must_eq(h1, h2, "key order should not affect hash")

# 2) -0.0 normalization
h3 = sha256hex(canonical_bytes({"x":-0.0}))
h4 = sha256hex(canonical_bytes({"x":0.0}))
must_eq(h3, h4, "-0.0 should normalize to 0.0")

# 3) Unicode NFC normalization (é vs e +  ́)
h5 = sha256hex(canonical_bytes({"s":"é"}))
h6 = sha256hex(canonical_bytes({"s":"e\u0301"}))
must_eq(h5, h6, "unicode NFC should match")

# 4) Depth limit (65 should fail)
def deep_obj(n):
    x = 1
    for _ in range(n):
        x = {"x": x}
    return x
must_raise(lambda: canonical_bytes(deep_obj(65)), "depth > 64 must fail")

# 5) NaN/Inf must fail
must_raise(lambda: canonical_bytes({"x": float("nan")}), "NaN must fail")
must_raise(lambda: canonical_bytes({"x": float("inf")}), "Inf must fail")

print("EDGE_CASES_OK")

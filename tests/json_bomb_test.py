import sys, json, hashlib

MAX_DEPTH = 64

def make_deep(depth):
    x = 0
    for _ in range(depth):
        x = [x]
    return x

def depth_check_iter(x):
    stack = [(x, 0)]
    while stack:
        v, d = stack.pop()
        if d > MAX_DEPTH:
            raise ValueError("DEPTH_LIMIT_EXCEEDED")
        if isinstance(v, list):
            for it in v:
                stack.append((it, d+1))
        elif isinstance(v, dict):
            for it in v.values():
                stack.append((it, d+1))

def canon_bytes(obj):
    depth_check_iter(obj)
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return (s + "\n").encode("utf-8")

# 1) Should PASS at depth 64
b1 = canon_bytes(make_deep(64))
h1 = hashlib.sha256(b1).hexdigest()

# 2) Should REJECT at depth 200
try:
    canon_bytes(make_deep(200))
    print("FAIL: depth 200 accepted")
    sys.exit(1)
except Exception:
    print("DEPTH_REJECT_OK")

print("DEPTH64_HASH:", h1)

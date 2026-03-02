import hashlib, json, unicodedata

def norm_value(x):
    if isinstance(x, dict):
        return {k: norm_value(v) for k, v in x.items()}
    if isinstance(x, list):
        return [norm_value(v) for v in x]
    if isinstance(x, str):
        return unicodedata.normalize("NFC", x)
    return x

def canonical_bytes(obj):
    obj = norm_value(obj)
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return (s + "\n").encode("utf-8")

with open("tests/big.json","r",encoding="utf-8") as f:
    data = json.load(f)

h = hashlib.sha256(canonical_bytes(data)).hexdigest()
print("BIG_HASH:", h)

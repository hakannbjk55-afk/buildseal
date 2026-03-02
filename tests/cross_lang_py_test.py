import json, hashlib

def canon(x):
    if x is None: return "null"
    if x is True: return "true"
    if x is False: return "false"
    if isinstance(x, str):
        return json.dumps(x, ensure_ascii=False, separators=(",",":"))
    if isinstance(x, int):
        return str(x)
    if isinstance(x, float):
        raise ValueError("FLOAT_REJECTED")
    if isinstance(x, list):
        return "[" + ",".join(canon(v) for v in x) + "]"
    if isinstance(x, dict):
        keys = sorted(x.keys())
        return "{" + ",".join(json.dumps(k, ensure_ascii=False, separators=(",",":")) + ":" + canon(x[k]) for k in keys) + "}"
    raise ValueError("UNSUPPORTED")

raw = open("test_vectors/cross_lang_001.json","r",encoding="utf-8").read()
obj = json.loads(raw)
out = canon(obj) + "\n"
h = hashlib.sha256(out.encode("utf-8")).hexdigest()
print("PY_SHA256:", h)

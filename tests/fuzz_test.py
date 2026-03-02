import json, random, string, hashlib, sys, unicodedata, math

SEED = 1337
N = 1000
MAX_DEPTH = 20

random.seed(SEED)

def rand_str():
    # bazen birleşik unicode (NFC/NFD) üretelim
    base = random.choice(["e\u0301", "é", "a", "Z", "ğ", "ş", "İ"])
    tail = "".join(random.choice(string.ascii_letters) for _ in range(random.randint(0, 8)))
    return base + tail

def rand_num():
    t = random.randint(0, 9)
    if t == 0: return 0.0
    if t == 1: return -0.0
    if t == 2: return random.randint(-10**6, 10**6)
    if t == 3: return random.random() * random.randint(-1000, 1000)
    if t == 4: return 1.23456789012345
    if t == 5: return 2**53 - 1
    if t == 6: return -(2**53 - 1)
    if t == 7: return 0
    if t == 8: return 42
    return -7

def rand_value(depth=0):
    if depth >= MAX_DEPTH:
        return rand_str()
    t = random.randint(0, 9)
    if t <= 2:
        return rand_str()
    if t <= 4:
        return rand_num()
    if t == 5:
        return random.choice([True, False, None])
    if t == 6:
        # list
        return [rand_value(depth+1) for _ in range(random.randint(0, 6))]
    # dict
    d = {}
    for _ in range(random.randint(0, 6)):
        d[rand_str()] = rand_value(depth+1)
    return d

def norm_value(x, depth=0):
    if depth > 64:
        raise ValueError("DEPTH_LIMIT_EXCEEDED")
    if isinstance(x, dict):
        return {k: norm_value(v, depth+1) for k, v in x.items()}
    if isinstance(x, list):
        return [norm_value(v, depth+1) for v in x]
    if isinstance(x, str):
        return unicodedata.normalize("NFC", x)
    if isinstance(x, float):
        if math.isnan(x) or math.isinf(x):
            raise ValueError("NAN_INF_REJECTED")
        if x == 0.0:
            return 0.0
        return x
    return x

def canonical_bytes(obj):
    obj = norm_value(obj, 0)
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return (s + "\n").encode("utf-8")

def sha(b): return hashlib.sha256(b).hexdigest()

hashes = []
for i in range(N):
    x = rand_value(0)
    b = canonical_bytes(x)
    h = sha(b)
    hashes.append(h)

# determinism check: aynı seed aynı sonuç üretmeli
random.seed(SEED)
hashes2 = []
for i in range(N):
    x = rand_value(0)
    b = canonical_bytes(x)
    hashes2.append(sha(b))

if hashes != hashes2:
    print("FUZZ_DETERMINISM_FAIL")
    sys.exit(1)

print("FUZZ_OK", N)

import sys, math
from decimal import Decimal

def esc(s: str) -> str:
    out = []
    for ch in s:
        o = ord(ch)
        if ch == '"': out.append('\\"')
        elif ch == '\\': out.append('\\\\')
        elif ch == '\b': out.append('\\b')
        elif ch == '\f': out.append('\\f')
        elif ch == '\n': out.append('\\n')
        elif ch == '\r': out.append('\\r')
        elif ch == '\t': out.append('\\t')
        elif o < 0x20:
            out.append('\\u%04x' % o)
        else:
            out.append(ch)
    return '"' + ''.join(out) + '"'

def is_neg_zero_num(x):
    return isinstance(x, float) and x == 0.0 and math.copysign(1.0, x) < 0

def jcs_num(n):
    # STRICT: float yok (RFC8785 number formatting zor; burada policy olarak reddediyoruz)
    if isinstance(n, bool) or n is None:
        raise TypeError("not a number")
    if isinstance(n, float) or isinstance(n, Decimal):
        raise ValueError("FLOAT_REJECTED_STRICT")
    if not isinstance(n, int):
        raise ValueError("NUMBER_TYPE_REJECTED")
    # -0 yok (int'te yok zaten)
    return str(n)

def jcs(x):
    if x is None: return "null"
    if x is True: return "true"
    if x is False: return "false"
    if isinstance(x, str): return esc(x)
    if isinstance(x, int): return jcs_num(x)
    if isinstance(x, float):
        if is_neg_zero_num(x): raise ValueError("NEG_ZERO_REJECTED_STRICT")
        raise ValueError("FLOAT_REJECTED_STRICT")
    if isinstance(x, list):
        return "[" + ",".join(jcs(v) for v in x) + "]"
    if isinstance(x, dict):
        # keys: string olmalı, lexicographic by Unicode code point
        for k in x.keys():
            if not isinstance(k, str):
                raise ValueError("NON_STRING_KEY")
        keys = sorted(x.keys())
        return "{" + ",".join(esc(k) + ":" + jcs(x[k]) for k in keys) + "}"
    raise ValueError("UNSUPPORTED_TYPE")

def must_eq(a,b,msg):
    if a!=b:
        print("FAIL:", msg)
        print("A:", a)
        print("B:", b)
        sys.exit(1)

def must_fail(fn,msg):
    try:
        fn()
    except Exception:
        return
    print("FAIL:", msg)
    sys.exit(1)

# 1) Key ordering
must_eq(jcs({"b":2,"a":1}), '{"a":1,"b":2}', "key ordering")

# 2) String escaping (control chars)
must_eq(jcs({"s":"a\nb"}), '{"s":"a\\nb"}', "escape newline")

# 3) Non-string key reject
must_fail(lambda: jcs({1:"x"}), "non-string key must fail")

# 4) Float reject (strict policy)
must_fail(lambda: jcs({"x":1.0}), "float must fail")

print("JCS_STRICT_OK")

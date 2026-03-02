import hashlib

def normalize_newlines(data: bytes) -> bytes:
    data = data.replace(b'\r\n', b'\n')
    data = data.replace(b'\r', b'\n')
    return data

data_lf = b'{"a":1}\n'
data_crlf = b'{"a":1}\r\n'

h1 = hashlib.sha256(normalize_newlines(data_lf)).hexdigest()
h2 = hashlib.sha256(normalize_newlines(data_crlf)).hexdigest()

print("LF :", h1)
print("CRLF:", h2)

if h1 == h2:
    print("Now deterministic")
else:
    print("Still broken")

import hashlib

data_lf = b'{"a":1}\n'
data_crlf = b'{"a":1}\r\n'

h1 = hashlib.sha256(data_lf).hexdigest()
h2 = hashlib.sha256(data_crlf).hexdigest()

print("LF :", h1)
print("CRLF:", h2)

if h1 == h2:
    print("Same hash")
else:
    print("Different hash")

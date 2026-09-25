import os, struct, zlib

def png(size, path, fn):
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            raw += bytes(fn(x, y))
    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xffffffff)
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    blob = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
            + chunk(b"IEND", b""))
    with open(path, "wb") as f:
        f.write(blob)
    print(path, os.path.getsize(path), "bytes")

c0 = (217, 70, 239)
c1 = (139, 92, 246)

def base_icon(x, y, size):
    t = (x + y) / (2 * (size - 1))
    r = int(c0[0] + (c1[0] - c0[0]) * t)
    g = int(c0[1] + (c1[1] - c0[1]) * t)
    b = int(c0[2] + (c1[2] - c0[2]) * t)
    cx, cy = size / 2, size / 2 + size * 0.06
    R = size * 0.20
    hx, hy = cx - R * 0.45, cy + R * 0.75
    rx, ry = R * 0.72, R * 0.56
    if ((x - hx) / rx) ** 2 + ((y - hy) / ry) ** 2 < 1 or (
        abs(x - (hx + rx * 0.92)) < R * 0.17 and (hy - R * 1.9) < y < (hy + ry * 0.2)
    ):
        return (255, 255, 255, 255)
    return (r, g, b, 255)

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/public")
for name in ["icon-192.png", "icon-512.png", "icon-maskable-512.png"]:
    size = 192 if "192" in name else 512
    png(size, name, lambda x, y, s=size: base_icon(x, y, s))

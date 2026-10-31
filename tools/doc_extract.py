"""最小化的 OLE2 + Word97 (.doc) 文本提取器：只依赖标准库。

用法: python doc_extract.py <input.doc> <output.txt>
"""
import struct
import sys


class Ole:
    def __init__(self, data: bytes):
        self.d = data
        if data[:8] != b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1":
            raise ValueError("不是 OLE2 复合文档")
        self.ssz = 1 << struct.unpack_from("<H", data, 30)[0]
        self.mssz = 1 << struct.unpack_from("<H", data, 32)[0]
        self.n_fat = struct.unpack_from("<I", data, 44)[0]
        self.dir_start = struct.unpack_from("<I", data, 48)[0]
        self.mini_cutoff = struct.unpack_from("<I", data, 56)[0]
        self.minifat_start = struct.unpack_from("<I", data, 60)[0]
        self.n_minifat = struct.unpack_from("<I", data, 64)[0]
        self.difat_start = struct.unpack_from("<I", data, 68)[0]
        self.n_difat = struct.unpack_from("<I", data, 72)[0]
        self._load_difat()
        self._load_fat()
        self._load_dir()
        self._load_ministream()

    def _sector(self, idx: int) -> bytes:
        off = 512 + idx * self.ssz
        return self.d[off:off + self.ssz]

    def _load_difat(self):
        self.difat = list(struct.unpack_from("<109I", self.d, 76))
        sec = self.difat_start
        for _ in range(self.n_difat):
            if sec >= 0xFFFFFFFA:
                break
            buf = self._sector(sec)
            ents = struct.unpack_from("<%dI" % (self.ssz // 4), buf, 0)
            self.difat.extend(ents[:-1])
            sec = ents[-1]

    def _load_fat(self):
        self.fat = []
        for s in self.difat[: self.n_fat]:
            if s >= 0xFFFFFFFA:
                continue
            buf = self._sector(s)
            self.fat.extend(struct.unpack_from("<%dI" % (self.ssz // 4), buf, 0))

    def _chain(self, start: int):
        out, seen = [], set()
        s = start
        while s < 0xFFFFFFFA and s not in seen and s < len(self.fat):
            seen.add(s)
            out.append(s)
            s = self.fat[s]
        return out

    def _read_chain(self, start: int) -> bytes:
        return b"".join(self._sector(s) for s in self._chain(start))

    def _load_dir(self):
        raw = self._read_chain(self.dir_start)
        self.entries = []
        for i in range(0, len(raw), 128):
            e = raw[i:i + 128]
            if len(e) < 128:
                break
            nlen = struct.unpack_from("<H", e, 64)[0]
            name = e[: max(0, nlen - 2)].decode("utf-16-le", errors="ignore")
            etype = e[66]
            start = struct.unpack_from("<I", e, 116)[0]
            size = struct.unpack_from("<Q", e, 120)[0]
            self.entries.append((name, etype, start, size))

    def _load_ministream(self):
        self.ministream = b""
        self.minifat = []
        for name, etype, start, size in self.entries:
            if etype == 5:  # root
                self.ministream = self._read_chain(start)[:size]
                break
        if self.n_minifat and self.minifat_start < 0xFFFFFFFA:
            raw = self._read_chain(self.minifat_start)
            self.minifat = list(struct.unpack_from("<%dI" % (len(raw) // 4), raw, 0))

    def stream(self, name: str) -> bytes:
        for n, etype, start, size in self.entries:
            if etype == 2 and n == name:
                if size < self.mini_cutoff:
                    out, s, seen = b"", start, set()
                    while s < 0xFFFFFFFA and s not in seen and s < len(self.minifat):
                        seen.add(s)
                        out += self.ministream[s * self.mssz:(s + 1) * self.mssz]
                        s = self.minifat[s]
                    return out[:size]
                return self._read_chain(start)[:size]
        return b""


def extract_text(doc: bytes) -> str:
    ole = Ole(doc)
    wd = ole.stream("WordDocument")
    if not wd:
        raise ValueError("没有 WordDocument 流")

    flags = struct.unpack_from("<H", wd, 0x0A)[0]
    table_name = "1Table" if (flags >> 9) & 1 else "0Table"
    table = ole.stream(table_name)

    fc_clx, lcb_clx = struct.unpack_from("<II", wd, 0x01A2)
    clx = table[fc_clx:fc_clx + lcb_clx]

    i = 0
    pcdt = None
    while i < len(clx):
        tag = clx[i]
        if tag == 1:
            cb = struct.unpack_from("<H", clx, i + 1)[0]
            i += 3 + cb
        elif tag == 2:
            lcb = struct.unpack_from("<I", clx, i + 1)[0]
            pcdt = clx[i + 5:i + 5 + lcb]
            break
        else:
            break

    if not pcdt:
        raise ValueError("找不到 piece table")

    n = (len(pcdt) - 4) // 12
    cps = list(struct.unpack_from("<%dI" % (n + 1), pcdt, 0))
    pieces = []
    base = 4 * (n + 1)
    for k in range(n):
        fc = struct.unpack_from("<I", pcdt, base + k * 8 + 2)[0]
        compressed = bool(fc & 0x40000000)
        offset = (fc & 0x3FFFFFFF) // 2 if compressed else fc
        pieces.append((cps[k], cps[k + 1], offset, compressed))

    out = []
    for cp_start, cp_end, offset, compressed in pieces:
        length = cp_end - cp_start
        if compressed:
            raw = wd[offset:offset + length]
            out.append(raw.decode("cp1252", errors="ignore"))
        else:
            raw = wd[offset:offset + length * 2]
            out.append(raw.decode("utf-16-le", errors="ignore"))
    text = "".join(out)
    # Word 控制字符清洗
    text = text.replace("\r", "\n").replace("\x07", "\t").replace("\x0b", "\n")
    text = text.replace("\x0c", "\n").replace("\x01", "").replace("\x02", "")
    text = "".join(ch for ch in text if ch >= " " or ch == "\n" or ch == "\t")
    return text


def main():
    src, dst = sys.argv[1], sys.argv[2]
    data = open(src, "rb").read()
    text = extract_text(data)
    with open(dst, "w", encoding="utf-8") as f:
        f.write(text)
    print("chars:", len(text))
    print("lines:", text.count("\n"))


if __name__ == "__main__":
    main()

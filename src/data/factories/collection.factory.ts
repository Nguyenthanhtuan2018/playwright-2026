import fs from "fs";
import path from "path";
import zlib from "zlib";

export type CollectionDraft = {
  name: string;
  code: string;
  index: number;
  description?: string;
  imagePath: string;
};

const IMAGE_PATH = path.resolve(__dirname, "../files/collection-140.png");

/** Record CMS auto — prefix AUTO_ để lọc/tránh đụng data tay. */
export function newCollection(overrides: Partial<CollectionDraft> = {}): CollectionDraft {
  // Form CMS giới hạn Name 12 ký tự, Code 15 ký tự.
  const stamp = Date.now().toString(36).slice(-6);
  ensureCollectionImage();
  return {
    name: `AUTO_${stamp}`,
    code: `auto${stamp}`,
    index: 1,
    imagePath: IMAGE_PATH,
    ...overrides,
  };
}

export function ensureCollectionImage(): string {
  fs.mkdirSync(path.dirname(IMAGE_PATH), { recursive: true });
  if (!fs.existsSync(IMAGE_PATH)) fs.writeFileSync(IMAGE_PATH, buildPng(140, 140));
  return IMAGE_PATH;
}

function crc32(buf: Buffer): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function buildPng(width: number, height: number): Buffer {
  const stride = width * 3 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < width; x++) {
      const i = y * stride + 1 + x * 3;
      raw[i] = 27;
      raw[i + 1] = 96;
      raw[i + 2] = 176;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

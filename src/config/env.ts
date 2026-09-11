import fs from "fs";
import path from "path";

export function loadDotEnv(fileName = ".env"): void {
  const filePath = path.resolve(__dirname, "../..", fileName);
  if (!fs.existsSync(filePath)) return;

  for (const raw of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function env() {
  loadDotEnv();
  const baseURL = process.env.CMS_BASE_URL ?? "https://portal.shb.whitelabel.taptap.vn";
  const user = process.env.CMS_USER ?? "";
  const password = process.env.CMS_PASSWORD ?? "";
  if (!user || !password) {
    throw new Error("Thiếu CMS_USER hoặc CMS_PASSWORD. Copy .env.example thành .env rồi điền.");
  }
  return { baseURL, user, password };
}

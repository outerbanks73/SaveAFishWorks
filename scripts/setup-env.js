/**
 * Auto-creates .env and .env.local from .env.example if they don't exist.
 * Replaces USER placeholder with the current system username.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const example = path.join(root, ".env.example");
const targets = [".env", ".env.local"];

if (!fs.existsSync(example)) {
  console.log("[setup] .env.example not found, skipping");
  process.exit(0);
}

const template = fs.readFileSync(example, "utf-8");
const username = os.userInfo().username;
const content = template.replace(/USER@localhost/g, `${username}@localhost`);

for (const file of targets) {
  const dest = path.join(root, file);
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, content);
    console.log(`[setup] Created ${file} (DATABASE_URL user: ${username})`);
  } else {
    console.log(`[setup] ${file} already exists, skipping`);
  }
}

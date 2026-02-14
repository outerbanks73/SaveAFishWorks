/**
 * Auto-creates .env and .env.local from .env.example if they don't exist.
 * If they already exist, merges any NEW keys from .env.example (preserves existing values).
 * Replaces USER placeholder with the current system username.
 * Generates a random AUTH_SECRET if the placeholder value is present.
 */
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");

const root = path.resolve(__dirname, "..");
const example = path.join(root, ".env.example");
const targets = [".env", ".env.local"];

if (!fs.existsSync(example)) {
  console.log("[setup] .env.example not found, skipping");
  process.exit(0);
}

const username = os.userInfo().username;

/** Parse an env file into a Map of key → full line (preserves comments above keys). */
function parseEnvKeys(content) {
  const map = new Map();
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) map.set(match[1], line);
  }
  return map;
}

/** Apply dynamic substitutions to a value line. */
function substitute(line) {
  // Replace USER placeholder in DATABASE_URL
  line = line.replace(/USER@localhost/g, `${username}@localhost`);
  // Generate a real AUTH_SECRET instead of using the placeholder
  if (line.startsWith("AUTH_SECRET=") && line.includes("dev-secret-change-in-production")) {
    const secret = crypto.randomBytes(32).toString("base64");
    line = `AUTH_SECRET="${secret}"`;
  }
  return line;
}

const template = fs.readFileSync(example, "utf-8");
const templateKeys = parseEnvKeys(template);

for (const file of targets) {
  const dest = path.join(root, file);
  if (!fs.existsSync(dest)) {
    // Fresh creation — substitute all values
    const content = template
      .split("\n")
      .map((line) => substitute(line))
      .join("\n");
    fs.writeFileSync(dest, content);
    console.log(`[setup] Created ${file} (DATABASE_URL user: ${username})`);
  } else {
    // File exists — merge any NEW keys from .env.example
    const existing = fs.readFileSync(dest, "utf-8");
    const existingKeys = parseEnvKeys(existing);
    const newKeys = [];
    for (const [key, line] of templateKeys) {
      if (!existingKeys.has(key)) {
        newKeys.push(substitute(line));
      }
    }
    if (newKeys.length > 0) {
      const updated = existing.trimEnd() + "\n\n# Added by setup-env.js\n" + newKeys.join("\n") + "\n";
      fs.writeFileSync(dest, updated);
      console.log(`[setup] ${file}: added ${newKeys.length} new key(s): ${newKeys.map((l) => l.split("=")[0]).join(", ")}`);
    } else {
      console.log(`[setup] ${file} already exists and is up to date`);
    }
  }
}

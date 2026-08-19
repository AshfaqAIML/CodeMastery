import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const standalone = join(root, ".next", "standalone");

cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), {
  recursive: true,
});
rmSync(join(standalone, "public"), { recursive: true, force: true });
mkdirSync(join(standalone, "public"), { recursive: true });
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });

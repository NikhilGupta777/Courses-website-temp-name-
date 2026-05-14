import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const exists = (path: string) => existsSync(join(root, path));
const read = (path: string) => readFileSync(join(root, path), "utf8");

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test("dashboard profile and certificates pages live under the dashboard URL space", () => {
  assert.equal(exists("src/app/(dashboard)/dashboard/profile/page.tsx"), true);
  assert.equal(exists("src/app/(dashboard)/dashboard/certificates/page.tsx"), true);
});

test("legacy top-level profile and certificates routes redirect to dashboard routes", () => {
  assert.match(read("src/app/(dashboard)/profile/page.tsx"), /redirect\("\/dashboard\/profile"\)/);
  assert.match(read("src/app/(dashboard)/certificates/page.tsx"), /redirect\("\/dashboard\/certificates"\)/);
});

test("dashboard navigation does not point at legacy top-level profile or certificates", () => {
  const dashboardSource = read("src/app/(dashboard)/dashboard/page.tsx");
  const headerSource = read("src/components/layout/header.tsx");
  assert.doesNotMatch(`${dashboardSource}\n${headerSource}`, /href="\/profile"|href="\/certificates"/);
});

test("auth proxy uses Auth.js token decoding and preserves safe callback redirects", () => {
  const source = read("src/proxy.ts");
  assert.match(source, /import \{ getToken \} from "next-auth\/jwt"/);
  assert.doesNotMatch(source, /jwtVerify/);
  assert.match(source, /sanitizeLoginCallbackUrl/);
  assert.match(source, /searchParams\.get\("callbackUrl"\)/);
});

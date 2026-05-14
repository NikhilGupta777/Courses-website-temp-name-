import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { escapeHtml, parseAllowedImageUploadFolder, sanitizeLoginCallbackUrl } from "../src/lib/security";

const root = process.cwd();
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

test("login callback sanitizer keeps only relative same-origin paths", () => {
  assert.equal(sanitizeLoginCallbackUrl("/dashboard/courses"), "/dashboard/courses");
  assert.equal(sanitizeLoginCallbackUrl("https://evil.example/phish"), "/dashboard");
  assert.equal(sanitizeLoginCallbackUrl("//evil.example/phish"), "/dashboard");
  assert.equal(sanitizeLoginCallbackUrl("/\\evil"), "/dashboard");
});

test("HTML escaping prevents email template injection", () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert('x')">`), "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;");
});

test("image upload folder parser rejects path and bucket namespace abuse", () => {
  assert.equal(parseAllowedImageUploadFolder("avatars"), "avatars");
  assert.equal(parseAllowedImageUploadFolder("../../private"), null);
  assert.equal(parseAllowedImageUploadFolder("admin/backups"), null);
});

test("lesson content derives course access from the lesson instead of client courseId", () => {
  const source = read("src/server/routers/lesson.ts");
  assert.match(source, /const lesson = await ctx\.db\.lesson\.findUnique\(/);
  assert.match(source, /const actualCourseId = lesson\.module\.courseId/);
  assert.doesNotMatch(source, /checkCourseAccess\(ctx\.session\.user\.id,\s*input\.courseId\)/);
});

test("quiz read and submit paths enforce course access and avoid answer leakage by default", () => {
  const source = read("src/server/routers/quiz.ts");
  assert.match(source, /assertQuizAccess/);
  assert.match(source, /checkCourseAccess\(ctx\.session\.user\.id,\s*courseId\)/);
  assert.match(source, /const canShowAnswers = quiz\.showCorrectAnswers === true/);
  assert.match(source, /correctAnswer: canShowAnswers \? q\.correctAnswer : null/);
});

test("instructor question mutations verify quiz ownership first", () => {
  const source = read("src/server/routers/quiz.ts");
  assert.match(source, /assertInstructorOwnsQuiz/);
  assert.match(source, /await assertInstructorOwnsQuiz\(ctx, input\.quizId\)/);
  assert.match(source, /await assertInstructorOwnsQuestion\(ctx, input\.id\)/);
});

test("public live class queries use safe selects without meeting or recording URLs", () => {
  const source = read("src/server/routers/liveClass.ts");
  assert.match(source, /liveClassPublicSelect/);
  assert.doesNotMatch(source.match(/const liveClassPublicSelect = \{[\s\S]*?\} as const;/)?.[0] ?? "", /meetingUrl|recordingUrl/);
  assert.doesNotMatch(source, /getUpcoming[\s\S]*include: \{\s*instructor[\s\S]*meetingUrl/);
  assert.doesNotMatch(source, /getAll[\s\S]*include: \{\s*instructor[\s\S]*meetingUrl/);
});

test("course editor lookup is not public", () => {
  const source = read("src/server/routers/course.ts");
  assert.match(source, /getById: protectedProcedure/);
  assert.match(source, /checkCourseAccess\(ctx\.session\.user\.id,\s*input\.id\)/);
  assert.doesNotMatch(source, /getById: publicProcedure/);
});

test("module and lesson reorder validate parent ownership for every ordered ID", () => {
  const moduleSource = read("src/server/routers/module.ts");
  const lessonSource = read("src/server/routers/lesson.ts");
  assert.match(moduleSource, /matchingModules !== input\.orderedIds\.length/);
  assert.match(moduleSource, /ctx\.db\.\$transaction/);
  assert.match(lessonSource, /matchingLessons !== input\.orderedIds\.length/);
  assert.match(lessonSource, /ctx\.db\.\$transaction/);
});

test("reviews require active or completed enrollment before creation", () => {
  const source = read("src/server/routers/review.ts");
  assert.match(source, /ctx\.db\.enrollment\.findUnique/);
  assert.match(source, /enrollment\?\.status !== "ACTIVE" && enrollment\?\.status !== "COMPLETED"/);
});

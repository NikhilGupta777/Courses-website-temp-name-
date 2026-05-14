import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

async function main() {
  console.log("Seeding database...");

  const categoryData = [
    { name: "ChatGPT", slug: "chatgpt" },
    { name: "Gemini AI", slug: "gemini" },
    { name: "AI Chatbots", slug: "chatbots" },
    { name: "Image Generation", slug: "image-generation" },
    { name: "Prompting", slug: "prompting" },
    { name: "AI Tools", slug: "ai-tools" },
    { name: "Business AI", slug: "business-ai" },
    { name: "LLM", slug: "llm" },
    { name: "Automation", slug: "automation" },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoryData) {
    const c = await db.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
    categories[cat.slug] = c;
  }
  console.log("Categories done");

  const adminPwd = await bcrypt.hash("Admin@123", 10);
  await db.user.upsert({
    where: { email: "admin1@learnai.in" },
    create: { email: "admin1@learnai.in", name: "Super Admin", password: adminPwd, role: "ADMIN", emailVerified: new Date() },
    update: {},
  });
  await db.user.upsert({
    where: { email: "admin2@learnai.in" },
    create: { email: "admin2@learnai.in", name: "Content Admin", password: adminPwd, role: "ADMIN", emailVerified: new Date() },
    update: {},
  });
  console.log("Admins done");

  const instPwd = await bcrypt.hash("Instructor@123", 10);
  const instructorDefs = [
    { email: "rahul.mehta@learnai.in", name: "Rahul Mehta", displayName: "Rahul Mehta", bio: "Former AI Lead at Infosys with 8+ years building production AI systems.", expertise: ["ChatGPT","LLMs","Prompt Engineering"] },
    { email: "priya.sharma@learnai.in", name: "Priya Sharma", displayName: "Priya Sharma", bio: "Ex-Google AI researcher, expert in diffusion models and Midjourney.", expertise: ["Image Generation","Stable Diffusion","Midjourney"] },
    { email: "arjun.singh@learnai.in", name: "Arjun Singh", displayName: "Arjun Singh", bio: "PhD in NLP from IIT Bombay. Researcher at Microsoft Research India.", expertise: ["NLP","LangChain","RAG","Chatbots"] },
    { email: "sneha.reddy@learnai.in", name: "Sneha Reddy", displayName: "Sneha Reddy", bio: "Business strategist and AI consultant. MBA from IIM Bangalore.", expertise: ["Business AI","AI Tools","Productivity"] },
  ];

  const profiles: Record<string, string> = {};
  for (const inst of instructorDefs) {
    const u = await db.user.upsert({
      where: { email: inst.email },
      create: { email: inst.email, name: inst.name, password: instPwd, role: "INSTRUCTOR", emailVerified: new Date() },
      update: {},
    });
    const p = await db.instructorProfile.upsert({
      where: { userId: u.id },
      create: { userId: u.id, displayName: inst.displayName, bio: inst.bio, expertise: inst.expertise },
      update: {},
    });
    profiles[inst.email] = p.id;
  }
  console.log("Instructors done");

  const stuPwd = await bcrypt.hash("Student@123", 10);
  const studentEmails = [
    "ankit.verma@example.com",
    "divya.nair@example.com",
    "rohit.gupta@example.com",
    "meera.patel@example.com",
    "suresh.babu@example.com",
  ];
  const studentIds: string[] = [];
  for (const email of studentEmails) {
    const parts = email.split("@")[0]!.split(".");
    const name = parts.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    const u = await db.user.upsert({
      where: { email },
      create: { email, name, password: stuPwd, role: "STUDENT", emailVerified: new Date() },
      update: {},
    });
    studentIds.push(u.id);
  }
  console.log("Students done");

  const rahulId = profiles["rahul.mehta@learnai.in"]!;
  const priyaId = profiles["priya.sharma@learnai.in"]!;
  const arjunId = profiles["arjun.singh@learnai.in"]!;
  const snehaId = profiles["sneha.reddy@learnai.in"]!;

  const courseDefs = [
    { slug: "chatgpt-mastery", title: "ChatGPT Complete Mastery", sub: "From beginner to power user", desc: "The most comprehensive ChatGPT course in India.", cat: "chatgpt", level: "BEGINNER", price: 1999, orig: 3999, free: false, featured: true, instId: rahulId },
    { slug: "gemini-ai-masterclass", title: "Gemini AI Masterclass", sub: "Master Google Gemini", desc: "Deep dive into Google Gemini.", cat: "gemini", level: "BEGINNER", price: 1499, orig: 2999, free: false, featured: true, instId: rahulId },
    { slug: "ai-chatbot-builder", title: "Build AI Chatbots from Scratch", sub: "LangChain RAG and vector DBs", desc: "Build intelligent AI chatbots.", cat: "chatbots", level: "INTERMEDIATE", price: 2999, orig: 5999, free: false, featured: true, instId: arjunId },
    { slug: "image-generation-ai", title: "AI Image Generation", sub: "Midjourney DALL-E Stable Diffusion", desc: "Complete guide to AI image generation.", cat: "image-generation", level: "BEGINNER", price: 2499, orig: 4999, free: false, featured: true, instId: priyaId },
    { slug: "ai-prompting-fundamentals", title: "AI Prompting Fundamentals", sub: "Art and science of prompts", desc: "Free entry point to AI.", cat: "prompting", level: "BEGINNER", price: 0, orig: 0, free: true, featured: true, instId: rahulId },
    { slug: "chatgpt-basics", title: "ChatGPT Basics for Everyone", sub: "Get started in under 3 hours", desc: "Friendliest ChatGPT intro.", cat: "chatgpt", level: "BEGINNER", price: 0, orig: 0, free: true, featured: false, instId: snehaId },
    { slug: "ai-tools-everyday", title: "AI Tools for Everyday Use", sub: "Save 2 hours daily", desc: "Best AI tools for daily tasks.", cat: "ai-tools", level: "BEGINNER", price: 0, orig: 0, free: true, featured: false, instId: snehaId },
    { slug: "advanced-prompting", title: "Advanced Prompt Engineering", sub: "Meta-prompts and red-teaming", desc: "Advanced prompt engineering.", cat: "prompting", level: "ADVANCED", price: 3499, orig: 6999, free: false, featured: true, instId: arjunId },
    { slug: "ai-for-business", title: "AI for Business Leaders", sub: "Implement AI in your org", desc: "Practical AI for business.", cat: "business-ai", level: "INTERMEDIATE", price: 2999, orig: 5999, free: false, featured: true, instId: snehaId },
    { slug: "llm-fundamentals", title: "LLM Fundamentals", sub: "How LLMs work", desc: "Deep dive into transformers.", cat: "llm", level: "ADVANCED", price: 3999, orig: 7999, free: false, featured: true, instId: arjunId },
    { slug: "ai-automation-workflows", title: "AI Automation and Workflows", sub: "Automate with AI", desc: "Build AI automation workflows.", cat: "automation", level: "INTERMEDIATE", price: 1999, orig: 3999, free: false, featured: true, instId: snehaId },
    { slug: "stable-diffusion-mastery", title: "Stable Diffusion Mastery", sub: "Local AI image generation", desc: "Complete Stable Diffusion course.", cat: "image-generation", level: "INTERMEDIATE", price: 2499, orig: 4999, free: false, featured: false, instId: priyaId },
  ];

  const courseIds: Record<string, string> = {};
  for (const cd of courseDefs) {
    const catId = categories[cd.cat]?.id;
    const course = await db.course.upsert({
      where: { slug: cd.slug },
      create: {
        slug: cd.slug, title: cd.title, subtitle: cd.sub, description: cd.desc,
        categoryId: catId,
        level: cd.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
        status: "PUBLISHED", deliveryMode: "PRE_RECORDED",
        price: cd.price, originalPrice: cd.orig, isFree: cd.free, isFeatured: cd.featured,
        instructorId: cd.instId,
        publishedAt: new Date(),
        totalStudents: Math.floor(Math.random() * 15000) + 1000,
        averageRating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
        totalReviews: Math.floor(Math.random() * 3000) + 100,
      },
      update: { status: "PUBLISHED" },
    });
    courseIds[cd.slug] = course.id;
  }
  console.log("Courses done");

  type LType = "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION" | "RESOURCE";
  const modDefs: Record<string, { title: string; lessons: { title: string; type: LType; free: boolean }[] }[]> = {
    "chatgpt-mastery": [
      { title: "Getting Started with ChatGPT", lessons: [
        { title: "What is ChatGPT?", type: "VIDEO", free: true },
        { title: "Setting up your account", type: "VIDEO", free: false },
        { title: "Interface tour", type: "VIDEO", free: false },
        { title: "Quiz: ChatGPT Basics", type: "QUIZ", free: false },
      ]},
      { title: "Prompting Like a Pro", lessons: [
        { title: "What makes a great prompt?", type: "VIDEO", free: true },
        { title: "Role prompting and personas", type: "VIDEO", free: false },
        { title: "Chain-of-thought prompting", type: "VIDEO", free: false },
      ]},
      { title: "ChatGPT for Work and Business", lessons: [
        { title: "Writing emails with AI", type: "VIDEO", free: true },
        { title: "Code generation and debugging", type: "VIDEO", free: false },
        { title: "Marketing copy", type: "VIDEO", free: false },
        { title: "Data analysis with ChatGPT", type: "VIDEO", free: false },
      ]},
    ],
    "ai-prompting-fundamentals": [
      { title: "What is Prompt Engineering?", lessons: [
        { title: "Why prompts matter", type: "VIDEO", free: true },
        { title: "Anatomy of a great prompt", type: "VIDEO", free: true },
        { title: "Quiz: Prompting basics", type: "QUIZ", free: true },
      ]},
      { title: "Core Prompting Techniques", lessons: [
        { title: "Zero-shot vs few-shot prompting", type: "VIDEO", free: true },
        { title: "Chain-of-thought technique", type: "VIDEO", free: true },
        { title: "Role and persona prompting", type: "VIDEO", free: true },
      ]},
      { title: "Prompting for Real Tasks", lessons: [
        { title: "Prompting for writing", type: "VIDEO", free: true },
        { title: "Prompting for coding", type: "VIDEO", free: true },
        { title: "Build your template library", type: "ARTICLE", free: true },
      ]},
    ],
    "chatgpt-basics": [
      { title: "Your First Steps", lessons: [
        { title: "What is ChatGPT? Explained simply", type: "VIDEO", free: true },
        { title: "Creating your free account", type: "VIDEO", free: true },
        { title: "The ChatGPT interface explained", type: "VIDEO", free: true },
      ]},
      { title: "Using ChatGPT Daily", lessons: [
        { title: "Asking better questions", type: "VIDEO", free: true },
        { title: "Writing and editing with AI", type: "VIDEO", free: true },
        { title: "Research and summaries", type: "VIDEO", free: true },
        { title: "ChatGPT for students", type: "VIDEO", free: true },
      ]},
      { title: "Getting More from ChatGPT", lessons: [
        { title: "Custom instructions and memory", type: "VIDEO", free: true },
        { title: "ChatGPT limitations", type: "VIDEO", free: true },
        { title: "Quiz: ChatGPT Basics", type: "QUIZ", free: true },
      ]},
    ],
  };

  const lessonIdsForQuiz: string[] = [];
  for (const [slug, mods] of Object.entries(modDefs)) {
    const courseId = courseIds[slug];
    if (!courseId) continue;
    for (let mi = 0; mi < mods.length; mi++) {
      const mod = mods[mi];
      if (!mod) continue;
      const m = await db.module.upsert({
        where: { id: `seed-m-${slug}-${mi}` },
        create: { id: `seed-m-${slug}-${mi}`, courseId, title: mod.title, position: mi + 1 },
        update: { title: mod.title },
      });
      for (let li = 0; li < mod.lessons.length; li++) {
        const l = mod.lessons[li];
        if (!l) continue;
        const lesson = await db.lesson.upsert({
          where: { id: `seed-l-${slug}-${mi}-${li}` },
          create: {
            id: `seed-l-${slug}-${mi}-${li}`,
            moduleId: m.id,
            title: l.title,
            type: l.type,
            position: li + 1,
            isFree: l.free,
            isPublished: true,
            duration: l.type === "QUIZ" ? 5 : 12,
            content: l.type === "ARTICLE" ? `# ${l.title}\n\nThis article covers the key concepts.` : null,
          },
          update: {},
        });
        if (l.type === "QUIZ") lessonIdsForQuiz.push(lesson.id);
      }
    }
  }
  console.log("Modules and lessons done");

  for (let qi = 0; qi < Math.min(2, lessonIdsForQuiz.length); qi++) {
    const lessonId = lessonIdsForQuiz[qi];
    if (!lessonId) continue;
    const existing = await db.quiz.findUnique({ where: { lessonId } });
    if (!existing) {
      const quiz = await db.quiz.create({ data: { lessonId, title: `Quiz ${qi + 1}`, passingScore: 70 } });
      const qs = [
        { text: "What is the main purpose of ChatGPT?", type: "MULTIPLE_CHOICE" as const, options: JSON.stringify([{id:"a",text:"Generate images"},{id:"b",text:"Generate text responses"},{id:"c",text:"Edit videos"},{id:"d",text:"Write code only"}]), correct: "b", pos: 1 },
        { text: "Which company created ChatGPT?", type: "MULTIPLE_CHOICE" as const, options: JSON.stringify([{id:"a",text:"Google"},{id:"b",text:"Microsoft"},{id:"c",text:"OpenAI"},{id:"d",text:"Meta"}]), correct: "c", pos: 2 },
        { text: "ChatGPT can access the internet by default.", type: "TRUE_FALSE" as const, options: null, correct: "false", pos: 3 },
      ];
      for (const q of qs) {
        await db.question.create({ data: { quizId: quiz.id, type: q.type, text: q.text, options: q.options, correctAnswer: q.correct, points: 1, position: q.pos } });
      }
    }
  }
  console.log("Quizzes done");

  const enrollSlugs = ["chatgpt-mastery","ai-prompting-fundamentals","chatgpt-basics","gemini-ai-masterclass","ai-tools-everyday"];
  for (let si = 0; si < studentIds.length; si++) {
    const uid = studentIds[si];
    if (!uid) continue;
    const n = Math.floor(Math.random() * 3) + 1;
    for (let ci = 0; ci < n; ci++) {
      const slug = enrollSlugs[(si + ci) % enrollSlugs.length]!;
      const courseId = courseIds[slug];
      if (!courseId) continue;
      const progress = ci === 0 ? 100 : Math.floor(Math.random() * 80);
      const status = progress === 100 ? "COMPLETED" : "ACTIVE";
      await db.enrollment.upsert({
        where: { userId_courseId: { userId: uid, courseId } },
        create: { userId: uid, courseId, progress, status: status as "ACTIVE" | "COMPLETED", enrolledAt: new Date(), completedAt: status === "COMPLETED" ? new Date() : null },
        update: {},
      });
      if (status === "COMPLETED") {
        const certNum = `LEARNAI-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
        await db.certificate.create({ data: { userId: uid, courseId, certificateNumber: certNum, verificationUrl: `https://learnai.in/verify/${certNum}`, metadata: { courseName: slug } } }).catch(() => {});
      }
    }
  }
  console.log("Enrollments done");

  const s0 = studentIds[0]; const s1 = studentIds[1]; const s2 = studentIds[2];
  const cM = courseIds["chatgpt-mastery"]; const cP = courseIds["ai-prompting-fundamentals"]; const cB = courseIds["chatgpt-basics"];
  if (s0 && cM) await db.review.upsert({ where: { userId_courseId: { userId: s0, courseId: cM } }, create: { userId: s0, courseId: cM, rating: 5, comment: "Absolutely brilliant course!" }, update: {} });
  if (s1 && cP) await db.review.upsert({ where: { userId_courseId: { userId: s1, courseId: cP } }, create: { userId: s1, courseId: cP, rating: 5, comment: "Best prompting course online." }, update: {} });
  if (s2 && cB) await db.review.upsert({ where: { userId_courseId: { userId: s2, courseId: cB } }, create: { userId: s2, courseId: cB, rating: 4, comment: "Very practical." }, update: {} });
  console.log("Reviews done");

  if (s0) {
    await db.notification.create({ data: { userId: s0, type: "COURSE_UPDATE", title: "Welcome to LearnAI!", message: "Start your AI journey today.", isRead: false } });
  }
  console.log("Notifications done");

  if (cP && s0) {
    const lessons = await db.lesson.findMany({ where: { module: { courseId: cP } }, take: 3 });
    for (const lesson of lessons) {
      await db.lessonProgress.upsert({ where: { userId_lessonId: { userId: s0, lessonId: lesson.id } }, create: { userId: s0, lessonId: lesson.id, isCompleted: true, completedAt: new Date() }, update: {} });
    }
  }
  console.log("Seed complete!");
}

main().catch(console.error).finally(() => db.$disconnect());

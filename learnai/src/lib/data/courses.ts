// ============================================================
// LearnAI — Course Data
// ============================================================

export type LessonType = "VIDEO" | "QUIZ" | "ARTICLE" | "EXERCISE";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type DeliveryMode = "PRE_RECORDED" | "LIVE" | "HYBRID";
export type CourseBadge = "Bestseller" | "New" | "Hot" | "Free";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  isFree: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  id: string;
  name: string;
  image: string | null;
  title: string;
  bio: string;
  totalStudents: number;
  totalCourses: number;
  rating: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: CourseLevel;
  deliveryMode: DeliveryMode;
  price: number;
  originalPrice: number;
  isFree: boolean;
  isPro: boolean;
  duration: string;
  totalLessons: number;
  instructor: {
    name: string;
    image: string | null;
    title: string;
    bio: string;
  };
  rating: number;
  totalReviews: number;
  totalStudents: number;
  tags: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  thumbnail: string | null;
  isFeatured: boolean;
  badge?: CourseBadge;
  modules: Module[];
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
  price: number;
  maxSeats: number;
  seatsLeft: number;
  isLive: boolean;
  description: string;
  platform: string;
}

// ── Free course slugs ──────────────────────────────────────
export const FREE_COURSE_SLUGS = [
  "ai-prompting-fundamentals",
  "chatgpt-basics",
  "ai-tools-everyday",
] as const;

// ── Categories ─────────────────────────────────────────────
export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "chatgpt", label: "ChatGPT & GPT-4" },
  { id: "gemini", label: "Gemini AI" },
  { id: "chatbots", label: "AI Chatbots" },
  { id: "image-generation", label: "Image Generation" },
  { id: "prompting", label: "Prompting" },
  { id: "ai-tools", label: "AI Tools" },
  { id: "business-ai", label: "Business AI" },
  { id: "llm", label: "LLMs & Research" },
  { id: "automation", label: "AI Automation" },
];

// ── Category colour map (Tailwind gradient classes) ────────
export const CATEGORY_COLORS: Record<string, { from: string; to: string; icon: string }> = {
  chatgpt:          { from: "from-orange-100", to: "to-amber-200",   icon: "text-orange-600" },
  gemini:           { from: "from-blue-100",   to: "to-cyan-200",    icon: "text-blue-600"   },
  chatbots:         { from: "from-green-100",  to: "to-emerald-200", icon: "text-green-600"  },
  "image-generation":{ from: "from-pink-100",  to: "to-rose-200",    icon: "text-pink-600"   },
  prompting:        { from: "from-violet-100", to: "to-purple-200",  icon: "text-violet-600" },
  "ai-tools":       { from: "from-indigo-100", to: "to-blue-200",    icon: "text-indigo-600" },
  "business-ai":    { from: "from-yellow-100", to: "to-amber-200",   icon: "text-yellow-600" },
  llm:              { from: "from-slate-100",  to: "to-gray-200",    icon: "text-slate-600"  },
  automation:       { from: "from-teal-100",   to: "to-cyan-200",    icon: "text-teal-600"   },
};


// ── Instructors ────────────────────────────────────────────
export const INSTRUCTORS: Instructor[] = [
  {
    id: "ins-1",
    name: "Rahul Mehta",
    image: null,
    title: "AI Engineer & Educator",
    bio: "Former AI Lead at Infosys with 8+ years building production AI systems. Taught 40,000+ students across India on ChatGPT, LLMs, and prompt engineering.",
    totalStudents: 40000,
    totalCourses: 4,
    rating: 4.9,
  },
  {
    id: "ins-2",
    name: "Priya Sharma",
    image: null,
    title: "Generative AI Specialist",
    bio: "Ex-Google AI researcher, now an independent educator. Expert in diffusion models, Midjourney, DALL-E and Stable Diffusion with 5+ published papers.",
    totalStudents: 25000,
    totalCourses: 3,
    rating: 4.8,
  },
  {
    id: "ins-3",
    name: "Arjun Singh",
    image: null,
    title: "NLP & LLM Researcher",
    bio: "PhD in NLP from IIT Bombay. Researcher at Microsoft Research India. Specialises in transformers, fine-tuning, and building production chatbot systems.",
    totalStudents: 18000,
    totalCourses: 3,
    rating: 4.9,
  },
  {
    id: "ins-4",
    name: "Sneha Reddy",
    image: null,
    title: "AI for Business Consultant",
    bio: "Business strategist and AI consultant who has helped 150+ Indian startups and enterprises adopt AI tools for growth. MBA from IIM Bangalore.",
    totalStudents: 22000,
    totalCourses: 2,
    rating: 4.7,
  },
];


// ── Courses ────────────────────────────────────────────────
export const COURSES: Course[] = [
  // 1. ChatGPT Mastery
  {
    id: "c-01",
    slug: "chatgpt-mastery",
    title: "ChatGPT Complete Mastery",
    subtitle: "From beginner to power user — ChatGPT, GPT-4, plugins, custom GPTs & API",
    description: "The most comprehensive ChatGPT course in India. Learn how to use ChatGPT for writing, coding, research, business, automation and more. Covers GPT-4 Turbo, custom instructions, plugins, and building your own GPT.",
    category: "chatgpt",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 1999,
    originalPrice: 3999,
    isFree: false,
    isPro: true,
    duration: "18h 30m",
    totalLessons: 72,
    instructor: {
      name: "Rahul Mehta",
      image: null,
      title: "AI Engineer & Educator",
      bio: "Former AI Lead at Infosys with 8+ years building production AI systems. Taught 40,000+ students across India.",
    },
    rating: 4.9,
    totalReviews: 2840,
    totalStudents: 14200,
    tags: ["ChatGPT", "GPT-4", "AI Writing", "Productivity", "API"],
    learningOutcomes: [
      "Use ChatGPT like a professional for writing, coding, and research",
      "Build custom GPTs without any coding knowledge",
      "Integrate ChatGPT API into your own projects",
      "Use advanced prompting techniques for better outputs",
      "Automate workflows using ChatGPT + Zapier",
      "Generate content, emails, code, and business plans with AI",
    ],
    prerequisites: ["No prior AI experience needed", "Basic computer skills"],
    thumbnail: null,
    isFeatured: true,
    badge: "Bestseller",
    modules: [
      {
        id: "m-c01-1",
        title: "Getting Started with ChatGPT",
        lessons: [
          { id: "l-1", title: "What is ChatGPT and how does it work?", type: "VIDEO", duration: "12:30", isFree: true },
          { id: "l-2", title: "Setting up your ChatGPT account", type: "VIDEO", duration: "8:15", isFree: false },
          { id: "l-3", title: "The ChatGPT interface tour", type: "VIDEO", duration: "10:00", isFree: false },
          { id: "l-4", title: "Quiz: ChatGPT Basics", type: "QUIZ", duration: "5:00", isFree: false },
        ],
      },
      {
        id: "m-c01-2",
        title: "Prompting Like a Pro",
        lessons: [
          { id: "l-5", title: "What makes a great prompt?", type: "VIDEO", duration: "14:20", isFree: true },
          { id: "l-6", title: "Role prompting & personas", type: "VIDEO", duration: "11:45", isFree: false },
          { id: "l-7", title: "Chain-of-thought prompting", type: "VIDEO", duration: "13:10", isFree: false },
          { id: "l-8", title: "Hands-on: Write 10 killer prompts", type: "EXERCISE", duration: "20:00", isFree: false },
        ],
      },
      {
        id: "m-c01-3",
        title: "ChatGPT for Work & Business",
        lessons: [
          { id: "l-9", title: "Writing emails, reports & proposals with AI", type: "VIDEO", duration: "16:00", isFree: true },
          { id: "l-10", title: "Code generation & debugging with ChatGPT", type: "VIDEO", duration: "18:30", isFree: false },
          { id: "l-11", title: "Marketing copy & social media content", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-12", title: "ChatGPT for data analysis", type: "VIDEO", duration: "15:00", isFree: false },
        ],
      },
      {
        id: "m-c01-4",
        title: "Advanced ChatGPT: Custom GPTs & API",
        lessons: [
          { id: "l-13", title: "Building Custom GPTs", type: "VIDEO", duration: "22:00", isFree: true },
          { id: "l-14", title: "ChatGPT Plugins & browsing", type: "VIDEO", duration: "14:00", isFree: false },
          { id: "l-15", title: "Using the OpenAI API with Python", type: "VIDEO", duration: "28:00", isFree: false },
          { id: "l-16", title: "Final project: Build your own AI assistant", type: "EXERCISE", duration: "45:00", isFree: false },
        ],
      },
    ],
  },


  // 2. Gemini AI Masterclass
  {
    id: "c-02",
    slug: "gemini-ai-masterclass",
    title: "Gemini AI Masterclass",
    subtitle: "Master Google's most powerful AI — Gemini 1.5 Pro, Gemini Advanced & Google AI Studio",
    description: "Deep dive into Google Gemini, the most capable AI model from Google. Learn Gemini Advanced, Google AI Studio, Gemini API, multimodal capabilities (text, image, video, audio), and how to integrate Gemini into real-world projects.",
    category: "gemini",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 1499,
    originalPrice: 2999,
    isFree: false,
    isPro: true,
    duration: "14h 45m",
    totalLessons: 56,
    instructor: {
      name: "Rahul Mehta",
      image: null,
      title: "AI Engineer & Educator",
      bio: "Former AI Lead at Infosys. Expert in Google AI products and large language models.",
    },
    rating: 4.8,
    totalReviews: 1620,
    totalStudents: 9800,
    tags: ["Gemini", "Google AI", "Multimodal AI", "AI Studio", "Gemini API"],
    learningOutcomes: [
      "Understand Gemini 1.5 Pro's multimodal capabilities",
      "Use Google AI Studio to build and test prompts",
      "Integrate Gemini API into web and mobile apps",
      "Use Gemini for document analysis, image understanding & code",
      "Compare Gemini vs ChatGPT and choose the right tool",
      "Build a real-world Gemini-powered application",
    ],
    prerequisites: ["No prior AI experience needed"],
    thumbnail: null,
    isFeatured: true,
    badge: "New",
    modules: [
      {
        id: "m-c02-1",
        title: "Introduction to Google Gemini",
        lessons: [
          { id: "l-g1", title: "Gemini vs ChatGPT — what's the difference?", type: "VIDEO", duration: "11:00", isFree: true },
          { id: "l-g2", title: "Setting up Gemini Advanced", type: "VIDEO", duration: "7:30", isFree: false },
          { id: "l-g3", title: "The Gemini interface & extensions", type: "VIDEO", duration: "9:00", isFree: false },
        ],
      },
      {
        id: "m-c02-2",
        title: "Gemini's Multimodal Powers",
        lessons: [
          { id: "l-g4", title: "Image understanding with Gemini", type: "VIDEO", duration: "15:00", isFree: true },
          { id: "l-g5", title: "Analysing PDFs and documents", type: "VIDEO", duration: "13:20", isFree: false },
          { id: "l-g6", title: "Video and audio input capabilities", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-g7", title: "Hands-on: Multimodal project", type: "EXERCISE", duration: "25:00", isFree: false },
        ],
      },
      {
        id: "m-c02-3",
        title: "Google AI Studio & Gemini API",
        lessons: [
          { id: "l-g8", title: "Google AI Studio tour", type: "VIDEO", duration: "14:00", isFree: true },
          { id: "l-g9", title: "Prompt engineering in AI Studio", type: "VIDEO", duration: "16:00", isFree: false },
          { id: "l-g10", title: "Using the Gemini API with Python", type: "VIDEO", duration: "24:00", isFree: false },
          { id: "l-g11", title: "Building a Gemini chatbot app", type: "EXERCISE", duration: "40:00", isFree: false },
        ],
      },
    ],
  },

  // 3. AI Chatbot Builder
  {
    id: "c-03",
    slug: "ai-chatbot-builder",
    title: "Build AI Chatbots from Scratch",
    subtitle: "Create production-ready AI chatbots using LangChain, OpenAI, RAG and vector databases",
    description: "Learn to build intelligent AI chatbots from the ground up. Covers LangChain, Retrieval-Augmented Generation (RAG), vector databases (Pinecone, Chroma), custom knowledge bases, deployment on cloud, and building customer support bots.",
    category: "chatbots",
    level: "Intermediate",
    deliveryMode: "PRE_RECORDED",
    price: 2999,
    originalPrice: 5999,
    isFree: false,
    isPro: true,
    duration: "26h 15m",
    totalLessons: 88,
    instructor: {
      name: "Arjun Singh",
      image: null,
      title: "NLP & LLM Researcher",
      bio: "PhD in NLP from IIT Bombay. Researcher at Microsoft Research India. Expert in LangChain and production chatbot systems.",
    },
    rating: 4.9,
    totalReviews: 1980,
    totalStudents: 11500,
    tags: ["Chatbots", "LangChain", "RAG", "OpenAI", "Python", "Vector DB"],
    learningOutcomes: [
      "Build a full-stack AI chatbot with custom knowledge",
      "Implement Retrieval-Augmented Generation (RAG) pipelines",
      "Integrate vector databases for semantic search",
      "Deploy chatbots to production using Vercel & Railway",
      "Build customer support, FAQ and document QA bots",
      "Add memory, multi-turn conversation and fallback logic",
    ],
    prerequisites: ["Basic Python knowledge", "Familiarity with APIs"],
    thumbnail: null,
    isFeatured: true,
    badge: "Hot",
    modules: [
      {
        id: "m-c03-1",
        title: "Chatbot Fundamentals & Architecture",
        lessons: [
          { id: "l-cb1", title: "How modern AI chatbots work", type: "VIDEO", duration: "13:00", isFree: true },
          { id: "l-cb2", title: "Overview of LangChain", type: "VIDEO", duration: "11:30", isFree: false },
          { id: "l-cb3", title: "Setting up your dev environment", type: "VIDEO", duration: "9:00", isFree: false },
        ],
      },
      {
        id: "m-c03-2",
        title: "Building with LangChain",
        lessons: [
          { id: "l-cb4", title: "Chains, Agents & Tools", type: "VIDEO", duration: "18:00", isFree: true },
          { id: "l-cb5", title: "Memory & conversation history", type: "VIDEO", duration: "14:00", isFree: false },
          { id: "l-cb6", title: "Connecting to external APIs", type: "VIDEO", duration: "16:00", isFree: false },
          { id: "l-cb7", title: "Exercise: Build a multi-turn chatbot", type: "EXERCISE", duration: "30:00", isFree: false },
        ],
      },
      {
        id: "m-c03-3",
        title: "RAG & Vector Databases",
        lessons: [
          { id: "l-cb8", title: "What is RAG and why it matters", type: "VIDEO", duration: "12:00", isFree: true },
          { id: "l-cb9", title: "Embeddings & semantic search", type: "VIDEO", duration: "15:00", isFree: false },
          { id: "l-cb10", title: "Pinecone & ChromaDB setup", type: "VIDEO", duration: "20:00", isFree: false },
          { id: "l-cb11", title: "Build a document Q&A bot", type: "EXERCISE", duration: "45:00", isFree: false },
        ],
      },
      {
        id: "m-c03-4",
        title: "Deployment & Production",
        lessons: [
          { id: "l-cb12", title: "Deploying to Vercel with Next.js", type: "VIDEO", duration: "22:00", isFree: true },
          { id: "l-cb13", title: "Adding authentication & rate limiting", type: "VIDEO", duration: "18:00", isFree: false },
          { id: "l-cb14", title: "Monitoring & logging your chatbot", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-cb15", title: "Final project: Customer support bot", type: "EXERCISE", duration: "60:00", isFree: false },
        ],
      },
    ],
  },


  // 4. Image Generation AI
  {
    id: "c-04",
    slug: "image-generation-ai",
    title: "AI Image Generation: Midjourney, DALL-E & Stable Diffusion",
    subtitle: "Create stunning AI art and images using the three leading image AI tools",
    description: "Complete guide to AI image generation. Master Midjourney v6, DALL-E 3 and Stable Diffusion to create photorealistic images, concept art, logos, social media content, and more. Covers prompting for images, style control, inpainting, outpainting and commercial use.",
    category: "image-generation",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 2499,
    originalPrice: 4999,
    isFree: false,
    isPro: true,
    duration: "22h 00m",
    totalLessons: 80,
    instructor: {
      name: "Priya Sharma",
      image: null,
      title: "Generative AI Specialist",
      bio: "Ex-Google AI researcher. Expert in diffusion models and generative image AI with 5+ published papers.",
    },
    rating: 4.8,
    totalReviews: 2210,
    totalStudents: 13400,
    tags: ["Midjourney", "DALL-E", "Stable Diffusion", "AI Art", "Generative AI"],
    learningOutcomes: [
      "Create professional-quality images using Midjourney v6",
      "Generate precise images with DALL-E 3 in ChatGPT",
      "Run Stable Diffusion locally and on cloud",
      "Master image prompting techniques for any style",
      "Use inpainting and outpainting for advanced edits",
      "Use AI images commercially for business and freelancing",
    ],
    prerequisites: ["No technical skills required", "A computer with internet connection"],
    thumbnail: null,
    isFeatured: true,
    badge: "Bestseller",
    modules: [
      {
        id: "m-c04-1",
        title: "Introduction to AI Image Generation",
        lessons: [
          { id: "l-img1", title: "How AI image generators work", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-img2", title: "Midjourney vs DALL-E vs Stable Diffusion", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-img3", title: "Setting up all three tools", type: "VIDEO", duration: "15:00", isFree: false },
        ],
      },
      {
        id: "m-c04-2",
        title: "Mastering Midjourney v6",
        lessons: [
          { id: "l-img4", title: "Midjourney interface & commands", type: "VIDEO", duration: "14:00", isFree: true },
          { id: "l-img5", title: "Image prompting for stunning results", type: "VIDEO", duration: "18:00", isFree: false },
          { id: "l-img6", title: "Style, aspect ratio and parameters", type: "VIDEO", duration: "16:00", isFree: false },
          { id: "l-img7", title: "Variations, upscaling and remixing", type: "VIDEO", duration: "12:00", isFree: false },
        ],
      },
      {
        id: "m-c04-3",
        title: "DALL-E 3 & Stable Diffusion",
        lessons: [
          { id: "l-img8", title: "DALL-E 3 in ChatGPT — full guide", type: "VIDEO", duration: "16:00", isFree: true },
          { id: "l-img9", title: "Stable Diffusion: installation & setup", type: "VIDEO", duration: "20:00", isFree: false },
          { id: "l-img10", title: "ControlNet for precise image control", type: "VIDEO", duration: "18:00", isFree: false },
          { id: "l-img11", title: "Inpainting & outpainting techniques", type: "VIDEO", duration: "15:00", isFree: false },
        ],
      },
    ],
  },

  // 5. AI Prompting Fundamentals (FREE)
  {
    id: "c-05",
    slug: "ai-prompting-fundamentals",
    title: "AI Prompting Fundamentals",
    subtitle: "Learn the art and science of writing prompts that get amazing results from any AI",
    description: "Your free entry point into the world of AI. This course teaches you how to write effective prompts for ChatGPT, Gemini, Claude and other AI tools. Learn zero-shot, few-shot, chain-of-thought and role prompting techniques that work across all AI platforms.",
    category: "prompting",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 0,
    originalPrice: 0,
    isFree: true,
    isPro: false,
    duration: "4h 30m",
    totalLessons: 22,
    instructor: {
      name: "Rahul Mehta",
      image: null,
      title: "AI Engineer & Educator",
      bio: "Former AI Lead at Infosys. Expert in prompt engineering and AI education.",
    },
    rating: 4.9,
    totalReviews: 5400,
    totalStudents: 28000,
    tags: ["Prompting", "ChatGPT", "Gemini", "Free", "Beginners"],
    learningOutcomes: [
      "Write clear, specific prompts that get accurate results",
      "Use zero-shot, few-shot and chain-of-thought techniques",
      "Apply role prompting to get expert-level responses",
      "Avoid common prompting mistakes that waste your time",
      "Prompt for writing, coding, research and creative tasks",
      "Build a personal library of reusable prompt templates",
    ],
    prerequisites: ["No experience needed — completely beginner friendly"],
    thumbnail: null,
    isFeatured: true,
    badge: "Free",
    modules: [
      {
        id: "m-c05-1",
        title: "What is Prompt Engineering?",
        lessons: [
          { id: "l-p1", title: "Why prompts matter — the basics", type: "VIDEO", duration: "8:00", isFree: true },
          { id: "l-p2", title: "Anatomy of a great prompt", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-p3", title: "Quiz: Prompting basics", type: "QUIZ", duration: "5:00", isFree: true },
        ],
      },
      {
        id: "m-c05-2",
        title: "Core Prompting Techniques",
        lessons: [
          { id: "l-p4", title: "Zero-shot vs few-shot prompting", type: "VIDEO", duration: "12:00", isFree: true },
          { id: "l-p5", title: "Chain-of-thought prompting", type: "VIDEO", duration: "11:00", isFree: true },
          { id: "l-p6", title: "Role & persona prompting", type: "VIDEO", duration: "9:00", isFree: true },
          { id: "l-p7", title: "Exercise: Write your first 5 prompts", type: "EXERCISE", duration: "15:00", isFree: true },
        ],
      },
      {
        id: "m-c05-3",
        title: "Prompting for Real Tasks",
        lessons: [
          { id: "l-p8", title: "Prompting for writing & content", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-p9", title: "Prompting for coding & debugging", type: "VIDEO", duration: "11:00", isFree: true },
          { id: "l-p10", title: "Prompting for research & analysis", type: "VIDEO", duration: "9:00", isFree: true },
          { id: "l-p11", title: "Build your prompt template library", type: "EXERCISE", duration: "20:00", isFree: true },
        ],
      },
    ],
  },


  // 6. ChatGPT Basics (FREE)
  {
    id: "c-06",
    slug: "chatgpt-basics",
    title: "ChatGPT Basics for Everyone",
    subtitle: "Get started with ChatGPT in under 3 hours — no technical background required",
    description: "The friendliest introduction to ChatGPT for absolute beginners. Learn what ChatGPT is, how to sign up, navigate the interface, and start using it for your daily tasks. Perfect for students, professionals, and anyone curious about AI.",
    category: "chatgpt",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 0,
    originalPrice: 0,
    isFree: true,
    isPro: false,
    duration: "2h 45m",
    totalLessons: 16,
    instructor: {
      name: "Sneha Reddy",
      image: null,
      title: "AI for Business Consultant",
      bio: "Business consultant and AI educator. MBA from IIM Bangalore. Makes AI approachable for non-tech audiences.",
    },
    rating: 4.8,
    totalReviews: 4100,
    totalStudents: 22500,
    tags: ["ChatGPT", "Free", "Beginners", "AI Basics"],
    learningOutcomes: [
      "Understand what ChatGPT is and how it generates responses",
      "Set up a free ChatGPT account and navigate the interface",
      "Use ChatGPT for writing, summarising and answering questions",
      "Understand ChatGPT's limitations and when not to trust it",
      "Use custom instructions to personalise ChatGPT",
      "Explore ChatGPT plugins and image generation (DALL-E)",
    ],
    prerequisites: ["No prior knowledge needed"],
    thumbnail: null,
    isFeatured: false,
    badge: "Free",
    modules: [
      {
        id: "m-c06-1",
        title: "Your First Steps with ChatGPT",
        lessons: [
          { id: "l-cb1a", title: "What is ChatGPT? — explained simply", type: "VIDEO", duration: "7:00", isFree: true },
          { id: "l-cb2a", title: "Creating your free account", type: "VIDEO", duration: "5:00", isFree: true },
          { id: "l-cb3a", title: "The ChatGPT interface explained", type: "VIDEO", duration: "8:00", isFree: true },
        ],
      },
      {
        id: "m-c06-2",
        title: "Using ChatGPT Daily",
        lessons: [
          { id: "l-cb4a", title: "Asking better questions", type: "VIDEO", duration: "9:00", isFree: true },
          { id: "l-cb5a", title: "Writing & editing with ChatGPT", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-cb6a", title: "Research, summaries & explanations", type: "VIDEO", duration: "8:00", isFree: true },
          { id: "l-cb7a", title: "ChatGPT for students & professionals", type: "VIDEO", duration: "11:00", isFree: true },
        ],
      },
      {
        id: "m-c06-3",
        title: "Getting More from ChatGPT",
        lessons: [
          { id: "l-cb8a", title: "Custom instructions & memory", type: "VIDEO", duration: "8:00", isFree: true },
          { id: "l-cb9a", title: "ChatGPT limitations — what to watch out for", type: "VIDEO", duration: "7:00", isFree: true },
          { id: "l-cb10a", title: "What's next? — your AI learning roadmap", type: "VIDEO", duration: "6:00", isFree: true },
          { id: "l-cb11a", title: "Quiz: ChatGPT Basics", type: "QUIZ", duration: "5:00", isFree: true },
        ],
      },
    ],
  },

  // 7. AI Tools for Everyday Use (FREE)
  {
    id: "c-07",
    slug: "ai-tools-everyday",
    title: "AI Tools for Everyday Use",
    subtitle: "Save 2+ hours daily with the best free AI tools for productivity, writing and creativity",
    description: "Discover the best AI tools available right now for everyday tasks. Covers ChatGPT, Gemini, Copilot, Grammarly AI, Canva AI, Notion AI, Perplexity and more. Learn how to use these tools to write faster, design better and get more done.",
    category: "ai-tools",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 0,
    originalPrice: 0,
    isFree: true,
    isPro: false,
    duration: "3h 15m",
    totalLessons: 18,
    instructor: {
      name: "Sneha Reddy",
      image: null,
      title: "AI for Business Consultant",
      bio: "Helps professionals use AI tools to boost productivity and grow their careers.",
    },
    rating: 4.7,
    totalReviews: 3200,
    totalStudents: 18900,
    tags: ["AI Tools", "Productivity", "Free", "Canva AI", "Notion AI"],
    learningOutcomes: [
      "Use 10+ AI tools to save hours of work every week",
      "Write, edit and proofread with Grammarly and ChatGPT",
      "Design graphics and presentations with Canva AI",
      "Organise and write notes with Notion AI",
      "Research and fact-check with Perplexity AI",
      "Choose the right AI tool for any task",
    ],
    prerequisites: ["Basic computer and internet skills"],
    thumbnail: null,
    isFeatured: false,
    badge: "Free",
    modules: [
      {
        id: "m-c07-1",
        title: "The AI Toolkit Landscape",
        lessons: [
          { id: "l-at1", title: "Best free AI tools in 2025", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-at2", title: "How to choose the right AI tool", type: "VIDEO", duration: "8:00", isFree: true },
          { id: "l-at3", title: "Setting up your AI productivity stack", type: "VIDEO", duration: "9:00", isFree: true },
        ],
      },
      {
        id: "m-c07-2",
        title: "Writing & Research AI Tools",
        lessons: [
          { id: "l-at4", title: "Grammarly AI for perfect writing", type: "VIDEO", duration: "11:00", isFree: true },
          { id: "l-at5", title: "Perplexity AI for research", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-at6", title: "Notion AI for notes & docs", type: "VIDEO", duration: "12:00", isFree: true },
        ],
      },
      {
        id: "m-c07-3",
        title: "Creative & Design AI Tools",
        lessons: [
          { id: "l-at7", title: "Canva AI: Design without skills", type: "VIDEO", duration: "13:00", isFree: true },
          { id: "l-at8", title: "AI for presentations & slides", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-at9", title: "Microsoft Copilot in Office 365", type: "VIDEO", duration: "11:00", isFree: true },
          { id: "l-at10", title: "Your personalised AI workflow", type: "EXERCISE", duration: "15:00", isFree: true },
        ],
      },
    ],
  },


  // 8. Advanced Prompt Engineering
  {
    id: "c-08",
    slug: "advanced-prompting",
    title: "Advanced Prompt Engineering",
    subtitle: "Go beyond the basics — master meta-prompts, prompt chaining, adversarial prompts & red-teaming",
    description: "Designed for AI power users and developers. This course covers advanced prompt engineering: prompt chaining, meta-prompts, self-consistency, tree-of-thought, ReAct, adversarial prompting, and red-teaming LLMs for safety. Includes LangChain integration.",
    category: "prompting",
    level: "Advanced",
    deliveryMode: "PRE_RECORDED",
    price: 3499,
    originalPrice: 6999,
    isFree: false,
    isPro: true,
    duration: "28h 00m",
    totalLessons: 95,
    instructor: {
      name: "Arjun Singh",
      image: null,
      title: "NLP & LLM Researcher",
      bio: "PhD in NLP from IIT Bombay. Specialises in advanced prompting and LLM alignment research.",
    },
    rating: 4.9,
    totalReviews: 980,
    totalStudents: 5600,
    tags: ["Prompt Engineering", "LLMs", "LangChain", "Advanced AI", "Red-teaming"],
    learningOutcomes: [
      "Design complex multi-step prompt chains for agentic workflows",
      "Apply self-consistency and tree-of-thought reasoning",
      "Use ReAct framework for tool-using agents",
      "Test and red-team LLMs for safety and reliability",
      "Build a custom prompt evaluation framework",
      "Fine-tune prompts for specific business use cases",
    ],
    prerequisites: ["Completed AI Prompting Fundamentals or equivalent", "Basic Python knowledge"],
    thumbnail: null,
    isFeatured: false,
    badge: "Hot",
    modules: [
      {
        id: "m-c08-1",
        title: "Beyond Basic Prompting",
        lessons: [
          { id: "l-ap1", title: "The limits of simple prompts", type: "VIDEO", duration: "12:00", isFree: true },
          { id: "l-ap2", title: "Meta-prompts & prompt templates", type: "VIDEO", duration: "15:00", isFree: false },
          { id: "l-ap3", title: "Self-consistency sampling", type: "VIDEO", duration: "13:00", isFree: false },
        ],
      },
      {
        id: "m-c08-2",
        title: "Advanced Reasoning Techniques",
        lessons: [
          { id: "l-ap4", title: "Tree-of-thought prompting", type: "VIDEO", duration: "16:00", isFree: true },
          { id: "l-ap5", title: "ReAct framework for agents", type: "VIDEO", duration: "18:00", isFree: false },
          { id: "l-ap6", title: "Prompt chaining with LangChain", type: "VIDEO", duration: "22:00", isFree: false },
          { id: "l-ap7", title: "Exercise: Build a reasoning chain", type: "EXERCISE", duration: "35:00", isFree: false },
        ],
      },
      {
        id: "m-c08-3",
        title: "Safety, Testing & Red-teaming",
        lessons: [
          { id: "l-ap8", title: "Adversarial prompting & jailbreaks", type: "VIDEO", duration: "14:00", isFree: true },
          { id: "l-ap9", title: "Red-teaming LLMs", type: "VIDEO", duration: "18:00", isFree: false },
          { id: "l-ap10", title: "Building a prompt evaluation suite", type: "EXERCISE", duration: "40:00", isFree: false },
        ],
      },
    ],
  },

  // 9. AI for Business
  {
    id: "c-09",
    slug: "ai-for-business",
    title: "AI for Business & Entrepreneurs",
    subtitle: "Use AI to grow your business, automate operations and outcompete your rivals",
    description: "Practical AI course for Indian entrepreneurs, startup founders, and business professionals. Learn how to implement AI in marketing, sales, HR, operations and customer service. Real case studies from Indian companies. No coding required.",
    category: "business-ai",
    level: "Beginner",
    deliveryMode: "PRE_RECORDED",
    price: 1999,
    originalPrice: 3999,
    isFree: false,
    isPro: true,
    duration: "16h 30m",
    totalLessons: 60,
    instructor: {
      name: "Sneha Reddy",
      image: null,
      title: "AI for Business Consultant",
      bio: "MBA IIM Bangalore. Has helped 150+ Indian businesses adopt AI. Advisor to multiple funded startups.",
    },
    rating: 4.8,
    totalReviews: 1540,
    totalStudents: 9200,
    tags: ["Business AI", "Entrepreneurship", "Marketing AI", "AI Strategy", "No-code AI"],
    learningOutcomes: [
      "Build a practical AI strategy for your business",
      "Automate marketing, content and social media with AI",
      "Use AI for customer service and support automation",
      "Implement AI in HR: hiring, onboarding and training",
      "Analyse business data with AI-powered tools",
      "Stay ahead of competitors using the latest AI trends",
    ],
    prerequisites: ["Basic business knowledge helpful but not required"],
    thumbnail: null,
    isFeatured: true,
    badge: "New",
    modules: [
      {
        id: "m-c09-1",
        title: "AI Strategy for Business",
        lessons: [
          { id: "l-biz1", title: "Why every business needs AI now", type: "VIDEO", duration: "11:00", isFree: true },
          { id: "l-biz2", title: "AI readiness assessment for your business", type: "EXERCISE", duration: "15:00", isFree: false },
          { id: "l-biz3", title: "Building your AI implementation roadmap", type: "VIDEO", duration: "13:00", isFree: false },
        ],
      },
      {
        id: "m-c09-2",
        title: "AI in Marketing & Sales",
        lessons: [
          { id: "l-biz4", title: "AI content creation for social media", type: "VIDEO", duration: "14:00", isFree: true },
          { id: "l-biz5", title: "AI-powered email marketing", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-biz6", title: "Lead generation with AI", type: "VIDEO", duration: "13:00", isFree: false },
          { id: "l-biz7", title: "Case study: Zomato & Swiggy's AI strategy", type: "VIDEO", duration: "10:00", isFree: false },
        ],
      },
      {
        id: "m-c09-3",
        title: "AI in Operations & HR",
        lessons: [
          { id: "l-biz8", title: "AI customer service & chatbots", type: "VIDEO", duration: "15:00", isFree: true },
          { id: "l-biz9", title: "AI for hiring & HR automation", type: "VIDEO", duration: "13:00", isFree: false },
          { id: "l-biz10", title: "AI tools for financial analysis", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-biz11", title: "Project: AI business strategy presentation", type: "EXERCISE", duration: "40:00", isFree: false },
        ],
      },
    ],
  },


  // 10. Stable Diffusion Pro
  {
    id: "c-10",
    slug: "stable-diffusion-pro",
    title: "Stable Diffusion Pro: Advanced Image AI",
    subtitle: "Master Stable Diffusion XL, ControlNet, LoRA training and professional image workflows",
    description: "The most advanced Stable Diffusion course available. Go beyond the basics with SDXL, custom LoRA training, ControlNet, IP-Adapter, AnimateDiff for video, ComfyUI workflows, and building a professional AI image generation pipeline.",
    category: "image-generation",
    level: "Advanced",
    deliveryMode: "PRE_RECORDED",
    price: 3999,
    originalPrice: 7999,
    isFree: false,
    isPro: true,
    duration: "32h 00m",
    totalLessons: 104,
    instructor: {
      name: "Priya Sharma",
      image: null,
      title: "Generative AI Specialist",
      bio: "Ex-Google AI researcher. Deep expertise in diffusion models, ControlNet and professional image generation workflows.",
    },
    rating: 4.9,
    totalReviews: 870,
    totalStudents: 4800,
    tags: ["Stable Diffusion", "SDXL", "ControlNet", "LoRA", "ComfyUI", "AI Art"],
    learningOutcomes: [
      "Run SDXL locally with optimal settings for any GPU",
      "Train custom LoRA models on your own images",
      "Use ControlNet for precise pose, depth and style control",
      "Build automated ComfyUI workflows for production",
      "Create AI videos with AnimateDiff",
      "Build a profitable AI image generation business",
    ],
    prerequisites: [
      "Completed AI Image Generation course or equivalent",
      "A GPU with 6GB+ VRAM recommended",
      "Basic Python knowledge helpful",
    ],
    thumbnail: null,
    isFeatured: false,
    badge: "Hot",
    modules: [
      {
        id: "m-c10-1",
        title: "Stable Diffusion XL Deep Dive",
        lessons: [
          { id: "l-sd1", title: "SDXL architecture explained", type: "VIDEO", duration: "15:00", isFree: true },
          { id: "l-sd2", title: "Local installation & GPU optimisation", type: "VIDEO", duration: "22:00", isFree: false },
          { id: "l-sd3", title: "AUTOMATIC1111 vs ComfyUI — which to use?", type: "VIDEO", duration: "14:00", isFree: false },
        ],
      },
      {
        id: "m-c10-2",
        title: "ControlNet Mastery",
        lessons: [
          { id: "l-sd4", title: "ControlNet models overview", type: "VIDEO", duration: "13:00", isFree: true },
          { id: "l-sd5", title: "Pose control with OpenPose", type: "VIDEO", duration: "16:00", isFree: false },
          { id: "l-sd6", title: "Depth and edge control", type: "VIDEO", duration: "15:00", isFree: false },
          { id: "l-sd7", title: "IP-Adapter for style transfer", type: "VIDEO", duration: "18:00", isFree: false },
        ],
      },
      {
        id: "m-c10-3",
        title: "Training Custom LoRAs",
        lessons: [
          { id: "l-sd8", title: "What is LoRA and why train one?", type: "VIDEO", duration: "12:00", isFree: true },
          { id: "l-sd9", title: "Dataset preparation & cleaning", type: "VIDEO", duration: "20:00", isFree: false },
          { id: "l-sd10", title: "Training your first LoRA", type: "EXERCISE", duration: "35:00", isFree: false },
          { id: "l-sd11", title: "Publishing and selling your LoRA", type: "VIDEO", duration: "12:00", isFree: false },
        ],
      },
    ],
  },

  // 11. LLM Fundamentals
  {
    id: "c-11",
    slug: "llm-fundamentals",
    title: "Understanding LLMs & Transformers",
    subtitle: "The theoretical and practical foundation of large language models — from attention to fine-tuning",
    description: "Understand how large language models actually work. Covers transformer architecture, attention mechanisms, tokenisation, pre-training, RLHF, fine-tuning, and the major LLMs (GPT-4, Gemini, Llama, Mistral). Includes hands-on fine-tuning a small model.",
    category: "llm",
    level: "Intermediate",
    deliveryMode: "PRE_RECORDED",
    price: 2999,
    originalPrice: 5999,
    isFree: false,
    isPro: true,
    duration: "24h 00m",
    totalLessons: 82,
    instructor: {
      name: "Arjun Singh",
      image: null,
      title: "NLP & LLM Researcher",
      bio: "PhD in NLP from IIT Bombay. Researcher at Microsoft Research India. Specialist in transformers and LLM internals.",
    },
    rating: 4.9,
    totalReviews: 1120,
    totalStudents: 6700,
    tags: ["LLMs", "Transformers", "NLP", "Fine-tuning", "GPT", "Research"],
    learningOutcomes: [
      "Understand how transformer architecture works end-to-end",
      "Explain attention mechanisms, positional encoding and tokenisation",
      "Understand how LLMs are pre-trained and aligned with RLHF",
      "Compare leading LLMs: GPT-4, Gemini, Llama 3, Mistral",
      "Fine-tune an open-source LLM for a custom task",
      "Apply LLM knowledge to make better product decisions",
    ],
    prerequisites: ["Basic Python", "Linear algebra fundamentals helpful"],
    thumbnail: null,
    isFeatured: false,
    badge: "New",
    modules: [
      {
        id: "m-c11-1",
        title: "Transformer Architecture",
        lessons: [
          { id: "l-llm1", title: "From RNNs to Transformers — the history", type: "VIDEO", duration: "14:00", isFree: true },
          { id: "l-llm2", title: "Attention is all you need — explained", type: "VIDEO", duration: "20:00", isFree: false },
          { id: "l-llm3", title: "Tokenisation and embeddings", type: "VIDEO", duration: "15:00", isFree: false },
          { id: "l-llm4", title: "Quiz: Transformer fundamentals", type: "QUIZ", duration: "10:00", isFree: false },
        ],
      },
      {
        id: "m-c11-2",
        title: "Pre-training, RLHF & Alignment",
        lessons: [
          { id: "l-llm5", title: "How LLMs are pre-trained on internet data", type: "VIDEO", duration: "16:00", isFree: true },
          { id: "l-llm6", title: "Instruction tuning & RLHF", type: "VIDEO", duration: "18:00", isFree: false },
          { id: "l-llm7", title: "Constitutional AI & DPO", type: "VIDEO", duration: "14:00", isFree: false },
        ],
      },
      {
        id: "m-c11-3",
        title: "Fine-tuning & Deployment",
        lessons: [
          { id: "l-llm8", title: "Fine-tuning with QLoRA on free GPU", type: "VIDEO", duration: "28:00", isFree: true },
          { id: "l-llm9", title: "Serving a fine-tuned model with FastAPI", type: "EXERCISE", duration: "35:00", isFree: false },
          { id: "l-llm10", title: "LLM benchmarks & evaluation", type: "VIDEO", duration: "16:00", isFree: false },
        ],
      },
    ],
  },

  // 12. AI Automation & Workflows
  {
    id: "c-12",
    slug: "ai-automation",
    title: "AI Automation & Workflows",
    subtitle: "Automate your business and life using AI + no-code tools: Zapier, Make, n8n & more",
    description: "Learn to build powerful AI automation workflows without coding. Combines AI tools (ChatGPT, Claude, Gemini) with automation platforms (Zapier, Make.com, n8n) to automate email, social media, data entry, reporting and more. Includes live workshops.",
    category: "automation",
    level: "Intermediate",
    deliveryMode: "HYBRID",
    price: 2499,
    originalPrice: 4999,
    isFree: false,
    isPro: true,
    duration: "20h 00m",
    totalLessons: 70,
    instructor: {
      name: "Rahul Mehta",
      image: null,
      title: "AI Engineer & Educator",
      bio: "AI automation expert. Has built 500+ automation workflows for businesses. Expert in Zapier, Make and n8n.",
    },
    rating: 4.8,
    totalReviews: 1340,
    totalStudents: 8100,
    tags: ["AI Automation", "Zapier", "Make", "n8n", "No-code", "Workflows"],
    learningOutcomes: [
      "Build end-to-end automation workflows with Zapier and Make",
      "Connect AI tools (ChatGPT, Claude) to 1000+ apps",
      "Automate social media posting, email replies, and reporting",
      "Build self-running data pipelines with n8n",
      "Create AI-powered lead generation systems",
      "Save 10+ hours per week with intelligent automation",
    ],
    prerequisites: ["Basic computer skills", "A Google account"],
    thumbnail: null,
    isFeatured: true,
    badge: "Hot",
    modules: [
      {
        id: "m-c12-1",
        title: "Introduction to AI Automation",
        lessons: [
          { id: "l-aut1", title: "The automation opportunity in 2025", type: "VIDEO", duration: "10:00", isFree: true },
          { id: "l-aut2", title: "Zapier vs Make vs n8n — which to choose?", type: "VIDEO", duration: "12:00", isFree: false },
          { id: "l-aut3", title: "Setting up your automation stack", type: "VIDEO", duration: "10:00", isFree: false },
        ],
      },
      {
        id: "m-c12-2",
        title: "Building Workflows with Zapier",
        lessons: [
          { id: "l-aut4", title: "Your first Zap — step by step", type: "VIDEO", duration: "14:00", isFree: true },
          { id: "l-aut5", title: "Connecting ChatGPT to Zapier", type: "VIDEO", duration: "16:00", isFree: false },
          { id: "l-aut6", title: "Automating email with AI", type: "EXERCISE", duration: "25:00", isFree: false },
          { id: "l-aut7", title: "Social media automation pipeline", type: "EXERCISE", duration: "30:00", isFree: false },
        ],
      },
      {
        id: "m-c12-3",
        title: "Advanced: Make & n8n",
        lessons: [
          { id: "l-aut8", title: "Make.com — visual workflow builder", type: "VIDEO", duration: "18:00", isFree: true },
          { id: "l-aut9", title: "n8n self-hosted automation", type: "VIDEO", duration: "22:00", isFree: false },
          { id: "l-aut10", title: "Build an AI lead generation bot", type: "EXERCISE", duration: "45:00", isFree: false },
          { id: "l-aut11", title: "Live workshop: Your personal automation system", type: "VIDEO", duration: "60:00", isFree: false },
        ],
      },
    ],
  },
];


// ── Live Classes ───────────────────────────────────────────
export const LIVE_CLASSES: LiveClass[] = [
  {
    id: "lc-01",
    title: "ChatGPT Masterclass: Live Q&A & Advanced Techniques",
    instructor: "Rahul Mehta",
    instructorTitle: "AI Engineer & Educator",
    date: "2026-06-10",
    time: "7:00 PM IST",
    duration: "90 min",
    topic: "Advanced ChatGPT prompting, custom GPTs, and live demos",
    price: 0,
    maxSeats: 500,
    seatsLeft: 87,
    isLive: false,
    description: "Join Rahul for a live deep-dive into advanced ChatGPT techniques. Bring your questions — we'll cover custom GPTs, plugins, and the latest GPT-4 features in real time.",
    platform: "Zoom",
  },
  {
    id: "lc-02",
    title: "AI Image Generation Workshop: Midjourney v6 Secrets",
    instructor: "Priya Sharma",
    instructorTitle: "Generative AI Specialist",
    date: "2026-06-15",
    time: "5:00 PM IST",
    duration: "120 min",
    topic: "Midjourney v6 parameters, style prompting, commercial use",
    price: 0,
    maxSeats: 300,
    seatsLeft: 42,
    isLive: false,
    description: "A hands-on live workshop with Priya where you will create stunning AI images using Midjourney v6. Learn the most powerful parameters, style mixing, and how to use AI images for your business.",
    platform: "Google Meet",
  },
  {
    id: "lc-03",
    title: "Build Your First AI Chatbot in 2 Hours — Live Coding",
    instructor: "Arjun Singh",
    instructorTitle: "NLP & LLM Researcher",
    date: "2026-06-20",
    time: "6:00 PM IST",
    duration: "120 min",
    topic: "LangChain, OpenAI API, and deploying a working chatbot",
    price: 0,
    maxSeats: 200,
    seatsLeft: 31,
    isLive: true,
    description: "Arjun will live-code a complete AI chatbot from scratch using LangChain and OpenAI API. By the end of this session you will have a deployed chatbot you can share with anyone.",
    platform: "Zoom",
  },
  {
    id: "lc-04",
    title: "AI for Indian Businesses: Real Case Studies & Strategy",
    instructor: "Sneha Reddy",
    instructorTitle: "AI for Business Consultant",
    date: "2026-06-25",
    time: "4:00 PM IST",
    duration: "90 min",
    topic: "AI adoption in Indian SMEs, startup case studies, ROI calculation",
    price: 0,
    maxSeats: 400,
    seatsLeft: 156,
    isLive: false,
    description: "Sneha will walk through 5 real Indian business case studies showing exactly how companies used AI to grow revenue, reduce costs, and beat competition.",
    platform: "Google Meet",
  },
  {
    id: "lc-05",
    title: "Understanding GPT-4o & Gemini 1.5: What's New in AI",
    instructor: "Arjun Singh",
    instructorTitle: "NLP & LLM Researcher",
    date: "2026-07-05",
    time: "7:30 PM IST",
    duration: "60 min",
    topic: "Latest AI model releases, capabilities comparison, and what's coming next",
    price: 0,
    maxSeats: 600,
    seatsLeft: 320,
    isLive: false,
    description: "Stay current with the latest in AI. Arjun will break down the newest models from OpenAI and Google, compare their capabilities, and give you a practical guide to choosing the right model for your use case.",
    platform: "Zoom",
  },
];

// ── Helper functions ───────────────────────────────────────
export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getFeaturedCourses(limit = 6): Course[] {
  return COURSES.filter((c) => c.isFeatured).slice(0, limit);
}

export function getFreeCourses(): Course[] {
  return COURSES.filter((c) => c.isFree);
}

export function getCoursesByCategory(category: string): Course[] {
  if (category === "all") return COURSES;
  return COURSES.filter((c) => c.category === category);
}

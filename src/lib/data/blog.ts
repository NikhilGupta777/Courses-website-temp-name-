// ─── Blog post data ───────────────────────────────────────────────────────────
// In production, replace with a CMS (Contentful, Sanity, or MDX files).

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // markdown / rich text
  author: { name: string; role: string; avatar: string };
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  coverColor: string; // tailwind gradient classes
  featured: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "chatgpt-prompt-tips-2026",
    title: "10 ChatGPT Prompt Tips That Will 10x Your Productivity in 2026",
    subtitle: "Stop writing vague prompts. Here's exactly how to get expert-level output from ChatGPT every single time.",
    excerpt: "Most people use ChatGPT like a search engine. Here's why that's wrong — and the exact prompting techniques that turn it into a personal expert assistant.",
    content: `## Why Most People Get Bad Results from ChatGPT

The single biggest mistake people make with ChatGPT is treating it like a search engine. They type a vague question, get a mediocre answer, and conclude that "AI isn't that good."

The reality? The model is extraordinary — but it needs context, role, format, and constraints to deliver its best.

## Tip 1: Always Assign a Role

Instead of: *"Explain machine learning"*

Try: *"You are a professor teaching machine learning to a final-year BTech student who already knows Python and basic statistics. Explain supervised learning with real-world Indian industry examples."*

The role primes the model's knowledge and communication style instantly.

## Tip 2: Use the CTF Framework

**Context → Task → Format**

- **Context**: Who you are, what you're working on
- **Task**: Exactly what you need
- **Format**: How you want the output (bullet list, table, 3 paragraphs, code, etc.)

## Tip 3: Give Examples (Few-Shot Prompting)

Show the model what good output looks like:

*"Here are two good subject lines I've written before: [example 1], [example 2]. Now write 5 more in the same style for a discount campaign."*

## Tip 4: Ask for Chain-of-Thought

Add *"Think step by step"* or *"Walk me through your reasoning"* to any complex problem. This dramatically improves accuracy on logic, math, and planning tasks.

## Tip 5: Set Constraints

*"In under 150 words, explain X to a 10-year-old. Use no jargon."*

Constraints force the model to be precise and useful.

## Tip 6: Use System-Level Instructions

If you're using the API or a GPT, set a system prompt:

*"You are a friendly but precise AI tutor. Always give examples. Never say 'I cannot'. If you don't know something, say so clearly."*

## Tip 7: Iterate, Don't Start Over

Bad output? Don't start a new chat. Add:

*"That was too formal. Rewrite it in a casual conversational tone, as if speaking to a friend."*

## Tip 8: Ask for Multiple Options

*"Give me 3 different approaches to solving this, ranked from simplest to most robust."*

Having options lets you pick or combine the best elements.

## Tip 9: Request Critiques

*"Now critique your own answer. What are the weaknesses or things you might have missed?"*

This surfaces blind spots the model itself can identify.

## Tip 10: Use Personas for Creative Work

*"You are a skeptical venture capitalist who has seen 500 pitches. Tear apart my business idea and find every flaw."*

Personas unlock dramatically different perspectives from the same model.

---

**Want to go deeper?** Our [AI Prompting Fundamentals](/courses/ai-prompting-fundamentals) course covers all these techniques and more — completely free.`,
    author: { name: "Rahul Mehta", role: "AI Engineer & Educator", avatar: "R" },
    publishedAt: "May 10, 2026",
    readingTime: "7 min read",
    category: "Prompting",
    tags: ["ChatGPT", "Prompting", "Productivity", "AI Tips"],
    coverColor: "from-violet-500 to-purple-600",
    featured: true,
  },
  {
    slug: "gemini-vs-chatgpt-2026",
    title: "Gemini 1.5 Pro vs ChatGPT-4o: Which AI Should Indian Developers Use?",
    subtitle: "An honest, hands-on comparison of both platforms — pricing, capabilities, and which wins for different use cases.",
    excerpt: "Both are excellent. But for Indian developers, the choice matters — from API pricing in INR to multimodal capabilities. Here's the full breakdown.",
    content: `## The Real Question Isn't Which Is Better

Both Gemini 1.5 Pro and GPT-4o are world-class models. The question is: **which is better for your specific use case?**

## Pricing (Important for Indian Developers)

As of May 2026:
- **Gemini 1.5 Pro**: $3.50 per million input tokens, $10.50 output (via Google AI Studio)
- **GPT-4o**: $5 per million input tokens, $15 output (via OpenAI API)

For high-volume applications, Gemini is meaningfully cheaper.

## Context Window

- **Gemini 1.5 Pro**: 1 million tokens (industry-leading)
- **GPT-4o**: 128k tokens

For processing long documents, codebases, or research papers — Gemini wins decisively.

## Multimodal Capabilities

Both handle text, images, and code. Gemini additionally handles:
- **Native video understanding** (upload a video, ask questions about it)
- **Native audio** (not just transcription, but understanding)
- **PDF and document analysis** at scale

GPT-4o is stronger on image generation via DALL-E integration.

## Coding Performance

GPT-4o currently edges ahead on:
- Complex multi-file refactoring
- Debugging subtle edge cases
- Following very specific coding style guides

Gemini is catching up fast and excels at:
- Code explanation with 1M context
- Understanding large codebases in one shot

## Which Should You Use?

| Use Case | Winner |
|----------|--------|
| Processing long documents | Gemini |
| Video/audio understanding | Gemini |
| Creative writing | GPT-4o |
| Code generation | GPT-4o (slight edge) |
| Cost-sensitive production | Gemini |
| Free daily use | Both (free tiers available) |

## Our Verdict

**Use both.** Seriously. They're complementary.

Start with Gemini for document-heavy and multimodal work. Use GPT-4o for coding, creative tasks, and when you need the most precise instruction following.

Want to master both? We have courses covering [Gemini AI](/courses/gemini-ai-masterclass) and [ChatGPT](/courses/chatgpt-mastery) in depth.`,
    author: { name: "Arjun Singh", role: "NLP & LLM Researcher", avatar: "A" },
    publishedAt: "May 7, 2026",
    readingTime: "9 min read",
    category: "AI Tools",
    tags: ["Gemini", "ChatGPT", "Comparison", "API"],
    coverColor: "from-blue-500 to-cyan-500",
    featured: true,
  },
  {
    slug: "stable-diffusion-beginners-guide",
    title: "Stable Diffusion for Absolute Beginners: Your First AI Image in 10 Minutes",
    subtitle: "No GPU required. No coding needed. This guide walks you through creating stunning AI images from scratch.",
    excerpt: "AI image generation sounds complex, but you can create professional-quality images in under 10 minutes. Here's exactly how.",
    content: `## You Don't Need a Powerful GPU Anymore

The biggest misconception about Stable Diffusion is that you need an expensive GPU. In 2026, you have three free options to run it entirely in the cloud.

## Option 1: Google Colab (Easiest)

1. Open [colab.research.google.com](https://colab.research.google.com)
2. Search for "Stable Diffusion AUTOMATIC1111 Colab"
3. Click "Open in Colab" → Runtime → Run All
4. Wait ~3 minutes for the interface to load
5. You're generating images

## Option 2: Hugging Face Spaces

Visit [huggingface.co/spaces](https://huggingface.co/spaces) and search for "Stable Diffusion". Dozens of free demos are available — no setup at all.

## Writing Your First Prompt

The anatomy of a great SD prompt:

**[Subject] + [Style] + [Lighting] + [Quality Tags]**

Example: *"Portrait of a young Indian woman, digital art, Artstation, soft golden hour lighting, 4k, highly detailed, professional photography"*

## Negative Prompts: The Secret Weapon

Negative prompts tell the model what NOT to include:

*"blurry, ugly, deformed, low quality, watermark, text, signature"*

Always add this — it dramatically improves quality.

## Key Parameters

- **Steps**: 20-30 is the sweet spot (more = slower but better)
- **CFG Scale**: 7-9 (how closely to follow your prompt)
- **Sampler**: DPM++ 2M Karras is reliable for most images

## Your First Challenge

Try generating: *"A vibrant Indian street market at sunset, photorealistic, 8k, golden light, award-winning photography"*

With the right negative prompt, you'll get a stunning result on your first try.

Want to go further? Our [AI Image Generation course](/courses/image-generation-ai) covers Midjourney, DALL-E 3, and Stable Diffusion end to end.`,
    author: { name: "Priya Sharma", role: "Generative AI Specialist", avatar: "P" },
    publishedAt: "May 3, 2026",
    readingTime: "6 min read",
    category: "Image Generation",
    tags: ["Stable Diffusion", "AI Art", "Beginners", "Free"],
    coverColor: "from-pink-500 to-rose-500",
    featured: false,
  },
  {
    slug: "ai-tools-for-freelancers-india",
    title: "7 AI Tools That Are Making Indian Freelancers 3x More Productive",
    subtitle: "From content writing to client management — these tools are quietly transforming how Indian freelancers work.",
    excerpt: "A curated list of AI tools that are actually useful for Indian freelancers — tested, priced in INR where possible, and honest about limitations.",
    content: `## The AI Advantage for Freelancers

As a freelancer, your income is directly tied to your output and quality. AI tools don't replace your skills — they amplify them. Here are the tools worth your attention.

## 1. ChatGPT Plus (₹1,700/month)

**Best for**: Writing, research, client emails, proposals
**Why it's worth it**: The code interpreter alone saves hours. Writing proposals, summarising documents, and drafting client responses becomes 5x faster.

## 2. Grammarly Business

**Best for**: Any English writing (emails, content, reports)
**Free tier**: Surprisingly good. Paid adds tone detection and style guides.

## 3. Canva AI (Free + Pro ₹3,999/year)

**Best for**: Social media graphics, presentations, thumbnails
**Magic Write + Magic Edit** are genuinely impressive and require zero design skills.

## 4. Perplexity AI (Free)

**Best for**: Research and fact-checking
**Why**: Unlike ChatGPT, it cites sources. Critical for any content that needs to be accurate.

## 5. Notion AI (₹800/month add-on)

**Best for**: Project management, meeting notes, documentation
**Killer feature**: "Summarise this meeting transcript" saves 30 minutes per call.

## 6. Otter.ai

**Best for**: Recording and transcribing client calls
**Free tier**: 300 minutes/month — enough for most freelancers.

## 7. Copy.ai / Jasper

**Best for**: Marketing copy, product descriptions, ad copy
**Honest take**: Better for structured content types (ads, product descriptions) than long-form writing.

## The Stack We Recommend

For most Indian freelancers starting out:
1. **ChatGPT Free** (upgrade to Plus when you can)
2. **Grammarly Free**
3. **Canva Free**
4. **Perplexity Free**

That's ₹0/month and will noticeably improve your output quality immediately.

Want a practical walkthrough of all these tools? Our [AI Tools for Everyday Use](/courses/ai-tools-everyday) course is completely free.`,
    author: { name: "Sneha Reddy", role: "AI for Business Consultant", avatar: "S" },
    publishedAt: "April 28, 2026",
    readingTime: "8 min read",
    category: "AI Tools",
    tags: ["Freelancing", "Productivity", "AI Tools", "India"],
    coverColor: "from-indigo-500 to-blue-600",
    featured: false,
  },
  {
    slug: "career-in-ai-india-2026",
    title: "How to Land an AI/ML Job in India in 2026: A Complete Roadmap",
    subtitle: "The hiring landscape, required skills, salary benchmarks, and the exact learning path to go from zero to your first AI job.",
    excerpt: "AI jobs in India are booming — but competition is fierce. This guide shows exactly what to learn, how to build your portfolio, and how to get noticed.",
    content: `## The Indian AI Job Market in 2026

India now has over 200,000 AI/ML job openings, making it the second-largest AI talent market globally. But: most applicants lack practical skills. That gap is your opportunity.

## What Companies Actually Hire For

**Tier 1 (Google, Microsoft, Amazon India)**: Deep ML theory, publications, IIT/IISc credentials or equivalent demonstrated skill
**Tier 2 (Infosys, TCS AI divisions, Wipro)**: Python, ML frameworks, a strong portfolio
**Startups**: Practical skills > credentials. Build things that work.

## The Honest Salary Picture (2026)

| Role | Fresher | 2-3 Years |
|------|---------|-----------|
| ML Engineer | ₹8-15 LPA | ₹18-35 LPA |
| Data Scientist | ₹7-12 LPA | ₹15-28 LPA |
| NLP Engineer | ₹10-18 LPA | ₹22-40 LPA |
| AI Product Manager | ₹12-20 LPA | ₹25-45 LPA |

## The 6-Month Learning Roadmap

**Month 1-2: Foundations**
- Python (if not already)
- Statistics & probability basics
- Our free [AI Prompting course](/courses/ai-prompting-fundamentals)

**Month 3-4: Core ML**
- Scikit-learn, pandas, NumPy
- Our [Machine Learning Bootcamp](/courses/chatgpt-mastery)
- Kaggle competitions (at least 2)

**Month 5-6: Specialise + Build**
- Pick one: NLP, Computer Vision, or LLMs
- Build 2-3 portfolio projects with GitHub repos
- Deploy at least one project publicly

## Portfolio > Certificates

A working ML project deployed on Hugging Face Spaces or a GitHub repo with clean code is worth more than any certification. Build things recruiters can click and use.

## Where to Find Jobs

- **LinkedIn**: Search "ML Engineer India" + "LLM" + "Python"
- **Naukri.com**: AI-specific filters
- **Internshala**: For freshers and interns
- **AngelList**: For startup roles
- **Referrals**: Most overlooked. Our community Discord connects 5,000+ learners.

Ready to start? Our complete AI learning path starts with [three free courses](/courses) — no credit card needed.`,
    author: { name: "Rahul Mehta", role: "AI Engineer & Educator", avatar: "R" },
    publishedAt: "April 22, 2026",
    readingTime: "11 min read",
    category: "Career",
    tags: ["Career", "AI Jobs", "India", "Roadmap", "Salary"],
    coverColor: "from-green-500 to-emerald-600",
    featured: false,
  },
  {
    slug: "llm-fine-tuning-beginners",
    title: "Fine-tuning an LLM in 2026: What's Changed and How to Do It for Free",
    subtitle: "QLoRA, Unsloth, and Google Colab have made fine-tuning accessible to everyone. Here's a practical starter guide.",
    excerpt: "Fine-tuning used to require thousands of dollars of compute. In 2026, you can do it for free in a Google Colab notebook. Here's how.",
    content: `## Why Fine-tuning Matters Now

Pre-trained LLMs are general-purpose. Fine-tuning makes them expert at your specific task — whether that's customer support for your product, code generation in your codebase style, or medical question answering.

## The 2026 Landscape

Three breakthroughs made fine-tuning accessible:

1. **QLoRA**: Fine-tune large models with minimal GPU memory (4-bit quantisation + LoRA)
2. **Unsloth**: 2x faster fine-tuning with 70% less VRAM vs standard QLoRA
3. **Google Colab free T4**: Enough to fine-tune Llama 3 8B on custom data

## What You Need

- A Google account (free Colab)
- 50-1,000 training examples in instruction-response format
- ~3-4 hours (mostly waiting)

## Step-by-Step with Unsloth

\`\`\`python
# Install
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"

# Load model (4-bit quantised)
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/llama-3-8b-bnb-4bit",
    max_seq_length = 2048,
    load_in_4bit = True,
)

# Add LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_alpha = 16,
    lora_dropout = 0,
    bias = "none",
)
\`\`\`

## Formatting Your Training Data

The Alpaca format works well for instruction tuning:

\`\`\`json
{
  "instruction": "Summarise this customer complaint in one sentence.",
  "input": "I ordered the product 3 weeks ago and still haven't received it...",
  "output": "Customer ordered 3 weeks ago, item not received, requesting update."
}
\`\`\`

## After Training: Evaluate Before Deploying

Always test on held-out examples your model never saw during training. Look for:
- Hallucinations (confidently wrong answers)
- Format inconsistencies  
- Edge case failures

## Hosting Your Fine-tuned Model

Free options: Hugging Face Hub (private or public), Ollama for local deployment.

Want to go deep? Our [Understanding LLMs & Transformers course](/courses/llm-fundamentals) covers the theory, and we're adding a hands-on fine-tuning module next month.`,
    author: { name: "Arjun Singh", role: "NLP & LLM Researcher", avatar: "A" },
    publishedAt: "April 15, 2026",
    readingTime: "12 min read",
    category: "LLMs",
    tags: ["LLMs", "Fine-tuning", "QLoRA", "Open Source AI"],
    coverColor: "from-slate-600 to-gray-700",
    featured: false,
  },
];

export const BLOG_CATEGORIES = [
  "All",
  "Prompting",
  "AI Tools",
  "Image Generation",
  "Career",
  "LLMs",
  "Tutorials",
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => p.category === category);
}

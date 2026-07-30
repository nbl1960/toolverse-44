import type { PromptTemplate } from "./types";

/**
 * Every template here is genuinely usable as written — copy, paste,
 * fill in the bracketed placeholder, done. Not filler content padded
 * out to look comprehensive; each one follows the same structural
 * principles the Analyzer checks for (role, task, format, constraints).
 */
export const PROMPT_LIBRARY: PromptTemplate[] = [
  {
    id: "blog-post",
    title: "Blog post outline",
    category: "Writing",
    targetModel: "chatgpt",
    prompt:
      "You are an experienced content writer. Write a detailed outline for a blog post titled \"[TITLE]\" aimed at [AUDIENCE]. Structure it with an introduction, 4-6 main sections with descriptive subheadings, and a conclusion. For each section, include 2-3 bullet points on what to cover. Keep the tone [TONE, e.g. conversational and practical].",
  },
  {
    id: "email-followup",
    title: "Professional follow-up email",
    category: "Writing",
    targetModel: "chatgpt",
    prompt:
      "You are a professional communicator. Write a concise follow-up email to [RECIPIENT] regarding [TOPIC]. The email should reference our previous conversation about [CONTEXT], restate the key ask clearly, and end with a specific, low-friction next step. Keep it under 150 words and maintain a warm but professional tone.",
  },
  {
    id: "code-review",
    title: "Code review request",
    category: "Coding",
    targetModel: "claude",
    prompt:
      "You are a senior software engineer conducting a code review. Review the following [LANGUAGE] code for correctness, readability, and potential bugs. For each issue found, explain what's wrong, why it matters, and suggest a specific fix. Organize your response by severity (critical, moderate, minor). Code:\n\n[PASTE CODE HERE]",
  },
  {
    id: "debug-help",
    title: "Debugging assistant",
    category: "Coding",
    targetModel: "claude",
    prompt:
      "You are a debugging expert. I'm getting the following error: \"[ERROR MESSAGE]\" when running [WHAT YOU WERE DOING]. Here's the relevant code:\n\n[PASTE CODE HERE]\n\nExplain the most likely root cause first, then walk through how to fix it step by step. If there could be multiple causes, list them in order of likelihood.",
  },
  {
    id: "explain-simply",
    title: "Explain a complex topic simply",
    category: "Education",
    targetModel: "gemini",
    prompt:
      "You are a patient teacher explaining [TOPIC] to a complete beginner with no background in the subject. Use a real-world analogy to build intuition first, then explain the core concept in plain language, avoiding jargon. Keep it to 3-4 short paragraphs. End with one question I could ask myself to check my understanding.",
  },
  {
    id: "study-plan",
    title: "Personalized study plan",
    category: "Education",
    targetModel: "gemini",
    prompt:
      "You are an academic tutor. Create a [DURATION]-week study plan for learning [SUBJECT], starting from [CURRENT LEVEL, e.g. complete beginner]. Break it into weekly milestones with specific topics to cover and one practical exercise per week. Format the plan as a table with columns for Week, Topics, and Practice Exercise.",
  },
  {
    id: "product-description",
    title: "E-commerce product description",
    category: "Business",
    targetModel: "chatgpt",
    prompt:
      "You are a copywriter for an e-commerce brand. Write a product description for [PRODUCT NAME], a [SHORT PRODUCT DESCRIPTION]. Highlight 3 key benefits (not just features), address one likely customer objection, and end with a clear call to action. Target audience: [AUDIENCE]. Keep it under 120 words, in an upbeat, confident tone.",
  },
  {
    id: "meeting-summary",
    title: "Meeting notes to action items",
    category: "Business",
    targetModel: "claude",
    prompt:
      "You are an executive assistant. Below are raw meeting notes. Summarize the key decisions made, then produce a bulleted list of action items, each with an owner (if mentioned) and a deadline (if mentioned, otherwise write \"no deadline set\"). Keep the summary to 3 sentences maximum. Notes:\n\n[PASTE NOTES HERE]",
  },
  {
    id: "swot-analysis",
    title: "SWOT analysis",
    category: "Business",
    targetModel: "gemini",
    prompt:
      "You are a business strategy consultant. Conduct a SWOT analysis for [BUSINESS/PRODUCT], operating in [INDUSTRY/MARKET]. Provide 3-4 specific, non-generic points per category (Strengths, Weaknesses, Opportunities, Threats) — avoid vague statements like \"strong brand\" without specifics. Format as a table.",
  },
  {
    id: "social-caption",
    title: "Social media caption set",
    category: "Marketing",
    targetModel: "chatgpt",
    prompt:
      "You are a social media manager. Write 3 distinct caption options for a post about [TOPIC/PRODUCT], each with a different angle (e.g. one direct, one story-driven, one question-based). Each caption should be under 280 characters, include one clear call to action, and match a [TONE, e.g. playful and confident] brand voice.",
  },
  {
    id: "ad-copy",
    title: "Ad copy variations",
    category: "Marketing",
    targetModel: "chatgpt",
    prompt:
      "You are a direct-response copywriter. Write 3 short ad headlines (under 10 words each) and matching body copy (under 30 words each) for [PRODUCT/SERVICE], targeting [AUDIENCE] who currently struggle with [PAIN POINT]. Each variation should lead with a different hook: curiosity, urgency, and social proof.",
  },
  {
    id: "portrait-photo",
    title: "Realistic portrait",
    category: "Image",
    targetModel: "midjourney",
    prompt:
      "portrait of [SUBJECT DESCRIPTION], natural lighting, shallow depth of field, 85mm lens, soft shadows, neutral background, photorealistic, highly detailed skin texture --ar 3:4 --v 6",
  },
  {
    id: "product-shot",
    title: "Studio product photography",
    category: "Image",
    targetModel: "midjourney",
    prompt:
      "[PRODUCT] on a minimal white background, studio lighting, soft reflections, product photography, high detail, centered composition, commercial advertising style --ar 1:1 --v 6",
  },
  {
    id: "landscape-scene",
    title: "Atmospheric landscape",
    category: "Image",
    targetModel: "dalle",
    prompt:
      "A wide, atmospheric landscape of [LOCATION/SCENE] during [TIME OF DAY], with dramatic lighting and soft clouds, painted in a realistic digital art style with rich, warm color grading.",
  },
  {
    id: "resume-bullet",
    title: "Resume bullet point rewrite",
    category: "Career",
    targetModel: "claude",
    prompt:
      "You are a resume writing expert. Rewrite the following resume bullet point to be more results-oriented, using the format: Action verb + what you did + measurable outcome. If a metric isn't provided, suggest where one could realistically go without inventing a specific number. Original bullet: \"[PASTE BULLET HERE]\"",
  },
  {
    id: "interview-prep",
    title: "Interview answer practice",
    category: "Career",
    targetModel: "chatgpt",
    prompt:
      "You are an interview coach. I'm preparing for a [ROLE] interview. Ask me the question \"[INTERVIEW QUESTION]\" one at a time, wait for my answer, then give specific, constructive feedback on structure, clarity, and impact before moving to the next round. Start with the first question now.",
  },
];

export const PROMPT_LIBRARY_CATEGORIES = Array.from(new Set(PROMPT_LIBRARY.map((t) => t.category)));

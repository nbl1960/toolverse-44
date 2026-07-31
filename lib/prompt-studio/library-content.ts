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
  {
    id: "cover-letter",
    title: "Cover letter draft",
    category: "Career",
    targetModel: "claude",
    prompt:
      "You are a career coach. Write a cover letter for a [ROLE] position at [COMPANY]. I have [X years] of experience in [FIELD], and my strongest relevant achievement is [SPECIFIC ACHIEVEMENT]. Keep it to 3 paragraphs: an opening hook, a middle paragraph connecting my experience to their needs, and a confident closing. Avoid generic phrases like \"team player\" or \"hard worker\".",
  },
  {
    id: "data-summary",
    title: "Summarize a dataset in plain language",
    category: "Business",
    targetModel: "gemini",
    prompt:
      "You are a data analyst explaining findings to a non-technical stakeholder. Below is a summary of [DATASET/METRICS]. Explain the 3 most important takeaways in plain language, avoid statistical jargon, and end with one clear recommendation based on the data. Data:\n\n[PASTE DATA/METRICS HERE]",
  },
  {
    id: "presentation-outline",
    title: "Presentation outline",
    category: "Business",
    targetModel: "chatgpt",
    prompt:
      "You are a presentation coach. Create a slide-by-slide outline for a [DURATION]-minute presentation on [TOPIC] to an audience of [AUDIENCE]. For each slide, give a one-line headline and 2-3 supporting bullet points. Include a strong opening hook slide and a clear closing call-to-action slide. Aim for [NUMBER] slides total.",
  },
  {
    id: "translate-tone",
    title: "Translate while preserving tone",
    category: "Writing",
    targetModel: "claude",
    prompt:
      "You are a professional translator. Translate the following text from [SOURCE LANGUAGE] to [TARGET LANGUAGE], preserving the original tone (e.g. formal, playful, urgent) rather than translating literally word-for-word. If an idiom doesn't translate directly, use the closest natural equivalent in the target language rather than a literal translation. Text:\n\n[PASTE TEXT HERE]",
  },
  {
    id: "video-script",
    title: "Short-form video script",
    category: "Marketing",
    targetModel: "chatgpt",
    prompt:
      "You are a short-form video scriptwriter. Write a 30-45 second script for a video about [TOPIC], structured as: a 3-second hook, the main point delivered in plain language, and a call to action. Include brief [VISUAL CUE] notes in brackets alongside the spoken lines. Tone: [TONE, e.g. energetic and direct].",
  },
  {
    id: "logo-concept",
    title: "Logo concept",
    category: "Image",
    targetModel: "midjourney",
    prompt:
      "minimalist logo design for [BRAND/COMPANY NAME], [INDUSTRY], simple geometric shapes, flat vector style, two-color palette, clean lines, white background --ar 1:1 --v 6",
  },
  {
    id: "concept-art",
    title: "Concept art scene",
    category: "Image",
    targetModel: "dalle",
    prompt:
      "A detailed concept art illustration of [SCENE/CHARACTER/SETTING], in a [ART STYLE, e.g. painterly fantasy] style, with dramatic lighting and a strong sense of depth and atmosphere, digital painting quality.",
  },
  {
    id: "seo-meta-batch",
    title: "SEO title and meta description",
    category: "SEO",
    targetModel: "chatgpt",
    prompt:
      "You are an SEO copywriter. Write 3 title tag options (under 60 characters) and matching meta descriptions (under 155 characters) for a page about [TOPIC], targeting the keyword \"[TARGET KEYWORD]\". Each title should include the keyword naturally, and each description should include a clear reason to click.",
  },
  {
    id: "keyword-clusters",
    title: "Keyword cluster research",
    category: "SEO",
    targetModel: "perplexity",
    prompt:
      "Research current, related search queries and question phrasings people use around \"[TOPIC]\". Group them into 3-4 topic clusters with a short label for each cluster, and note which cluster appears to have the clearest commercial intent versus purely informational intent. Cite your sources.",
  },
  {
    id: "content-brief",
    title: "Content brief for a writer",
    category: "SEO",
    targetModel: "claude",
    prompt:
      "You are a content strategist writing a brief for a freelance writer. For an article targeting \"[TARGET KEYWORD]\", provide: a working title, the search intent behind this query, 4-6 subheadings to cover, one competitor angle to differentiate from, and a target word count of [WORD COUNT].",
  },
  {
    id: "landing-page-copy",
    title: "Landing page hero copy",
    category: "Marketing",
    targetModel: "chatgpt",
    prompt:
      "You are a conversion copywriter. Write hero section copy for a landing page selling [PRODUCT/SERVICE] to [AUDIENCE]. Provide: a headline (under 10 words) leading with the main benefit, one supporting subheadline (under 20 words), and 3 short bullet points addressing the audience's biggest objections.",
  },
  {
    id: "email-sequence",
    title: "Welcome email sequence outline",
    category: "Marketing",
    targetModel: "claude",
    prompt:
      "You are an email marketing strategist. Outline a 4-email welcome sequence for new subscribers to [BRAND/PRODUCT]. For each email, give: the send timing (e.g. \"Day 0\"), a one-line goal, and a suggested subject line. The sequence should build trust before the first sales ask, not lead with one.",
  },
  {
    id: "customer-support-reply",
    title: "Customer support response",
    category: "Customer Support",
    targetModel: "chatgpt",
    prompt:
      "You are a customer support agent for [COMPANY]. A customer wrote: \"[PASTE CUSTOMER MESSAGE]\". Write a reply that acknowledges their frustration specifically (not generically), explains the resolution or next step clearly, and avoids corporate-sounding phrases like \"we apologize for any inconvenience\". Keep it under 120 words.",
  },
  {
    id: "escalation-summary",
    title: "Support ticket escalation summary",
    category: "Customer Support",
    targetModel: "claude",
    prompt:
      "You are a support team lead. Summarize the following support conversation for an engineering escalation: what the customer is experiencing, what troubleshooting has already been tried, and the specific technical question engineering needs to answer. Keep it under 100 words — engineers need the facts, not the full conversation. Conversation:\n\n[PASTE CONVERSATION HERE]",
  },
  {
    id: "faq-generator",
    title: "FAQ section from common questions",
    category: "Customer Support",
    targetModel: "gemini",
    prompt:
      "You are a technical writer. Based on the common customer questions below, write a clear FAQ section — one question per entry, each answered in 2-3 plain-language sentences with no jargon. Group related questions together under short subheadings. Questions:\n\n[PASTE LIST OF QUESTIONS HERE]",
  },
  {
    id: "job-description",
    title: "Job description draft",
    category: "HR & Recruiting",
    targetModel: "chatgpt",
    prompt:
      "You are a recruiter. Write a job description for a [ROLE TITLE] position at a [COMPANY SIZE/STAGE, e.g. Series A startup] company. Include: a 2-sentence role summary, 5-6 core responsibilities, 4-5 required qualifications (avoid inflating requirements beyond what's actually needed), and a note on what makes this role interesting beyond the standard perks list.",
  },
  {
    id: "interview-questions",
    title: "Structured interview questions",
    category: "HR & Recruiting",
    targetModel: "claude",
    prompt:
      "You are a hiring manager preparing to interview candidates for a [ROLE]. Write 6 interview questions that assess [KEY SKILL/COMPETENCY], moving from a general question to increasingly specific, behavioral ones (\"tell me about a time when...\"). For each question, note in one sentence what a strong answer would demonstrate.",
  },
  {
    id: "performance-review",
    title: "Performance review draft",
    category: "HR & Recruiting",
    targetModel: "claude",
    prompt:
      "You are a manager writing a performance review. Based on the notes below about [EMPLOYEE NAME]'s work this period, write a review that leads with specific accomplishments (not vague praise), addresses one area for growth constructively and specifically, and ends with a clear focus for next period. Notes:\n\n[PASTE NOTES HERE]",
  },
  {
    id: "market-sizing",
    title: "Market size research",
    category: "Business",
    targetModel: "perplexity",
    prompt:
      "Research the current market size and growth rate for [INDUSTRY/PRODUCT CATEGORY]. Include the most recent figures available, the source and year for each figure, and note if estimates vary significantly between sources. Present as a short table with source citations.",
  },
  {
    id: "competitor-comparison",
    title: "Competitor comparison table",
    category: "Business",
    targetModel: "perplexity",
    prompt:
      "Compare [YOUR PRODUCT/COMPANY] against its top 3 competitors: [COMPETITOR 1], [COMPETITOR 2], [COMPETITOR 3]. Present a table comparing pricing, core feature set, and target customer for each. Note which competitor is the closest direct alternative and why. Cite sources for pricing and feature claims.",
  },
  {
    id: "pricing-strategy",
    title: "Pricing tier structure",
    category: "Business",
    targetModel: "claude",
    prompt:
      "You are a pricing strategist. Propose a 3-tier pricing structure for [PRODUCT/SERVICE] serving [CUSTOMER SEGMENTS]. For each tier, suggest a name, what's included, and the reasoning for what differentiates it from the tier above. Avoid arbitrary feature-gating — each tier's inclusions should map to a genuine difference in customer needs.",
  },
  {
    id: "budget-breakdown",
    title: "Personal budget breakdown",
    category: "Personal Finance",
    targetModel: "gemini",
    prompt:
      "You are a personal finance educator, not a licensed financial advisor. Based on a monthly take-home income of [AMOUNT], suggest a reasonable budget breakdown across essential categories (housing, food, transportation, savings, discretionary) using a well-known framework like 50/30/20 as a starting point. Explain the reasoning briefly, and note this is a general framework, not personalized financial advice.",
  },
  {
    id: "savings-goal",
    title: "Savings goal plan",
    category: "Personal Finance",
    targetModel: "gemini",
    prompt:
      "You are a personal finance educator. I want to save [AMOUNT] for [GOAL] within [TIMEFRAME]. Break down what that means as a monthly savings target, and suggest 2-3 general, practical ways people commonly free up that amount in a monthly budget. Note this is general education, not individualized financial advice.",
  },
  {
    id: "recipe-from-ingredients",
    title: "Recipe from what's on hand",
    category: "Lifestyle",
    targetModel: "chatgpt",
    prompt:
      "You are a home cooking assistant. I have these ingredients on hand: [LIST INGREDIENTS]. Suggest one recipe I could make using mostly what I already have, noting any single common ingredient I might need to buy. Include a simple step-by-step method and an approximate cook time.",
  },
  {
    id: "workout-plan",
    title: "Beginner workout plan",
    category: "Lifestyle",
    targetModel: "gemini",
    prompt:
      "You are a fitness educator, not a personal trainer providing medical advice. Suggest a simple 3-day-a-week beginner workout plan for someone with [EQUIPMENT AVAILABLE, e.g. just bodyweight / a home gym], focused on [GOAL, e.g. general strength]. Include a brief warm-up note and remind me to consult a professional before starting a new exercise program if I have any health concerns.",
  },
  {
    id: "travel-itinerary",
    title: "Travel itinerary draft",
    category: "Lifestyle",
    targetModel: "perplexity",
    prompt:
      "Research a [DURATION]-day itinerary for [DESTINATION], for someone interested in [INTERESTS, e.g. food and history]. Include suggested areas to stay, 2-3 must-see highlights, and note anything currently closed, seasonal, or requiring advance booking. Cite sources for anything time-sensitive.",
  },
  {
    id: "book-summary",
    title: "Chapter-by-chapter book notes",
    category: "Education",
    targetModel: "claude",
    prompt:
      "You are a reading comprehension assistant. Summarize the following chapter in 3-4 sentences capturing the core argument or events, then list 2 key takeaways I should remember. Avoid padding the summary with minor details. Chapter text:\n\n[PASTE CHAPTER TEXT HERE]",
  },
  {
    id: "flashcard-generator",
    title: "Flashcards from notes",
    category: "Education",
    targetModel: "gemini",
    prompt:
      "You are a study assistant. Convert the following notes into 10 flashcard-style question-and-answer pairs, formatted as \"Q: ... / A: ...\". Focus on the facts and concepts most likely to be tested, not minor details. Notes:\n\n[PASTE NOTES HERE]",
  },
  {
    id: "essay-feedback",
    title: "Essay structure feedback",
    category: "Education",
    targetModel: "claude",
    prompt:
      "You are a writing tutor. Review the structure (not just the grammar) of the following essay: does the thesis appear clearly, does each paragraph support it, and does the conclusion follow logically? Give feedback organized by section, not just a general comment. Essay:\n\n[PASTE ESSAY HERE]",
  },
  {
    id: "short-story-opener",
    title: "Short story opening scene",
    category: "Creative Writing",
    targetModel: "claude",
    prompt:
      "You are a fiction writer. Write an opening scene (300-400 words) for a short story in the [GENRE] genre, featuring a character who is [CHARACTER DESCRIPTION] and wants [WHAT THEY WANT]. Open in the middle of an action or tension, not with backstory or scene-setting description. Show, don't tell, what kind of person they are.",
  },
  {
    id: "dialogue-scene",
    title: "Character dialogue scene",
    category: "Creative Writing",
    targetModel: "claude",
    prompt:
      "You are a fiction writer. Write a dialogue-only scene (no narration except minimal action beats) between [CHARACTER A] and [CHARACTER B], where the underlying conflict is [CONFLICT], but neither character says the conflict directly — let it come through in what they don't say. Keep it to 15-20 exchanges.",
  },
  {
    id: "podcast-outline",
    title: "Podcast episode outline",
    category: "Creative Writing",
    targetModel: "chatgpt",
    prompt:
      "You are a podcast producer. Outline a [DURATION]-minute solo episode on [TOPIC]. Structure it as: a cold-open hook (no intro music description needed, just the spoken hook), 3 main talking points with a one-line note on what to say for each, and a closing thought that ties back to the opening hook.",
  },
  {
    id: "character-portrait",
    title: "Character portrait for a story",
    category: "Image",
    targetModel: "midjourney",
    prompt:
      "character portrait of [CHARACTER DESCRIPTION], [GENRE] style, expressive lighting, detailed costume design, dynamic pose, digital illustration, fantasy concept art --ar 2:3 --v 6",
  },
];

export const PROMPT_LIBRARY_CATEGORIES = Array.from(new Set(PROMPT_LIBRARY.map((t) => t.category)));

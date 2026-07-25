import type { GeneratorConfig } from "@/lib/generator-config";
import type { LinkedinGeneratorType } from "./types";

export const MIN_TOPIC_LENGTH = 3;
export const MAX_TOPIC_LENGTH = 400;

export const LINKEDIN_GENERATOR_CONFIG: Record<LinkedinGeneratorType, GeneratorConfig> = {
  "headline-generator": {
    inputLabel: "Your role and what you do",
    placeholder: "e.g. Product manager at a fintech startup, focused on B2B payments",
    helperText: "Describe your role and what makes your work distinct — LinkedIn headlines have 220 characters.",
    outputNoun: "headline",
    promptInstruction:
      "Generate a compelling LinkedIn headline. Strong headlines go beyond a job title — they signal specific value, expertise, or focus area, and help the person get found in search.",
    formatHint: "Each output must be under 220 characters, a single line, no quotation marks.",
  },
  "about-generator": {
    inputLabel: "Your background and experience",
    placeholder: "e.g. 8 years in UX design, currently leading a design team at a healthtech company, passionate about accessibility",
    helperText: "Summarize your career story — this becomes the About section on your profile.",
    outputNoun: "About section",
    promptInstruction:
      "Write a LinkedIn 'About' section: a first-person narrative covering background, what the person does now, and what they're focused on or open to. Should read naturally, not like a résumé bullet list.",
    formatHint:
      "Each output should be 3-5 short paragraphs (150-250 words total), first-person, using \\n\\n between paragraphs.",
  },
  "summary-generator": {
    inputLabel: "Your role and key strengths",
    placeholder: "e.g. Senior backend engineer specializing in distributed systems and API design",
    helperText: "A short professional summary — punchier and shorter than a full About section.",
    outputNoun: "summary",
    promptInstruction:
      "Write a concise professional summary (an elevator-pitch version of a LinkedIn About section) — a few punchy sentences establishing who this person is professionally and their core strength, not a full multi-paragraph narrative.",
    formatHint: "Each output should be 2-3 sentences (40-70 words), first-person, on a single block of text.",
  },
  "post-generator": {
    inputLabel: "What do you want to post about?",
    placeholder: "e.g. A lesson I learned from a failed product launch",
    helperText: "Describe the topic, insight, or update you want to share.",
    outputNoun: "post",
    promptInstruction:
      "Write a LinkedIn post. Strong LinkedIn posts open with a hook in the first line (since that's what shows before 'see more'), share a genuine insight or story, and end with a takeaway or a question that invites comments.",
    formatHint:
      "Each output should be a complete post (100-200 words), using \\n\\n between short paragraphs/lines for readability, no hashtags unless naturally part of the flow.",
  },
  "experience-generator": {
    inputLabel: "Job title and what you did",
    placeholder: "e.g. Marketing manager who ran paid social campaigns and grew email list from 5k to 40k",
    helperText: "Describe the role and your key responsibilities or achievements.",
    outputNoun: "experience description",
    promptInstruction:
      "Write a LinkedIn work experience bullet-point description for this role. Strong experience entries lead with action verbs and, where possible, quantify impact.",
    formatHint:
      "Each output should be 3-5 bullet points, each starting with '• ' on its own line, each a single action-oriented sentence.",
  },
  "skills-generator": {
    inputLabel: "Your role or industry",
    placeholder: "e.g. Data analyst working primarily with SQL, Python, and dashboarding tools",
    helperText: "Describe your role or field — used to suggest relevant LinkedIn skills to add.",
    outputNoun: "skills list",
    promptInstruction:
      "Suggest a set of relevant LinkedIn skills for this role/industry, mixing hard/technical skills with relevant soft skills recruiters search for.",
    formatHint: "Each output should be a single comma-separated line of 10-15 skills, each 1-3 words, no numbering.",
  },
  "recommendation-generator": {
    inputLabel: "Who you're recommending and why",
    placeholder: "e.g. My teammate Priya, a designer I worked with for 2 years, incredibly detail-oriented and great with stakeholders",
    helperText: "Describe the person's role, your working relationship, and what stood out about them.",
    outputNoun: "recommendation",
    promptInstruction:
      "Write a LinkedIn recommendation for a colleague based on this description. Should sound genuine and specific, not generic praise, and briefly establish the working relationship.",
    formatHint: "Each output should be 2-3 short paragraphs (80-150 words), first-person, using \\n\\n between paragraphs.",
  },
  "connection-request-generator": {
    inputLabel: "Who you're connecting with and why",
    placeholder: "e.g. A hiring manager at a company I'd love to work for, reaching out after seeing their job posting",
    helperText: "Describe who you're reaching out to and your reason — LinkedIn connection notes have a 300-character limit.",
    outputNoun: "connection request message",
    promptInstruction:
      "Write a short, personalized LinkedIn connection request note for this situation. Should be genuine and specific to the context given, not a generic template, and must fit LinkedIn's connection note limit.",
    formatHint: "Each output MUST be under 300 characters (LinkedIn's hard limit for connection notes), a single message, no quotation marks.",
  },
  "company-description-generator": {
    inputLabel: "What does the company do?",
    placeholder: "e.g. A 20-person startup building inventory management software for independent bakeries",
    helperText: "Describe the company, its product, and who it serves.",
    outputNoun: "company description",
    promptInstruction:
      "Write a LinkedIn Company Page 'About' description for this business — should clearly state what the company does, who it serves, and what makes it distinct, in a professional but approachable tone.",
    formatHint: "Each output should be 2-3 short paragraphs (60-120 words), using \\n\\n between paragraphs.",
  },
  "job-description-generator": {
    inputLabel: "Role and key responsibilities",
    placeholder: "e.g. Senior frontend engineer, React-focused, will work closely with design on a consumer product",
    helperText: "Describe the role, seniority, and core responsibilities.",
    outputNoun: "job description",
    promptInstruction:
      "Write a LinkedIn job posting description for this role: a brief intro to the role, a bullet list of key responsibilities, and a short bullet list of qualifications.",
    formatHint:
      "Each output should include a 1-2 sentence intro, then '• ' bulleted responsibilities, then '• ' bulleted qualifications, using \\n for line breaks between sections.",
  },
};

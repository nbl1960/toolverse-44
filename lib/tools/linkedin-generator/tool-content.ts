import type { FaqItem, ToolExample } from "@/lib/types";
import type { LinkedinGeneratorType } from "./types";

interface GeneratorContent {
  faq: FaqItem[];
  example: ToolExample;
}

export const LINKEDIN_GENERATOR_CONTENT: Record<LinkedinGeneratorType, GeneratorContent> = {
  "headline-generator": {
    faq: [
      {
        question: "How long can a LinkedIn headline be?",
        answer: "220 characters. Every generated headline is written to fit comfortably within that limit.",
      },
      {
        question: "Should my headline just be my job title?",
        answer:
          "A job title alone is the most common headline on LinkedIn, which also makes it the least memorable — headlines that signal a specific focus, outcome, or expertise tend to stand out more in search and to profile visitors.",
      },
      {
        question: "Will this headline show up in LinkedIn search?",
        answer:
          "LinkedIn's search does weight headline text, so including terms someone might search for (your role, specialty, or industry) can help your profile surface more often.",
      },
      {
        question: "Can I regenerate for a different angle?",
        answer: "Yes — click Regenerate for three new headline options anytime.",
      },
    ],
    example: {
      title: "Example: a fintech product manager",
      summary: "Entering a role description generates three headline options:",
      inputs: [{ label: "Role", value: "Product manager at a fintech startup, focused on B2B payments" }],
      outputs: [{ label: "Option 1", value: "Product Manager helping B2B fintechs move money faster and safer" }],
    },
  },
  "about-generator": {
    faq: [
      {
        question: "How long should a LinkedIn About section be?",
        answer:
          "LinkedIn allows up to 2,600 characters, though most well-read About sections are far shorter — the generated drafts land around 150-250 words, a length people will actually read in full.",
      },
      {
        question: "Should the About section be written in first or third person?",
        answer:
          "First person ('I help...') generally reads as more personal and is the more common, modern convention — every generated draft uses first person.",
      },
      {
        question: "Can I edit the generated About section?",
        answer: "Yes — treat it as a strong first draft. Add specific achievements, names, or numbers that make it unmistakably yours.",
      },
      {
        question: "How is this different from the Summary Generator?",
        answer:
          "About is the longer, full narrative version of your profile story. Summary is a shorter, punchier elevator-pitch version — useful anywhere you need a compact bio.",
      },
    ],
    example: {
      title: "Example: a UX design lead",
      summary: "Entering a background summary generates three About drafts:",
      inputs: [{ label: "Background", value: "8 years in UX design, currently leading a design team at a healthtech company, passionate about accessibility" }],
      outputs: [{ label: "Option 1", value: "I've spent the last 8 years learning that good design is invisible — and great design is accessible to everyone.\\n\\nToday I lead a design team at a healthtech company…" }],
    },
  },
  "summary-generator": {
    faq: [
      {
        question: "Where would I use a short summary like this?",
        answer:
          "Anywhere a compact bio is useful beyond LinkedIn's About section — a speaker bio, a team page, a conference profile, or the opening line of an About section you want to expand yourself.",
      },
      {
        question: "How is this different from the About Generator?",
        answer:
          "This produces a 2-3 sentence elevator pitch. The About Generator produces the fuller, multi-paragraph narrative version for your actual LinkedIn About section.",
      },
      {
        question: "Can I use this as my LinkedIn headline instead?",
        answer: "It's written as a summary, not optimized for the 220-character headline format — use the Headline Generator for that specifically.",
      },
      {
        question: "Can I regenerate for a different tone?",
        answer: "Yes — click Regenerate, or rephrase your input to hint at a different tone or emphasis.",
      },
    ],
    example: {
      title: "Example: a backend engineer",
      summary: "Entering a role and strengths generates three short summaries:",
      inputs: [{ label: "Role and strengths", value: "Senior backend engineer specializing in distributed systems and API design" }],
      outputs: [{ label: "Option 1", value: "Senior backend engineer who builds distributed systems that don't fall over at 3am. API design is where I do my best work." }],
    },
  },
  "post-generator": {
    faq: [
      {
        question: "How long should a LinkedIn post be?",
        answer:
          "LinkedIn shows roughly the first 3 lines before a 'see more' cutoff, so the hook matters most — beyond that, 100-200 words tends to perform well without losing readers.",
      },
      {
        question: "Should I add hashtags?",
        answer:
          "A few relevant hashtags can help with discovery, but LinkedIn's algorithm weighs engagement and dwell time more heavily — a genuinely good hook matters more than hashtag count.",
      },
      {
        question: "Will this post sound like me?",
        answer: "Treat it as a strong structural draft — add your own specific details, examples, and voice before posting.",
      },
      {
        question: "Can I regenerate for a different angle on the same topic?",
        answer: "Yes — click Regenerate for three new takes on the same topic.",
      },
    ],
    example: {
      title: "Example: a lesson from a failed launch",
      summary: "Entering a topic generates three post drafts:",
      inputs: [{ label: "Topic", value: "A lesson I learned from a failed product launch" }],
      outputs: [{ label: "Option 1", value: "We shipped a feature nobody asked for. Here's what I learned about talking to users before writing a single line of code…" }],
    },
  },
  "experience-generator": {
    faq: [
      {
        question: "Should I quantify my achievements?",
        answer:
          "Where possible, yes — specific numbers (grew X by Y%, managed a team of Z) are consistently more compelling to readers and recruiters than general descriptions of duties.",
      },
      {
        question: "How many bullet points should an experience entry have?",
        answer: "3-5 is a common sweet spot — enough to show scope and impact without turning into a full job description.",
      },
      {
        question: "Should I list responsibilities or achievements?",
        answer:
          "Achievements (what you accomplished) tend to be more compelling than responsibilities (what you were assigned) — the generated bullets lean toward action and outcome where your input supports it.",
      },
      {
        question: "Can I regenerate for a different emphasis?",
        answer: "Yes — click Regenerate, or adjust your input to highlight different aspects of the role.",
      },
    ],
    example: {
      title: "Example: a marketing manager role",
      summary: "Entering a role and key work generates three bullet-point descriptions:",
      inputs: [{ label: "Role and work", value: "Marketing manager who ran paid social campaigns and grew email list from 5k to 40k" }],
      outputs: [{ label: "Option 1", value: "• Grew email subscriber list from 5,000 to 40,000 (8x) through targeted paid social campaigns\\n• Managed paid social budget across three platforms…" }],
    },
  },
  "skills-generator": {
    faq: [
      {
        question: "How many skills can I add on LinkedIn?",
        answer: "Up to 50 skills total on your profile, though LinkedIn only prominently displays your top few — pick the ones most relevant to what you want to be found for.",
      },
      {
        question: "Should I include soft skills?",
        answer:
          "A mix works well — hard/technical skills help you get found in recruiter searches, while a few relevant soft skills round out how you're perceived.",
      },
      {
        question: "Do skills actually affect search visibility?",
        answer: "Yes — LinkedIn's search and recruiter tools do factor in listed skills, especially skills with endorsements.",
      },
      {
        question: "Can I regenerate for a more specific skill set?",
        answer: "Yes — click Regenerate, or make your role/industry description more specific for more targeted suggestions.",
      },
    ],
    example: {
      title: "Example: a data analyst",
      summary: "Entering a role description generates three skill list options:",
      inputs: [{ label: "Role", value: "Data analyst working primarily with SQL, Python, and dashboarding tools" }],
      outputs: [{ label: "Option 1", value: "SQL, Python, Data Visualization, Tableau, Power BI, Statistical Analysis, ETL, Data Cleaning, A/B Testing, Stakeholder Communication…" }],
    },
  },
  "recommendation-generator": {
    faq: [
      {
        question: "Should a LinkedIn recommendation be specific?",
        answer:
          "Yes — specific examples and details are what make a recommendation feel genuine rather than generic praise, which is why the generated drafts are shaped closely around your input.",
      },
      {
        question: "How long should a recommendation be?",
        answer: "80-150 words is a common, readable length — long enough to be substantive, short enough that people actually read it.",
      },
      {
        question: "Can I edit the generated recommendation?",
        answer: "Yes — treat it as a strong starting draft, and add any specific project names or details that make it unmistakably about that person.",
      },
      {
        question: "Should I ask the person before posting a recommendation?",
        answer: "It's good etiquette to let a colleague know you're writing one, and many people appreciate being asked what they'd like emphasized.",
      },
    ],
    example: {
      title: "Example: recommending a former teammate",
      summary: "Entering context about the person generates three recommendation drafts:",
      inputs: [{ label: "Context", value: "My teammate Priya, a designer I worked with for 2 years, incredibly detail-oriented and great with stakeholders" }],
      outputs: [{ label: "Option 1", value: "I worked alongside Priya for two years, and if there's one thing I'd tell anyone hiring a designer, it's this: she catches the details everyone else misses…" }],
    },
  },
  "connection-request-generator": {
    faq: [
      {
        question: "What's the character limit for a LinkedIn connection note?",
        answer: "300 characters. Every generated message is written to fit within that limit.",
      },
      {
        question: "Does adding a note actually help?",
        answer:
          "A specific, personalized note is generally accepted more often than a blank request, especially when reaching out to someone you don't already know.",
      },
      {
        question: "Should I mention why I want to connect?",
        answer: "Yes — a brief, genuine reason (a shared interest, a job posting, a mutual connection) gives the recipient context and makes the request easy to say yes to.",
      },
      {
        question: "Can I regenerate for a shorter or different tone?",
        answer: "Yes — click Regenerate for three new message options.",
      },
    ],
    example: {
      title: "Example: reaching out to a hiring manager",
      summary: "Entering the context generates three connection request messages:",
      inputs: [{ label: "Context", value: "A hiring manager at a company I'd love to work for, reaching out after seeing their job posting" }],
      outputs: [{ label: "Option 1", value: "Hi [Name], I just saw your team's opening for a [role] and would love to connect — I've been following [Company]'s work and think it's a great fit for my background." }],
    },
  },
  "company-description-generator": {
    faq: [
      {
        question: "Where does this description go?",
        answer: "Your LinkedIn Company Page's 'About' section — the description visitors see when they land on your company's page.",
      },
      {
        question: "How long should a company description be?",
        answer: "60-120 words is a readable range that covers what the company does and who it serves without turning into a full pitch deck.",
      },
      {
        question: "Should this include a call to action?",
        answer: "A short closing line inviting visitors to learn more or visit your site can work well, though it's optional depending on your page's goals.",
      },
      {
        question: "Can I regenerate for a different tone?",
        answer: "Yes — click Regenerate, or rephrase your input to hint at a more formal or more casual tone.",
      },
    ],
    example: {
      title: "Example: a bakery software startup",
      summary: "Entering a company description generates three page-ready drafts:",
      inputs: [{ label: "Company", value: "A 20-person startup building inventory management software for independent bakeries" }],
      outputs: [{ label: "Option 1", value: "We build inventory software for the people who wake up before sunrise to bake it. [Company] helps independent bakeries track ingredients, cut waste, and spend less time on spreadsheets…" }],
    },
  },
  "job-description-generator": {
    faq: [
      {
        question: "Does this follow LinkedIn's job posting format?",
        answer: "Yes — a short intro, bulleted responsibilities, and bulleted qualifications, matching the structure LinkedIn job postings typically use.",
      },
      {
        question: "Should I list required vs. preferred qualifications separately?",
        answer:
          "It can help candidates self-select, though it's optional — the generated draft gives you one qualifications list you can split further if you'd like.",
      },
      {
        question: "Will this include salary information?",
        answer: "No — pay transparency requirements vary by location, so add compensation details yourself based on your jurisdiction's requirements.",
      },
      {
        question: "Can I regenerate for a different seniority level?",
        answer: "Yes — click Regenerate, or update your input to specify a different seniority or scope.",
      },
    ],
    example: {
      title: "Example: a senior frontend role",
      summary: "Entering the role details generates three job description drafts:",
      inputs: [{ label: "Role", value: "Senior frontend engineer, React-focused, will work closely with design on a consumer product" }],
      outputs: [{ label: "Option 1", value: "We're looking for a Senior Frontend Engineer to help shape the next chapter of our consumer product.\\n\\n• Build and maintain React-based interfaces used by millions of users…" }],
    },
  },
};

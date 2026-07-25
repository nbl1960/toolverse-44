import type {
  KeywordCoverage,
  ProfileSeoFinding,
  ProfileSeoFormValues,
  ProfileSeoResult,
} from "./types";
import { ABOUT_CHAR_LIMIT, HEADLINE_CHAR_LIMIT, MIN_RECOMMENDED_SKILLS } from "./constants";

function parseList(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Checks each target keyword's presence across headline/about/skills, and
 * a handful of completeness/length findings — a keyword-coverage and
 * profile-completeness check, not a black-box "SEO score" with no
 * visible reasoning.
 */
export function checkProfileSeo(values: ProfileSeoFormValues): ProfileSeoResult {
  const headlineLower = values.headline.toLowerCase();
  const aboutLower = values.about.toLowerCase();
  const skillsList = parseList(values.skills);
  const skillsLower = skillsList.map((s) => s.toLowerCase());
  const keywords = parseList(values.targetKeywords);

  const keywordCoverage: KeywordCoverage[] = keywords.map((keyword) => {
    const keywordLower = keyword.toLowerCase();
    return {
      keyword,
      inHeadline: headlineLower.includes(keywordLower),
      inAbout: aboutLower.includes(keywordLower),
      inSkills: skillsLower.some((skill) => skill.includes(keywordLower)),
    };
  });

  const findings: ProfileSeoFinding[] = [];
  let score = 0;

  // Keyword coverage — up to 50 points, split across headline/about/skills placement.
  if (keywords.length > 0) {
    const headlineHits = keywordCoverage.filter((k) => k.inHeadline).length;
    const anyHits = keywordCoverage.filter((k) => k.inHeadline || k.inAbout || k.inSkills).length;
    const headlineScore = Math.round((headlineHits / keywords.length) * 20);
    const coverageScore = Math.round((anyHits / keywords.length) * 30);
    score += headlineScore + coverageScore;
    findings.push({
      label: "Keyword coverage",
      passed: anyHits === keywords.length,
      detail: `${anyHits}/${keywords.length} target keywords appear somewhere on your profile (${headlineHits}/${keywords.length} in your headline specifically, the highest-value spot).`,
    });
  } else {
    findings.push({
      label: "Keyword coverage",
      passed: false,
      detail: "Add target keywords above to check whether your profile actually contains the terms people might search for.",
    });
  }

  // Headline present and reasonably used — 15 points.
  const hasHeadline = values.headline.trim().length > 0;
  const headlineWellUsed = values.headline.trim().length >= 20;
  score += hasHeadline ? (headlineWellUsed ? 15 : 8) : 0;
  findings.push({
    label: "Headline",
    passed: headlineWellUsed,
    detail: hasHeadline
      ? `${values.headline.trim().length}/${HEADLINE_CHAR_LIMIT} characters used.`
      : "No headline provided.",
  });

  // About present and substantial — 20 points.
  const aboutLength = values.about.trim().length;
  const aboutSubstantial = aboutLength >= 200;
  score += aboutLength === 0 ? 0 : aboutSubstantial ? 20 : 10;
  findings.push({
    label: "About section",
    passed: aboutSubstantial,
    detail:
      aboutLength === 0
        ? "No About section provided."
        : `${aboutLength}/${ABOUT_CHAR_LIMIT} characters used.${aboutSubstantial ? "" : " Consider expanding — short About sections give search and readers less to work with."}`,
  });

  // Skills count — 15 points.
  const hasEnoughSkills = skillsList.length >= MIN_RECOMMENDED_SKILLS;
  score += skillsList.length === 0 ? 0 : hasEnoughSkills ? 15 : 8;
  findings.push({
    label: "Skills",
    passed: hasEnoughSkills,
    detail:
      skillsList.length === 0
        ? "No skills listed."
        : `${skillsList.length} skill${skillsList.length === 1 ? "" : "s"} listed.${hasEnoughSkills ? "" : ` Add at least ${MIN_RECOMMENDED_SKILLS} for better search coverage.`}`,
  });

  return { score: Math.min(100, score), keywordCoverage, findings };
}

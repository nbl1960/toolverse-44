export interface ProfileSeoFormValues {
  headline: string;
  about: string;
  skills: string;
  targetKeywords: string;
}

export interface KeywordCoverage {
  keyword: string;
  inHeadline: boolean;
  inAbout: boolean;
  inSkills: boolean;
}

export interface ProfileSeoResult {
  score: number;
  keywordCoverage: KeywordCoverage[];
  findings: ProfileSeoFinding[];
}

export interface ProfileSeoFinding {
  label: string;
  passed: boolean;
  detail: string;
}

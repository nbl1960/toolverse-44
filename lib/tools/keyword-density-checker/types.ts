export interface WordFrequency {
  word: string;
  count: number;
  density: number;
}

export interface KeywordDensityResult {
  totalWords: number;
  topWords: WordFrequency[];
  targetKeyword: WordFrequency | null;
}

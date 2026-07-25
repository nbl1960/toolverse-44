export interface ParsedChapterLine {
  title: string;
  durationSeconds: number;
}

export interface TimestampRow {
  title: string;
  startSeconds: number;
  formatted: string;
}

export interface TimestampGeneratorResult {
  rows: TimestampRow[];
  totalSeconds: number;
  totalFormatted: string;
  exportText: string;
}

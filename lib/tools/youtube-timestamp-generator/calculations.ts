import type { ParsedChapterLine, TimestampGeneratorResult, TimestampRow } from "./types";

/** Parses "1:30", "12:05", or "1:02:30" into a whole number of seconds. Returns null if unparseable. */
export function parseDurationToSeconds(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":").map((part) => part.trim());
  if (parts.length < 1 || parts.length > 3) return null;

  const numbers = parts.map((part) => Number(part));
  if (numbers.some((value) => !Number.isFinite(value) || value < 0)) return null;

  if (numbers.length === 1) {
    return numbers[0] ?? 0;
  }
  if (numbers.length === 2) {
    const [minutes, seconds] = numbers;
    return (minutes ?? 0) * 60 + (seconds ?? 0);
  }
  const [hours, minutes, seconds] = numbers;
  return (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0);
}

/** Formats a whole number of seconds as "m:ss" or "h:mm:ss", matching YouTube's own timestamp format. */
export function formatSecondsAsTimestamp(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/**
 * Parses one chapter per line in "Title | duration" format. Lines that
 * don't match (missing separator, missing title, unparseable duration)
 * are silently skipped rather than erroring the whole input, so a user
 * fixing one line doesn't lose progress on the others.
 */
export function parseChapterLines(raw: string): ParsedChapterLine[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): ParsedChapterLine | null => {
      const separatorIndex = line.lastIndexOf("|");
      if (separatorIndex === -1) return null;

      const title = line.slice(0, separatorIndex).trim();
      const durationSeconds = parseDurationToSeconds(line.slice(separatorIndex + 1));
      if (!title || durationSeconds === null || durationSeconds <= 0) return null;

      return { title, durationSeconds };
    })
    .filter((row): row is ParsedChapterLine => row !== null);
}

/** Converts parsed chapters (each with its own duration) into cumulative start-time timestamps. */
export function calculateTimestamps(chapters: ParsedChapterLine[]): TimestampGeneratorResult {
  let cumulative = 0;
  const rows: TimestampRow[] = [];

  for (const chapter of chapters) {
    rows.push({
      title: chapter.title,
      startSeconds: cumulative,
      formatted: formatSecondsAsTimestamp(cumulative),
    });
    cumulative += chapter.durationSeconds;
  }

  return {
    rows,
    totalSeconds: cumulative,
    totalFormatted: formatSecondsAsTimestamp(cumulative),
    exportText: rows.map((row) => `${row.formatted} ${row.title}`).join("\n"),
  };
}

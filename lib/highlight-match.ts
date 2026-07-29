export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

/**
 * Splits `text` into segments marking which parts match `query`
 * (case-insensitive), so the UI can render matched portions distinctly
 * (bold/highlighted) without altering the original text's casing. Pure
 * function — no JSX here, so it's usable in tests and doesn't couple
 * search logic to a specific highlighting component.
 */
export function highlightMatch(text: string, query: string): HighlightSegment[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [{ text, isMatch: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, cursor);
    if (matchIndex === -1) {
      segments.push({ text: text.slice(cursor), isMatch: false });
      break;
    }
    if (matchIndex > cursor) {
      segments.push({ text: text.slice(cursor, matchIndex), isMatch: false });
    }
    segments.push({ text: text.slice(matchIndex, matchIndex + trimmedQuery.length), isMatch: true });
    cursor = matchIndex + trimmedQuery.length;
  }

  return segments;
}

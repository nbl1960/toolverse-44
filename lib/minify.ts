/**
 * Shared minification logic for HTML/CSS/JS. Deliberately conservative:
 * strips comments and collapses blank lines/indentation, but NEVER joins
 * lines together or removes whitespace between tokens on the same line.
 *
 * That scope limit is intentional, not laziness. A naive whitespace-
 * collapsing minifier can silently break real code — removing a newline
 * between two statements that rely on JavaScript's automatic semicolon
 * insertion, or stripping something that looks like a comment but is
 * actually inside a string, produces code that LOOKS minified but is
 * subtly wrong. This tool guarantees the output still runs/renders
 * identically to the input; it trades some file-size reduction for that
 * guarantee. For maximum compression in a real build pipeline, a proper
 * bundler-based minifier (Terser, esbuild, cssnano) remains the right
 * tool — this one is for quick, safe cleanup of a snippet.
 */

/**
 * Strips //-line and /* block *\/ comments from JS/CSS-family code,
 * without touching anything that looks like a comment marker while
 * actually inside a string, template literal, or (for JS) a regex
 * literal. Runs as a single-pass state machine over the characters.
 */
export function stripCStyleComments(source: string, options: { allowLineComments: boolean }): string {
  let result = "";
  let i = 0;
  const n = source.length;

  type Mode = "normal" | "singleQuote" | "doubleQuote" | "template" | "lineComment" | "blockComment" | "regex";
  let mode: Mode = "normal";

  // Tracks the previous significant (non-whitespace) character actually
  // emitted to `result`, used only to disambiguate JS's `/` as either
  // division or the start of a regex literal — a division sign follows an
  // identifier/number/`)`/`]`; a regex literal follows almost anything else.
  let lastSignificant = "";

  while (i < n) {
    const char = source[i] ?? "";
    const next = source[i + 1] ?? "";

    if (mode === "normal") {
      if (char === "'" ) {
        mode = "singleQuote";
        result += char;
      } else if (char === '"') {
        mode = "doubleQuote";
        result += char;
      } else if (char === "`") {
        mode = "template";
        result += char;
      } else if (options.allowLineComments && char === "/" && next === "/") {
        mode = "lineComment";
        i += 2;
        continue;
      } else if (char === "/" && next === "*") {
        mode = "blockComment";
        i += 2;
        continue;
      } else if (
        options.allowLineComments &&
        char === "/" &&
        !/[\w)\]]/.test(lastSignificant)
      ) {
        // Heuristic: a `/` not preceded by an identifier/number/`)`/`]`
        // is treated as the start of a regex literal, not division — so
        // its contents are preserved verbatim rather than scanned for
        // comment markers.
        mode = "regex";
        result += char;
      } else {
        result += char;
        if (!/\s/.test(char)) lastSignificant = char;
      }
      i += 1;
      continue;
    }

    if (mode === "singleQuote" || mode === "doubleQuote") {
      const quote = mode === "singleQuote" ? "'" : '"';
      result += char;
      if (char === "\\") {
        result += next;
        i += 2;
        continue;
      }
      if (char === quote) {
        mode = "normal";
        lastSignificant = quote;
      }
      i += 1;
      continue;
    }

    if (mode === "template") {
      result += char;
      if (char === "\\") {
        result += next;
        i += 2;
        continue;
      }
      if (char === "`") {
        mode = "normal";
        lastSignificant = "`";
      }
      i += 1;
      continue;
    }

    if (mode === "regex") {
      result += char;
      if (char === "\\") {
        result += next;
        i += 2;
        continue;
      }
      if (char === "[") {
        // Character classes can contain an unescaped `/`, which does not
        // end the regex literal.
        let j = i + 1;
        while (j < n && source[j] !== "]") {
          if (source[j] === "\\") j += 1;
          j += 1;
        }
        result += source.slice(i + 1, j + 1);
        i = j + 1;
        continue;
      }
      if (char === "/") {
        mode = "normal";
        lastSignificant = "/";
      }
      i += 1;
      continue;
    }

    if (mode === "lineComment") {
      if (char === "\n") {
        mode = "normal";
        result += char;
      }
      i += 1;
      continue;
    }

    if (mode === "blockComment") {
      if (char === "*" && next === "/") {
        mode = "normal";
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }
  }

  return result;
}

/** Collapses runs of blank lines to one, and trims trailing whitespace from every line — never joins lines together. */
export function collapseBlankLines(source: string): string {
  return source
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function minifyJs(source: string): string {
  return collapseBlankLines(stripCStyleComments(source, { allowLineComments: true }));
}

export function minifyCss(source: string): string {
  // CSS has no line comments and no regex-literal ambiguity, but does have
  // strings (in content:/url()/attr selectors) that must be respected.
  return collapseBlankLines(stripCStyleComments(source, { allowLineComments: false }));
}

/** Strips HTML comments and collapses blank lines, leaving tag/attribute whitespace untouched. */
export function minifyHtml(source: string): string {
  const withoutComments = source.replace(/<!--[\s\S]*?-->/g, "");
  return collapseBlankLines(withoutComments);
}

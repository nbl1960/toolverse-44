/**
 * Renders a JSON-LD `<script>` tag for structured data. This is the shared
 * "SEO component": any page can drop in `<JsonLd data={buildXJsonLd(...)} />`
 * to get rich-result markup without duplicating the `<script>` boilerplate.
 *
 * Server component by design — structured data belongs in the initial HTML,
 * not injected client-side.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify does not escape "</script>" sequences — if a value
  // ever contained that literal substring, it would prematurely close
  // this script tag. Every JSON-LD builder today only uses internally-
  // authored registry content, not live user input, so this isn't
  // exploitable as things stand — but escaping `<` to its unicode
  // form is the standard, zero-cost defense-in-depth fix, and a JSON
  // parser reads `\u003c` identically to a literal `<`, so this changes
  // nothing about how the structured data itself is interpreted.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD must be inlined as raw JSON
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

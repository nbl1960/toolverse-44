import { describe, it, expect } from "vitest";
import { minifyJs, minifyCss, minifyHtml, stripCStyleComments } from "@/lib/minify";

describe("minifyJs", () => {
  it("removes a line comment", () => {
    const out = minifyJs("const x = 1; // this is a comment\nconst y = 2;");
    expect(out).not.toContain("this is a comment");
    expect(out).toContain("const x = 1;");
    expect(out).toContain("const y = 2;");
  });

  it("removes a block comment", () => {
    const out = minifyJs("/* header comment */\nfunction foo() { return 1; }");
    expect(out).not.toContain("header comment");
    expect(out).toContain("function foo()");
  });

  it("does not treat a URL inside a string as a comment", () => {
    const out = minifyJs('const url = "https://example.com"; // real comment');
    expect(out).toContain("https://example.com");
    expect(out).not.toContain("real comment");
  });

  it("preserves comment-like text inside a string literal", () => {
    const out = minifyJs('const s = "this // is not a comment";');
    expect(out).toContain("this // is not a comment");
  });

  it("preserves block-comment-like text inside a string literal", () => {
    const out = minifyJs('const s = "/* not a comment */";');
    expect(out).toContain("/* not a comment */");
  });

  it("does not strip a regex literal containing slashes", () => {
    const out = minifyJs("const re = /https:\\/\\/[a-z]+\\.com/g;");
    expect(out).toContain("/https:\\/\\/[a-z]+\\.com/g");
  });

  it("treats a slash after an identifier as division, not a regex start", () => {
    const out = minifyJs("const result = a / b / c; // comment");
    expect(out).toContain("a / b / c;");
    expect(out).not.toContain("comment");
  });

  it("preserves // inside a template literal", () => {
    const out = minifyJs("const s = `see: // not a comment`;");
    expect(out).toContain("see: // not a comment");
  });

  it("collapses multiple consecutive blank lines to at most one", () => {
    const out = minifyJs("const a = 1;\n\n\n\n\nconst b = 2;");
    expect(out).not.toMatch(/\n{3,}/);
  });

  it("never joins lines together (ASI safety)", () => {
    const input = "const a = 1\nconst b = 2";
    const out = minifyJs(input);
    // Both statements must remain on separate lines — joining them could
    // change behavior for ASI-dependent code elsewhere.
    expect(out.split("\n").length).toBeGreaterThanOrEqual(2);
  });

  it("produces output that still executes correctly on a realistic snippet", () => {
    const original = `
      // Calculate the total price including tax
      function calculateTotal(items, taxRate) {
        let subtotal = 0;
        for (const item of items) {
          subtotal += item.price * item.quantity;
        }
        const tax = subtotal * taxRate;
        return { subtotal: subtotal, tax: tax, total: subtotal + tax };
      }
      calculateTotal.result = calculateTotal(
        [{ price: 10, quantity: 2 }, { price: 5, quantity: 3 }],
        0.08
      );
    `;
    const minified = minifyJs(original);
    const scope: { calculateTotal?: { result?: { subtotal: number; tax: number; total: number } } } = {};
    // eslint-disable-next-line no-new-func -- deliberately verifying the minifier's OWN output is still valid, executable JS, using Function rather than eval to avoid leaking into the surrounding scope.
    new Function("scope", `${minified}\nscope.calculateTotal = calculateTotal;`)(scope);
    const result = scope.calculateTotal?.result;
    expect(result?.subtotal).toBe(35);
    expect(result?.total).toBeCloseTo(37.8, 5);
  });
});

describe("minifyCss", () => {
  it("removes block comments but preserves comment-like text inside string values", () => {
    const css = '/* header */\n.btn {\n  content: "/* not a comment */";\n  color: red;\n}';
    const out = minifyCss(css);
    expect(out).not.toContain("header");
    expect(out).toContain('content: "/* not a comment */"');
    expect(out).toContain("color: red;");
  });
});

describe("minifyHtml", () => {
  it("removes HTML comments and collapses blank lines", () => {
    const html = "<!-- header -->\n<div>\n\n\n  <p>Hello</p>\n</div>";
    const out = minifyHtml(html);
    expect(out).not.toContain("header");
    expect(out).toContain("<p>Hello</p>");
    expect(out).not.toMatch(/\n{3,}/);
  });
});

describe("stripCStyleComments (line-comment mode disabled, CSS case)", () => {
  it("does not strip // when line comments are disabled", () => {
    const out = stripCStyleComments("width: 100px; // not a real CSS comment", { allowLineComments: false });
    expect(out).toContain("// not a real CSS comment");
  });
});

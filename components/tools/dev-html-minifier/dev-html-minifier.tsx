"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { runHtmlMinify } from "@/lib/tools/html-minifier/calculations";

export function DevHtmlMinifier() {
  return (
    <TextTransformTool
      toolSlug="dev-html-minifier"
      inputLabel="Paste your HTML"
      inputPlaceholder="<!-- comment -->\n<div>\n  <p>Hello</p>\n</div>"
      actionLabel="Minify HTML"
      outputLabel="Minified HTML"
      downloadFilename="minified"
      fileExtension="html"
      transform={runHtmlMinify}
    />
  );
}

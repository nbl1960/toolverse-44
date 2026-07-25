"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { runJsMinify } from "@/lib/tools/javascript-minifier/calculations";

export function DevJavascriptMinifier() {
  return (
    <TextTransformTool
      toolSlug="dev-javascript-minifier"
      inputLabel="Paste your JavaScript"
      inputPlaceholder="// comment\nfunction add(a, b) {\n  return a + b;\n}"
      actionLabel="Minify JavaScript"
      outputLabel="Minified JavaScript"
      downloadFilename="minified"
      fileExtension="js"
      transform={runJsMinify}
    />
  );
}

"use client";

import { TextTransformTool } from "@/components/shared/text-transform-tool";
import { runCssMinify } from "@/lib/tools/css-minifier/calculations";

export function DevCssMinifier() {
  return (
    <TextTransformTool
      toolSlug="dev-css-minifier"
      inputLabel="Paste your CSS"
      inputPlaceholder="/* button */\n.btn {\n  color: red;\n}"
      actionLabel="Minify CSS"
      outputLabel="Minified CSS"
      downloadFilename="minified"
      fileExtension="css"
      transform={runCssMinify}
    />
  );
}

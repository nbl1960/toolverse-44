import { FacebookGeneratorTemplate } from "@/components/tools/facebook-generator/facebook-generator-template";

/** Thin wrapper around the shared generator template — see facebook-generator-template.tsx for the actual UI. */
export function FacebookCommentGenerator() {
  return <FacebookGeneratorTemplate type="comment-generator" />;
}

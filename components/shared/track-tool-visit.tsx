"use client";

import * as React from "react";
import { trackToolVisit } from "@/lib/recent-tools";

/** Invisible — records this tool as recently visited on mount, for the Dashboard's Recently Used rail. Nothing rendered; purely a side-effect component. */
export function TrackToolVisit({ slug }: { slug: string }) {
  React.useEffect(() => {
    trackToolVisit(slug);
  }, [slug]);
  return null;
}

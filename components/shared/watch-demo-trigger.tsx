"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// The demo modal is interaction-triggered (only rendered once someone
// clicks "Watch Demo"), so it's code-split out of the homepage's initial
// bundle entirely rather than shipped to every visitor up front.
const WatchDemoModal = dynamic(
  () => import("@/components/shared/watch-demo-modal").then((m) => m.WatchDemoModal),
  { ssr: false }
);

/**
 * The one genuinely interactive piece of the hero — isolated into its
 * own small client component so the homepage itself stays a Server
 * Component. Owns the modal's open/closed state and renders both the
 * trigger button and the (code-split) modal together.
 */
export function WatchDemoTrigger() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button size="lg" variant="outline" onClick={() => setIsOpen(true)}>
        <PlayCircle className="h-4 w-4" />
        Watch 20 Second Demo
      </Button>
      <WatchDemoModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

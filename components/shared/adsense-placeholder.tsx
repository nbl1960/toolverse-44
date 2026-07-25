interface AdSlotProps {
  /** Visually-hidden-friendly label distinguishing multiple slots on one page. */
  label?: string;
  className?: string;
}

/**
 * A clearly-labeled ad slot placeholder — reserves the layout space and
 * visual rhythm where an ad unit will sit, without loading any real ad
 * script. Wire in your AdSense publisher/slot IDs here once you have an
 * approved account; until then this renders a neutral, honest "reserved
 * space" block rather than a fake ad.
 */
export function AdSlot({ label = "Advertisement", className }: AdSlotProps) {
  return (
    <div
      role="complementary"
      aria-label={label}
      className={`flex min-h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center ${className ?? ""}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

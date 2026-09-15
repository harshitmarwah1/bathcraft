import type { Metadata } from "next";
import IconAnimationPreview from "@/components/brand/IconAnimationPreview";

export const metadata: Metadata = {
  title: "Icon animation",
  // Internal review page, not a destination.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <IconAnimationPreview />;
}

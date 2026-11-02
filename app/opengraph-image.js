import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og";

export const alt = "The Commercial Hive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Commercial awareness for future lawyers"
        title="Where future commercial lawyers develop commercial judgement."
        footer="Analysis, challenges and a public portfolio"
      />
    ),
    size
  );
}

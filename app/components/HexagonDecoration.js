function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(" ");
}

const RADIUS = 46;
const ROWS = 3;
const COLS = 3;
const COL_SPACING = 90;
const ROW_SPACING = 80;
const ROW_OFFSET = 46;

export default function HexagonDecoration() {
  const hexes = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cx = 60 + col * COL_SPACING + (row % 2 ? ROW_OFFSET : 0);
      const cy = 60 + row * ROW_SPACING;
      hexes.push({ cx, cy });
    }
  }

  return (
    <svg
      viewBox="0 0 400 400"
      className="honeycomb-decoration absolute pointer-events-none"
      style={{ top: "-60px", right: "-80px", width: "460px", height: "460px", zIndex: 0 }}
      aria-hidden="true"
    >
      {hexes.map((h, i) => (
        <polygon
          key={i}
          points={hexPoints(h.cx, h.cy, RADIUS)}
          fill="none"
          stroke="#C6752B"
          strokeWidth="1.2"
          opacity="0.45"
        />
      ))}
    </svg>
  );
}

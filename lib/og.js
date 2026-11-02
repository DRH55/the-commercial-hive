// The look of every link-preview card (what LinkedIn and others show when a page is shared).
// Built from basic shapes because the image renderer supports a limited set of CSS.

function Hexagon() {
  return (
    <svg width="54" height="60" viewBox="0 0 100 110" fill="none">
      <polygon points="50,4 93,28 93,80 50,104 7,80 7,28" stroke="#C6752B" strokeWidth="8" />
      <polygon points="50,28 75,42 75,68 50,82 25,68 25,42" stroke="#C6752B" strokeWidth="8" />
    </svg>
  );
}

function clip(text, max) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export function OgCard({ eyebrow, title, footer }) {
  const shown = clip(title, 130);
  const fontSize = shown.length > 90 ? 50 : shown.length > 55 ? 60 : 72;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#C6752B", padding: 14 }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF5EA",
          padding: "52px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Hexagon />
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 5, color: "#211D1A", fontWeight: 700 }}>
            THE COMMERCIAL <span style={{ color: "#C6752B", marginLeft: 12 }}>HIVE</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#C6752B", textTransform: "uppercase", marginBottom: 22 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize, lineHeight: 1.15, color: "#211D1A", fontWeight: 700 }}>{shown}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#4A423A" }}>
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex" }}>thecommercialhive.com</div>
        </div>
      </div>
    </div>
  );
}

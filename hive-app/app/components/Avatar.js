export default function Avatar({ photo, name, size = 34 }) {
  const initials = name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div
      className="hex flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: photo ? `center/cover no-repeat url(${photo})` : "#C6752B",
      }}
    >
      {!photo && (
        <span className="font-display font-semibold text-cream" style={{ fontSize: size * 0.38 }}>
          {initials}
        </span>
      )}
    </div>
  );
}

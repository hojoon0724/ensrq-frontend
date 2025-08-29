export function WordmarkVertical({ color }: { color: string }) {
  return (
    <div
      className="wordmark flex flex-row items-center gap-quarter"
      style={{
        fontSize: "2.25rem",
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        width: "2.25rem", // Set width to font-size for proper layout
        height: "auto",
      }}
    >
      <div className="museo font-light " style={{ color }}>
        ensemble
      </div>
      <div className={`museo-slab font-bold py-quarter`} style={{ backgroundColor: color, color: "white" }}>
        NEW
      </div>
      <div className="museo font-light " style={{ color }}>
        SRQ
      </div>
    </div>
  );
}

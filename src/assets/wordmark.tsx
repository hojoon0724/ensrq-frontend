export default function Wordmark({ color }: { color: string }) {
  return (
    <div className="wordmark flex flex-row" style={{ fontSize: "2.25rem" }}>
      <div className="museo font-light pr-quarter" style={{ color }}>
        ensemble
      </div>
      <div className={`museo-slab font-bold px-quarter`} style={{ backgroundColor: color, color: "black" }}>
        NEW
      </div>
      <div className="museo font-light pl-quarter" style={{ color }}>
        SRQ
      </div>
    </div>
  );
}

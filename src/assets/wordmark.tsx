export default function Wordmark({ color }: { color: string }) {
  return (
    <div className="wordmark text-4xl flex flex-row">
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

export function Wordmark({ color }: { color: string }) {
  return (
    <div className="wordmark flex flex-row">
      <div className="museo font-light pr-quarter text-[2.25rem]" style={{ color }}>
        ensemble
      </div>
      <div
        className={`museo-slab font-bold px-quarter text-[2.25rem]`}
        style={{ backgroundColor: color, color: "black" }}
      >
        NEW
      </div>
      <div className="museo font-light pl-quarter text-[2.25rem]" style={{ color }}>
        SRQ
      </div>
    </div>
  );
}

export default function HojoonKimFooter({ className }: { className?: string }) {
  return (
    <div
      className={`footer bg-black w-full p-1 flex justify-center items-center bottom-0 relative ${className}`}
      style={{ fontSize: "0.6rem", fontFamily: "Roboto Mono, monospace", fontWeight: "400", letterSpacing: "0.1ch" }}
    >
      <span style={{ color: "#009fff" }}>&#91;&nbsp;</span>
      <span style={{ color: "#da70d6" }}>designed&nbsp;</span>
      <span style={{ color: "#efefef" }}>and&nbsp;</span>
      <span style={{ color: "#b5cea8" }}>built&nbsp;</span>
      <span style={{ color: "#009fff" }}>&#93;&nbsp;</span>
      <span style={{ color: "#efefef" }}>by&nbsp;</span>
      <span style={{ color: "#ffd800" }}>&#123;&nbsp;</span>
      <span style={{ color: "#a2e6ff" }}>Hojoon Kim&nbsp;</span>
      <span style={{ color: "#ffd800" }}>&#125;</span>
    </div>
  );
}

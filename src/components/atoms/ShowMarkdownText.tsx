import ReactMarkdown from "react-markdown";

type ShowMarkdownTextProps = {
  children: string;
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl";
};

export function ShowMarkdownText({ children, fontSize = "base" }: ShowMarkdownTextProps) {
  const sizeClasses = {
    sm: "markdown-sm",
    base: "markdown-base",
    lg: "markdown-lg",
    xl: "markdown-xl",
    "2xl": "markdown-2xl",
  };

  return (
    <div className={`markdown-content ${sizeClasses[fontSize]}`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}

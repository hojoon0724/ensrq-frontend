import ReactMarkdown from "react-markdown";

type ShowMarkdownTextProps = {
  children: string;
};

export function ShowMarkdownText({ children }: ShowMarkdownTextProps) {
  return <ReactMarkdown>{children}</ReactMarkdown>;
}

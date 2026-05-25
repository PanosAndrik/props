import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogMarkdown({ content }: { content: string }) {
  return (
    <article className="prose prose-zinc mt-8 max-w-none prose-headings:font-bold prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}

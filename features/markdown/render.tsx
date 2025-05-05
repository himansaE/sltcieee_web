"use client";

import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

type MarkdownRenderProps = {
  content: string;
  className?: string;
};

// Full featured markdown renderer with all formatting options
export const MarkdownRender: React.FC<MarkdownRenderProps> = ({
  content,
  className,
}) => {
  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <Markdown
        components={{
          // Override default element renderers with styled versions
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-3 mt-4">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            // For inline code
            if (!className) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm">
                  {children}
                </code>
              );
            }
            // For code blocks
            return (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-x-auto mb-4">
                <code className={className}>{children}</code>
              </pre>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-md my-4"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
          ),
          hr: () => <hr className="my-6 border-t border-gray-300" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

// Simplified markdown renderer for previews that matches SimpleMDXEditor
export const SimpleMarkdownRender: React.FC<MarkdownRenderProps> = ({
  content,
  className,
}) => {
  return (
    <div
      className={cn("prose dark:prose-invert max-w-none text-sm", className)}
    >
      <Markdown
        components={{
          // More compact styling for preview
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gray-200 pl-2 italic my-2">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            if (!className) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-xs">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-x-auto mb-2 text-xs">
                <code className={className}>{children}</code>
              </pre>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-md my-2"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-2 py-1 text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-2 py-1">{children}</td>
          ),
          hr: () => <hr className="my-3 border-t border-gray-300" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

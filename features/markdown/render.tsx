"use client";

import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";
import type { ReactNode } from "react";

type MarkdownRenderProps = {
  content: string;
  className?: string;
};

// Type definitions for custom component props
type HeadingProps = {
  children: ReactNode;
};

type ParagraphProps = {
  children: ReactNode;
};

type ListProps = {
  children: ReactNode;
};

type ListItemProps = {
  children: ReactNode;
};

type BlockquoteProps = {
  children: ReactNode;
};

type LinkProps = {
  href?: string;
  children: ReactNode;
};

type CodeProps = {
  children: ReactNode;
  className?: string;
};

type ImageProps = {
  src?: string;
  alt?: string;
};

type TableProps = {
  children: ReactNode;
};

type TableHeadProps = {
  children: ReactNode;
};

type TableCellProps = {
  children: ReactNode;
};

// Full featured markdown renderer with all formatting options
export const MarkdownRender: React.FC<MarkdownRenderProps> = ({
  content,
  className,
}) => {
  const components: Components = {
    // Override default element renderers with styled versions
    h1: ({ children }: HeadingProps) => (
      <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }: HeadingProps) => (
      <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }: HeadingProps) => (
      <h3 className="text-lg font-bold mb-3 mt-4">{children}</h3>
    ),
    p: ({ children }: ParagraphProps) => <p className="mb-4">{children}</p>,
    ul: ({ children }: ListProps) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    ol: ({ children }: ListProps) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
    li: ({ children }: ListItemProps) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }: BlockquoteProps) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: LinkProps) => (
      <a
        href={href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children, className }: CodeProps) => {
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
    img: ({ src, alt }: ImageProps) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-4" />
    ),
    table: ({ children }: TableProps) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: TableHeadProps) => (
      <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
    ),
    th: ({ children }: TableCellProps) => (
      <th className="border border-gray-300 px-4 py-2 text-left">{children}</th>
    ),
    td: ({ children }: TableCellProps) => (
      <td className="border border-gray-300 px-4 py-2">{children}</td>
    ),
    hr: () => <hr className="my-6 border-t border-gray-300" />,
  };

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
};

// Simplified markdown renderer for previews that matches SimpleMDXEditor
export const SimpleMarkdownRender: React.FC<MarkdownRenderProps> = ({
  content,
  className,
}) => {
  const components: Components = {
    // More compact styling for preview
    h1: ({ children }: HeadingProps) => (
      <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>
    ),
    h2: ({ children }: HeadingProps) => (
      <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>
    ),
    h3: ({ children }: HeadingProps) => (
      <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>
    ),
    p: ({ children }: ParagraphProps) => <p className="mb-2">{children}</p>,
    ul: ({ children }: ListProps) => (
      <ul className="list-disc pl-5 mb-2">{children}</ul>
    ),
    ol: ({ children }: ListProps) => (
      <ol className="list-decimal pl-5 mb-2">{children}</ol>
    ),
    li: ({ children }: ListItemProps) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }: BlockquoteProps) => (
      <blockquote className="border-l-2 border-gray-200 pl-2 italic my-2">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: LinkProps) => (
      <a
        href={href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children, className }: CodeProps) => {
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
    img: ({ src, alt }: ImageProps) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-2" />
    ),
    table: ({ children }: TableProps) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: TableHeadProps) => (
      <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
    ),
    th: ({ children }: TableCellProps) => (
      <th className="border border-gray-300 px-2 py-1 text-left">{children}</th>
    ),
    td: ({ children }: TableCellProps) => (
      <td className="border border-gray-300 px-2 py-1">{children}</td>
    ),
    hr: () => <hr className="my-3 border-t border-gray-300" />,
  };

  return (
    <div
      className={cn("prose dark:prose-invert max-w-none text-sm", className)}
    >
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
};


import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="relative my-4 group">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                 <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono uppercase">
                   {match[1]}
                 </span>
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-xl !bg-[#1e2128] !border !border-slate-800 !p-4 custom-scrollbar"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-[#1e2128] px-1.5 py-0.5 rounded text-indigo-400 font-mono text-xs" {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 text-white">{children}</h3>,
        p: ({ children }) => <p className="mb-4 leading-relaxed text-slate-300">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-300">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 italic bg-indigo-500/5 my-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 border border-slate-800 rounded-lg">
            <table className="min-w-full divide-y divide-slate-800">{children}</table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 bg-slate-800 text-left text-xs font-bold uppercase text-slate-400 tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-sm text-slate-300 border-t border-slate-800">
            {children}
          </td>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
            {children}
          </a>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

import React from 'react';

export const formatInlineText = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    const nextBold = text.indexOf('**', currentIndex);
    const nextCode = text.indexOf('`', currentIndex);

    let first = -1;
    let type: 'bold' | 'code' | 'none' = 'none';

    if (nextBold !== -1 && nextCode !== -1) {
      if (nextBold < nextCode) {
        first = nextBold;
        type = 'bold';
      } else {
        first = nextCode;
        type = 'code';
      }
    } else if (nextBold !== -1) {
      first = nextBold;
      type = 'bold';
    } else if (nextCode !== -1) {
      first = nextCode;
      type = 'code';
    }

    if (first === -1) {
      parts.push(text.substring(currentIndex));
      break;
    }

    if (first > currentIndex) {
      parts.push(text.substring(currentIndex, first));
    }

    if (type === 'bold') {
      const closingIndex = text.indexOf('**', first + 2);
      if (closingIndex !== -1) {
        const content = text.substring(first + 2, closingIndex);
        parts.push(
          <strong key={first} className="font-bold text-white">
            {content}
          </strong>
        );
        currentIndex = closingIndex + 2;
      } else {
        parts.push('**');
        currentIndex = first + 2;
      }
    } else if (type === 'code') {
      const closingIndex = text.indexOf('`', first + 1);
      if (closingIndex !== -1) {
        const content = text.substring(first + 1, closingIndex);
        parts.push(
          <code
            key={first}
            className="px-1.5 py-0.5 font-mono text-[13px] bg-slate-950 border border-slate-800 text-indigo-300 rounded font-semibold whitespace-nowrap"
          >
            {content}
          </code>
        );
        currentIndex = closingIndex + 1;
      } else {
        parts.push('`');
        currentIndex = first + 1;
      }
    }
  }

  return <>{parts}</>;
};

export const renderMarkdown = (text: string): React.ReactNode => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentListType: 'ul' | 'ol' | null = null;
  let currentListItems: React.ReactNode[] = [];

  const flushList = (key: string | number) => {
    if (currentListType === 'ul') {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-6 my-3 space-y-2 text-slate-350 text-[15px]">
          {currentListItems}
        </ul>
      );
    } else if (currentListType === 'ol') {
      elements.push(
        <ol key={`ol-${key}`} className="list-decimal pl-6 my-3 space-y-2 text-slate-350 text-[15px]">
          {currentListItems}
        </ol>
      );
    }
    currentListType = null;
    currentListItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if heading
    if (trimmed.startsWith('#')) {
      flushList(i);
      const hashCount = (trimmed.match(/^#+/) || [''])[0].length;
      const headingText = trimmed.replace(/^#+\s+/, '');

      if (hashCount === 1) {
        elements.push(
          <h1 key={i} className="text-2xl font-extrabold text-white mt-6 mb-3">
            {formatInlineText(headingText)}
          </h1>
        );
      } else if (hashCount === 2) {
        elements.push(
          <h2 key={i} className="text-xl font-bold text-white mt-5 mb-2 border-b border-slate-800 pb-1.5">
            {formatInlineText(headingText)}
          </h2>
        );
      } else {
        // 3 or more hashes
        elements.push(
          <h3 key={i} className="text-base font-bold text-slate-200 mt-5 mb-2 border-l-2 border-indigo-500 pl-3">
            {formatInlineText(headingText)}
          </h3>
        );
      }
      continue;
    }

    // Check if bullet list item
    const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
    // Check if numbered list item
    const numMatch = trimmed.match(/^\d+\.\s+/);

    if (isBullet) {
      if (currentListType !== 'ul') {
        flushList(i);
        currentListType = 'ul';
      }
      const content = trimmed.substring(2);
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {formatInlineText(content)}
        </li>
      );
      continue;
    }

    if (numMatch) {
      if (currentListType !== 'ol') {
        flushList(i);
        currentListType = 'ol';
      }
      const content = trimmed.substring(numMatch[0].length);
      currentListItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {formatInlineText(content)}
        </li>
      );
      continue;
    }

    // Empty line: flush list, add a small spacing
    if (trimmed === '') {
      flushList(i);
      elements.push(<div key={`spacer-${i}`} className="h-2" />);
      continue;
    }

    // Regular text line: flush active list
    flushList(i);

    elements.push(
      <p key={i} className="text-slate-350 text-[15px] leading-relaxed my-2">
        {formatInlineText(line)}
      </p>
    );
  }

  // Flush any remaining list at the end
  flushList('end');

  return <div className="space-y-1">{elements}</div>;
};

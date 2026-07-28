import React from 'react';

// Render inline text formatting (handles **bold** and *italic*)
function renderInlineText(text: string) {
  if (!text) return null;
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-text-primary">
          {renderItalics(part.slice(2, -2), index)}
        </strong>
      );
    }
    return renderItalics(part, index);
  });
}

function renderItalics(text: string, parentIndex: number) {
  const italicParts = text.split(/(\*.*?\*)/g);
  return italicParts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
      return (
        <em key={`${parentIndex}-${index}`} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default function MarkdownContent({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Code / Formula block (``` or $$)
    if (trimmed.startsWith('```') || trimmed.startsWith('$$')) {
      const fence = trimmed.startsWith('```') ? '```' : '$$';
      const codeLines: string[] = [];
      const firstLineText = trimmed.replace(/^```\w*|^$$/, '').trim();
      if (firstLineText && !firstLineText.endsWith(fence) && firstLineText !== fence) {
        codeLines.push(firstLineText);
      }
      i++;
      while (i < lines.length) {
        const curr = lines[i];
        if (curr.trim().endsWith(fence) || curr.trim() === fence) {
          i++;
          break;
        }
        codeLines.push(curr);
        i++;
      }
      elements.push(
        <div key={`code-${i}`} className="bg-primary-dark/95 text-white p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner my-4">
          {codeLines.join('\n')}
        </div>
      );
      continue;
    }

    // Table block (starts with |)
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

        const headers = parseRow(tableLines[0]);
        const isSeparator = tableLines[1].includes('---');
        const dataRows = isSeparator ? tableLines.slice(2) : tableLines.slice(1);

        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto rounded-2xl border border-border-custom shadow-2xs bg-white">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-bg-custom border-b border-border-custom font-display font-bold text-text-primary">
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-4 py-3 font-bold">{renderInlineText(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60">
                {dataRows.map((rowStr, rIdx) => {
                  const cells = parseRow(rowStr);
                  return (
                    <tr key={rIdx} className="hover:bg-bg-custom/50 transition-colors">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 font-medium">{renderInlineText(cell)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Horizontal rule (--- or ***)
    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={`hr-${i}`} className="border-border-custom/70 my-6" />);
      i++;
      continue;
    }

    // Headings (###, ####, ##, #)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg sm:text-xl font-bold text-text-primary font-display pt-5 pb-2 border-b border-border-custom/80">
          {renderInlineText(trimmed.replace('### ', ''))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm sm:text-base font-bold text-primary font-display pt-3">
          {renderInlineText(trimmed.replace('#### ', ''))}
        </h4>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl sm:text-2xl font-bold text-text-primary font-display pt-6 pb-2 border-b border-border-custom">
          {renderInlineText(trimmed.replace('## ', ''))}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-extrabold text-text-primary font-display pt-6">
          {renderInlineText(trimmed.replace('# ', ''))}
        </h1>
      );
      i++;
      continue;
    }

    // Unordered / Bullet list (* or -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const curr = lines[i].trim();
        if (curr.startsWith('* ') || curr.startsWith('- ')) {
          listItems.push(curr.replace(/^[\*\-]\s+/, ''));
          i++;
        } else if (curr === '') {
          if (i + 1 < lines.length && (lines[i + 1].trim().startsWith('* ') || lines[i + 1].trim().startsWith('- '))) {
            i++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 my-3 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span className="leading-relaxed">{renderInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered / Numbered list (e.g. 1. , 2. )
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length) {
        const curr = lines[i].trim();
        if (/^\d+\.\s/.test(curr)) {
          listItems.push(curr.replace(/^\d+\.\s+/, ''));
          i++;
        } else if (curr === '') {
          if (i + 1 < lines.length && /^\d+\.\s/.test(lines[i + 1].trim())) {
            i++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-3 pl-2 list-decimal list-inside bg-bg-custom/40 p-4 rounded-xl border border-border-custom/50">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed font-medium">
              {renderInlineText(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular Paragraph
    const paraLines: string[] = [];
    while (i < lines.length) {
      const curr = lines[i].trim();
      if (!curr) break;
      if (
        curr.startsWith('### ') ||
        curr.startsWith('#### ') ||
        curr.startsWith('## ') ||
        curr.startsWith('# ') ||
        curr === '---' ||
        curr === '***' ||
        curr.startsWith('|') ||
        curr.startsWith('```') ||
        curr.startsWith('$$') ||
        curr.startsWith('* ') ||
        curr.startsWith('- ') ||
        /^\d+\.\s/.test(curr)
      ) {
        break;
      }
      paraLines.push(curr);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="text-text-primary leading-relaxed my-2">
          {renderInlineText(paraLines.join(' '))}
        </p>
      );
    }
  }

  return (
    <div className="space-y-3 text-xs sm:text-sm text-text-primary leading-relaxed">
      {elements}
    </div>
  );
}

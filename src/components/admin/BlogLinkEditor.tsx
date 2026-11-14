'use client';

import React, { useRef, useState } from 'react';
import { Link2, X } from 'lucide-react';
import { normalizeBlogLink, parseBlogLinks } from '@/lib/blogLinks';

type Field = 'subHeading' | 'subPara';

type Selection = { field: Field; start: number; end: number; text: string };

// "Add Links" panel for one Main Description Block. It previews the block's
// heading and paragraph; select any word or line there to link it. The link
// is saved inside the text as [selected words](https://link).
export default function BlogLinkEditor({
  subHeading,
  subPara,
  onChange,
  alwaysOpen = false,
}: {
  subHeading: string;
  subPara: string;
  onChange: (field: Field, value: string) => void;
  /** Show the preview straight away, without the Add Links toggle button. */
  alwaysOpen?: boolean;
}) {
  const [isOpen, setOpen] = useState(alwaysOpen);
  const open = alwaysOpen || isOpen;
  const [selection, setSelection] = useState<Selection | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const headingRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLDivElement>(null);

  const values: Record<Field, string> = { subHeading, subPara };

  // Works out which characters of the stored text the admin selected.
  const handleSelect = (field: Field) => {
    const container = field === 'subHeading' ? headingRef.current : paraRef.current;
    const sel = window.getSelection();
    if (!container || !sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    // Position in the stored text for one end of the selection.
    const position = (node: Node, offset: number): number | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        const span = node.parentElement?.closest<HTMLElement>('[data-start]');
        return span && container.contains(span) ? Number(span.dataset.start) + offset : null;
      }
      const el = node as HTMLElement;
      if (el.dataset?.start !== undefined && container.contains(el)) {
        return Number(el.dataset.start) + (offset === 0 ? 0 : (el.textContent ?? '').length);
      }
      return null;
    };
    const startPos = position(range.startContainer, range.startOffset);
    const endPos = position(range.endContainer, range.endOffset);
    if (startPos === null || endPos === null) {
      setError('Select text inside the heading or inside the paragraph (not across both, and not an existing link).');
      setSelection(null);
      return;
    }

    let start = startPos;
    let end = endPos;
    const text = values[field];
    // Ignore spaces at the edges of the selection.
    while (start < end && /\s/.test(text[start])) start++;
    while (end > start && /\s/.test(text[end - 1])) end--;
    const selected = text.slice(start, end);

    if (!selected) return;
    if (/[[\]]/.test(selected) || selected.includes('\n')) {
      setError('The selection can’t include square brackets or run over more than one line. Select a smaller part.');
      setSelection(null);
      return;
    }
    setError('');
    setUrl('');
    setSelection({ field, start, end, text: selected });
  };

  const addLink = () => {
    if (!selection) return;
    const href = normalizeBlogLink(url);
    if (!href) {
      setError('Enter a full link starting with https:// (or a site page like /contact).');
      return;
    }
    const text = values[selection.field];
    onChange(
      selection.field,
      `${text.slice(0, selection.start)}[${selection.text}](${href})${text.slice(selection.end)}`,
    );
    setSelection(null);
    setUrl('');
    setError('');
    window.getSelection()?.removeAllRanges();
  };

  const removeLink = (field: Field, start: number, end: number, label: string) => {
    const text = values[field];
    onChange(field, `${text.slice(0, start)}${label}${text.slice(end)}`);
  };

  const renderPreview = (field: Field, ref: React.RefObject<HTMLDivElement | null>, className: string, empty: string) => {
    const text = values[field];
    return (
      <div ref={ref} onMouseUp={() => handleSelect(field)} className={`whitespace-pre-wrap select-text cursor-text ${className}`}>
        {text ? (
          parseBlogLinks(text).map((segment) =>
            segment.type === 'text' ? (
              <span key={segment.start} data-start={segment.start}>{segment.text}</span>
            ) : (
              <span
                key={segment.start}
                className="inline-flex items-center gap-1 rounded bg-[#F9010D]/10 px-1 text-[#F9010D] underline select-none"
                title={segment.href}
              >
                {segment.text}
                <button
                  type="button"
                  onMouseUp={(e) => e.stopPropagation()}
                  onClick={() => removeLink(field, segment.start, segment.end, segment.text)}
                  className="rounded p-0.5 text-gray-500 hover:bg-red-100 hover:text-red-600"
                  title="Remove link"
                  aria-label={`Remove link from "${segment.text}"`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ),
          )
        ) : (
          <span className="italic text-gray-400">{empty}</span>
        )}
      </div>
    );
  };

  return (
    <div>
      {!alwaysOpen && (
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSelection(null);
          setError('');
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-[#002147]/20 bg-[#002147]/5 px-3 py-1.5 text-sm font-semibold text-[#002147] hover:bg-[#002147]/10 transition-colors"
      >
        <Link2 className="h-4 w-4" />
        {open ? 'Close Links' : 'Add Links'}
      </button>
      )}

      {open && (
        <div className={`${alwaysOpen ? '' : 'mt-3 '}space-y-3 rounded-lg border border-dashed border-[#002147]/30 bg-[#002147]/[0.02] p-4`}>
          <p className="text-xs text-gray-500">
            Select any word or line below, then paste the link and click <b>Add Link</b>. Links are saved when you save the blog.
          </p>

          {renderPreview('subHeading', headingRef, 'text-lg font-bold text-[#002147]', 'No heading')}
          {renderPreview('subPara', paraRef, 'text-sm leading-relaxed text-gray-700', 'No paragraph')}

          {selection && (
            <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-600">
                Link for: <span className="font-semibold text-[#002147]">“{selection.text}”</span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  autoFocus
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                  placeholder="https://www.example.com or /contact"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#002147] focus:border-[#002147] focus:outline-none focus:ring-2 focus:ring-[#002147]/20"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addLink}
                    className="rounded-lg bg-[#002147] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002147]/90"
                  >
                    Add Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelection(null)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

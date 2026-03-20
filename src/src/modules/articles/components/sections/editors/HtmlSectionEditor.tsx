import React, { useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Quote, Code, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { HtmlSectionData } from '@/src/types/content-section';

interface Props {
  section: HtmlSectionData;
  onChange: (updates: Partial<HtmlSectionData>) => void;
}

export function HtmlSectionEditor({ section, onChange }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) onChange({ content: editorRef.current.innerHTML });
  };

  const toolbarGroups = [
    [
      { icon: Bold, cmd: 'bold', title: 'Bold' },
      { icon: Italic, cmd: 'italic', title: 'Italic' },
      { icon: Underline, cmd: 'underline', title: 'Underline' },
    ],
    [
      { icon: Heading1, cmd: 'formatBlock', val: '<h2>', title: 'Heading' },
      { icon: Heading2, cmd: 'formatBlock', val: '<h3>', title: 'Subheading' },
    ],
    [
      { icon: List, cmd: 'insertUnorderedList', title: 'Bullet list' },
      { icon: ListOrdered, cmd: 'insertOrderedList', title: 'Numbered list' },
    ],
    [
      { icon: AlignLeft, cmd: 'justifyLeft', title: 'Left' },
      { icon: AlignCenter, cmd: 'justifyCenter', title: 'Center' },
      { icon: AlignRight, cmd: 'justifyRight', title: 'Right' },
    ],
    [
      { icon: LinkIcon, cmd: 'createLink', title: 'Link', prompt: true },
      { icon: Quote, cmd: 'formatBlock', val: '<blockquote>', title: 'Quote' },
      { icon: Code, cmd: 'formatBlock', val: '<pre>', title: 'Code' },
    ],
  ];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isFocused ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
      <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 p-1.5 flex flex-wrap gap-0.5">
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="contents">
            <div className="flex gap-0.5">
              {group.map((btn, bi) => {
                const Icon = btn.icon;
                return (
                  <button key={bi} type="button" title={btn.title}
                    onClick={() => {
                      if (btn.prompt) {
                        const url = prompt('Enter URL:');
                        if (url) execCommand(btn.cmd, url);
                      } else {
                        execCommand(btn.cmd, btn.val);
                      }
                    }}
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
            {gi < toolbarGroups.length - 1 && <div className="w-px bg-gray-200 dark:bg-gray-700 my-0.5" />}
          </div>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={() => { if (editorRef.current) onChange({ content: editorRef.current.innerHTML }); }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={(e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }}
        dangerouslySetInnerHTML={{ __html: section.content }}
        className="p-4 focus:outline-none bg-white dark:bg-gray-800 min-h-[120px] prose dark:prose-invert max-w-none text-sm"
        data-placeholder="Nhập nội dung văn bản..."
        style={{ lineHeight: 1.7 }}
      />
      <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 px-3 py-1 text-xs text-gray-400 flex justify-between">
        <span>{section.content.replace(/<[^>]*>/g, '').length} ký tự</span>
        <span>{Math.ceil(section.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200)} phút đọc</span>
      </div>
      <style>{`[contenteditable][data-placeholder]:empty:before{content:attr(data-placeholder);color:#9ca3af;cursor:text;}`}</style>
    </div>
  );
}
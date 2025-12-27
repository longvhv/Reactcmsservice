import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * Rich Text Editor Component
 * Simple WYSIWYG editor using contentEditable
 * For production, consider using libraries like:
 * - TinyMCE
 * - CKEditor
 * - Quill
 * - Slate
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your content...',
  minHeight = '400px',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);

  // Execute document command
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      group: 'text-format',
      buttons: [
        { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
      ],
    },
    {
      group: 'headings',
      buttons: [
        { 
          icon: Heading1, 
          command: 'formatBlock', 
          value: '<h1>',
          title: 'Heading 1' 
        },
        { 
          icon: Heading2, 
          command: 'formatBlock', 
          value: '<h2>',
          title: 'Heading 2' 
        },
      ],
    },
    {
      group: 'lists',
      buttons: [
        { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
        { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
      ],
    },
    {
      group: 'alignment',
      buttons: [
        { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
        { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
        { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
      ],
    },
    {
      group: 'insert',
      buttons: [
        { 
          icon: LinkIcon, 
          command: 'createLink', 
          title: 'Insert Link',
          requiresValue: true 
        },
        { 
          icon: ImageIcon, 
          command: 'insertImage', 
          title: 'Insert Image',
          requiresValue: true 
        },
        { icon: Quote, command: 'formatBlock', value: '<blockquote>', title: 'Quote' },
        { icon: Code, command: 'formatBlock', value: '<pre>', title: 'Code Block' },
      ],
    },
    {
      group: 'history',
      buttons: [
        { icon: Undo, command: 'undo', title: 'Undo (Ctrl+Z)' },
        { icon: Redo, command: 'redo', title: 'Redo (Ctrl+Y)' },
      ],
    },
  ];

  // Handle button click
  const handleButtonClick = (button: any) => {
    if (button.requiresValue) {
      const url = prompt(
        button.command === 'createLink' 
          ? 'Enter URL:' 
          : 'Enter image URL:'
      );
      if (url) {
        execCommand(button.command, url);
      }
    } else {
      execCommand(button.command, button.value);
    }
  };

  // Handle input change
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle paste (clean HTML)
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div 
      className={`border rounded-xl overflow-hidden transition-all ${
        isFocused 
          ? 'border-blue-500 ring-2 ring-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((group, groupIndex) => (
            <React.Fragment key={group.group}>
              <div className="flex gap-1">
                {group.buttons.map((button, btnIndex) => {
                  const Icon = button.icon;
                  return (
                    <button
                      key={btnIndex}
                      type="button"
                      onClick={() => handleButtonClick(button)}
                      title={button.title}
                      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
              {groupIndex < toolbarButtons.length - 1 && (
                <div className="w-px bg-gray-300 dark:bg-gray-600 my-1" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose dark:prose-invert max-w-none p-6 focus:outline-none bg-white dark:bg-gray-800 overflow-y-auto"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      {/* Character count */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {value.replace(/<[^>]*>/g, '').length} characters
        </span>
        <span>
          {Math.ceil(value.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min read
        </span>
      </div>

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }
        
        [contenteditable] {
          line-height: 1.7;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] pre {
          background: #1f2937;
          color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: monospace;
          margin: 1rem 0;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

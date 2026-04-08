'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions/placeholder';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit } from '@tiptap/extension-table';
import './boardEditor.scss';
import { ButtonComponent } from '../button';
import { Tooltip, TooltipTrigger } from 'react-aria-components';
import { useEffect } from 'react';

type ToolbarButtonProps = {
  onClick: () => void;
  icon: string;
  label: string;
  isActive?: boolean;
};

type BoardEditorProps = {
  content?: string;
  isEditMode?: boolean;
};

function ToolbarButton({ onClick, icon, label, isActive }: ToolbarButtonProps) {
  return (
    <TooltipTrigger delay={300} closeDelay={100}>
      <ButtonComponent
        variant="outlined"
        className={`tiptap-editor__tool-button ${isActive ? 'is-active' : ''}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        aria-label={label}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </ButtonComponent>

      <Tooltip className="toolbar-tooltip">{label}</Tooltip>
    </TooltipTrigger>
  );
}

function ToolbarDivider() {
  return <span className="tiptap-editor__divider" aria-hidden="true" />;
}

export default function BoardEditor({ content, isEditMode = true }: BoardEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: isEditMode,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: !isEditMode, // 읽기 모드에서는 링크 클릭 가능하게
        autolink: true,
        defaultProtocol: 'https',
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TableKit.configure({
        table: {
          resizable: true,
        },
      }),
      Placeholder.configure({
        placeholder: '여기에 내용을 입력하세요.',
      }),
    ],
    content,
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(isEditMode);
  }, [editor, isEditMode]);

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content || '');
  }, [editor, content]);

  if (!editor) return null;

  // 링크 삽입
  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href ?? '';
    const url = window.prompt('링크 주소를 입력해주세요.', previousUrl);

    if (url === null) return;

    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // 이미지 삽입 (현재는 링크 URL로 삽입)
  const handleImage = () => {
    const url = window.prompt('이미지 URL을 입력해주세요.');
    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
  };

  // 표 삽입
  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="tiptap-editor">
      {isEditMode && (
        <div className="tiptap-editor__toolbar">
          <div className="tiptap-editor__group">
            <ToolbarButton
              label="굵게"
              icon="format_bold"
              isActive={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              label="기울임"
              icon="format_italic"
              isActive={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              label="밑줄"
              icon="format_underlined"
              isActive={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
          </div>

          <ToolbarDivider />

          <div className="tiptap-editor__group">
            <ToolbarButton
              label="헤딩 1"
              icon="format_h1"
              isActive={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            />
            <ToolbarButton
              label="헤딩 2"
              icon="format_h2"
              isActive={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolbarButton
              label="헤딩 3"
              icon="format_h3"
              isActive={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            />
          </div>

          <ToolbarDivider />

          <div className="tiptap-editor__group">
            <ToolbarButton
              label="앞머리 기호"
              icon="format_list_bulleted"
              isActive={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              label="앞머리 번호"
              icon="format_list_numbered"
              isActive={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </div>

          <ToolbarDivider />

          <div className="tiptap-editor__group">
            <ToolbarButton
              label="왼쪽 정렬"
              icon="format_align_left"
              isActive={editor.isActive({ textAlign: 'left' })}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            />
            <ToolbarButton
              label="가운데 정렬"
              icon="format_align_center"
              isActive={editor.isActive({ textAlign: 'center' })}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            />
            <ToolbarButton
              label="오른쪽 정렬"
              icon="format_align_right"
              isActive={editor.isActive({ textAlign: 'right' })}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            />
          </div>

          <ToolbarDivider />

          <div className="tiptap-editor__group">
            <ToolbarButton
              label="링크"
              icon="link"
              isActive={editor.isActive('link')}
              onClick={handleLink}
            />
            <ToolbarButton label="이미지 삽입" icon="image" onClick={handleImage} />
            <ToolbarButton
              label="표 삽입"
              icon="table"
              isActive={editor.isActive('table')}
              onClick={handleInsertTable}
            />
          </div>

          <ToolbarDivider />

          <div className="tiptap-editor__group">
            <ToolbarButton
              label="코드"
              icon="code"
              isActive={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            />
            <ToolbarButton
              label="인용"
              icon="format_quote"
              isActive={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
          </div>
        </div>
      )}

      <div className="tiptap-editor__body">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

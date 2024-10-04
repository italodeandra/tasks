import {
  ClipboardEvent,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  MouseEvent as RMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { markdownConverter } from "../../utils/markdownConverter";
import { isTouchDevice } from "@italodeandra/ui/utils/isBrowser";
import { mergeRefs } from "react-merge-refs";
import clsx from "@italodeandra/ui/utils/clsx";
import { markdownClassNames } from "./markdown.classNames";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

function MarkdownEditorWithRef(
  {
    value,
    onChange,
    editing: editingProp,
    onChangeEditing,
    className,
    editOnClick,
    editOnDoubleClick,
    editHighlight,
    placeholder,
    uploadClipboardImage,
    onClick,
    ...props
  }: {
    value: string;
    onChange?: (value: string) => void;
    editing?: boolean;
    onChangeEditing?: (editing: boolean) => void;
    className?: string;
    editOnClick?: boolean;
    editOnDoubleClick?: boolean;
    editHighlight?: boolean;
    placeholder?: string;
    uploadClipboardImage?: (image: string) => Promise<string>;
    onClick?: (e: RMouseEvent) => void;
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [editing, setEditing] = useState(editingProp || false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<EditorView>();

  useEffect(() => {
    if (editingProp !== undefined && editingProp !== editing) {
      setEditing(editingProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProp]);

  useEffect(() => {
    if (onChangeEditing && editing !== editingProp) {
      onChangeEditing(editing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleClick = useCallback(
    (e: RMouseEvent) => {
      onClick?.(e);
      if (editOnClick) {
        setEditing(true);
      }
    },
    [editOnClick, onClick],
  );

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (editor) {
      setEditing(false);
      onChange?.(editor.state.doc.toString() || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const handleKeyDownEditor = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        editor &&
        editing &&
        (e.key === "Escape" ||
          (e.key === "Enter" && !e.shiftKey && !isTouchDevice))
      ) {
        const isCursorAtEnd =
          editor.state.doc.toString().length === editor.state.selection.main.to;
        const endsWithAList = editor.state.doc.toString()?.endsWith("- ");
        if (!endsWithAList && isCursorAtEnd) {
          e.preventDefault();
          editor?.contentDOM?.blur();
        }
      }
    },
    [editing, editor],
  );

  const handleKeyDownRender = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!editing && e.key === "Enter") {
        setEditing(true);
      }
    },
    [editing],
  );

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (uploadClipboardImage) {
        const clipboard = e.clipboardData;
        if (clipboard) {
          const items = clipboard.items;

          for (const item of Array.from(items)) {
            if (item.type.indexOf("image") !== -1) {
              e.preventDefault();
              const blob = item.getAsFile();
              if (blob) {
                const reader = new FileReader();
                reader.onload = async function (event) {
                  const base64 = event.target?.result as string | undefined;
                  if (base64) {
                    const imageUrl = uploadClipboardImage
                      ? await uploadClipboardImage(base64)
                      : base64;
                    const markdownImage = `![image](${imageUrl})`;

                    if (editor) {
                      const transaction = editor.state.update({
                        changes: {
                          from: editor.state.selection.main.from,
                          to: editor.state.selection.main.to,
                          insert: markdownImage,
                        },
                      });
                      editor.dispatch(transaction);
                    }
                  }
                };
                reader.readAsDataURL(blob);
              }
            }
          }
        }
      }
    },
    [uploadClipboardImage, editor],
  );

  if (editing) {
    return (
      <CodeMirror
        value={value}
        extensions={[
          EditorView.lineWrapping,
          markdown({ base: markdownLanguage }),
        ]}
        // onChange={handleChange}
        onBlur={handleBlur}
        theme={vscodeDark}
        onKeyDown={handleKeyDownEditor}
        autoFocus
        className="[&_.cm-editor]:bg-transparent [&_.cm-editor]:outline-0"
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
        }}
        onCreateEditor={(editor) => {
          setEditor(editor);
        }}
        onPaste={handlePaste}
      />
    );
  }

  return (
    <div
      {...props}
      ref={mergeRefs([innerRef, ref])}
      dangerouslySetInnerHTML={{
        __html: value
          ? markdownConverter.makeHtml(value.replaceAll(" ", ""))
          : placeholder || "",
      }}
      onKeyDown={handleKeyDownRender}
      className={clsx(
        markdownClassNames,
        {
          "pointer-events-auto": editing,
          "cursor-pointer": !editing && onChange,
          "ring-2 ring-zinc-700 focus:ring-primary-500":
            editing && editHighlight,
          "text-zinc-500": !editing && !value,
        },
        className,
      )}
      data-is-editing={editing}
      onDoubleClick={
        editOnDoubleClick && onChange ? handleDoubleClick : undefined
      }
      onClick={handleClick}
      data-is-markdown=""
      onPaste={handlePaste}
    />
  );
}

export const MarkdownEditor = forwardRef(MarkdownEditorWithRef);

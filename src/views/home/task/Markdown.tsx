import clsx from "@italodeandra/ui/utils/clsx";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { markdownConverter } from "../../../utils/markdownConverter";
import setSelectionRange from "@italodeandra/ui/utils/setSelectionRange";
import Loading from "@italodeandra/ui/components/Loading";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export function Markdown({
  value = "",
  onChange,
  className,
  placeholder,
  editable,
  loading,
  editing,
  onChangeEditing,
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  editable?: boolean;
  loading?: boolean;
  editing?: boolean;
  onChangeEditing?: (editing: boolean) => void;
}) {
  let [internalEditing, setInternalEditing] = useState(Boolean(editing));
  let [newValue, setNewValue] = useState(value);
  let contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newValue !== value) {
      setNewValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (editing !== internalEditing) {
      setInternalEditing(Boolean(editing));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  useEffect(() => {
    if (editing !== internalEditing) {
      onChangeEditing?.(internalEditing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalEditing]);

  const markdownHtml = useMemo(
    () => markdownConverter.makeHtml(newValue),
    [newValue]
  );

  const saveChanges = useCallback(() => {
    setInternalEditing(false);
    if (internalEditing) {
      onChange?.(newValue.trim());
    }
  }, [internalEditing, newValue, onChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (internalEditing) {
        if (e.key === "Escape") {
          e.preventDefault();
          saveChanges();
        }
      }
    },
    [internalEditing, saveChanges]
  );

  useEffect(() => {
    if (internalEditing && contentRef.current) {
      contentRef.current.focus();
      setSelectionRange(
        contentRef.current,
        contentRef.current.innerText.length,
        contentRef.current.innerText.length
      );
    }
  }, [internalEditing]);

  const handleDoubleClick = useCallback(() => {
    setInternalEditing(true);
  }, []);

  const handleChange = useCallback((value: string) => {
    setNewValue(value);
  }, []);

  return (
    <div className="relative flex-1">
      {loading && <Loading className="absolute top-0.5 right-0.5 w-4 h-4" />}
      {internalEditing ? (
        <CodeMirror
          value={newValue}
          extensions={[
            EditorView.lineWrapping,
            markdown({ base: markdownLanguage }),
          ]}
          onChange={handleChange}
          theme={vscodeDark}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          ref={contentRef}
          className={clsx(
            "prose prose-zinc dark:prose-invert",
            "prose-pre:p-0 prose-ul:my-0 prose-li:my-0 prose-p:my-0 [&_.task-list-item]:pl-3",
            {
              "cursor-text": internalEditing,
              "select-none": !internalEditing,
              "opacity-50": !newValue && !internalEditing && placeholder,
            },
            className
          )}
          dangerouslySetInnerHTML={{
            __html: markdownHtml,
          }}
          {...(editable
            ? {
                onDoubleClick: handleDoubleClick,
              }
            : {})}
        />
      )}
    </div>
  );
}

import clsx from "@italodeandra/ui/utils/clsx";
import {
  FocusEvent,
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
  }, [newValue, value]);

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
    if (internalEditing && contentRef.current) {
      setNewValue(contentRef.current.innerText);
      onChange?.(contentRef.current.innerText);
      if (!contentRef.current.innerText) {
        contentRef.current.innerText = placeholder || "";
      }
    }
  }, [internalEditing, onChange, placeholder]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (internalEditing) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          saveChanges();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          e.currentTarget.innerText = value;
          if (!value) {
            saveChanges();
          }
          setInternalEditing(false);
        }
        if (e.key === "Tab") {
          e.preventDefault();
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            const newText = e.shiftKey
              ? selectedText.replace(/^(\t|\s{2})/gm, "")
              : "\t" + selectedText.replace(/\n/g, "\n\t");
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
          }
        }
      }
    },
    [internalEditing, saveChanges, value]
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      if (!newValue && placeholder) {
        e.currentTarget.innerText = "";
      }
    },
    [newValue, placeholder]
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

  return (
    <div className="relative flex-1">
      {loading && <Loading className="absolute top-0.5 right-0.5 w-4 h-4" />}
      <div
        ref={contentRef}
        className={clsx(
          "outline-0 [&_a]:truncate [&_a]:block rounded whitespace-pre-wrap prose prose-zinc dark:prose-invert",
          "prose-ul:my-0 prose-li:my-0 prose-ul:leading-none prose-li:leading-none",
          {
            "cursor-text": internalEditing,
            "select-none": !internalEditing,
            "opacity-50": !newValue && !internalEditing && placeholder,
          },
          className
        )}
        dangerouslySetInnerHTML={{
          __html:
            (internalEditing ? newValue : markdownHtml) || placeholder || "",
        }}
        {...(editable
          ? {
              contentEditable: internalEditing,
              onKeyDown: handleKeyDown,
              onBlur: saveChanges,
              onDoubleClick: handleDoubleClick,
              onFocus: handleFocus,
            }
          : {})}
      />
    </div>
  );
}

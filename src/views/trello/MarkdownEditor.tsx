import {
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
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

function MarkdownEditorWithRef(
  {
    value,
    onChange,
    editing: editingProp,
    onChangeEditing,
    className,
    editOnDoubleClick,
    editHighlight,
    ...props
  }: {
    value: string;
    onChange?: (value: string) => void;
    editing?: boolean;
    onChangeEditing?: (editing: boolean) => void;
    className?: string;
    editOnDoubleClick?: boolean;
    editHighlight?: boolean;
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [editing, setEditing] = useState(editingProp || false);
  const innerRef = useRef<HTMLDivElement>(null);

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

  const handleEdit = useCallback(() => {
    setEditing(true);
  }, []);

  useEffect(() => {
    if (editing) {
      innerRef.current!.innerText = value;
      const target = innerRef.current;
      setTimeout(() => {
        if (target) {
          target.focus();
          const range = document.createRange();
          range.selectNodeContents(target);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleBlur = useCallback(() => {
    setEditing(false);
    window.getSelection()?.removeAllRanges();
    setTimeout(() => {
      if (innerRef.current?.parentElement) {
        innerRef.current.parentElement.focus();
      }
    });
    const newTitle = innerRef.current!.innerText;
    onChange?.(newTitle);
    innerRef.current!.innerHTML = markdownConverter.makeHtml(
      value.replaceAll(" ", ""),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (
        editing &&
        (e.key === "Escape" ||
          (e.key === "Enter" && !e.shiftKey && !isTouchDevice))
      ) {
        e.preventDefault();
        e.currentTarget.blur();
      }
      if (!editing && e.key === "Enter") {
        handleEdit();
      }
    },
    [editing, handleEdit],
  );

  return (
    <div
      {...props}
      ref={mergeRefs([innerRef, ref])}
      dangerouslySetInnerHTML={{
        __html: markdownConverter.makeHtml(value.replaceAll(" ", "")),
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      contentEditable={editing}
      className={clsx(
        markdownClassNames,
        {
          "pointer-events-auto": editing,
          "cursor-pointer": !editing && onChange,
          "ring-2 ring-zinc-700 focus:ring-primary-500":
            editing && editHighlight,
        },
        className,
      )}
      data-is-editing={editing}
      onDoubleClick={editOnDoubleClick ? handleEdit : undefined}
      data-is-markdown=""
    />
  );
}

export const MarkdownEditor = forwardRef(MarkdownEditorWithRef);

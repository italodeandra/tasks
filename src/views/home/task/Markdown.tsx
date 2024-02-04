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
import { isNil } from "lodash";
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
}: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  editable?: boolean;
  loading?: boolean;
  editing?: boolean;
}) {
  let [internalEditing, setInternalEditing] = useState(editing);
  let [newValue, setNewValue] = useState(value);
  let contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newValue !== value) {
      setNewValue(value);
    }
  }, [newValue, value]);

  useEffect(() => {
    setInternalEditing(editing);
  }, [editing]);

  const markdownHtml = useMemo(
    () => markdownConverter.makeHtml(newValue),
    [newValue]
  );

  const saveChanges = useCallback(() => {
    setInternalEditing(false);
    if (internalEditing && contentRef.current) {
      setNewValue(contentRef.current.innerText);
      onChange?.(contentRef.current.innerText);
    }
  }, [internalEditing, onChange]);

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

          let selection = window.getSelection();
          if (selection) {
            let start =
              selection.anchorOffset < selection.focusOffset
                ? selection.anchorOffset
                : selection.focusOffset;
            let end =
              start === selection.anchorOffset
                ? selection.focusOffset
                : selection.anchorOffset;
            if (!isNil(start) && !isNil(end)) {
              let textBeforeSelection = e.currentTarget.innerText.substring(
                0,
                start
              );
              let linebreaksBeforeSelection = textBeforeSelection.split("\n");
              if (!e.shiftKey) {
                linebreaksBeforeSelection[
                  linebreaksBeforeSelection.length - 1
                ] = `  ${
                  linebreaksBeforeSelection[
                    linebreaksBeforeSelection.length - 1
                  ]
                }`;
              } else {
                linebreaksBeforeSelection[
                  linebreaksBeforeSelection.length - 1
                ] = linebreaksBeforeSelection[
                  linebreaksBeforeSelection.length - 1
                ].replace(/^ {1,2}/g, "");
              }
              let indentedBeforeSelection =
                linebreaksBeforeSelection.join("\n");
              let beforeSelectionDiff =
                indentedBeforeSelection.length - textBeforeSelection.length;

              let textInsideSelection = e.currentTarget.innerText.substring(
                start,
                end
              );
              let linebreaksInsideSelection = textInsideSelection;
              if (!e.shiftKey) {
                linebreaksInsideSelection =
                  linebreaksInsideSelection.replaceAll("\n", "\n  ");
              } else {
                linebreaksInsideSelection =
                  linebreaksInsideSelection.replaceAll("\n  ", "\n");
              }
              let insideSelectionDiff =
                linebreaksInsideSelection.length - textInsideSelection.length;

              let newValue =
                indentedBeforeSelection +
                linebreaksInsideSelection +
                e.currentTarget.innerText.substring(end);

              setNewValue(newValue);

              let el = e.currentTarget;

              setTimeout(() => {
                setSelectionRange(
                  el,
                  start + beforeSelectionDiff,
                  end + beforeSelectionDiff + insideSelectionDiff
                );
              });
            }
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

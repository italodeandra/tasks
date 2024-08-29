import {
  ClipboardEvent,
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
    editOnClick,
    editOnDoubleClick,
    editHighlight,
    placeholder,
    uploadClipboardImage,
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
    innerRef.current!.innerHTML = value
      ? markdownConverter.makeHtml(value.replaceAll(" ", ""))
      : placeholder || "";

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

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (uploadClipboardImage) {
        const clipboard = e.clipboardData;
        if (clipboard) {
          const items = clipboard.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              const blob = items[i].getAsFile();
              if (blob) {
                const reader = new FileReader();
                reader.onload = async function (event) {
                  const base64 = event.target?.result as string | undefined;
                  if (base64) {
                    const imageUrl = uploadClipboardImage
                      ? await uploadClipboardImage(base64)
                      : base64;
                    const markdownImage = `![image](${imageUrl})`;

                    // Insert the markdown image at the cursor position in the contentEditable div
                    const selection = window.getSelection();
                    if (selection && selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      range.deleteContents();

                      // Create a new text node with the markdown image
                      const markdownNode =
                        document.createTextNode(markdownImage);
                      range.insertNode(markdownNode);

                      // Move the cursor to the end of the inserted text
                      range.setStartAfter(markdownNode);
                      range.setEndAfter(markdownNode);
                      selection.removeAllRanges();
                      selection.addRange(range);
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
    [uploadClipboardImage],
  );

  return (
    <div
      {...props}
      ref={mergeRefs([innerRef, ref])}
      dangerouslySetInnerHTML={{
        __html: value
          ? markdownConverter.makeHtml(value.replaceAll(" ", ""))
          : placeholder || "",
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
          "text-zinc-500": !editing && !value,
        },
        className,
      )}
      data-is-editing={editing}
      onDoubleClick={editOnDoubleClick && onChange ? handleEdit : undefined}
      onClick={editOnClick ? handleEdit : undefined}
      data-is-markdown=""
      onPaste={handlePaste}
    />
  );
}

export const MarkdownEditor = forwardRef(MarkdownEditorWithRef);

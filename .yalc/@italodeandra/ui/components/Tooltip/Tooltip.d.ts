import { Dispatch, HTMLProps, ReactNode, SetStateAction } from "react";
import type { Placement, UseFloatingReturn } from "@floating-ui/react-dom-interactions";
import { useInteractions } from "@floating-ui/react-dom-interactions";
interface TooltipState extends UseFloatingReturn, ReturnType<typeof useInteractions> {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
declare type Delay = number | Partial<{
    open: number;
    close: number;
}>;
export declare function useTooltipState({ initialOpen, placement, id, delayGroupContext, delay, }?: {
    initialOpen?: boolean;
    placement?: Placement;
    id?: any;
    delayGroupContext?: {
        delay: Delay;
        currentId: any;
        setCurrentId: (id: any) => void;
    };
    delay?: Delay;
}): any;
export declare const TooltipAnchor: import("react").ForwardRefExoticComponent<{
    children: JSX.Element | string;
    asChild?: boolean | undefined;
    state: TooltipState;
} & import("react").RefAttributes<unknown>>;
export declare const TooltipContent: import("react").ForwardRefExoticComponent<Pick<{
    state: TooltipState;
} & HTMLProps<HTMLDivElement>, "size" | "color" | "className" | "state" | "open" | "title" | "prefix" | "media" | "height" | "width" | "translate" | "content" | "min" | "max" | "default" | "target" | "key" | "defaultChecked" | "defaultValue" | "suppressContentEditableWarning" | "suppressHydrationWarning" | "accessKey" | "contentEditable" | "contextMenu" | "dir" | "draggable" | "hidden" | "id" | "lang" | "nonce" | "placeholder" | "slot" | "spellCheck" | "style" | "tabIndex" | "radioGroup" | "role" | "about" | "datatype" | "inlist" | "property" | "resource" | "typeof" | "vocab" | "autoCapitalize" | "autoCorrect" | "autoSave" | "itemProp" | "itemScope" | "itemType" | "itemID" | "itemRef" | "results" | "security" | "unselectable" | "inputMode" | "is" | "aria-activedescendant" | "aria-atomic" | "aria-autocomplete" | "aria-busy" | "aria-checked" | "aria-colcount" | "aria-colindex" | "aria-colspan" | "aria-controls" | "aria-current" | "aria-describedby" | "aria-details" | "aria-disabled" | "aria-dropeffect" | "aria-errormessage" | "aria-expanded" | "aria-flowto" | "aria-grabbed" | "aria-haspopup" | "aria-hidden" | "aria-invalid" | "aria-keyshortcuts" | "aria-label" | "aria-labelledby" | "aria-level" | "aria-live" | "aria-modal" | "aria-multiline" | "aria-multiselectable" | "aria-orientation" | "aria-owns" | "aria-placeholder" | "aria-posinset" | "aria-pressed" | "aria-readonly" | "aria-relevant" | "aria-required" | "aria-roledescription" | "aria-rowcount" | "aria-rowindex" | "aria-rowspan" | "aria-selected" | "aria-setsize" | "aria-sort" | "aria-valuemax" | "aria-valuemin" | "aria-valuenow" | "aria-valuetext" | "children" | "dangerouslySetInnerHTML" | "onCopy" | "onCopyCapture" | "onCut" | "onCutCapture" | "onPaste" | "onPasteCapture" | "onCompositionEnd" | "onCompositionEndCapture" | "onCompositionStart" | "onCompositionStartCapture" | "onCompositionUpdate" | "onCompositionUpdateCapture" | "onFocus" | "onFocusCapture" | "onBlur" | "onBlurCapture" | "onChange" | "onChangeCapture" | "onBeforeInput" | "onBeforeInputCapture" | "onInput" | "onInputCapture" | "onReset" | "onResetCapture" | "onSubmit" | "onSubmitCapture" | "onInvalid" | "onInvalidCapture" | "onLoad" | "onLoadCapture" | "onError" | "onErrorCapture" | "onKeyDown" | "onKeyDownCapture" | "onKeyPress" | "onKeyPressCapture" | "onKeyUp" | "onKeyUpCapture" | "onAbort" | "onAbortCapture" | "onCanPlay" | "onCanPlayCapture" | "onCanPlayThrough" | "onCanPlayThroughCapture" | "onDurationChange" | "onDurationChangeCapture" | "onEmptied" | "onEmptiedCapture" | "onEncrypted" | "onEncryptedCapture" | "onEnded" | "onEndedCapture" | "onLoadedData" | "onLoadedDataCapture" | "onLoadedMetadata" | "onLoadedMetadataCapture" | "onLoadStart" | "onLoadStartCapture" | "onPause" | "onPauseCapture" | "onPlay" | "onPlayCapture" | "onPlaying" | "onPlayingCapture" | "onProgress" | "onProgressCapture" | "onRateChange" | "onRateChangeCapture" | "onSeeked" | "onSeekedCapture" | "onSeeking" | "onSeekingCapture" | "onStalled" | "onStalledCapture" | "onSuspend" | "onSuspendCapture" | "onTimeUpdate" | "onTimeUpdateCapture" | "onVolumeChange" | "onVolumeChangeCapture" | "onWaiting" | "onWaitingCapture" | "onAuxClick" | "onAuxClickCapture" | "onClick" | "onClickCapture" | "onContextMenu" | "onContextMenuCapture" | "onDoubleClick" | "onDoubleClickCapture" | "onDrag" | "onDragCapture" | "onDragEnd" | "onDragEndCapture" | "onDragEnter" | "onDragEnterCapture" | "onDragExit" | "onDragExitCapture" | "onDragLeave" | "onDragLeaveCapture" | "onDragOver" | "onDragOverCapture" | "onDragStart" | "onDragStartCapture" | "onDrop" | "onDropCapture" | "onMouseDown" | "onMouseDownCapture" | "onMouseEnter" | "onMouseLeave" | "onMouseMove" | "onMouseMoveCapture" | "onMouseOut" | "onMouseOutCapture" | "onMouseOver" | "onMouseOverCapture" | "onMouseUp" | "onMouseUpCapture" | "onSelect" | "onSelectCapture" | "onTouchCancel" | "onTouchCancelCapture" | "onTouchEnd" | "onTouchEndCapture" | "onTouchMove" | "onTouchMoveCapture" | "onTouchStart" | "onTouchStartCapture" | "onPointerDown" | "onPointerDownCapture" | "onPointerMove" | "onPointerMoveCapture" | "onPointerUp" | "onPointerUpCapture" | "onPointerCancel" | "onPointerCancelCapture" | "onPointerEnter" | "onPointerEnterCapture" | "onPointerLeave" | "onPointerLeaveCapture" | "onPointerOver" | "onPointerOverCapture" | "onPointerOut" | "onPointerOutCapture" | "onGotPointerCapture" | "onGotPointerCaptureCapture" | "onLostPointerCapture" | "onLostPointerCaptureCapture" | "onScroll" | "onScrollCapture" | "onWheel" | "onWheelCapture" | "onAnimationStart" | "onAnimationStartCapture" | "onAnimationEnd" | "onAnimationEndCapture" | "onAnimationIteration" | "onAnimationIterationCapture" | "onTransitionEnd" | "onTransitionEndCapture" | "cite" | "data" | "form" | "label" | "span" | "summary" | "pattern" | "list" | "as" | "type" | "autoFocus" | "disabled" | "formAction" | "formEncType" | "formMethod" | "formNoValidate" | "formTarget" | "name" | "value" | "step" | "wrap" | "method" | "crossOrigin" | "href" | "accept" | "alt" | "autoComplete" | "capture" | "checked" | "maxLength" | "minLength" | "multiple" | "readOnly" | "required" | "src" | "htmlFor" | "download" | "hrefLang" | "rel" | "selected" | "classID" | "coords" | "autoPlay" | "controls" | "dateTime" | "acceptCharset" | "action" | "encType" | "manifest" | "allowFullScreen" | "allowTransparency" | "frameBorder" | "challenge" | "keyType" | "keyParams" | "charSet" | "httpEquiv" | "high" | "low" | "reversed" | "start" | "async" | "cellPadding" | "cellSpacing" | "colSpan" | "headers" | "rowSpan" | "scope" | "cols" | "kind" | "srcLang" | "preload" | "loop" | "defer" | "integrity" | "marginHeight" | "marginWidth" | "mediaGroup" | "muted" | "noValidate" | "optimum" | "playsInline" | "poster" | "rows" | "sandbox" | "scoped" | "scrolling" | "seamless" | "shape" | "sizes" | "srcDoc" | "srcSet" | "useMap" | "wmode"> & import("react").RefAttributes<unknown>>;
declare function Tooltip({ children, content, placement, delay, }: {
    children: JSX.Element;
    content: ReactNode;
    placement?: Placement;
    delay?: Delay;
}): JSX.Element;
declare namespace Tooltip {
    var Group: ({ children, delay, }: {
        children: ReactNode;
        delay?: Delay | undefined;
    }) => JSX.Element;
}
export default Tooltip;

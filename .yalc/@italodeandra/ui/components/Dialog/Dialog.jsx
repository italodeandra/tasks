import * as RDialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/16/solid";
import Button from "../Button";
import clsx from "../../utils/clsx";
import { modalContentClassName } from "../../styles/Modal.classNames";
export default function Dialog({ children, title, description, open, onOpenChange, contentClassName, contentOverflowClassName, closeButtonClassName, overlayClassName, }) {
    return (<RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className={clsx("ui-dialog-overlay", "fixed inset-0 z-20 flex items-center justify-center bg-black/50", "will-change-[opacity,transform] data-[state=closed]:animate-fadeOut data-[state=open]:animate-slideUpAndFade", overlayClassName)}>
          <RDialog.Content className={clsx(modalContentClassName, "ui-dialog-content", "relative p-0 focus:outline-none", contentClassName)} {...(!description ? { "aria-describedby": undefined } : {})}>
            <div className={clsx("flex max-h-[85vh] w-[90vw] max-w-[450px] flex-col gap-3 overflow-auto p-4", contentOverflowClassName)}>
              {title && (<RDialog.Title className={clsx("ui-dialog-title", "-mb-1 text-lg font-medium text-zinc-900 dark:text-zinc-50")}>
                  {title}
                </RDialog.Title>)}
              {description && (<RDialog.Description className={clsx("ui-dialog-description", "text-zinc-700 dark:text-zinc-300")}>
                  {description}
                </RDialog.Description>)}
              {children}
              <RDialog.Close asChild>
                <Button className={clsx("ui-dialog-close-button", "absolute right-1 top-1", closeButtonClassName)} aria-label="Close" variant="text" icon size="sm">
                  <XMarkIcon />
                </Button>
              </RDialog.Close>
            </div>
          </RDialog.Content>
        </RDialog.Overlay>
      </RDialog.Portal>
    </RDialog.Root>);
}

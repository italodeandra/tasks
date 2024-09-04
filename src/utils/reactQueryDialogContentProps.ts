import { DialogContentProps } from "@radix-ui/react-dialog";

export const reactQueryDialogContentProps: DialogContentProps = {
  onInteractOutside: (e) => {
    if ((e.currentTarget as HTMLDivElement).closest(".tsqd-parent-container")) {
      e.preventDefault();
    }
  },
};

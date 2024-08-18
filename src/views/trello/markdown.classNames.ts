import clsx from "@italodeandra/ui/utils/clsx";

export const markdownClassNames = clsx(
  "prose prose-zinc dark:prose-invert",
  "prose-code:rounded prose-code:!bg-zinc-950 prose-code:px-1 prose-code:py-0.5 prose-code:before:hidden prose-code:after:hidden",
  "prose-pre:p-0 [&_pre_code]:!px-3 [&_pre_code]:!py-2",
);

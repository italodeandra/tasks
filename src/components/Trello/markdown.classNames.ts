import clsx from "@italodeandra/ui/utils/clsx";

export const markdownClassNames = clsx(
  "outline-none",
  "prose prose-zinc dark:prose-invert",
  "prose-code:rounded prose-code:!bg-black/50 prose-code:font-normal prose-code:text-zinc-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:hidden prose-code:after:hidden",
  "prose-pre:p-0 [&_pre_code]:!px-3 [&_pre_code]:!py-2 [&_pre_code]:!bg-transparent",
  "leading-normal max-w-none",
);

import { useEffect, useState } from "react";
import useDebouncedValue from "@italodeandra/ui/hooks/useDebouncedValue";
import NumericInput from "@italodeandra/ui/components/Input/NumericInput";
import clsx from "@italodeandra/ui/utils/clsx";
import Button from "@italodeandra/ui/components/Button";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

export function PriorityInput({
  value,
  onChange,
  loading,
}: {
  value?: number;
  onChange: (value?: number) => void;
  loading?: boolean;
}) {
  const [innerValue, setValue] = useState<string>();

  const debouncedValue = useDebouncedValue(innerValue, "600ms");
  useEffect(() => {
    if (value?.toString() !== debouncedValue) {
      onChange(debouncedValue ? Number(debouncedValue) : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (value?.toString() !== innerValue) {
      setValue(value?.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <NumericInput
      className="w-full"
      inputClassName={clsx(
        "dark:bg-transparent dark:border-transparent px-2.5 py-[7px] rounded-none",
        {
          "text-zinc-500": !innerValue,
        },
      )}
      trailingInputClassName="pr-[72px]"
      trailing={
        <div className="flex gap-0.5">
          {Number(innerValue) > 0 && (
            <Button
              icon
              variant="text"
              className="pointer-events-auto p-1"
              size="sm"
              onClick={() =>
                setValue(
                  innerValue && innerValue !== "1"
                    ? (Number(innerValue) - 1).toString()
                    : undefined,
                )
              }
            >
              <MinusIcon />
            </Button>
          )}
          <Button
            icon
            variant="text"
            className="pointer-events-auto p-1"
            size="sm"
            onClick={() =>
              setValue(innerValue ? (Number(innerValue) + 1).toString() : "1")
            }
          >
            <PlusIcon />
          </Button>
        </div>
      }
      placeholder="None"
      value={innerValue || ""}
      onValueChange={({ value }) => setValue(value)}
      onBlur={(event) => {
        if (event.target.value === "0") {
          setValue(undefined);
        }
      }}
      allowNegative={false}
      loading={loading}
    />
  );
}

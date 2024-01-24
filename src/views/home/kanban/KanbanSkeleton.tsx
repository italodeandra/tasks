import Stack from "@italodeandra/ui/components/Stack";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import fakeArray from "@italodeandra/ui/utils/fakeArray";

export function KanbanSkeleton() {
  return (
    <Stack className="gap-0.5 p-2">
      <Skeleton className="h-6 w-20" />
      {fakeArray(10).map((n) => (
        <Skeleton key={n} className="h-7" />
      ))}
    </Stack>
  );
}
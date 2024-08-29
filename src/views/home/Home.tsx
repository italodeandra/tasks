import Button from "@italodeandra/ui/components/Button";
import { PlusIcon } from "@heroicons/react/20/solid";
import { boardListApi } from "../../pages/api/board/list";
import Routes from "../../Routes";

export function Home() {
  const boardList = boardListApi.useQuery();

  return (
    <>
      <div className="flex flex-col gap-3 px-3 pb-3">
        <div className="text-2xl font-medium">Boards</div>
        <div className="flex flex-wrap gap-4">
          {boardList.data?.map((board) => (
            <Button
              key={board._id}
              variant="filled"
              className="min-h-32 w-full rounded-lg text-lg font-normal dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 dark:active:border-zinc-500 sm:w-96"
              href={Routes.Board(board._id)}
            >
              {board.name}
            </Button>
          ))}
          <Button
            leading={<PlusIcon />}
            variant="filled"
            className="min-h-32 w-full rounded-lg dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:border-zinc-500 sm:w-96"
            href={Routes.Board("new")}
          >
            New board
          </Button>
        </div>
      </div>
    </>
  );
}

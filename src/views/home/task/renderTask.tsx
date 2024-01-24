import { ITask } from "./ITask";
import dynamic from "next/dynamic";

const Task = dynamic(() => import("./Task"), { ssr: false });

export function renderTask(item: ITask) {
  return <Task {...item} />;
}

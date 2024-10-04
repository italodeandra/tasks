import { proxy } from "valtio";

export const boardState = proxy({
  data: undefined as Data | undefined,
  selectedProjects: [] as string[],
  selectedSubProjects: [] as string[],
});

export type Data = {
  _id: string;
  title: string;
  order: number;
  tasks?: {
    _id: string;
    title: string;
  }[];
}[];

import { proxy } from "valtio";

export const state = proxy({
  data: undefined as Data | undefined,
});

export type Data = {
  _id: string;
  title: string;
  tasks?: {
    _id: string;
    title: string;
    description?: string;
  }[];
}[];

import { proxy } from "valtio";

export const state = proxy({
  data: [] as Data,
  //   data: [
  //     {
  //       _id: "665e78c7b3d3cf0f86db4c8d",
  //       title: "Todo",
  //       tasks: [
  //         {
  //           _id: "665e78f7c9e5ab7e262c1e9a",
  //           title: "Buy milk",
  //         },
  //         {
  //           _id: "665e78f9f32b8de9e1532975",
  //           title: "Buy bread",
  //         },
  //         {
  //           _id: "665f2378c6316ed4eefbaed8",
  //           title: "Buy eggs",
  //         },
  //       ],
  //     },
  //     {
  //       _id: "665f23b72ca02db00eafcb23",
  //       title: "Doing",
  //       tasks: [
  //         {
  //           _id: "665fdb6c403542034d819d2f",
  //           title: `Coding
  //
  // When there's \`code\` in the middle of text
  //
  // \`\`\`js
  // const thisIsCode = 2;
  // \`\`\``,
  //           description: "This is a description",
  //         },
  //       ],
  //     },
  //   ] as Data,
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

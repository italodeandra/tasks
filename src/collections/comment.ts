import { schema, types } from "papr";
import { onlyServer } from "@italodeandra/next/utils/isServer";
import db from "@italodeandra/next/db";

const commentSchema = onlyServer(() =>
  schema(
    {
      content: types.string({ required: true }),
      taskId: types.objectId({ required: true }),
      authorId: types.objectId({ required: true }),
    },
    {
      timestamps: true,
    }
  )
);

export type IComment = (typeof commentSchema)[0];

const getComment = () => onlyServer(() => db.model("comments", commentSchema));

export default getComment;

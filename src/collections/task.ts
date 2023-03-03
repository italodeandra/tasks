import {schema, types} from "papr";
import db from "../db";
import {onlyServer} from "@italodeandra/next/utils/isServer";

const taskSchema = onlyServer(() => schema({
    content: types.string({required: true}),
}));

export type ITask = (typeof taskSchema)[0];

const Task = onlyServer(() => db.model("users", taskSchema));

export default Task;

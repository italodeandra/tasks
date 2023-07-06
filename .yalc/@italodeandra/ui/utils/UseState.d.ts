import { Dispatch, SetStateAction } from "react";
declare type UseState<S> = [S, Dispatch<SetStateAction<S>>];
export default UseState;

import { ComponentProps } from "react";
import { InputProps } from "./Input";
import { NumericFormatProps } from "react-number-format";
declare function NumericInput(props: Omit<NumericFormatProps, "customInput"> & InputProps<undefined>): JSX.Element;
export type NumericInputProps = ComponentProps<typeof NumericInput>;
export default NumericInput;

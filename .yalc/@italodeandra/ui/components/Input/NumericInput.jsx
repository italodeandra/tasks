import Input from "./Input";
import { NumericFormat } from "react-number-format";
function NumericInput(props) {
    return <NumericFormat customInput={Input} {...props}/>;
}
export default NumericInput;

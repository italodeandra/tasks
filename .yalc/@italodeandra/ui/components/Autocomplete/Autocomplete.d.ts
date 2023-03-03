/// <reference types="react" />
import { UnstyledAutocompleteProps } from "../Autocomplete/UnstyledAutocomplete";
export declare type AutocompleteProps<T extends {
    _id: string;
}> = UnstyledAutocompleteProps<T>;
export default function Autocomplete<T extends {
    _id: string;
}>({ query: defaultQuery, onChangeQuery, emptyText, ...props }: AutocompleteProps<T>): JSX.Element;

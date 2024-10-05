import { Controller as RHFController, useForm as useRHForm, } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
export function useForm(props) {
    const formReturn = useRHForm({
        resolver: props?.schema ? zodResolver(props.schema) : undefined,
        ...props,
    });
    const register = formReturn.register;
    formReturn.register = function (name, options) {
        const registerReturn = register(name, {
            ...options,
            // setValueAs: (value) => (value === "" ? undefined : value),
        });
        const zodProperty = props?.schema
            ?.shape?.[name];
        return {
            ...registerReturn,
            error: formReturn.formState.errors[name]?.message,
            required: !!zodProperty && !zodProperty.isOptional(),
        };
    };
    return formReturn;
}
export function Controller(props) {
    return <RHFController {...props}/>;
}

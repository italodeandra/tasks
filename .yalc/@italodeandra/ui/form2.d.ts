import { ControllerProps, FieldPath, FieldValues, UseFormProps, UseFormStateReturn } from "react-hook-form/dist/types";
import * as z from "zod";
import React from "react";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form/dist/types/controller";
type Any = any;
export declare function useForm<TFieldValues extends FieldValues = FieldValues, TContext = Any>(props?: UseFormProps<TFieldValues, TContext> & {
    schema: z.Schema<TFieldValues, Any>;
}): import("react-hook-form").UseFormReturn<TFieldValues, TContext, undefined>;
export declare function Controller<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: Omit<ControllerProps<TFieldValues, TName>, "render"> & {
    render: ({ field, fieldState, formState, }: {
        field: ControllerRenderProps<TFieldValues, TName> & {
            error?: string;
        };
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => React.ReactElement;
}): React.JSX.Element;
export {};

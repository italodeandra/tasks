import { FormEvent } from "react";
import { ArrayKey, IsTuple, TupleKeys } from "react-hook-form/dist/types/path/common";
import { Get, PartialDeep, RequiredDeep, WritableDeep } from "type-fest";
import { DeepPartial } from "redux";
type Any = any;
export type DeepMapValues<T, V> = {
    [K in keyof T]: T[K] extends Array<Any> ? DeepMapValues<T[K][0], V> & V : T[K] extends object ? DeepMapValues<T[K], V> : V;
};
export type IsEqual<T1, T2> = T1 extends T2 ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2 ? true : false : false;
export type Primitive = null | undefined | string | number | boolean | symbol | bigint;
export type BrowserNativeObject = Date | FileList | File;
export type FieldValues = Record<string, Any>;
export type AnyIsEqual<T1, T2> = T1 extends T2 ? IsEqual<T1, T2> extends true ? true : never : never;
export type PathImpl<K extends string | number, V, TraversedTypes> = V extends Primitive | BrowserNativeObject ? `${K}` : true extends AnyIsEqual<TraversedTypes, V> ? `${K}` : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;
export type PathInternal<T, TraversedTypes = T> = T extends ReadonlyArray<infer V> ? IsTuple<T> extends true ? {
    [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
}[TupleKeys<T>] : PathImpl<ArrayKey, V, TraversedTypes> : {
    [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
}[keyof T];
export type Path<T> = T extends Any ? PathInternal<T> : never;
export type FieldPath<TFieldValues extends FieldValues> = Path<TFieldValues>;
export type DeepRequiredByValidation<T, V extends {
    [K in keyof T]?: Any;
}> = {
    [P in keyof T]-?: P extends keyof V ? T[P] extends object ? DeepRequiredByValidation<T[P], V[P]> : DeepRequiredByValidation<NonNullable<T[P]>, V[P]> : T[P];
};
export declare function createFormState<T extends object, V extends PartialDeep<DeepMapValues<RequiredDeep<T>, {
    required: string;
}>>>(options: {
    defaultValues: T;
    validation?: V;
}): {
    options: {
        defaultValues: T;
        validation?: V | undefined;
    };
    values: DeepRequiredByValidation<T, V>;
    setValue<N extends Path<T>>(name: N, value: DeepPartial<Get<T, N>>): void;
    errors: DeepMapValues<RequiredDeep<T>, {
        message: string;
    }>;
    registeredFields: {
        value: string[];
    } & {
        $$valtioRef: true;
    };
    reset(values?: DeepPartial<T>): void;
};
export type Validation = {
    required?: string;
    min?: [number, string];
};
export declare function useForm<T extends ReturnType<typeof createFormState>>(state: T, options?: {
    onSubmit?: (values: T["values"]) => void;
    resetOnUnmount?: boolean;
}): WritableDeep<T extends (...args: any[]) => any ? T : T extends {
    $$valtioRef: true;
} ? T : T extends Promise<any> ? Awaited<T> : { readonly [K in keyof T]: T[K] extends infer T_1 ? T_1 extends T[K] ? T_1 extends (...args: any[]) => any ? T_1 : T_1 extends {
    $$valtioRef: true;
} ? T_1 : T_1 extends Promise<any> ? Awaited<T_1> : { readonly [K_1 in keyof T_1]: T_1[K_1] extends infer T_2 ? T_2 extends T_1[K_1] ? T_2 extends (...args: any[]) => any ? T_2 : T_2 extends {
    $$valtioRef: true;
} ? T_2 : T_2 extends Promise<any> ? Awaited<T_2> : { readonly [K_2 in keyof T_2]: T_2[K_2] extends infer T_3 ? T_3 extends T_2[K_2] ? T_3 extends (...args: any[]) => any ? T_3 : T_3 extends {
    $$valtioRef: true;
} ? T_3 : T_3 extends Promise<any> ? Awaited<T_3> : { readonly [K_3 in keyof T_3]: T_3[K_3] extends infer T_4 ? T_4 extends T_3[K_3] ? T_4 extends (...args: any[]) => any ? T_4 : T_4 extends {
    $$valtioRef: true;
} ? T_4 : T_4 extends Promise<any> ? Awaited<T_4> : { readonly [K_4 in keyof T_4]: T_4[K_4] extends infer T_5 ? T_5 extends T_4[K_4] ? T_5 extends (...args: any[]) => any ? T_5 : T_5 extends {
    $$valtioRef: true;
} ? T_5 : T_5 extends Promise<any> ? Awaited<T_5> : { readonly [K_5 in keyof T_5]: T_5[K_5] extends infer T_6 ? T_6 extends T_5[K_5] ? T_6 extends (...args: any[]) => any ? T_6 : T_6 extends {
    $$valtioRef: true;
} ? T_6 : T_6 extends Promise<any> ? Awaited<T_6> : { readonly [K_6 in keyof T_6]: T_6[K_6] extends infer T_7 ? T_7 extends T_6[K_6] ? T_7 extends (...args: any[]) => any ? T_7 : T_7 extends {
    $$valtioRef: true;
} ? T_7 : T_7 extends Promise<any> ? Awaited<T_7> : { readonly [K_7 in keyof T_7]: T_7[K_7] extends infer T_8 ? T_8 extends T_7[K_7] ? T_8 extends (...args: any[]) => any ? T_8 : T_8 extends {
    $$valtioRef: true;
} ? T_8 : T_8 extends Promise<any> ? Awaited<T_8> : { readonly [K_8 in keyof T_8]: T_8[K_8] extends infer T_9 ? T_9 extends T_8[K_8] ? T_9 extends (...args: any[]) => any ? T_9 : T_9 extends {
    $$valtioRef: true;
} ? T_9 : T_9 extends Promise<any> ? Awaited<T_9> : { readonly [K_9 in keyof T_9]: T_9[K_9] extends infer T_10 ? T_10 extends T_9[K_9] ? T_10 extends (...args: any[]) => any ? T_10 : T_10 extends {
    $$valtioRef: true;
} ? T_10 : T_10 extends Promise<any> ? Awaited<T_10> : { readonly [K_10 in keyof T_10]: any; } : never : never; } : never : never; } : never : never; } : never : never; } : never : never; } : never : never; } : never : never; } : never : never; } : never : never; } : never : never; }> & {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    register: <N extends Path<T["values"]>>(name: N, handler?: {
        onChange?: ((e: Any) => Any) | undefined;
        onValueChange?: ((e: Any) => Any) | undefined;
    } | undefined) => {
        onChange(event: {
            target: {
                value: Any;
            };
        }): void;
        name: N;
        value: any;
        error: boolean;
        helpText: any;
        required: boolean;
    } | {
        onValueChange(value: Any): void;
        name: N;
        value: any;
        error: boolean;
        helpText: any;
        required: boolean;
    };
};
export {};

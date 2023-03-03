declare type Intl<T> = {
    [key: string]: Intl<T> | T;
};
export default function useTranslation(intl?: Intl<string>): (sentence: string, path?: string) => string;
export {};

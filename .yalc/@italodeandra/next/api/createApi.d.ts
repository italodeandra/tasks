import { InferApiArgs, InferApiResponse } from "./apiHandlerWrapper";
import { QueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
export default function createApi<T extends (...args: any) => any>(queryKey: string, handler: T, apiOptions?: {
    mutationOptions?: {
        onSuccess?: (data: InferApiResponse<T>, variables: InferApiArgs<T>, queryClient: QueryClient) => Promise<unknown> | unknown;
    };
}): {
    handler: import("next").NextApiHandler;
    Types: {
        Args: InferApiArgs<T>;
        Response: InferApiResponse<T>;
        QueryOptions: UseQueryOptions<InferApiResponse<T>, unknown, InferApiResponse<T>, import("@tanstack/react-query").QueryKey>;
        MutationOptions: UseMutationOptions<InferApiResponse<T>, unknown, InferApiArgs<T>, unknown>;
    };
    useQuery: (args: InferApiArgs<T>, options?: UseQueryOptions<InferApiResponse<T>, unknown, InferApiResponse<T>, import("@tanstack/react-query").QueryKey> | undefined) => import("@tanstack/react-query").UseQueryResult<InferApiResponse<T>, unknown>;
    useMutation: (options?: UseMutationOptions<InferApiResponse<T>, unknown, InferApiArgs<T>, unknown> | undefined) => import("@tanstack/react-query").UseMutationResult<import("../utils/Jsonify").default<T extends import("type-fest/source/async-return-type").AsyncFunction ? Awaited<ReturnType<T>> : ReturnType<T>>, unknown, InferApiArgs<T>, unknown>;
    invalidate: (queryClient: QueryClient) => Promise<void>;
    cancelQueries: (queryClient: QueryClient) => Promise<void>;
    getQueryData: (queryClient: QueryClient) => InferApiResponse<T> | undefined;
    setQueryData: (queryClient: QueryClient, updater: import("@tanstack/query-core/build/types/packages/query-core/src/utils").Updater<import("../utils/Jsonify").default<T extends import("type-fest/source/async-return-type").AsyncFunction ? Awaited<ReturnType<T>> : ReturnType<T>> | undefined, import("../utils/Jsonify").default<T extends import("type-fest/source/async-return-type").AsyncFunction ? Awaited<ReturnType<T>> : ReturnType<T>> | undefined>) => import("../utils/Jsonify").default<T extends import("type-fest/source/async-return-type").AsyncFunction ? Awaited<ReturnType<T>> : ReturnType<T>> | undefined;
};

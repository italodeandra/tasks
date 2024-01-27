"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apiHandlerWrapper_1 = require("./apiHandlerWrapper");
var react_query_1 = require("@tanstack/react-query");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createApi(queryKey, handler) {
    var apiHandler = (0, apiHandlerWrapper_1.apiHandlerWrapper)(handler);
    var Types = {};
    // noinspection JSUnusedGlobalSymbols
    return {
        handler: apiHandler,
        Types: Types,
        useQuery: function (args, options) {
            return (0, react_query_1.useQuery)([queryKey], (0, apiHandlerWrapper_1.queryFnWrapper)(queryKey, args), options);
        },
        useMutation: function (options) { return (0, react_query_1.useMutation)([queryKey], (0, apiHandlerWrapper_1.mutationFnWrapper)(queryKey), options); },
        invalidate: function (queryClient) {
            return queryClient.invalidateQueries([queryKey]);
        },
        cancelQueries: function (queryClient) {
            return queryClient.cancelQueries([queryKey]);
        },
        getQueryData: function (queryClient) {
            return queryClient.getQueryData([queryKey]);
        },
        setQueryData: function (queryClient, updater) { return queryClient.setQueryData([queryKey], updater); },
    };
}
exports.default = createApi;

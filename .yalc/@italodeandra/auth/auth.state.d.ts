declare const authState: {
    token: string | null;
};
export declare const hydrateAuthState: (cookies?: {
    state?: string | undefined;
} | undefined) => void;
export declare const useAuthSnapshot: () => {
    readonly token: string | null;
};
export default authState;

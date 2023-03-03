export default function createStateHydration(cookieName: string, state: any): (cookies?: {
    state?: string;
}) => void;

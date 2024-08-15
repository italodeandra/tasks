import { setCookie } from "cookies-next";
import ms from "ms";
import { snapshot, subscribe } from "valtio";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createStateHydration(cookieName, state) {
    subscribe(state, () => {
        setCookie(cookieName, snapshot(state), {
            maxAge: ms("30d"),
            path: "/",
        });
    });
    return function hydrate(cookies) {
        if (cookies?.[cookieName]) {
            try {
                const cookieValueString = cookies[cookieName];
                const cookieValue = JSON.parse(cookieValueString);
                if (typeof cookieValue === "object") {
                    Object.assign(state, cookieValue);
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (e) {
                // do nothing
            }
        }
    };
}

import { useCallback } from "react";
import { get } from "lodash";
export default function useTranslation(intl, prePath) {
    return useCallback((sentence, path) => {
        return (get(intl, [
            ...(prePath?.split(".") || []),
            ...(path?.split(".") || []),
            sentence,
        ].filter(Boolean)) || sentence);
    }, [intl, prePath]);
}

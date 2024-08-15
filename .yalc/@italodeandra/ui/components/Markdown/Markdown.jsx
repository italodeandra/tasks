import React, { useMemo } from "react";
import clsx from "../../utils/clsx";
import showdown from "showdown";
export default function Markdown({ children, className, options, }) {
    const converter = useMemo(() => new showdown.Converter(options), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(options)]);
    return (<div className={clsx("prose prose-zinc dark:prose-invert max-w-full", className)} dangerouslySetInnerHTML={children
            ? {
                __html: converter.makeHtml(children),
            }
            : undefined}/>);
}

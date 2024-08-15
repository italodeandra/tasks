export function stripHtml(input) {
    return input?.replace(/<\/?[^>]+(>|$)/g, "");
}
export function stripLineBreak(input) {
    return input?.trim().replaceAll("\r", "").replaceAll("\n", "");
}

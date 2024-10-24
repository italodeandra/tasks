export default function smoothScrollToHref(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");
    if (href) {
        const target = document.getElementById(href.split("#")[1]);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    }
}

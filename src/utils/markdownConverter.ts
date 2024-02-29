import showdown from "showdown";
import showdownHighlight from "showdown-highlight";

export const markdownConverter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  openLinksInNewWindow: true,
  extensions: [showdownHighlight({ pre: true })],
});

import showdown from "showdown";

export const markdownConverter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  openLinksInNewWindow: true,
});

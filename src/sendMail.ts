import prepareSendMail from "@italodeandra/next/mailer/sendMail";

const sendMail = prepareSendMail({
  product: {
    name: "Tasks",
    link: "https://italodeandra.de/",
    logo: "https://italodeandra.de/android-chrome-512x512.png",
    copyright: `&copy; ${new Date().getFullYear()} <a href="https://italodeandra.de/" target="_blank">Ítalo Andrade</a>`,
  },
});

export default sendMail;

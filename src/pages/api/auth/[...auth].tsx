import { connectDb } from "../../../db";
import Auth from "@italodeandra/auth/api";
import routes from "../../../routes";
import sendMail from "../../../sendMail";
import { primaryColor } from "../../../consts";

export default Auth({
  connectDb,
  routes,
  primaryColor,
  sendMail,
});

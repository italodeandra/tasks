import Auth from "@italodeandra/auth/api";
import { connectDb } from "../../../db";
import routes from "../../../routes";
import sendMail from "../../../sendMail";
import { primaryColor } from "../../../consts";

export default Auth({
  connectToDb: connectDb,
  routes,
  primaryColor,
  sendMail
});

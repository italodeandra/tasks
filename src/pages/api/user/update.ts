import createApi from "@italodeandra/next/api/createApi";
import { connectDb } from "../../../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { unauthorized } from "@italodeandra/next/api/errors";
import getUser from "@italodeandra/auth/collections/user/User";
import { invalidate_authGetUser } from "@italodeandra/auth/api/getUser";
import uploadToImgur from "@italodeandra/next/imgur";
import sharp from "sharp";
import { base64ToBuffer } from "@italodeandra/next/fileStorage/converters";
import removeEmptyProperties from "@italodeandra/next/utils/removeEmptyProperties";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export const userUpdateApi = createApi(
  "/api/user/update",
  async (
    args: {
      name: string;
      profilePicture?: string;
    },
    req,
    res,
  ) => {
    await connectDb();
    const user = await getUserFromCookies(req, res);
    const User = getUser();
    if (!user) {
      throw unauthorized;
    }

    const $set = {
      name: args.name,
      profilePicture: args.profilePicture?.startsWith("data:")
        ? await uploadToImgur(
            await sharp(base64ToBuffer(args.profilePicture))
              .resize(208, 208)
              .toBuffer(),
          )
        : undefined,
    };
    removeEmptyProperties($set);

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set,
      },
    );
  },
  {
    mutationOptions: {
      onSuccess(_d, _v, _c, queryClient) {
        void invalidate_authGetUser(queryClient);
      },
    },
  },
);

export default userUpdateApi.handler;

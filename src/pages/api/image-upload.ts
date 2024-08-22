import createApi from "@italodeandra/next/api/createApi";
import uploadToImgur from "@italodeandra/next/imgur";

export const imageUploadApi = createApi(
  "/api/image-upload",
  async (args: { image: string }) => {
    const imageUrl = await uploadToImgur(args.image);
    return { imageUrl };
  },
);

export default imageUploadApi.handler;
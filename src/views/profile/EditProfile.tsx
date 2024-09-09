import Input from "@italodeandra/ui/components/Input";
import { UserAvatar } from "../../components/UserAvatar";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { ChangeEvent, useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Button from "@italodeandra/ui/components/Button";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import { useDebounceEffect } from "./useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import { useForm } from "react-hook-form";
import { useAuthGetUser } from "@italodeandra/auth/api/getUser";
import { userUpdateApi } from "../../pages/api/user/update";
import { blobUrlToBase64 } from "@italodeandra/next/fileStorage/converters";

export function EditProfile() {
  const { data: user, isLoading } = useAuthGetUser();
  const userUpdate = userUpdateApi.useMutation({
    onSuccess() {
      setCrop({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
      });
      setCompletedCrop(undefined);
      setSrc(undefined);
    },
  });

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
    },
  });

  const [src, setSrc] = useState<string>();
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSrc(URL.createObjectURL(file));
    }
  };

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        void canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        );
      }
    },
    100,
    [completedCrop],
  );

  const cropToBlobUrl = async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    return URL.createObjectURL(blob);
  };

  const onSubmit = async () => {
    userUpdate.mutate({
      ...form.getValues(),
      profilePicture: completedCrop
        ? await blobUrlToBase64(await cropToBlobUrl())
        : user?.profilePicture,
    });
  };

  return (
    <div className="px-3">
      <form
        className="mx-auto flex max-w-screen-lg flex-col gap-3 pb-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="text-2xl font-medium">Edit profile</div>
        <div className="flex flex-col gap-2 rounded-lg bg-zinc-900 p-2">
          <div className="font-semibol">Name</div>
          <Input
            {...form.register("name", {
              required: "Fill with your name",
            })}
            required
            error={!!form.formState.errors.name}
            helpText={form.formState.errors.name?.message}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-zinc-900 p-2">
          <div className="font-semibol">Profile picture</div>
          <div className="flex gap-2">
            {isLoading && <Skeleton className="h-52 w-52" />}
            {src && (
              <>
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={50}
                  minHeight={50}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Profile picture"
                    src={src}
                    className="h-96 w-96"
                    ref={imgRef}
                  />
                </ReactCrop>
                {completedCrop && (
                  <canvas
                    ref={previewCanvasRef}
                    className="h-52 w-52"
                    style={{
                      objectFit: "contain",
                    }}
                  />
                )}
              </>
            )}
            {!src && (
              <>
                {user && (
                  <UserAvatar
                    className="h-52 w-52 rounded text-6xl"
                    {...user}
                  />
                )}
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  onChange={onFileSelect}
                  accept=".jpg,.jpeg,.png,.gif"
                />
                <Button
                  variant="outlined"
                  className="mb-auto flex items-center gap-3 p-2"
                  onClick={() =>
                    document.getElementById("profile-picture")?.click()
                  }
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded border border-zinc-800 p-3">
                    <PhotoIcon />
                  </div>
                  <div className="flex flex-col items-start gap-1.5">
                    <div className="text-gray-10 text-sm font-medium">
                      Change picture
                    </div>
                    <div className="text-xs text-zinc-500">
                      JPG, GIF, PNG - Max size 10MB
                    </div>
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>
        <Button
          variant="filled"
          color="primary"
          size="lg"
          type="submit"
          loading={userUpdate.isPending}
        >
          Save
        </Button>
      </form>
    </div>
  );
}

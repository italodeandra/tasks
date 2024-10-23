import { useId, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import useDebounceEffect from "../../hooks/useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import Skeleton from "../Skeleton";
import Button from "../Button";
import { PhotoIcon } from "@heroicons/react/24/outline";
export default function PictureCropInput({ value, onChange, loading, }) {
    const id = useId();
    const [src, setSrc] = useState();
    const [crop, setCrop] = useState({
        unit: "%",
        x: 25,
        y: 25,
        width: 50,
        height: 50,
    });
    const [completedCrop, setCompletedCrop] = useState();
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const onFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSrc(URL.createObjectURL(file));
        }
    };
    useDebounceEffect(async () => {
        if (completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current) {
            // We use canvasPreview as it's much faster than imgPreview.
            await canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
        }
    }, 100, [completedCrop]);
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
        const offscreen = new OffscreenCanvas(completedCrop.width * scaleX, completedCrop.height * scaleY);
        const ctx = offscreen.getContext("2d");
        if (!ctx) {
            throw new Error("No 2d context");
        }
        ctx.drawImage(previewCanvas, 0, 0, previewCanvas.width, previewCanvas.height, 0, 0, offscreen.width, offscreen.height);
        // You might want { type: "image/jpeg", quality: <0 to 1> } to
        // reduce image size
        const blob = await offscreen.convertToBlob({
            type: "image/png",
        });
        return URL.createObjectURL(blob);
    };
    const handleCrop = async () => {
        onChange(await cropToBlobUrl());
        setSrc(undefined);
    };
    return (<div className="flex gap-2">
      {loading && <Skeleton className="h-52 w-52"/>}
      {src && (<>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={1} minWidth={50} minHeight={50} className="max-h-96 max-w-96">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Profile picture" src={src} 
        // className="h-96 w-96 object-contain"
        ref={imgRef}/>
          </ReactCrop>
          {completedCrop && (<div className="flex flex-col gap-2">
              <canvas ref={previewCanvasRef} className="h-52 w-52" style={{
                    objectFit: "cover",
                }}/>
              <Button onClick={handleCrop}>Crop</Button>
            </div>)}
        </>)}
      {!src && (<>
          {value && (<div className="flex h-52 w-52 shrink-0 rounded" style={{
                    background: value
                        ? `center / cover url(${value})`
                        : undefined,
                }}/>)}
          <input type="file" id={id} className="hidden" onChange={onFileSelect} accept=".jpg,.jpeg,.png,.gif"/>
          <Button variant="outlined" className="mb-auto flex items-center gap-3 p-2" onClick={() => document.getElementById(id)?.click()}>
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
        </>)}
    </div>);
}
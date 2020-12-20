import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface IProps {
  setImage: (file: Blob) => void;
  imagePreview: string;
}

const PhotoWidgetCropper: React.FC<IProps> = ({ imagePreview, setImage }) => {
  const cropperRef = useRef<HTMLImageElement>(null);

  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    cropper.getCroppedCanvas().toBlob((blob: any) => setImage(blob));
  };

  return (
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: "100%" }}
      // Cropper.js options
      initialAspectRatio={1 / 1}
      preview=".img-preview"
      guides={false}
      viewMode={1}
      dragMode="move"
      scalable={true}
      cropBoxMovable={true}
      cropBoxResizable={true}
      ref={cropperRef}
      crop={onCrop}
    />
  );
};

export default PhotoWidgetCropper;

import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";



const PhotoWidgetCropper = ({ imagePreview, setImage }) => {
  const cropperRef = useRef(null);

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.getCroppedCanvas().toBlob((blob) => setImage(blob));
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

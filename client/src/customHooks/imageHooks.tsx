import { useState } from "react";

export const useImageState = (initImage: object = {}) => {
  const [imageState, setImage] = useState<FormData | object>(initImage);

  const changeImageFile = (file: FormData) => {
    setImage(file as FormData);
  };

  return { imageState, setImage, changeImageFile };
};

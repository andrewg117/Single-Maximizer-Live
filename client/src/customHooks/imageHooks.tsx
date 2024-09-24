import { useState } from "react";

export const useImageState = (initImage: object = {}) => {
  const [imageState, setImage] = useState<FormData | object>(initImage);

  const changeImageFile = (file: FormData) => {
    setImage(file as FormData);
  };

  return { imageState, setImage, changeImageFile };
};


// export const removePressImage = (e: Event, id: string) => {
//   e.preventDefault();

//   changeFile((prevState: stateType) => ({
//     ...prevState,
//     trackPress: trackPress.filter((item) => item._id.toString() !== id),
//     deletePressList: [
//       ...deletePressList,
//       trackPress.find((item) => item._id.toString() === id),
//     ],
//   }));
// };